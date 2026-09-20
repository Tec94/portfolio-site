import pageCopy from '../../content/site/ContactPage.json';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ArrowRight, ArrowUpRight, Check } from 'lucide-react';
import { profile } from '../../data/portfolioData';
import { usePortfolioSound } from '../providers/SoundProvider';
import {
  submitContactSubmission,
  validateContactSubmission,
  type ContactFieldErrors,
  type ContactSubmission,
} from '../../lib/contactSubmissions';

type FormStatus = 'idle' | 'submitting' | 'confirmed' | 'error';

const initialForm: ContactSubmission = {
  name: '',
  email: '',
  // The existing inbox requires these fields; this form does not ask for them.
  projectType: 'not specified',
  timeline: 'not specified',
  budgetRange: 'not specified',
  message: '',
  website: '',
};

export function ContactPage() {
  const sound = usePortfolioSound();
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<ContactFieldErrors>({});
  const [status, setStatus] = useState<FormStatus>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const formRef = useRef<HTMLFormElement>(null);
  const copyTimer = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => () => clearTimeout(copyTimer.current), []);

  const update = <Key extends keyof ContactSubmission>(key: Key, value: ContactSubmission[Key]) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
    if (status === 'error') setStatus('idle');
  };

  const copyEmail = async () => {
    sound.play('press');
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      sound.play('success');
      clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 1800);
    } catch {
      sound.play('error');
      setStatus('error');
      setStatusMessage(`Copy failed. Email ${profile.email} directly.`);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === 'submitting' || status === 'confirmed') return;
    sound.play('press');
    const nextErrors = validateContactSubmission(form);
    if (Object.keys(nextErrors).length || form.website) {
      sound.play('error');
      setErrors(nextErrors);
      setStatus('error');
      setStatusMessage('Review the highlighted fields.');
      const firstError = Object.keys(nextErrors)[0];
      window.requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>(`#${firstError}`)?.focus());
      return;
    }

    setStatus('submitting');
    setStatusMessage('Sending your inquiry.');
    const result = await submitContactSubmission(form);
    if (result.ok) {
      sound.play('success');
      setStatus('confirmed');
      setStatusMessage('Inquiry received. I’ll reply within 24 hours.');
      return;
    }
    setStatus('error');
    sound.play('error');
    setStatusMessage(result.message);
  };

  return (
    <main id="portfolio-main" className="portfolio-contact-page">
      <div className="portfolio-contact-layout">
        <h1>{pageCopy.contact}</h1>
        <p className="portfolio-contact-lede">Let’s make the<br />next useful thing.</p>
        <aside className="portfolio-contact-channels" aria-label="Contact options">
          <div className="portfolio-contact-ledger">
            <a href={profile.calUrl} target="_blank" rel="noreferrer">
              <span><strong>{pageCopy.book_a_call}</strong><small>15 min · Cal.com</small></span>
              <span className="portfolio-contact-arrow" aria-hidden="true"><ArrowUpRight /></span>
            </a>
            <a href={`mailto:${profile.email}`}>
              <span><strong>{pageCopy.email}</strong><small>{profile.email}</small></span>
              <span className="portfolio-contact-arrow" aria-hidden="true"><ArrowUpRight /></span>
            </a>
            <button type="button" onClick={copyEmail} data-copied={copied || undefined}>
              <span><strong>Copy email</strong><small role="status">{copied ? 'Copied' : 'To clipboard'}</small></span>
              <span className="portfolio-state-icon" aria-hidden="true"><ArrowRight data-active={!copied || undefined} /><Check data-active={copied || undefined} /></span>
            </button>
          </div>
          <div className="portfolio-contact-location"><span>Texas · Replies within 24h</span><LocalTime /></div>
        </aside>
        <form ref={formRef} className="portfolio-contact-form" onSubmit={handleSubmit} aria-label="Project inquiry" aria-busy={status === 'submitting'} noValidate>
          <ContactField id="name" label={pageCopy.name} error={errors.name}>
            <input id="name" name="name" autoComplete="name" placeholder="Ada Lovelace" required value={form.name} onChange={(event) => update('name', event.target.value)} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'name-error' : undefined} />
          </ContactField>
          <ContactField id="email" label={pageCopy.email_} error={errors.email}>
            <input id="email" name="email" type="email" autoComplete="email" placeholder="ada@lovelace.dev" required value={form.email} onChange={(event) => update('email', event.target.value)} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'email-error' : undefined} />
          </ContactField>
          <ContactField id="message" label="Message" error={errors.message}>
            <textarea id="message" name="message" rows={2} maxLength={2000} required placeholder="What are you building, and what would useful look like?" value={form.message} onChange={(event) => {
              update('message', event.target.value);
              event.target.style.height = 'auto';
              event.target.style.height = `${event.target.scrollHeight}px`;
            }} aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? 'message-error' : 'inquiry-note'} />
          </ContactField>
          <label className="portfolio-honeypot" aria-hidden="true">{pageCopy.website}<input name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={(event) => update('website', event.target.value)} /></label>
          <div className="portfolio-contact-form__footer">
            <p id="inquiry-note" className="portfolio-contact-note" role={status === 'error' ? 'alert' : 'status'} aria-live="polite">
              {statusMessage || '20–2,000 characters'}
            </p>
            <button className="portfolio-stamp" type="submit" disabled={status === 'submitting' || status === 'confirmed'}>
              <span>{status === 'submitting' ? 'Sending…' : status === 'confirmed' ? 'Inquiry sent' : 'Send inquiry'}</span>
              <span className="portfolio-stamp__clip" aria-hidden="true"><span><ArrowRight /><ArrowRight /></span></span>
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

function ContactField({ id, label, error, children }: { id: string; label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="portfolio-contact-rule" data-field={id}>
      <label htmlFor={id}>{label}</label>
      {children}
      {error ? <p id={`${id}-error`}>{error}</p> : null}
    </div>
  );
}

const localTimeFormat = new Intl.DateTimeFormat('en-US', { timeZone: profile.timeZone, hour: 'numeric', minute: '2-digit' });

function LocalTime() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const refresh = () => { if (!document.hidden) setNow(new Date()); };
    // The clock displays minutes, so it only needs a minute tick.
    const timer = window.setInterval(refresh, 60_000);
    document.addEventListener('visibilitychange', refresh);
    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', refresh);
    };
  }, []);
  return <time dateTime={now.toISOString()}>{localTimeFormat.format(now)}</time>;
}
