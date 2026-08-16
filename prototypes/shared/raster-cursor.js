const cursorSources = {
  default: "/src/assets/cursors/default.png",
  link: "/src/assets/cursors/pointer.png",
  media: "/src/assets/cursors/crosshair.png",
  drag: "/src/assets/cursors/crosshair.png",
  text: "/src/assets/cursors/text.png",
  pressed: "/src/assets/cursors/pressed.png",
};

const cursorHotspots = {
  default: [1, 2],
  link: [0, 1],
  media: [4, 4],
  drag: [4, 4],
  text: [3, 5],
  pressed: [1, 2],
};

function inferIntent(target) {
  if (!(target instanceof Element)) return "default";
  const explicit = target.closest("[data-cursor-intent]")?.dataset.cursorIntent;
  if (explicit) return explicit;
  if (target.closest("input, textarea, [contenteditable='true']")) return "text";
  if (target.closest("a, button, summary")) return "link";
  return "default";
}

function inferTone(target) {
  if (!(target instanceof Element)) return "light";
  const explicit = target.closest("[data-cursor-tone]")?.dataset.cursorTone;
  if (explicit) return explicit;
  return document.documentElement.dataset.resolvedTheme === "dark" ? "dark" : "light";
}

export function initRasterCursor() {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const cursor = document.createElement("div");
  const image = document.createElement("img");
  cursor.className = "shared-raster-cursor";
  cursor.dataset.tone = "light";
  cursor.hidden = true;
  cursor.setAttribute("aria-hidden", "true");
  image.alt = "";
  image.src = cursorSources.default;
  cursor.append(image);
  document.body.append(cursor);

  let pointerPressed = false;
  let activeIntent = "default";
  let previousPointer = null;

  const isMousePointer = (event) => !event.pointerType || event.pointerType === "mouse";

  const moveToActiveLayer = (target) => {
    const openDialog = target instanceof Element ? target.closest("dialog[open]") : null;
    const host = openDialog ?? document.body;
    if (cursor.parentElement !== host) host.append(cursor);
  };

  const render = (event) => {
    if (!isMousePointer(event)) {
      cursor.hidden = true;
      previousPointer = null;
      delete document.documentElement.dataset.rasterCursorReady;
      return;
    }

    moveToActiveLayer(event.target);
    document.documentElement.dataset.rasterCursorReady = "true";
    cursor.hidden = false;

    activeIntent = inferIntent(event.target);
    const renderedIntent = pointerPressed ? "pressed" : activeIntent;
    const [hotspotX, hotspotY] = cursorHotspots[renderedIntent] ?? cursorHotspots.default;
    let tilt = 0;
    let stretchX = 1;
    let stretchY = 1;

    if (previousPointer && !reducedMotion.matches) {
      const elapsed = Math.max(1, performance.now() - previousPointer.time);
      const deltaX = event.clientX - previousPointer.x;
      const deltaY = event.clientY - previousPointer.y;
      const speed = Math.hypot(deltaX, deltaY) / elapsed;
      stretchX = 1 + Math.min(0.24, speed * 0.1);
      stretchY = 1 - Math.min(0.12, speed * 0.06);
      tilt = Math.min(10, Math.max(-10, deltaX * 0.3));
    }

    cursor.style.setProperty("--cursor-x", `${event.clientX - hotspotX}px`);
    cursor.style.setProperty("--cursor-y", `${event.clientY - hotspotY}px`);
    cursor.style.setProperty("--cursor-tilt", `${tilt.toFixed(2)}deg`);
    cursor.style.setProperty("--cursor-stretch-x", stretchX.toFixed(3));
    cursor.style.setProperty("--cursor-stretch-y", stretchY.toFixed(3));
    cursor.dataset.tone = inferTone(event.target);
    image.src = cursorSources[renderedIntent] ?? cursorSources.default;
    previousPointer = { x: event.clientX, y: event.clientY, time: performance.now() };
  };

  const press = (event) => {
    if (!isMousePointer(event)) {
      cursor.hidden = true;
      previousPointer = null;
      delete document.documentElement.dataset.rasterCursorReady;
      return;
    }
    pointerPressed = true;
    image.src = cursorSources.pressed;
  };

  const release = (event) => {
    if (!isMousePointer(event)) return;
    pointerPressed = false;
    image.src = cursorSources[activeIntent] ?? cursorSources.default;
  };

  const hide = () => {
    cursor.hidden = true;
    previousPointer = null;
  };

  document.addEventListener("pointermove", render, { passive: true });
  document.addEventListener("pointerdown", press, { passive: true });
  document.addEventListener("pointerup", release, { passive: true });
  document.documentElement.addEventListener("mouseleave", hide);

  return () => {
    document.removeEventListener("pointermove", render);
    document.removeEventListener("pointerdown", press);
    document.removeEventListener("pointerup", release);
    document.documentElement.removeEventListener("mouseleave", hide);
    delete document.documentElement.dataset.rasterCursorReady;
    cursor.remove();
  };
}
