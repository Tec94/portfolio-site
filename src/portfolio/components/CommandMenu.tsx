import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type RefObject,
} from 'react';
import { Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { searchPortfolio, type RankedSearchResult } from '../content/search';
import { shouldPlayTypingSound, usePortfolioSound } from '../providers/SoundProvider';
import { usePortfolioTheme } from '../providers/ThemeProvider';

interface CommandMenuProps {
  open: boolean;
  onClose: () => void;
  returnFocusRef: RefObject<HTMLButtonElement>;
}

export function CommandMenu({ open, onClose, returnFocusRef }: CommandMenuProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();
  const theme = usePortfolioTheme();
  const sound = usePortfolioSound();
  const results = useMemo(
    () => searchPortfolio(query).filter((result) => result.kind !== 'project'),
    [query],
  );
  const activeResult = results[activeIndex];

  const close = () => {
    if (dialogRef.current?.open) dialogRef.current.close();
    onClose();
    sound.play('navigation');
    window.requestAnimationFrame(() => returnFocusRef.current?.focus());
  };

  const runResult = (result: RankedSearchResult) => {
    if (result.href) {
      navigate(result.href);
      close();
      return;
    }
    if (result.action === 'theme') {
      theme.cycleMode();
      sound.play('toggle');
    }
    if (result.action === 'sound') sound.toggle();
  };

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      setQuery('');
      setActiveIndex(0);
      dialog.showModal();
      sound.play('expansion');
      window.requestAnimationFrame(() => inputRef.current?.focus());
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open, sound]);

  useEffect(() => {
    if (activeIndex >= results.length) setActiveIndex(0);
  }, [activeIndex, results.length]);

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (shouldPlayTypingSound(event)) sound.playTyping();
    if (event.key === 'ArrowDown' && results.length) {
      event.preventDefault();
      setActiveIndex((current) => (current + 1) % results.length);
    }
    if (event.key === 'ArrowUp' && results.length) {
      event.preventDefault();
      setActiveIndex((current) => (current - 1 + results.length) % results.length);
    }
    if (event.key === 'Enter' && activeResult) {
      event.preventDefault();
      runResult(activeResult);
    }
  };

  const handleBackdropClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget) close();
  };

  return (
    <dialog
      ref={dialogRef}
      className="portfolio-command"
      aria-labelledby="portfolio-command-title"
      onClick={handleBackdropClick}
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
    >
      <div className="portfolio-command__sheet" data-cursor-tone="light">
        <header className="portfolio-command__header">
          <Search aria-hidden="true" />
          <h2 id="portfolio-command-title">Search</h2>
          <button type="button" className="portfolio-icon-button" aria-label="Close search" onClick={close}>
            <X aria-hidden="true" />
          </button>
        </header>
        <label className="portfolio-command__input-row">
          <span className="portfolio-visually-hidden">Search portfolio</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={handleInputKeyDown}
            placeholder="Type a page or action"
            autoComplete="off"
            aria-controls="portfolio-command-results"
            aria-activedescendant={activeResult ? `portfolio-command-${activeResult.id}` : undefined}
          />
          <kbd>Esc</kbd>
        </label>
        <div id="portfolio-command-results" className="portfolio-command__results" role="listbox">
          {results.map((result, index) => (
            <button
              id={`portfolio-command-${result.id}`}
              key={result.id}
              type="button"
              role="option"
              aria-selected={index === activeIndex}
              className="portfolio-command__result"
              data-active={index === activeIndex}
              onPointerMove={() => setActiveIndex(index)}
              onClick={() => runResult(result)}
            >
              <span>
                <strong>{result.title}</strong>
                {result.kind === 'article' ? <small>{result.summary}</small> : null}
              </span>
              {result.kind === 'article' ? (
                <span className="portfolio-command__kind">{result.kind}</span>
              ) : null}
            </button>
          ))}
          {results.length === 0 ? <p className="portfolio-command__empty">No match</p> : null}
        </div>
        <footer className="portfolio-command__footer">
          <span><kbd>↑</kbd><kbd>↓</kbd> Navigate</span>
          <span><kbd>Enter</kbd> Open</span>
        </footer>
      </div>
    </dialog>
  );
}
