import { useEffect, useMemo, useState } from 'react';
import type { ContentHeading } from '../content/manifest';

export function ContentNavigation({ headings }: { headings: ContentHeading[] }) {
  const navigable = useMemo(() => headings.filter((heading) => heading.level <= 3), [headings]);
  const [activeId, setActiveId] = useState(navigable[0]?.id ?? '');

  useEffect(() => {
    if (!navigable.length) return undefined;
    const nodes = navigable
      .map((heading) => document.getElementById(heading.id))
      .filter((node): node is HTMLElement => Boolean(node));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible?.target.id) setActiveId(visible.target.id);
      },
      { rootMargin: '-18% 0px -68%', threshold: [0, 1] },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [navigable]);

  if (!navigable.length) return null;

  return (
    <nav className="portfolio-content-nav" aria-label="On this page">
      <span className="portfolio-content-nav__label">On this page</span>
      <ol>
        {navigable.map((heading) => (
          <li key={heading.id} data-level={heading.level}>
            <a href={`#${heading.id}`} aria-current={activeId === heading.id ? 'location' : undefined}>
              {heading.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
