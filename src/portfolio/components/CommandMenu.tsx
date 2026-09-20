import pageCopy from '../../content/site/CommandMenu.json';
import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type RefObject,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { searchPortfolio, type RankedSearchResult } from '../content/search';
import { shouldPlayTypingSound, usePortfolioSound } from '../providers/SoundProvider';
import { usePortfolioTheme } from '../providers/ThemeProvider';
import { transitionPortfolioPage } from '../motion';

interface CommandMenuProps {
  open: boolean;
  onClose: () => void;
  returnFocusRef: RefObject<HTMLButtonElement>;
}

export function CommandMenu({ open, onClose, returnFocusRef }: CommandMenuProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [band, setBand] = useState({ top: 0, height: 0 });
  const navigate = useNavigate();
  const theme = usePortfolioTheme();
  const sound = usePortfolioSound();
  const results = useMemo(
    () => {
      const matches = searchPortfolio(query).filter((result) => result.kind !== 'project');
      return ['route', 'article', 'action'].flatMap((kind) => matches.filter((result) => result.kind === kind));
    },
    [query],
  );
  const activeResult = results[activeIndex];

  const close = (navigating = false) => {
    if (dialogRef.current?.open) dialogRef.current.close();
    onClose();
    sound.play(navigating ? 'navigation' : 'press');
    window.requestAnimationFrame(() => returnFocusRef.current?.focus());
  };

  const runResult = (result: RankedSearchResult) => {
    if (result.href) {
      close(true);
      transitionPortfolioPage(() => navigate(result.href!));
      return;
    }
    if (result.action === 'theme') {
      theme.cycleMode();
      sound.play('press');
    }
    if (result.action === 'sound') sound.toggle();
  };

  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      setQuery('');
      setActiveIndex(0);
      dialog.showModal();
      sound.play('press');
      window.requestAnimationFrame(() => inputRef.current?.focus());
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open, sound]);

  useEffect(() => {
    if (activeIndex >= results.length) setActiveIndex(0);
  }, [activeIndex, results.length]);

  useLayoutEffect(() => {
    if (!open) return;
    const row = listRef.current?.querySelector<HTMLElement>('[aria-selected="true"]');
    if (!row) { setBand({ top: 0, height: 0 }); return; }
    setBand({ top: row.offsetTop, height: row.offsetHeight });
    row.scrollIntoView?.({ block: 'nearest' });
  }, [activeIndex, open, results]);

  const resultMeta = (result: RankedSearchResult) => {
    if (result.action === 'theme') return theme.mode;
    if (result.action === 'sound') return sound.enabled ? 'on' : 'off';
    return result.href?.replace('/#', '/') ?? result.kind;
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (shouldPlayTypingSound(event)) sound.playTyping();
    if (event.key === 'ArrowDown' && results.length) {
      event.preventDefault();
      if (results.length > 1) sound.playTyping();
      setActiveIndex((current) => (current + 1) % results.length);
    }
    if (event.key === 'ArrowUp' && results.length) {
      event.preventDefault();
      if (results.length > 1) sound.playTyping();
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
          <h2 id="portfolio-command-title">+ Jack Cao/ <span className="portfolio-visually-hidden">{pageCopy["search"]}</span></h2>
          <button type="button" className="portfolio-command__close" aria-label="Close search"
            onPointerEnter={(event) => { if (event.pointerType === 'mouse') sound.playTyping(); }}
            onFocus={(event) => { if (event.currentTarget.matches(':focus-visible')) sound.playTyping(); }}
            onClick={() => close()}>[Esc] Close</button>
        </header>
        <label className="portfolio-command__input-row">
          <span className="portfolio-visually-hidden">{pageCopy["search_portfolio"]}</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={handleInputKeyDown}
            placeholder={pageCopy["type_a_page_or_action"]}
            autoComplete="off"
            role="combobox"
            aria-expanded={open}
            aria-autocomplete="list"
            spellCheck={false}
            aria-controls="portfolio-command-results"
            aria-activedescendant={activeResult ? `portfolio-command-${activeResult.id}` : undefined}
          />
          <span aria-hidden="true">Search anything</span>
        </label>
        <div ref={listRef} id="portfolio-command-results" className="portfolio-command__results" role="listbox" aria-label="Pages and commands">
          <span className="portfolio-command__band" aria-hidden="true" style={{ transform: `translateY(${band.top}px)`, height: band.height, opacity: results.length ? 1 : 0 }} />
          {results.map((result, index) => (
            <div key={result.id} role="presentation" className="portfolio-command__entry">
            {results[index - 1]?.kind !== result.kind && <div className="portfolio-command__group" role="presentation">
              {result.kind === 'route' ? 'Pages' : result.kind === 'action' ? 'Commands' : 'Writing'}
            </div>}
            <button
              id={`portfolio-command-${result.id}`}
              type="button"
              role="option"
              aria-selected={index === activeIndex}
              className="portfolio-command__result"
              data-active={index === activeIndex}
              onPointerEnter={(event) => {
                if (event.pointerType !== 'mouse') return;
                setActiveIndex(index);
                sound.playTyping();
              }}
              onFocus={(event) => {
                setActiveIndex(index);
                if (event.currentTarget.matches(':focus-visible')) sound.playTyping();
              }}
              onClick={() => runResult(result)}
            >
              <span>
                <strong>{result.title}</strong>
              </span>
              <span className="portfolio-command__meta" data-live={result.action && (result.action === 'theme' || sound.enabled) ? true : undefined} aria-hidden="true">{resultMeta(result)}</span>
            </button>
            </div>
          ))}
          {results.length === 0 ? <p className="portfolio-command__empty">{pageCopy["no_match"]}</p> : null}
        </div>
        <footer className="portfolio-command__footer">
          <span><kbd>[↑]</kbd><kbd>[↓]</kbd></span>
          <span><kbd>[Enter]</kbd> to visit</span>
        </footer>
      </div>
    </dialog>
  );
}
