import { useRef, useState, type FormEvent } from 'react';
import { ArrowUpRight, CalendarDays, Check, Clipboard, Mail, Send } from 'lucide-react';
import { profile } from '../../data/portfolioData';
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
  projectType: '',
  timeline: '',
  budgetRange: '',
  message: '',
  website: '',
};

export function ContactPage() {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<ContactFieldErrors>({});
  const [status, setStatus] = useState<FormStatus>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  const update = <Key extends keyof ContactSubmission>(key: Key, value: ContactSubmission[Key]) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
    if (status === 'error') setStatus('idle');
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setStatus('error');
      setStatusMessage(`Copy failed. Email ${profile.email} directly.`);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validateContactSubmission(form);
    if (Object.keys(nextErrors).length || form.website) {
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
      setStatus('confirmed');
      setStatusMessage('Inquiry received. I’ll reply within two business days.');
      return;
    }
    setStatus('error');
    setStatusMessage(result.message);
  };

  return (
    <main id="portfolio-main" className="portfolio-route-page portfolio-contact-page">
      <header className="portfolio-route-header">
        <p className="portfolio-kicker">Contact</p>
        <h1>Let’s make the next useful thing.</h1>
      </header>

      <section className="portfolio-contact-quick" aria-label="Contact options">
        <a href={profile.calUrl} target="_blank" rel="noreferrer">
          <CalendarDays aria-hidden="true" /><span><strong>Book a call</strong><small>15 minutes on Cal.com</small></span><ArrowUpRight aria-hidden="true" />
        </a>
        <a href={`mailto:${profile.email}`}>
          <Mail aria-hidden="true" /><span><strong>Email</strong><small>{profile.email}</small></span><ArrowUpRight aria-hidden="true" />
        </a>
        <button type="button" onClick={copyEmail}>
          {copied ? <Check aria-hidden="true" /> : <Clipboard aria-hidden="true" />}
          <span><strong>{copied ? 'Email copied' : 'Copy email'}</strong><small>{profile.email}</small></span>
        </button>
      </section>

      <button
        type="button"
        className="portfolio-inquiry-toggle"
        aria-expanded={expanded}
        aria-controls="portfolio-inquiry"
        onClick={() => setExpanded((current) => !current)}
      >
        {expanded ? 'Close project inquiry' : 'Send a project inquiry'}
      </button>

      <div id="portfolio-inquiry" className="portfolio-inquiry" data-open={expanded || undefined} hidden={!expanded}>
        <form ref={formRef} onSubmit={handleSubmit} aria-busy={status === 'submitting'} noValidate>
          <ContactField id="name" label="Name" error={errors.name}>
            <input id="name" name="name" autoComplete="name" value={form.name} onChange={(event) => update('name', event.target.value)} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'name-error' : undefined} />
          </ContactField>
          <ContactField id="email" label="Email" error={errors.email}>
            <input id="email" name="email" type="email" autoComplete="email" value={form.email} onChange={(event) => update('email', event.target.value)} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'email-error' : undefined} />
          </ContactField>
          <ContactField id="projectType" label="Project type" error={errors.projectType}>
            <select id="projectType" name="projectType" value={form.projectType} onChange={(event) => update('projectType', event.target.value)} aria-invalid={Boolean(errors.projectType)} aria-describedby={errors.projectType ? 'projectType-error' : undefined}>
              <option value="">Choose a project type</option>
              <option value="product-engineering">Product engineering</option>
              <option value="interface-systems">Interface systems</option>
              <option value="product-direction">Product direction</option>
              <option value="other">Something else</option>
            </select>
          </ContactField>
          <ContactField id="timeline" label="Timeline" error={errors.timeline}>
            <select id="timeline" name="timeline" value={form.timeline} onChange={(event) => update('timeline', event.target.value)} aria-invalid={Boolean(errors.timeline)} aria-describedby={errors.timeline ? 'timeline-error' : undefined}>
              <option value="">Choose a timeline</option>
              <option value="asap">As soon as possible</option>
              <option value="1-3-months">Within 1–3 months</option>
              <option value="3-6-months">Within 3–6 months</option>
              <option value="flexible">Flexible</option>
            </select>
          </ContactField>
          <ContactField id="budgetRange" label="Budget" error={errors.budgetRange}>
            <select id="budgetRange" name="budgetRange" value={form.budgetRange} onChange={(event) => update('budgetRange', event.target.value)} aria-invalid={Boolean(errors.budgetRange)} aria-describedby={errors.budgetRange ? 'budgetRange-error' : undefined}>
              <option value="">Choose a budget</option>
              <option value="under-1k">Under $1,000</option>
              <option value="1k-5k">$1,000–$5,000</option>
              <option value="5k-15k">$5,000–$15,000</option>
              <option value="15k-plus">$15,000+</option>
              <option value="undecided">Not decided</option>
            </select>
          </ContactField>
          <ContactField id="message" label="Project details" error={errors.message} wide>
            <textarea id="message" name="message" maxLength={2000} value={form.message} onChange={(event) => update('message', event.target.value)} aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? 'message-error' : 'message-count'} />
            <span id="message-count">{form.message.length} / 2000</span>
          </ContactField>
          <label className="portfolio-honeypot" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={(event) => update('website', event.target.value)} /></label>
          <button className="portfolio-submit" type="submit" disabled={status === 'submitting' || status === 'confirmed'}>
            {status === 'confirmed' ? <Check aria-hidden="true" /> : <Send aria-hidden="true" />}
            {status === 'submitting' ? 'Sending…' : status === 'confirmed' ? 'Inquiry sent' : 'Send inquiry'}
          </button>
          <p className="portfolio-contact-privacy">Your message goes only to the private project inquiry inbox. You can use direct email instead.</p>
          <p className="portfolio-form-status" role={status === 'error' ? 'alert' : 'status'} aria-live="polite">{statusMessage}</p>
        </form>
      </div>
    </main>
  );
}

function ContactField({ id, label, error, children, wide = false }: { id: string; label: string; error?: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <div className="portfolio-contact-field" data-wide={wide || undefined}>
      <label htmlFor={id}>{label}</label>
      {children}
      {error ? <p id={`${id}-error`}>{error}</p> : null}
    </div>
  );
}
