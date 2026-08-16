import {
  bindTypingSound,
  isSoundEnabled,
  playCuelume,
  playCollapseSound,
  playExpansionSound,
  subscribeToSoundPreference,
  toggleSoundEnabled,
} from "../shared/audio.js";
import { initRasterCursor } from "../shared/raster-cursor.js";

const root = document.documentElement;
const metaThemeColor = document.querySelector('meta[name="theme-color"]');
const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const themeModes = ["system", "light", "dark"];
const themeStorageKey = "portfolio-shell-theme";
const receiptAnimations = new WeakMap();
const svgNamespace = "http://www.w3.org/2000/svg";

function renderReceiptEdge(edge, inlineSize) {
  const notchSize = Number.parseFloat(getComputedStyle(root).fontSize);
  const notchCount = Math.max(1, Math.floor((inlineSize + notchSize) / (notchSize * 2)));
  if (Number(edge.dataset.notchCount) === notchCount) return;

  const fragment = document.createDocumentFragment();
  const isTop = edge.dataset.receiptEdge === "top";
  for (let index = 0; index < notchCount; index += 1) {
    const svg = document.createElementNS(svgNamespace, "svg");
    const circle = document.createElementNS(svgNamespace, "circle");
    svg.setAttribute("viewBox", "0 0 16 8");
    svg.setAttribute("aria-hidden", "true");
    circle.setAttribute("cx", "8");
    circle.setAttribute("cy", isTop ? "0" : "8");
    circle.setAttribute("r", "8");
    svg.append(circle);
    fragment.append(svg);
  }

  edge.dataset.notchCount = String(notchCount);
  edge.style.setProperty("--receipt-notch-count", notchCount);
  edge.replaceChildren(fragment);
}

const receiptEdgeObserver = new ResizeObserver((entries) => {
  entries.forEach((entry) => renderReceiptEdge(entry.target, entry.contentRect.width));
});

document.querySelectorAll("[data-receipt-edge]").forEach((edge) => receiptEdgeObserver.observe(edge));

function readTheme() {
  try {
    const stored = window.localStorage.getItem(themeStorageKey);
    return themeModes.includes(stored) ? stored : "system";
  } catch {
    return "system";
  }
}

function writeTheme(value) {
  try {
    window.localStorage.setItem(themeStorageKey, value);
  } catch {
    // The prototype remains usable with an in-session theme.
  }
}

let themeMode = readTheme();
let toastTimer = 0;

function resolvedTheme() {
  if (themeMode !== "system") return themeMode;
  return systemTheme.matches ? "dark" : "light";
}

function showToast(message) {
  const toast = document.querySelector("[data-toast]");
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.dataset.visible = "true";
  toastTimer = window.setTimeout(() => {
    toast.dataset.visible = "false";
  }, 1800);
}

function applyTheme({ announce = false } = {}) {
  const resolved = resolvedTheme();
  root.dataset.themeMode = themeMode;
  root.dataset.resolvedTheme = resolved;
  metaThemeColor?.setAttribute("content", resolved === "dark" ? "#211e1b" : "#f2eee5");
  document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
    button.setAttribute("aria-label", `Theme: ${themeMode}${themeMode === "system" ? `, currently ${resolved}` : ""}`);
  });
  document.querySelectorAll("[data-theme-label]").forEach((label) => {
    label.textContent = `Theme: ${themeMode}${themeMode === "system" ? ` · ${resolved}` : ""}`;
  });
  if (announce) showToast(`Theme: ${themeMode}`);
}

function cycleTheme() {
  themeMode = themeModes[(themeModes.indexOf(themeMode) + 1) % themeModes.length];
  writeTheme(themeMode);
  applyTheme({ announce: true });
}

function applySound({ announce = false } = {}) {
  const enabled = isSoundEnabled();
  document.querySelectorAll("[data-sound-toggle]").forEach((button) => {
    button.setAttribute("aria-pressed", String(enabled));
    button.setAttribute("aria-label", `Interface sounds ${enabled ? "on" : "off"}`);
  });
  document.querySelectorAll("[data-sound-label]").forEach((label) => {
    label.textContent = `Sound ${enabled ? "on" : "off"}`;
  });
  if (announce) showToast(`Sound ${enabled ? "on" : "off"}`);
}

document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
  button.addEventListener("click", cycleTheme);
});

document.querySelectorAll("[data-sound-toggle]").forEach((button) => {
  button.addEventListener("click", () => {
    toggleSoundEnabled();
    applySound({ announce: true });
  });
});

systemTheme.addEventListener("change", () => {
  if (themeMode === "system") applyTheme();
});

const receipts = [...document.querySelectorAll("[data-service]")];

function setActiveService(service) {
  document.querySelectorAll("[data-service-jump]").forEach((button) => {
    if (button.dataset.serviceJump === service) button.setAttribute("aria-current", "location");
    else button.removeAttribute("aria-current");
  });
}

function setServiceExpanded(service, expanded) {
  const control = document.querySelector(`[data-service-jump="${service}"]`);
  control?.setAttribute("aria-expanded", String(expanded));
}

let receiptStickFrame = 0;

function updateReceiptStickiness() {
  receiptStickFrame = 0;
  receipts.forEach((article) => {
    if (article.dataset.open !== "true") {
      delete article.dataset.stuck;
      return;
    }

    const trigger = article.querySelector(".receipt-trigger");
    const articleRect = article.getBoundingClientRect();
    const stickyInset = Number.parseFloat(getComputedStyle(trigger).insetBlockStart) || 0;
    const isStuck = articleRect.top < stickyInset
      && articleRect.bottom > stickyInset + trigger.offsetHeight;
    article.dataset.stuck = String(isStuck);
  });
}

function scheduleReceiptStickiness() {
  if (receiptStickFrame) return;
  receiptStickFrame = window.requestAnimationFrame(updateReceiptStickiness);
}

function cancelReceiptAnimation(body) {
  const active = receiptAnimations.get(body);
  if (!active) return;
  receiptAnimations.delete(body);
  active.height.cancel();
  active.content.cancel();
}

function settleReceipt(article, body, content, open) {
  const active = receiptAnimations.get(body);
  if (active) receiptAnimations.delete(body);

  body.style.height = open ? "auto" : "0px";
  content.style.opacity = open ? "1" : "0";
  content.style.transform = open ? "translateY(0)" : "translateY(-0.4rem)";
  active?.height.cancel();
  active?.content.cancel();

  if (open) {
    body.style.height = "auto";
    content.style.removeProperty("opacity");
    content.style.removeProperty("transform");
    updateReceiptStickiness();
  } else {
    body.hidden = true;
    body.style.removeProperty("height");
    content.style.removeProperty("opacity");
    content.style.removeProperty("transform");
    delete article.dataset.stuck;
  }
}

function animateReceipt(article, open) {
  const body = article.querySelector(".receipt-body");
  const content = body.querySelector(".receipt-content");
  const wasHidden = body.hidden;
  body.hidden = false;

  const currentHeight = wasHidden ? 0 : body.getBoundingClientRect().height;
  const contentStyle = getComputedStyle(content);
  const currentOpacity = Number.parseFloat(contentStyle.opacity) || 0;
  const currentTransform = contentStyle.transform === "none"
    ? "translateY(0)"
    : contentStyle.transform;

  cancelReceiptAnimation(body);
  body.style.height = `${currentHeight}px`;
  content.style.opacity = String(currentOpacity);
  content.style.transform = currentTransform;

  const targetHeight = open ? body.scrollHeight : 0;
  if (reducedMotion.matches || typeof body.animate !== "function") {
    settleReceipt(article, body, content, open);
    return;
  }

  const bounceHeight = open
    ? targetHeight + Math.min(8, targetHeight * 0.012)
    : currentHeight + Math.min(5, currentHeight * 0.01);
  const heightKeyframes = open
    ? [
      { height: `${currentHeight}px`, offset: 0 },
      { height: `${bounceHeight}px`, offset: 0.84 },
      { height: `${targetHeight}px`, offset: 1 },
    ]
    : [
      { height: `${currentHeight}px`, offset: 0 },
      { height: `${bounceHeight}px`, offset: 0.13 },
      { height: "0px", offset: 1 },
    ];
  const contentKeyframes = open
    ? [
      { opacity: currentOpacity, transform: currentTransform },
      { opacity: 1, transform: "translateY(0.08rem)", offset: 0.84 },
      { opacity: 1, transform: "translateY(0)" },
    ]
    : [
      { opacity: currentOpacity, transform: currentTransform },
      { opacity: 1, transform: "translateY(0.08rem)", offset: 0.13 },
      { opacity: 0, transform: "translateY(-0.4rem)" },
    ];
  const options = {
    duration: open ? 460 : 380,
    easing: "cubic-bezier(0.22, 1, 0.36, 1)",
    fill: "forwards",
  };
  const active = {
    height: body.animate(heightKeyframes, options),
    content: content.animate(contentKeyframes, options),
  };
  receiptAnimations.set(body, active);

  Promise.allSettled([active.height.finished, active.content.finished]).then(() => {
    if (receiptAnimations.get(body) !== active) return;
    settleReceipt(article, body, content, open);
  });
}

function closeReceipt(article, { sound = true } = {}) {
  const body = article.querySelector(".receipt-body");
  if (article.dataset.open !== "true") return;

  article.dataset.open = "false";
  delete article.dataset.stuck;
  setServiceExpanded(article.dataset.service, false);
  if (sound) void playCollapseSound();
  animateReceipt(article, false);
}

function openReceipt(article, { sound = true } = {}) {
  if (article.dataset.open === "true") return;

  receipts.forEach((receipt) => {
    if (receipt !== article) closeReceipt(receipt, { sound: false });
  });
  article.dataset.open = "true";
  setServiceExpanded(article.dataset.service, true);
  setActiveService(article.dataset.service);
  if (sound) void playExpansionSound();

  animateReceipt(article, true);
}

receipts.forEach((article) => {
  article.addEventListener("pointerenter", (event) => {
    if (event.pointerType === "mouse") openReceipt(article, { sound: false });
  });
  article.addEventListener("pointerleave", (event) => {
    if (event.pointerType === "mouse" && !article.matches(":focus-within")) {
      closeReceipt(article, { sound: false });
    }
  });
});

window.addEventListener("scroll", scheduleReceiptStickiness, { passive: true });
window.addEventListener("resize", scheduleReceiptStickiness);

document.querySelectorAll("[data-service-jump]").forEach((button) => {
  button.addEventListener("click", () => {
    const article = document.querySelector(`[data-service="${button.dataset.serviceJump}"]`);
    if (!article) return;
    openReceipt(article);
    article.scrollIntoView({
      behavior: reducedMotion.matches ? "auto" : "smooth",
      block: "start",
    });
  });
});

if ("IntersectionObserver" in window) {
  const serviceObserver = new IntersectionObserver((entries) => {
    const active = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (active) setActiveService(active.target.dataset.service);
  }, { rootMargin: "-18% 0px -58% 0px", threshold: [0, 0.15, 0.45] });
  receipts.forEach((receipt) => serviceObserver.observe(receipt));
}

const commandDialog = document.querySelector("[data-command-dialog]");
const commandInput = document.querySelector("[data-command-input]");
const commandOptions = [...document.querySelectorAll("[data-command-option]")];
const commandEmpty = document.querySelector("[data-command-empty]");
let activeCommandIndex = 0;
let commandReturnTarget = document.querySelector("[data-command-open]");

function visibleCommandOptions() {
  return commandOptions.filter((option) => !option.hidden);
}

function setActiveCommand(index, { sound = true } = {}) {
  const visible = visibleCommandOptions();
  if (!visible.length) return;
  activeCommandIndex = (index + visible.length) % visible.length;
  commandOptions.forEach((option) => option.setAttribute("aria-selected", "false"));
  visible[activeCommandIndex].setAttribute("aria-selected", "true");
  visible[activeCommandIndex].scrollIntoView({ block: "nearest" });
  if (sound) void playCuelume("tick");
}

function filterCommands() {
  const query = commandInput.value.trim().toLowerCase();
  commandOptions.forEach((option) => {
    option.hidden = query.length > 0 && !option.dataset.search.includes(query);
  });
  const visible = visibleCommandOptions();
  commandEmpty.hidden = visible.length > 0;
  activeCommandIndex = 0;
  if (visible.length) setActiveCommand(0, { sound: false });
}

function openCommand(trigger = document.activeElement) {
  if (commandDialog.open) return;
  commandReturnTarget = trigger instanceof HTMLElement && trigger !== document.body
    ? trigger
    : document.querySelector("[data-command-open]");
  commandDialog.showModal();
  commandInput.value = "";
  filterCommands();
  window.requestAnimationFrame(() => commandInput.focus());
  void playExpansionSound();
}

function closeCommand({ sound = true } = {}) {
  if (!commandDialog.open) return;
  commandDialog.close();
  if (sound) void playCollapseSound();
  commandReturnTarget?.focus();
}

function runCommand(option) {
  if (option.dataset.href) {
    window.location.href = option.dataset.href;
    return;
  }

  const service = option.dataset.serviceCommand;
  if (!service) return;
  closeCommand({ sound: false });
  const article = document.querySelector(`[data-service="${service}"]`);
  openReceipt(article);
  article.scrollIntoView({ behavior: reducedMotion.matches ? "auto" : "smooth", block: "start" });
}

document.querySelectorAll("[data-command-open]").forEach((button) => {
  button.addEventListener("click", () => openCommand(button));
});
document.querySelector("[data-command-close]").addEventListener("click", () => closeCommand());
commandInput.addEventListener("input", filterCommands);
bindTypingSound(commandInput);

commandOptions.forEach((option, index) => {
  option.addEventListener("pointerenter", (event) => {
    if (event.pointerType !== "mouse") return;
    const visibleIndex = visibleCommandOptions().indexOf(option);
    if (visibleIndex >= 0 && visibleIndex !== activeCommandIndex) setActiveCommand(visibleIndex);
  });
  option.addEventListener("click", () => {
    const visibleIndex = visibleCommandOptions().indexOf(option);
    if (visibleIndex >= 0) activeCommandIndex = visibleIndex;
    runCommand(option);
  });
});

commandDialog.addEventListener("click", (event) => {
  if (event.target === commandDialog) closeCommand();
});
commandDialog.addEventListener("cancel", (event) => {
  event.preventDefault();
  closeCommand();
});

document.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    openCommand();
    return;
  }
  if (!commandDialog.open) return;
  if (event.key === "ArrowDown") {
    event.preventDefault();
    setActiveCommand(activeCommandIndex + 1);
  } else if (event.key === "ArrowUp") {
    event.preventDefault();
    setActiveCommand(activeCommandIndex - 1);
  } else if (event.key === "Enter" && document.activeElement === commandInput) {
    event.preventDefault();
    const option = visibleCommandOptions()[activeCommandIndex];
    if (option) runCommand(option);
  }
});

applyTheme();
applySound();
subscribeToSoundPreference(() => applySound());
setActiveService("product-engineering");
initRasterCursor();
