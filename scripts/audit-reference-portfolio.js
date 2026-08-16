async (page) => {
  const targets = [
    ['nachi', 'https://www.nachi.design/'],
    ['amaan', 'https://www.amaaan.in/'],
    ['rauno', 'https://rauno.me/'],
    ['jakub', 'https://jakub.kr/'],
    ['peter', 'https://www.petercsipkay.com/'],
    ['nk', 'https://www.nk.studio/'],
    ['lorenzo', 'https://lorenzocabra.xyz/'],
    ['jamt', 'https://ja.mt/'],
    ['hamza', 'https://www.hamzaalabou.com/'],
    ['athrix', 'https://www.athrix.me/'],
    ['gareth', 'https://www.gareth.ng/'],
    ['noe', 'https://noechague-site.vercel.app/'],
    ['aniket', 'https://www.aniketpawar.com/'],
    ['cuelume', 'https://cuelume-site.pages.dev/'],
  ];

  const requestedBatch = page.url().includes('#')
    ? page.url().split('#').at(-1)
    : '';
  const batches = {
    'batch-a': ['nachi', 'amaan', 'rauno', 'jakub'],
    'batch-b': ['peter', 'nk', 'lorenzo', 'jamt'],
    'batch-c': ['hamza', 'athrix', 'gareth'],
    'batch-d': ['noe', 'aniket', 'cuelume'],
    'batch-lorenzo': ['lorenzo'],
    'batch-nk': ['nk'],
  };
  const requestedKeys = batches[requestedBatch];
  const activeTargets = requestedKeys
    ? targets.filter(([key]) => requestedKeys.includes(key))
    : targets;

  const viewports = [
    ['desktop', { width: 1440, height: 1000 }],
    ['mobile', { width: 390, height: 844 }],
  ];

  const styleKeys = [
    'backgroundColor',
    'borderColor',
    'borderRadius',
    'boxShadow',
    'color',
    'cursor',
    'filter',
    'fontFamily',
    'fontSize',
    'fontWeight',
    'letterSpacing',
    'lineHeight',
    'opacity',
    'outline',
    'textDecoration',
    'transform',
    'transition',
  ];

  const readStyle = async (auditId) => page.evaluate(({ id, keys }) => {
    const element = document.querySelector(`[data-codex-audit="${id}"]`);
    if (!element) return null;
    const style = getComputedStyle(element);
    return Object.fromEntries(keys.map((key) => [key, style[key]]));
  }, { id: auditId, keys: styleKeys });

  const changed = (before, after) => Object.fromEntries(
    Object.entries(after).filter(([key, value]) => before[key] !== value),
  );

  const auditCurrentPage = async (viewportName) => {
    await page.evaluate(() => {
      if (!window.__codexAuditClickGuard) {
        window.__codexAuditClickGuard = (event) => {
          event.preventDefault();
          event.stopImmediatePropagation();
        };
        document.addEventListener('click', window.__codexAuditClickGuard, true);
      }
    });

    const base = await page.evaluate(() => {
      const isVisible = (element) => {
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' &&
          style.display !== 'none';
      };

      const interactiveSelector = [
        'a[href]',
        'button',
        'input',
        'select',
        'textarea',
        '[role="button"]',
        '[tabindex]:not([tabindex="-1"])',
      ].join(',');

      const elements = [...document.querySelectorAll(interactiveSelector)]
        .filter(isVisible);
      const groups = new Map();

      for (const element of elements) {
        const classes = typeof element.className === 'string'
          ? element.className.trim().split(/\s+/).sort().join('.')
          : '';
        const signature = [
          element.tagName,
          element.getAttribute('role') || '',
          element.getAttribute('type') || '',
          classes,
        ].join('|');
        const existing = groups.get(signature);
        if (existing) {
          existing.count += 1;
          continue;
        }
        const auditId = `codex-audit-${groups.size}`;
        element.setAttribute('data-codex-audit', auditId);
        const rect = element.getBoundingClientRect();
        const computed = getComputedStyle(element);
        const hasTimedTransition = computed.transitionDuration
          .split(',')
          .some((duration) => Number.parseFloat(duration) > 0);
        groups.set(signature, {
          auditId,
          count: 1,
          signature,
          tag: element.tagName.toLowerCase(),
          role: element.getAttribute('role'),
          type: element.getAttribute('type'),
          label: element.getAttribute('aria-label') ||
            element.getAttribute('title') ||
            element.textContent?.replace(/\s+/g, ' ').trim() || '',
          href: element instanceof HTMLAnchorElement ? element.href : null,
          target: element.getAttribute('target'),
          tabIndex: element.tabIndex,
          ariaPressed: element.getAttribute('aria-pressed'),
          ariaExpanded: element.getAttribute('aria-expanded'),
          shouldProbe: hasTimedTransition || computed.animationName !== 'none' ||
            element.tagName === 'BUTTON' ||
            element.hasAttribute('aria-pressed') ||
            element.hasAttribute('aria-expanded'),
          rect: {
            x: Math.round(rect.x),
            y: Math.round(rect.y),
            width: Math.round(rect.width),
            height: Math.round(rect.height),
          },
        });
      }

      const keyframeNames = [];
      const mediaQueries = [];
      for (const sheet of [...document.styleSheets]) {
        let rules;
        try {
          rules = [...sheet.cssRules];
        } catch {
          continue;
        }
        const visit = (ruleList) => {
          for (const rule of ruleList) {
            if (rule.type === CSSRule.KEYFRAMES_RULE) {
              keyframeNames.push(rule.name || '');
            }
            if (rule.type === CSSRule.MEDIA_RULE) {
              const condition = rule.conditionText || '';
              if (/prefers-reduced-motion|hover|pointer|width|orientation/.test(condition)) {
                mediaQueries.push(condition);
              }
              visit([...rule.cssRules]);
            }
          }
        };
        visit(rules);
      }

      const fixedOrSticky = [...document.querySelectorAll('*')]
        .filter(isVisible)
        .map((element) => {
          const style = getComputedStyle(element);
          if (!['fixed', 'sticky'].includes(style.position)) return null;
          const rect = element.getBoundingClientRect();
          return {
            tag: element.tagName.toLowerCase(),
            label: element.getAttribute('aria-label') ||
              element.getAttribute('title') || element.tagName.toLowerCase(),
            className: typeof element.className === 'string' ? element.className : '',
            position: style.position,
            inset: [style.top, style.right, style.bottom, style.left],
            rect: [
              Math.round(rect.x),
              Math.round(rect.y),
              Math.round(rect.width),
              Math.round(rect.height),
            ],
          };
        })
        .filter(Boolean);

      const fontFamilies = [...new Set(
        [...document.querySelectorAll('body *')]
          .filter(isVisible)
          .map((element) => getComputedStyle(element).fontFamily),
      )];

      const colors = [...new Set(
        [...document.querySelectorAll('body *')]
          .filter(isVisible)
          .flatMap((element) => {
            const style = getComputedStyle(element);
            return [style.color, style.backgroundColor, style.borderColor];
          })
          .filter((value) => value && value !== 'rgba(0, 0, 0, 0)'),
      )];

      const animations = [...document.getAnimations({ subtree: true })].map((animation) => {
        const timing = animation.effect?.getTiming?.() || {};
        const target = animation.effect?.target;
        return {
          name: animation.animationName || animation.id || '',
          target: target ? `${target.tagName.toLowerCase()}.${target.className || ''}` : '',
          playState: animation.playState,
          duration: timing.duration,
          delay: timing.delay,
          easing: timing.easing,
          iterations: timing.iterations,
          direction: timing.direction,
          fill: timing.fill,
        };
      });

      const headings = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')]
        .filter(isVisible)
        .map((heading) => ({
          level: Number(heading.tagName.slice(1)),
          text: heading.textContent?.replace(/\s+/g, ' ').trim() || '',
        }));

      const mediaGroups = new Map();
      for (const element of [...document.querySelectorAll('img,video,audio,canvas,svg')]
        .filter(isVisible)) {
        const record = {
          tag: element.tagName.toLowerCase(),
          autoplay: 'autoplay' in element ? element.autoplay : null,
          loop: 'loop' in element ? element.loop : null,
          muted: 'muted' in element ? element.muted : null,
          controls: 'controls' in element ? element.controls : null,
        };
        const signature = JSON.stringify(record);
        const existing = mediaGroups.get(signature);
        if (existing) existing.count += 1;
        else mediaGroups.set(signature, { ...record, count: 1 });
      }

      const rootStyle = getComputedStyle(document.documentElement);
      const bodyStyle = getComputedStyle(document.body);
      return {
        title: document.title,
        lang: document.documentElement.lang,
        theme: document.documentElement.getAttribute('data-theme'),
        colorScheme: rootStyle.colorScheme,
        canvas: {
          htmlBackground: rootStyle.backgroundColor,
          bodyBackground: bodyStyle.backgroundColor,
          bodyColor: bodyStyle.color,
          bodyFont: bodyStyle.fontFamily,
          bodySize: bodyStyle.fontSize,
          scrollHeight: document.documentElement.scrollHeight,
          scrollSnapType: rootStyle.scrollSnapType || bodyStyle.scrollSnapType,
        },
        headings,
        groups: [...groups.values()],
        fixedOrSticky,
        fontFamilies,
        colors,
        media: [...mediaGroups.values()],
        animations,
        keyframeNames: [...new Set(keyframeNames)],
        mediaQueries: [...new Set(mediaQueries)],
        reducedMotionMatches: matchMedia('(prefers-reduced-motion: reduce)').matches,
        coarsePointerMatches: matchMedia('(pointer: coarse)').matches,
      };
    });

    const interactions = [];
    for (const group of viewportName === 'desktop'
      ? base.groups.filter((item) => item.shouldProbe)
      : []) {
      const locator = page.locator(`[data-codex-audit="${group.auditId}"]`);
      const before = await readStyle(group.auditId);
      if (!before) continue;
      let hover = {};
      let focus = {};
      let press = {};
      let animation = [];
      try {
        await locator.hover({ force: true });
        const hoveredStyle = await readStyle(group.auditId);
        if (hoveredStyle) hover = changed(before, hoveredStyle);
        animation = await page.evaluate((auditId) => {
          const element = document.querySelector(`[data-codex-audit="${auditId}"]`);
          if (!element) return [];
          return element.getAnimations({ subtree: true }).map((item) => {
            const timing = item.effect?.getTiming?.() || {};
            return {
              name: item.animationName || item.id || '',
              duration: timing.duration,
              delay: timing.delay,
              easing: timing.easing,
              playState: item.playState,
            };
          });
        }, group.auditId);
      } catch {}
      try {
        await locator.focus();
        const focusedStyle = await readStyle(group.auditId);
        if (focusedStyle) focus = changed(before, focusedStyle);
      } catch {}
      try {
        const box = await locator.boundingBox();
        if (box) {
          await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
          await page.mouse.down();
          const pressedStyle = await readStyle(group.auditId);
          if (pressedStyle) press = changed(before, pressedStyle);
          await page.mouse.up();
        }
      } catch {
        try { await page.mouse.up(); } catch {}
      }
      interactions.push({
        ...group,
        base: before,
        hover,
        focus,
        press,
        animation,
      });
    }

    return {
      viewport: viewportName,
      ...base,
      interactions,
    };
  };

  const results = [];
  for (const [key, url] of activeTargets) {
    const site = { key, url, observations: [], errors: [] };
    for (const [viewportName, viewport] of viewports) {
      try {
        await page.setViewportSize(viewport);
        await page.emulateMedia({ reducedMotion: 'no-preference' });
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        await page.evaluate(async () => {
          await document.fonts.ready;
        });
        const observation = await auditCurrentPage(viewportName);
        await page.emulateMedia({ reducedMotion: 'reduce' });
        const reduced = await page.evaluate(() => ({
          matches: matchMedia('(prefers-reduced-motion: reduce)').matches,
          animations: [...document.getAnimations({ subtree: true })].map((animation) => {
            const timing = animation.effect?.getTiming?.() || {};
            return {
              name: animation.animationName || animation.id || '',
              playState: animation.playState,
              duration: timing.duration,
              delay: timing.delay,
              easing: timing.easing,
            };
          }),
        }));
        observation.reducedMotion = reduced;
        site.observations.push(observation);
      } catch (error) {
        site.errors.push({ viewport: viewportName, message: String(error) });
      }
    }
    results.push(site);
  }

  return results;
}
