import { lazy, Suspense, useState, type FormEvent, type ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Select } from '@base-ui/react/select';
import {
  ArrowUpRight,
  CalendarDays,
  Check,
  ChevronDown,
  LockKeyhole,
  Mail,
  Send,
  AlertTriangle,
} from 'lucide-react';
import { profile } from '../../data/portfolioData';
import {
  submitContactSubmission,
  validateContactSubmission,
  type ContactFieldErrors,
  type ContactSubmission,
} from '../../lib/contactSubmissions';

const V2BookingWidget = lazy(() => import('./V2BookingWidget'));
const projectTypes = [
  { label: 'Web development', value: 'web-development' },
  { label: 'Product engineering', value: 'product-engineering' },
  { label: 'UI / UX design', value: 'ui-ux-design' },
  { label: 'Performance & SEO', value: 'performance-seo' },
  { label: 'Technical consulting', value: 'technical-consulting' },
  { label: 'Something else', value: 'other' },
];
const timelines = [
  { label: 'As soon as possible', value: 'asap' },
  { label: 'Within 1–3 months', value: '1-3-months' },
  { label: 'Within 3–6 months', value: '3-6-months' },
  { label: 'Flexible / exploring', value: 'flexible' },
];
const budgets = [
  { label: 'Under $1,000', value: 'under-1k' },
  { label: '$1,000–$5,000', value: '1k-5k' },
  { label: '$5,000–$15,000', value: '5k-15k' },
  { label: '$15,000+', value: '15k-plus' },
  { label: 'Not decided yet', value: 'undecided' },
];
type FormStatus = 'idle' | 'validating' | 'submitting' | 'confirmed' | 'error';

export default function ContactPage() {
  const [searchParams] = useSearchParams();
  const requestedType = searchParams.get('projectType') ?? '';
  const initialType = projectTypes.some((item) => item.value === requestedType) ? requestedType : '';
  const [form, setForm] = useState<ContactSubmission>({
    name: '',
    email: '',
    projectType: initialType,
    timeline: '',
    budgetRange: '',
    message: '',
    website: '',
  });
  const [errors, setErrors] = useState<ContactFieldErrors>({});
  const [status, setStatus] = useState<FormStatus>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [bookingActive, setBookingActive] = useState(false);

  const update = <Key extends keyof ContactSubmission>(
    key: Key,
    value: ContactSubmission[Key],
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
    if (status === 'error') setStatus('idle');
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('validating');
    setStatusMessage('Checking your inquiry.');
    const nextErrors = validateContactSubmission(form);
    if (Object.keys(nextErrors).length > 0 || form.website) {
      setErrors(nextErrors);
      setStatus('error');
      setStatusMessage('Review the highlighted fields before sending.');
      const firstError = Object.keys(nextErrors)[0];
      requestAnimationFrame(() => document.getElementById(firstError)?.focus());
      return;
    }

    setStatus('submitting');
    setStatusMessage('Securely sending your inquiry.');
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
    <div className="v2-page v2-contact-page">
      <header className="v2-contact-hero">
        <p className="v2-eyebrow">Let&apos;s connect</p>
        <h1>Let&apos;s build something useful.</h1>
        <p className="v2-lede">
          Tell me what you are trying to change, where things stand, and what a good outcome
          would look like.
        </p>
      </header>

      <form
        className="v2-contact-form"
        onSubmit={handleSubmit}
        aria-busy={status === 'submitting' || status === 'validating'}
        noValidate
      >
        <div className="v2-contact-fields">
          <Field
            id="name"
            label="Your name"
            error={errors.name}
          >
            <input
              id="name"
              name="name"
              autoComplete="name"
              value={form.name}
              onChange={(event) => update('name', event.target.value)}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? 'name-error' : undefined}
              placeholder="e.g. Alex Johnson"
            />
          </Field>
          <Field id="email" label="Email address" error={errors.email}>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={(event) => update('email', event.target.value)}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'email-error' : undefined}
              placeholder="alex@company.com"
            />
          </Field>
          <Field id="projectType" label="Project type" error={errors.projectType}>
            <BaseSelect
              id="projectType"
              value={form.projectType}
              placeholder="Choose a project type"
              options={projectTypes}
              error={Boolean(errors.projectType)}
              onChange={(value) => update('projectType', value)}
            />
          </Field>
          <Field id="timeline" label="Timeline" error={errors.timeline}>
            <BaseSelect
              id="timeline"
              value={form.timeline}
              placeholder="Choose a timeline"
              options={timelines}
              error={Boolean(errors.timeline)}
              onChange={(value) => update('timeline', value)}
            />
          </Field>
          <Field id="budgetRange" label="Budget range" error={errors.budgetRange}>
            <BaseSelect
              id="budgetRange"
              value={form.budgetRange}
              placeholder="Choose a budget range"
              options={budgets}
              error={Boolean(errors.budgetRange)}
              onChange={(value) => update('budgetRange', value)}
            />
          </Field>
          <Field id="message" label="Project details" error={errors.message} className="is-wide">
            <div className="v2-textarea-wrap">
              <textarea
                id="message"
                name="message"
                value={form.message}
                onChange={(event) => update('message', event.target.value)}
                aria-invalid={Boolean(errors.message)}
                aria-describedby={errors.message ? 'message-error' : 'message-count'}
                maxLength={2000}
                placeholder="What are you building, who is it for, and what is getting in the way?"
              />
              <span id="message-count">{form.message.length} / 2000</span>
            </div>
          </Field>
          <label className="v2-honeypot" aria-hidden="true">
            Website
            <input
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={form.website}
              onChange={(event) => update('website', event.target.value)}
            />
          </label>
        </div>

        <div className="v2-contact-submit">
          <button
            className="v2-button v2-button-primary"
            type="submit"
            disabled={status === 'submitting' || status === 'validating' || status === 'confirmed'}
          >
            {status === 'confirmed' ? <Check size={17} /> : <Send size={17} />}
            {status === 'submitting'
              ? 'Sending inquiry…'
              : status === 'confirmed'
                ? 'Inquiry confirmed'
                : 'Send inquiry'}
          </button>
          <a className="v2-button v2-button-secondary" href={`mailto:${profile.email}`}>
            <Mail size={17} aria-hidden="true" /> Email me instead
          </a>
        </div>

        <div
          className={`v2-form-status ${status === 'error' ? 'is-error' : ''} ${status === 'confirmed' ? 'is-confirmed' : ''}`}
          role={status === 'error' ? 'alert' : 'status'}
          aria-live="polite"
        >
          {status === 'error' ? <AlertTriangle size={16} /> : <LockKeyhole size={15} />}
          <span>
            {statusMessage || 'Your message is sent only to the private project inquiry inbox.'}
          </span>
        </div>
      </form>

      <section className="v2-booking-cta">
        <div>
          <CalendarDays aria-hidden="true" />
          <span>
            <strong>Not sure where to start?</strong>
            <small>Activate the booking panel for a free 30-minute conversation.</small>
          </span>
        </div>
        <button className="v2-button v2-button-secondary" onClick={() => setBookingActive(true)}>
          Book a call <ArrowUpRight size={16} aria-hidden="true" />
        </button>
      </section>

      {bookingActive ? (
        <Suspense
          fallback={
            <div className="v2-booking-loading" role="status" aria-busy="true">
              Loading secure booking…
            </div>
          }
        >
          <V2BookingWidget />
        </Suspense>
      ) : null}
    </div>
  );
}

function Field({
  id,
  label,
  error,
  children,
  className = '',
}: {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`v2-field ${className}`}>
      <label htmlFor={id}>{label}<span aria-hidden="true">*</span></label>
      {children}
      {error ? <p id={`${id}-error`} className="v2-field-error">{error}</p> : null}
    </div>
  );
}

function BaseSelect({
  id,
  value,
  placeholder,
  options,
  error,
  onChange,
}: {
  id: string;
  value: string;
  placeholder: string;
  options: Array<{ label: string; value: string }>;
  error: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <Select.Root
      id={id}
      name={id}
      items={options}
      value={value || null}
      onValueChange={(nextValue) => onChange(nextValue ?? '')}
    >
      <Select.Trigger
        className="v2-select-trigger"
        aria-invalid={error}
        aria-describedby={error ? `${id}-error` : undefined}
      >
        <Select.Value placeholder={placeholder} />
        <Select.Icon><ChevronDown size={16} /></Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Positioner className="v2-select-positioner" sideOffset={6} alignItemWithTrigger={false}>
          <Select.Popup className="v2-select-popup">
            <Select.List>
              {options.map((option) => (
                <Select.Item key={option.value} value={option.value} className="v2-select-item">
                  <Select.ItemIndicator className="v2-select-check">
                    <Check size={14} />
                  </Select.ItemIndicator>
                  <Select.ItemText>{option.label}</Select.ItemText>
                </Select.Item>
              ))}
            </Select.List>
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  );
}
