import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Bookmark, FileText, Sparkles } from 'lucide-react';
import { experiences, notes, profile, timeline } from '../../data/portfolioData';

gsap.registerPlugin(ScrollTrigger);

const noteTags = ['All', 'Mindset', 'Engineering', 'Business', 'AI'] as const;

export default function AboutPage() {
  const [tag, setTag] = useState<(typeof noteTags)[number]>('All');
  const [activeYear, setActiveYear] = useState(timeline[0].year);
  const pageRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const chapterRefs = useRef<Array<HTMLElement | null>>([]);
  const filteredNotes = tag === 'All' ? notes : notes.filter((note) => note.tag === tag);

  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add('(min-width: 1080px) and (prefers-reduced-motion: no-preference)', () => {
        chapterRefs.current.forEach((chapter, index) => {
          if (!chapter) return;
          ScrollTrigger.create({
            trigger: chapter,
            start: 'top 55%',
            end: 'bottom 45%',
            onEnter: () => setActiveYear(timeline[index].year),
            onEnterBack: () => setActiveYear(timeline[index].year),
          });
        });

        if (progressRef.current && chapterRefs.current[0]) {
          gsap.fromTo(
            progressRef.current,
            { scaleY: 0 },
            {
              scaleY: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: chapterRefs.current[0],
                endTrigger: chapterRefs.current[chapterRefs.current.length - 1],
                start: 'top 65%',
                end: 'bottom 60%',
                scrub: 0.35,
              },
            },
          );
        }
      });
      return () => media.revert();
    },
    { scope: pageRef },
  );

  return (
    <div ref={pageRef} className="v2-page v2-about-page">
      <header className="v2-about-hero">
        <div>
          <p className="v2-eyebrow">About / field notes</p>
          <h1>My story, the ideas I build with, <em>and the notes I leave behind.</em></h1>
          <p className="v2-lede">
            I like the seam between product thinking and implementation: the place where a
            fuzzy problem becomes a system people can actually use.
          </p>
        </div>
        <article className="v2-featured-note" aria-labelledby="featured-note-title">
          <span>Featured draft</span>
          <Sparkles aria-hidden="true" />
          <h2 id="featured-note-title">Designing systems that scale</h2>
          <p>Thoughts on building products that stay legible as the team and surface area grow.</p>
          <small>Forthcoming · Systems</small>
        </article>
      </header>

      <nav className="v2-career-rail" aria-label="Career chapters">
        <span className="v2-career-rail-line" aria-hidden="true" />
        {timeline.map((chapter) => (
          <a
            key={chapter.year}
            href={`#chapter-${chapter.year}`}
            className={activeYear === chapter.year ? 'is-active' : undefined}
          >
            <i aria-hidden="true" />
            <span>{chapter.year}</span>
            <strong>{chapter.title}</strong>
            <small>{chapter.badge}</small>
          </a>
        ))}
      </nav>

      <div className="v2-about-layout">
        <section className="v2-career-chapters" aria-label="Career timeline">
          <span className="v2-chapter-track" aria-hidden="true">
            <span ref={progressRef} />
          </span>
          {timeline.map((chapter, index) => (
            <article
              key={chapter.year}
              id={`chapter-${chapter.year}`}
              ref={(node) => {
                chapterRefs.current[index] = node;
              }}
              className={activeYear === chapter.year ? 'is-active' : undefined}
            >
              <div className="v2-chapter-year" aria-hidden="true">
                <span>{chapter.year}</span>
                <i />
              </div>
              <div className="v2-chapter-copy">
                <p>{chapter.badge}</p>
                <h2>{chapter.title}</h2>
                <p>{chapter.summary}</p>
                <div className="v2-chapter-notes">
                  <h3>Notes from this chapter</h3>
                  {chapter.notes.map((note) => (
                    <div key={note.title}>
                      <span>{note.title}</span>
                      <small>{note.date} · {note.tag} · Draft</small>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          ))}

          <section className="v2-experience-ledger" aria-labelledby="experience-title">
            <div>
              <p className="v2-eyebrow">Resume ledger</p>
              <h2 id="experience-title">Previous teams</h2>
            </div>
            <div>
              {experiences.map((experience) => (
                <article key={experience.company}>
                  <strong>{experience.company}</strong>
                  <span>{experience.role}</span>
                  <small>{experience.period} · {experience.location}</small>
                </article>
              ))}
              <a href={`mailto:${profile.email}?subject=Resume request`}>
                <FileText size={16} aria-hidden="true" /> Request full résumé
              </a>
            </div>
          </section>
        </section>

        <aside id="notes-archive" className="v2-notes-archive">
          <header>
            <div>
              <p className="v2-eyebrow">Notes archive</p>
              <h2>Working thoughts</h2>
            </div>
            <span>{filteredNotes.length.toString().padStart(2, '0')}</span>
          </header>
          <div className="v2-note-filters" role="group" aria-label="Filter notes">
            {noteTags.map((noteTag) => (
              <button
                key={noteTag}
                onClick={() => setTag(noteTag)}
                aria-pressed={tag === noteTag}
                className={tag === noteTag ? 'is-active' : undefined}
              >
                {noteTag}
              </button>
            ))}
          </div>
          <div className="v2-note-list">
            {filteredNotes.map((note) => (
              <article key={note.title}>
                <div>
                  <span>{note.tag}</span>
                  <Bookmark size={14} aria-hidden="true" />
                </div>
                <h3>{note.title}</h3>
                <small>{note.date}</small>
                <p>{note.excerpt}</p>
                <em>Draft · not yet published</em>
              </article>
            ))}
          </div>
        </aside>
      </div>

      <footer className="v2-about-footer">
        <span>Design · build · iterate</span>
        <span>{profile.location}</span>
      </footer>
    </div>
  );
}
