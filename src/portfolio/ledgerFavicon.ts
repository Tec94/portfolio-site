// Ledger artwork adapted from the supplied ledger-favicon.js.

const INK = '#2b2620', PAPER = '#f4efe7', LINE = '#cfc4b3', SOFT = '#e6dfd2';
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const ease = (v: number) => v < 0.5 ? 4 * v * v * v : 1 - Math.pow(-2 * v + 2, 3) / 2;
const spring = (x: number) => 1 - Math.pow(2, -10 * x) * Math.cos(x * 12);

function drawLedger(ctx: CanvasRenderingContext2D, st: { fold: number; level: number; done: number }, s: { hidden: boolean; progress: number; t: number }) {
  const away = s.hidden;
  st.fold += ((away ? 1 : 0) - st.fold) * 0.12;
  st.level += ((away ? 0 : s.progress) - st.level) * 0.1;
  const done = !away && st.level > 0.985; st.done += ((done ? 1 : 0) - st.done) * 0.15;
  const f = 4 + ease(st.fold) * 16, top = 28 - st.level * 26, wave = (x: number) => top + Math.sin(x / 5 + s.t * 3) * (1 - st.done);
  ctx.clearRect(0, 0, 32, 32);
  ctx.fillStyle = INK; ctx.beginPath(); ctx.roundRect(0, 0, 32, 32, 7); ctx.fill();
  ctx.save(); ctx.beginPath(); ctx.moveTo(4, 4); ctx.lineTo(28 - f, 4); ctx.lineTo(28, 4 + f); ctx.lineTo(28, 28); ctx.lineTo(4, 28); ctx.closePath(); ctx.fillStyle = PAPER; ctx.fill(); ctx.clip();
  ctx.strokeStyle = LINE; ctx.lineWidth = 1; for (let y = 11; y < 28; y += 5) { ctx.beginPath(); ctx.moveTo(7, y + 0.5); ctx.lineTo(25, y + 0.5); ctx.stroke(); }
  ctx.fillStyle = INK; ctx.font = '700 15px Besley, Georgia, serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic'; ctx.globalAlpha = 1 - st.done; ctx.fillText('J', 7, 24); ctx.globalAlpha = 1;
  ctx.beginPath(); ctx.moveTo(4, 30); for (let x = 4; x <= 28; x += 2) ctx.lineTo(x, wave(x)); ctx.lineTo(28, 30); ctx.closePath(); ctx.fillStyle = INK; ctx.fill();
  ctx.clip(); ctx.fillStyle = PAPER; ctx.globalAlpha = 1 - st.done; ctx.fillText('J', 7, 24); ctx.globalAlpha = 1;
  ctx.restore();
  const creaseOp = clamp(1 - (st.level - 0.75) / 0.2, 0, 1);
  if (creaseOp > 0.01) { ctx.globalAlpha = creaseOp; ctx.beginPath(); ctx.moveTo(28 - f, 4); ctx.lineTo(28, 4 + f); ctx.lineTo(28 - f, 4 + f); ctx.closePath(); ctx.fillStyle = SOFT; ctx.fill(); ctx.strokeStyle = LINE; ctx.lineWidth = 0.8; ctx.stroke(); ctx.globalAlpha = 1; }
  if (st.done > 0.01) { ctx.save(); ctx.translate(16, 17); const k = spring(st.done); ctx.scale(k, k); ctx.strokeStyle = PAPER; ctx.lineWidth = 2.6; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath(); ctx.moveTo(-6, 0); ctx.lineTo(-1.5, 4.5); ctx.lineTo(7, -5); ctx.stroke(); ctx.restore(); }
}


export function mountLedgerFavicon() {
  if (!window.CanvasRenderingContext2D) return;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 32;
  const ctx = canvas.getContext('2d');
  const link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
  if (!ctx || !link) return;
  const originalHref = link.href;
  const originalType = link.type;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let frameId: number | undefined;
  let last = '';
  const started = performance.now();

  const frame = () => {
    frameId = undefined;
    const doc = document.documentElement;
    const range = doc.scrollHeight - doc.clientHeight;
    const progress = range > 0 ? clamp(doc.scrollTop / range, 0, 1) : 1;
    const hidden = document.hidden;
    const fold = hidden ? 1 : 0;
    const level = hidden ? 0 : progress;
    const done = !hidden && progress > 0.985 ? 1 : 0;
    // Follow the current scroll position without a trailing interpolation or timer.
    drawLedger(ctx, { fold, level, done }, { hidden, progress, t: reduced.matches ? 0 : (performance.now() - started) / 1000 });
    const url = canvas.toDataURL('image/png');
    if (url !== last) { link.type = 'image/png'; link.href = url; last = url; }
  };
  const update = () => {
    if (document.hidden) {
      if (frameId !== undefined) cancelAnimationFrame(frameId);
      frame();
    } else if (frameId === undefined) {
      frameId = requestAnimationFrame(frame);
    }
  };
  const observer = new ResizeObserver(update);
  observer.observe(document.body);
  addEventListener('scroll', update, { passive: true });
  addEventListener('resize', update);
  document.addEventListener('visibilitychange', update);
  reduced.addEventListener('change', update);
  update();
  return () => {
    if (frameId !== undefined) cancelAnimationFrame(frameId);
    observer.disconnect();
    removeEventListener('scroll', update);
    removeEventListener('resize', update);
    document.removeEventListener('visibilitychange', update);
    reduced.removeEventListener('change', update);
    link.href = originalHref;
    link.type = originalType;
  };
}
