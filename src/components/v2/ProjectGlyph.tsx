import type { ProjectGlyph as GlyphName } from '../../data/portfolioData';

interface ProjectGlyphProps {
  name: GlyphName;
  className?: string;
  title?: string;
}

export default function ProjectGlyph({ name, className, title }: ProjectGlyphProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
    >
      {title ? <title>{title}</title> : null}
      {name === 'card' ? (
        <>
          <rect x="7" y="11" width="34" height="26" rx="6" />
          <path d="M7 19h34M13 30h10" />
          <circle cx="34" cy="29" r="3" />
        </>
      ) : null}
      {name === 'voice' ? (
        <>
          <path d="M11 12h26v19H24l-8 6v-6h-5V12Z" />
          <path d="M17 19h14M17 25h9" />
        </>
      ) : null}
      {name === 'nest' ? (
        <>
          <path d="m8 21 16-12 16 12-4 18H12L8 21Z" />
          <path d="M17 25c2.2-5 11.8-5 14 0-2.4 7.2-11.6 7.2-14 0Z" />
          <path d="M24 19v11" />
        </>
      ) : null}
      {name === 'chart' ? (
        <>
          <path d="M9 38V10M9 38h31" />
          <path d="m14 31 8-9 7 5 10-13" />
          <circle cx="14" cy="31" r="2" />
          <circle cx="22" cy="22" r="2" />
          <circle cx="29" cy="27" r="2" />
          <circle cx="39" cy="14" r="2" />
        </>
      ) : null}
      {name === 'coin' ? (
        <>
          <circle cx="24" cy="24" r="16" />
          <path d="M17 29c3-1 4-10 7-10s4 9 7 10" />
          <path d="M16 19c4 3 12 3 16 0M16 30c4-3 12-3 16 0" />
        </>
      ) : null}
    </svg>
  );
}
