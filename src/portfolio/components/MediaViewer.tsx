import pageCopy from '../../content/site/MediaViewer.json';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import type { ProjectMedia } from '../content/contracts';
import { usePortfolioSound } from '../providers/SoundProvider';

interface MediaViewerProps {
  media: ProjectMedia[];
  projectTitle: string;
  open: boolean;
  initialIndex?: number;
  onClose: () => void;
}

export function MediaViewer({
  media,
  projectTitle,
  open,
  initialIndex = 0,
  onClose,
}: MediaViewerProps) {
  const { play } = usePortfolioSound();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const dragStartRef = useRef<number | null>(null);
  const [index, setIndex] = useState(initialIndex);
  const item = media[index];
  const hasMultiple = media.length > 1;

  const select = useCallback((nextIndex: number) => {
    if (nextIndex === index) return;
    setIndex(nextIndex);
    play('press');
  }, [index, play]);
  const previous = useCallback(() => select((index - 1 + media.length) % media.length), [index, media.length, select]);
  const next = useCallback(() => select((index + 1) % media.length), [index, media.length, select]);
  const close = () => { if (open) { play('press'); onClose(); } };

  useEffect(() => {
    if (open) setIndex(Math.min(initialIndex, Math.max(media.length - 1, 0)));
  }, [initialIndex, media.length, open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      play('press');
    }
    if (open || !dialog.open) return;
    let cancelled = false;
    const animations = dialog.getAnimations?.() ?? [];
    if (!animations.length) dialog.close();
    else void Promise.allSettled(animations.map((animation) => animation.finished)).then(() => {
      if (!cancelled && dialog.open) dialog.close();
    });
    return () => { cancelled = true; };
  }, [open, play]);

  useEffect(() => {
    if (!open) return undefined;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLVideoElement) return;
      if (event.key === 'ArrowLeft' && hasMultiple) {
        event.preventDefault();
        previous();
      }
      if (event.key === 'ArrowRight' && hasMultiple) {
        event.preventDefault();
        next();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [hasMultiple, next, open, previous]);

  if (!item) return null;

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (item.type === 'video') return;
    dragStartRef.current = event.clientX;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (dragStartRef.current === null) return;
    const distance = event.clientX - dragStartRef.current;
    dragStartRef.current = null;
    if (Math.abs(distance) < 48 || !hasMultiple) return;
    if (distance > 0) previous();
    else next();
  };

  return (
    <dialog
      ref={dialogRef}
      className="portfolio-viewer"
      aria-labelledby="portfolio-viewer-title"
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
      data-state={open ? 'open' : 'closing'}
      onClose={close}
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <div className="portfolio-viewer__frame" data-cursor-tone="dark">
        <header className="portfolio-viewer__header">
          <span>{String(index + 1).padStart(2, '0')} / {String(media.length).padStart(2, '0')}</span>
          <strong id="portfolio-viewer-title">{projectTitle}</strong>
          <button type="button" aria-label="Close media viewer" onClick={close}>
            <X aria-hidden="true" />
          </button>
        </header>
        <div
          className={`portfolio-viewer__stage${hasMultiple ? '' : ' is-single'}`}
          data-cursor-intent={hasMultiple ? 'drag' : 'media'}
        >
          {hasMultiple ? (
            <button className="portfolio-viewer__side is-previous" type="button" aria-label="Previous media" onClick={previous}>
              <ChevronLeft aria-hidden="true" />
            </button>
          ) : null}
          <div className="portfolio-viewer__media"
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerCancel={() => { dragStartRef.current = null; }}
            onLostPointerCapture={() => { dragStartRef.current = null; }}
          >
            {item.type === 'video' ? (
              open ? <video key={item.source} src={item.source} controls playsInline preload="metadata" poster={item.poster} aria-label={item.alt} /> : item.poster ? <img src={item.poster} alt={item.alt} /> : null
            ) : (
              <img src={item.source} alt={item.alt} draggable={false} />
            )}
          </div>
          {hasMultiple ? (
            <button className="portfolio-viewer__side is-next" type="button" aria-label="Next media" onClick={next}>
              <ChevronRight aria-hidden="true" />
            </button>
          ) : null}
        </div>
        {hasMultiple ? (
          <div className="portfolio-viewer__filmstrip" aria-label="Choose media">
            {media.map((entry, entryIndex) => (
              <button
                key={`${entry.source}-${entryIndex}`}
                type="button"
                aria-label={`Show media ${entryIndex + 1}`}
                aria-current={entryIndex === index ? 'true' : undefined}
                onClick={() => select(entryIndex)}
              >
                {entry.type === 'image' ? <img src={entry.source} alt="" /> : <span>{pageCopy["video"]}</span>}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </dialog>
  );
}
