import pageCopy from '../../content/site/ServicesReceipts.json';
import serviceContent from '../../content/site/services.json';
import { motion } from 'framer-motion';
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEventHandler,
} from 'react';
import { profile } from '../../data/portfolioData';

interface ServiceDefinition {
  slug: string;
  title: string;
  summary: string;
  rows: Array<{ label: string; values: string[] }>;
  duration: string;
  price: string;
}

const services: ServiceDefinition[] = serviceContent;

function ReceiptEdge({ position }: { position: 'top' | 'bottom' }) {
  const edgeRef = useRef<HTMLDivElement>(null);
  const [notchCount, setNotchCount] = useState(12);

  useEffect(() => {
    const edge = edgeRef.current;
    if (!edge) return undefined;
    const update = (width: number) => {
      setNotchCount(Math.max(1, Math.floor((width + 16) / 32)));
    };
    update(edge.clientWidth);
    if (typeof ResizeObserver === 'undefined') return undefined;
    const observer = new ResizeObserver(([entry]) => update(entry.contentRect.width));
    observer.observe(edge);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={edgeRef}
      className={`portfolio-receipt-edge is-${position}`}
      style={{ '--portfolio-receipt-notch-count': notchCount } as CSSProperties}
      aria-hidden="true"
    >
      {Array.from({ length: notchCount }, (_, index) => (
        <svg key={index} viewBox="0 0 16 8">
          <circle cx="8" cy={position === 'top' ? '0' : '8'} r="8" />
        </svg>
      ))}
    </div>
  );
}

function ServiceReceipt({
  service,
  open,
  onPointerEnter,
  onPointerLeave,
  onFocus,
  onBlur,
}: {
  service: ServiceDefinition;
  open: boolean;
  onPointerEnter: PointerEventHandler<HTMLElement>;
  onPointerLeave: PointerEventHandler<HTMLElement>;
  onFocus: () => void;
  onBlur: () => void;
}) {
  const articleRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    if (!open) {
      setStuck(false);
      return undefined;
    }
    const update = () => {
      const article = articleRef.current;
      const trigger = triggerRef.current;
      if (!article || !trigger) return;
      const articleRect = article.getBoundingClientRect();
      const inset = Number.parseFloat(getComputedStyle(trigger).insetBlockStart) || 0;
      setStuck(articleRect.top < inset && articleRect.bottom > inset + trigger.offsetHeight);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [open]);

  const detailsId = `portfolio-${service.slug}-details`;
  return (
    <article
      ref={articleRef}
      id={`portfolio-service-${service.slug}`}
      className="portfolio-service-receipt"
      data-open={open}
      data-stuck={stuck || undefined}
      data-cursor-tone={service.slug === 'interface-systems' ? 'dark' : 'light'}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    >
      <ReceiptEdge position="top" />
      <div className="portfolio-receipt-sheet">
        <div
          ref={triggerRef}
          className="portfolio-receipt-trigger"
          tabIndex={0}
          aria-expanded={open}
          aria-controls={detailsId}
          onFocus={onFocus}
          onBlur={onBlur}
        >
          <span className="portfolio-receipt-title">
            <strong>{service.title}</strong>
            <span>{service.summary}</span>
          </span>
        </div>
        <motion.div
          id={detailsId}
          className="portfolio-receipt-body"
          initial={false}
          animate={{ height: open ? 'auto' : 0 }}
          transition={{ type: 'spring', stiffness: 360, damping: 30, mass: 0.8 }}
          aria-hidden={!open}
        >
          <motion.div
            className="portfolio-receipt-content"
            initial={false}
            animate={{ opacity: open ? 1 : 0, y: open ? 0 : -6 }}
            transition={{ duration: open ? 0.28 : 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <dl className="portfolio-receipt-specs">
              {service.rows.map((row) => (
                <div className="portfolio-receipt-spec-row" key={row.label}>
                  <dt>{row.label}</dt>
                  <dd>{row.values.map((value) => <span key={value}>{value}</span>)}</dd>
                </div>
              ))}
              <div className="portfolio-receipt-spec-row is-emphasis">
                <dt>{pageCopy["duration_weeks"]}</dt><dd>{service.duration}</dd>
              </div>
              <div className="portfolio-receipt-spec-row is-emphasis is-price">
                <dt>{pageCopy["pricing"]}</dt><dd>{service.price}</dd>
              </div>
            </dl>
          </motion.div>
        </motion.div>
      </div>
      <ReceiptEdge position="bottom" />
    </article>
  );
}

export function ServicesReceipts({ standalone = false }: { standalone?: boolean }) {
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  return (
    <section
      id="services"
      className="portfolio-content-shell portfolio-split-layout portfolio-services"
      data-portfolio-section="services"
      aria-labelledby="portfolio-services-heading"
    >
      <div className="portfolio-services__sidebar">
        <div className="portfolio-services__index">
          {standalone ? (
            <h1 id="portfolio-services-heading">{pageCopy["services"]}</h1>
          ) : (
            <h2 id="portfolio-services-heading">{pageCopy["services_"]}</h2>
          )}
          <a className="portfolio-services__booking" href={profile.calUrl} target="_blank" rel="noreferrer">{pageCopy["book_a_call"]}</a>
        </div>
      </div>
      <div className="portfolio-services__receipts">
        {services.map((service) => (
          <ServiceReceipt
            key={service.slug}
            service={service}
            open={openSlug === service.slug}
            onPointerEnter={(event) => {
              if (event.pointerType === 'mouse') setOpenSlug(service.slug);
            }}
            onPointerLeave={(event) => {
              if (event.pointerType === 'mouse') setOpenSlug((current) => (
                current === service.slug ? null : current
              ));
            }}
            onFocus={() => setOpenSlug(service.slug)}
            onBlur={() => setOpenSlug((current) => (
              current === service.slug ? null : current
            ))}
          />
        ))}
      </div>
    </section>
  );
}
