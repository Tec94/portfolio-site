import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  CheckCircle2,
  Copy,
  CreditCard,
  Minus,
  Pencil,
  Plus,
  ShieldCheck,
  Zap,
} from 'lucide-react';

const DESIGN_WIDTH = 4096;
const DESIGN_HEIGHT = 2458;
const MVP_PRICE = 5000;
const RUSH_PRICE = 500;
const TAX_RATE = 0.06;
const PAYMENT_FONT = '"Avenir Next", "Avenir", "Helvetica Neue", "Segoe UI", sans-serif';

type PaymentMethodKey = 'card' | 'crypto' | 'applepay';
type CheckoutStatus = 'idle' | 'processing' | 'success';
type FormErrors = Partial<Record<'method' | 'fullName' | 'companyName' | 'email' | 'cardNumber' | 'expiry' | 'cvv', string>>;

const x = (value: number) => `calc(${(value / DESIGN_WIDTH) * 100}cqw)`;
const y = (value: number) => `calc(${(value / DESIGN_HEIGHT) * 100}cqh)`;

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

function clampQuantity(value: number, minimum = 1, maximum = 9) {
  return Math.min(maximum, Math.max(minimum, value));
}

function normalizeCardNumber(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
}

function normalizeExpiry(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length <= 2) {
    return digits;
  }
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

function normalizeCvv(value: string) {
  return value.replace(/\D/g, '').slice(0, 3);
}

function validateEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validateExpiry(value: string) {
  return /^(0[1-9]|1[0-2])\/\d{2}$/.test(value);
}

function LogoMark() {
  return (
    <div className="relative" style={{ width: x(92), height: y(84) }} aria-hidden="true">
      <span className="absolute rounded-sm bg-[#111111]" style={{ left: x(0), top: y(0), width: x(14), height: y(42) }} />
      <span className="absolute rounded-sm bg-[#111111]" style={{ left: x(0), top: y(28), width: x(40), height: y(14) }} />
      <span className="absolute rounded-sm bg-[#111111]" style={{ left: x(26), top: y(28), width: x(18), height: y(56) }} />
      <span className="absolute rounded-sm bg-[#111111]" style={{ left: x(48), top: y(32), width: x(18), height: y(52) }} />
      <span className="absolute rounded-sm bg-[#111111]" style={{ left: x(48), top: y(32), width: x(44), height: y(16) }} />
      <span className="absolute rounded-sm bg-[#111111]" style={{ left: x(48), top: y(50), width: x(44), height: y(16) }} />
      <span className="absolute rounded-sm bg-[#111111]" style={{ left: x(78), top: y(32), width: x(14), height: y(52) }} />
    </div>
  );
}

function PaymentMethodCard({
  active,
  label,
  onClick,
  children,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.992 }}
      transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col justify-between text-left transition-shadow duration-200 focus-visible:outline-none"
      style={{
        borderRadius: x(44),
        border: active ? `${x(4)} solid #2382ff` : `${x(2)} solid rgba(229, 228, 225, 0.8)`,
        background: active ? 'rgba(255,255,255,0.84)' : 'rgba(255,255,255,0.48)',
        padding: `${y(30)} ${x(34)}`,
        minHeight: y(176),
        boxShadow: active
          ? '0 12px 28px rgba(35,130,255,0.12)'
          : '0 8px 18px rgba(26, 30, 40, 0.03)',
        outline: active ? `${x(2)} solid rgba(35, 130, 255, 0.08)` : undefined,
        outlineOffset: x(2),
      }}
      aria-pressed={active}
      aria-label={`Select ${label}`}
    >
      <div className="flex items-center" style={{ gap: x(18) }}>
        <span
          className="flex items-center justify-center rounded-full"
          style={{
            width: x(54),
            height: x(54),
            border: `${x(2)} solid ${active ? '#1c80ff' : '#e4e5e9'}`,
            background: active ? '#2083ff' : 'rgba(255,255,255,0.94)',
            boxShadow: active ? '0 8px 18px rgba(28,128,255,0.2)' : 'none',
          }}
          aria-hidden="true"
        >
          <span
            className="rounded-full"
            style={{
              width: x(16),
              height: x(16),
              background: active ? '#ffffff' : 'transparent',
            }}
          />
        </span>
        <span
          style={{
            fontSize: x(44),
            fontWeight: 600,
            color: active ? '#1f2129' : '#898d98',
            letterSpacing: '-0.025em',
          }}
        >
          {label}
        </span>
      </div>

      <div style={{ marginTop: y(28) }}>{children}</div>
    </motion.button>
  );
}

function QuantityButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.92 }}
      onClick={onClick}
      aria-label={label}
      className="flex items-center justify-center rounded-full bg-[#7f818a] text-white transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2382ff]/60"
      style={{ width: x(40), height: x(40) }}
    >
      {children}
    </motion.button>
  );
}

function SelectionRow({
  icon,
  title,
  description,
  quantity,
  onDecrease,
  onIncrease,
  price,
  suffix,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
  price: string;
  suffix?: string;
}) {
  return (
    <div style={{ padding: `${y(34)} ${x(34)} ${y(28)}` }}>
      <div className="flex items-center justify-between" style={{ gap: x(32) }}>
        <div className="flex items-center" style={{ gap: x(22) }}>
          <span className="flex items-center justify-center text-[#636772]" style={{ width: x(34), height: y(34) }}>
            {icon}
          </span>
          <span style={{ fontSize: x(46), fontWeight: 700, color: '#191d25', letterSpacing: '-0.03em' }}>
            {title}
          </span>
        </div>

        <div className="flex items-center" style={{ gap: x(18) }}>
          <QuantityButton label={`Decrease ${title} quantity`} onClick={onDecrease}>
            <Minus size={16} strokeWidth={2.6} />
          </QuantityButton>

          <div
            className="flex items-center justify-center border border-[#ede9e5] bg-white text-[#151922]"
            style={{
              width: x(76),
              height: y(54),
              borderRadius: x(14),
              fontSize: x(42),
              fontWeight: 600,
              boxShadow: '0 8px 18px rgba(18, 24, 38, 0.04)',
              fontVariantNumeric: 'tabular-nums',
            }}
            aria-live="polite"
          >
            {quantity}
          </div>

          <QuantityButton label={`Increase ${title} quantity`} onClick={onIncrease}>
            <Plus size={16} strokeWidth={2.6} />
          </QuantityButton>

          <div style={{ minWidth: x(180), textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
            <span style={{ fontSize: x(46), fontWeight: 700, color: '#141822', letterSpacing: '-0.03em' }}>{price}</span>
            {suffix ? (
              <span style={{ fontSize: x(42), fontWeight: 500, color: '#6d7079' }}>{suffix}</span>
            ) : null}
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: y(28),
          borderTop: `${y(2)} solid #efebe7`,
          paddingTop: y(28),
          fontSize: x(37),
          lineHeight: 1.55,
          fontWeight: 500,
          color: '#767984',
          letterSpacing: '-0.01em',
        }}
      >
        {description}
      </div>
    </div>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  placeholder,
  inputMode,
  autoComplete,
  maxLength,
  type = 'text',
  rightSlot,
  muted,
  error,
  readOnly,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
  autoComplete?: string;
  maxLength?: number;
  type?: React.HTMLInputTypeAttribute;
  rightSlot?: React.ReactNode;
  muted?: boolean;
  error?: string;
  readOnly?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        style={{
          display: 'block',
          marginBottom: y(18),
          fontSize: x(32),
          fontWeight: 500,
          color: '#5f636f',
          letterSpacing: '-0.02em',
        }}
      >
        {label}
      </label>

      <div
        className="flex items-center justify-between bg-white transition-[border-color,box-shadow] duration-200"
        style={{
          height: y(96),
          borderRadius: x(24),
          padding: `0 ${x(30)}`,
          border: `${x(2)} solid ${error ? '#d75d5d' : '#ebe7e3'}`,
          boxShadow: error
            ? '0 10px 22px rgba(215, 93, 93, 0.08)'
            : '0 10px 22px rgba(18, 24, 38, 0.035)',
        }}
      >
        <input
          id={id}
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          inputMode={inputMode}
          autoComplete={autoComplete}
          maxLength={maxLength}
          readOnly={readOnly}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className="min-w-0 flex-1 bg-transparent outline-none"
          style={{
            fontSize: x(42),
            fontWeight: 600,
            color: muted ? '#b4b7bf' : '#151923',
            letterSpacing: '-0.02em',
            fontFamily: PAYMENT_FONT,
            fontVariantNumeric: 'tabular-nums',
            caretColor: '#177dff',
          }}
        />
        {rightSlot ? <div style={{ marginLeft: x(20), flexShrink: 0 }}>{rightSlot}</div> : null}
      </div>

      <AnimatePresence initial={false}>
        {error ? (
          <motion.p
            id={`${id}-error`}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -2 }}
            transition={{ duration: 0.16 }}
            style={{
              marginTop: y(10),
              marginBottom: 0,
              fontSize: x(24),
              fontWeight: 600,
              color: '#c04646',
              letterSpacing: '-0.01em',
            }}
          >
            {error}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function SecurityBadge({ label }: { label: string }) {
  return (
    <div className="flex items-center" style={{ gap: x(10) }}>
      <CheckCircle2 size={14} strokeWidth={1.8} />
      <span>{label}</span>
    </div>
  );
}

export default function PaymentTerminal() {
  const prefersReducedMotion = useReducedMotion();
  const processingTimerRef = useRef<number | null>(null);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodKey>('card');
  const [mvpQty, setMvpQty] = useState(3);
  const [rushQty, setRushQty] = useState(1);
  const [fullName, setFullName] = useState('Harry Alexanderoff');
  const [companyName, setCompanyName] = useState('Alexandroff Design');
  const [email, setEmail] = useState('harry@alexandroff.design');
  const [cardNumber, setCardNumber] = useState('4149 4991 5415 9532');
  const [expiry, setExpiry] = useState('11/29');
  const [cvv, setCvv] = useState('123');
  const [discountCode, setDiscountCode] = useState('ABC123');
  const [savePayment, setSavePayment] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<CheckoutStatus>('idle');

  useEffect(() => {
    return () => {
      if (processingTimerRef.current !== null) {
        window.clearTimeout(processingTimerRef.current);
      }
    };
  }, []);

  const subtotal = mvpQty * MVP_PRICE + rushQty * RUSH_PRICE;
  const taxes = Math.round(subtotal * TAX_RATE);
  const total = subtotal + taxes;

  const buttonLabel = status === 'processing' ? 'Processing...' : `Pay ${formatCurrency(total)}`;

  const validate = () => {
    const nextErrors: FormErrors = {};

    if (paymentMethod !== 'card') {
      nextErrors.method = 'Only Bank card is available in this demo checkout.';
    }

    if (!fullName.trim()) {
      nextErrors.fullName = 'Enter the full name exactly as shown on the mock.';
    }

    if (!companyName.trim()) {
      nextErrors.companyName = 'Enter a company name.';
    }

    if (!validateEmail(email.trim())) {
      nextErrors.email = 'Enter a valid billing email address.';
    }

    if (cardNumber.replace(/\s/g, '').length !== 16) {
      nextErrors.cardNumber = 'Enter a 16-digit card number.';
    }

    if (!validateExpiry(expiry)) {
      nextErrors.expiry = 'Use MM/YY.';
    }

    if (normalizeCvv(cvv).length !== 3) {
      nextErrors.cvv = 'Use a 3-digit CVV.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validate()) {
      setStatus('idle');
      return;
    }

    setStatus('processing');

    if (processingTimerRef.current !== null) {
      window.clearTimeout(processingTimerRef.current);
    }

    processingTimerRef.current = window.setTimeout(() => {
      setStatus('success');
      processingTimerRef.current = null;
    }, prefersReducedMotion ? 150 : 950);
  };

  const fieldGridGap = x(34);

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
      animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="flex items-center justify-center"
    >
      <div
        className="relative"
        style={{
          width: 'min(calc((100dvh - 24px) * 4096 / 2458), calc(100vw - 24px))',
          aspectRatio: `${DESIGN_WIDTH} / ${DESIGN_HEIGHT}`,
          containerType: 'size',
          fontFamily: PAYMENT_FONT,
          color: '#161b26',
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(circle at top, rgba(255,255,255,0.98) 0%, rgba(249,246,242,0.96) 44%, rgba(245,241,236,0.96) 100%),
              radial-gradient(rgba(25,30,41,0.03) 0.9px, transparent 0.9px)
            `,
            backgroundSize: '100% 100%, 11px 11px',
          }}
        />

        <div
          className="absolute"
          style={{
            left: x(220),
            top: y(372),
            width: x(3656),
            height: y(1740),
            borderRadius: x(86),
            border: `${x(3)} solid #dfd8d2`,
            background: 'rgba(246,243,239,0.78)',
            boxShadow: '0 24px 65px rgba(74, 69, 77, 0.12)',
            overflow: 'hidden',
          }}
        >
          <div
            className="absolute"
            style={{
              inset: `${y(26)} ${x(26)}`,
              borderRadius: x(74),
              border: `${x(2)} solid #e4ddd7`,
            }}
          />

          <div
            className="absolute"
            style={{
              inset: `${y(42)} ${x(42)} ${y(42)}`,
              display: 'grid',
              gridTemplateColumns: '35.4% 64.6%',
              overflow: 'hidden',
            }}
          >
            <section
              aria-labelledby="payment-package-title"
              style={{
                height: '100%',
                borderRadius: `${x(56)} ${x(28)} ${x(28)} ${x(56)}`,
                border: `${x(2)} solid #e7e1dc`,
                background: 'linear-gradient(180deg, rgba(250,247,243,0.98), rgba(248,245,241,0.98))',
                boxShadow: '0 10px 24px rgba(31, 30, 36, 0.05)',
                padding: `${y(68)} ${x(92)} ${y(48)}`,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <LogoMark />

              <div style={{ marginTop: y(96), maxWidth: x(1080) }}>
                <h1
                  id="payment-package-title"
                  style={{
                    margin: 0,
                    fontSize: x(122),
                    lineHeight: 0.94,
                    fontWeight: 700,
                    color: '#16224a',
                    letterSpacing: '-0.08em',
                  }}
                >
                  Build your own
                  <br />
                  design package
                </h1>

                <p
                  style={{
                    margin: `${y(28)} 0 0`,
                    maxWidth: x(830),
                    fontSize: x(39),
                    lineHeight: 1.42,
                    fontWeight: 500,
                    color: '#6a6f79',
                    letterSpacing: '-0.02em',
                  }}
                >
                  Pay only for what you need, to get your project up and running.
                  <br />
                  I&apos;ll handle the rest.
                </p>
              </div>

              <div
                style={{
                  marginTop: y(46),
                  borderRadius: x(42),
                  border: `${x(2)} solid #e8e1db`,
                  background: '#f1ece7',
                  padding: `${y(20)} ${x(20)}`,
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.75)',
                }}
              >
                <div
                  className="flex items-center justify-between"
                  style={{
                    padding: `0 ${x(14)}`,
                    marginBottom: y(18),
                    fontSize: x(30),
                    fontWeight: 500,
                    color: '#666a74',
                    letterSpacing: '-0.02em',
                  }}
                >
                  <span>Your selection</span>
                  <span className="text-[#676a74]" aria-hidden="true">
                    <Pencil size={18} strokeWidth={2.1} />
                  </span>
                </div>

                <div
                  style={{
                    overflow: 'hidden',
                    borderRadius: x(36),
                    border: `${x(2)} solid #ece7e2`,
                    background: '#fffdfa',
                    boxShadow: '0 12px 26px rgba(31, 30, 36, 0.035)',
                  }}
                >
                  <SelectionRow
                    icon={<CreditCard size={18} strokeWidth={2.1} />}
                    title="MVP sprint"
                    description="Daily async updates • One-time purchase • Pre-defined scope"
                    quantity={mvpQty}
                    onDecrease={() => setMvpQty((current) => clampQuantity(current - 1))}
                    onIncrease={() => setMvpQty((current) => clampQuantity(current + 1))}
                    price={formatCurrency(mvpQty * MVP_PRICE)}
                  />
                  <div style={{ borderTop: `${y(2)} solid #efebe7` }} />
                  <SelectionRow
                    icon={<Zap size={18} strokeWidth={2.1} />}
                    title="Hyper-fast delivery"
                    description="Highest priority turnaround • Paid weekly"
                    quantity={rushQty}
                    onDecrease={() => setRushQty((current) => clampQuantity(current - 1))}
                    onIncrease={() => setRushQty((current) => clampQuantity(current + 1))}
                    price={formatCurrency(rushQty * RUSH_PRICE)}
                    suffix="/w"
                  />
                </div>
              </div>

              <div
                style={{
                  marginTop: y(44),
                  fontSize: x(42),
                  lineHeight: 1.58,
                  fontWeight: 500,
                  color: '#636771',
                  letterSpacing: '-0.02em',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span style={{ fontWeight: 700, color: '#161a23' }}>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between" style={{ marginTop: y(6) }}>
                  <span>Taxes (6%)</span>
                  <span style={{ fontWeight: 700, color: '#161a23' }}>{formatCurrency(taxes)}</span>
                </div>
              </div>

              <div
                style={{
                  marginTop: y(38),
                  paddingTop: y(40),
                  borderTop: `${y(4)} dotted #ddd7d1`,
                }}
              >
                <div className="flex items-end justify-between">
                  <span
                    style={{
                      fontSize: x(44),
                      fontWeight: 600,
                      color: '#151923',
                      letterSpacing: '-0.03em',
                    }}
                  >
                    To be paid today
                  </span>
                  <span
                    style={{
                      fontSize: x(82),
                      lineHeight: 1,
                      fontWeight: 700,
                      color: '#11161d',
                      letterSpacing: '-0.06em',
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {formatCurrency(total)}
                  </span>
                </div>
              </div>

              <p
                style={{
                  marginTop: 'auto',
                  marginBottom: 0,
                  fontSize: x(28),
                  lineHeight: 1.6,
                  fontWeight: 500,
                  color: '#b2b5bc',
                  letterSpacing: '-0.02em',
                }}
              >
                When subscribing, you agree to{' '}
                <span style={{ textDecoration: 'underline', textUnderlineOffset: y(6) }}>Terms of service</span>{' '}
                and the <span style={{ textDecoration: 'underline', textUnderlineOffset: y(6) }}>Refund policy</span>
              </p>
            </section>

            <section
              aria-labelledby="payment-method-title"
              style={{
                height: '100%',
                borderRadius: `${x(28)} ${x(56)} ${x(56)} ${x(28)}`,
                border: `${x(2)} solid #e7e1dc`,
                background: 'linear-gradient(180deg, rgba(252,250,247,0.98), rgba(251,249,246,0.98))',
                boxShadow: '0 10px 24px rgba(31, 30, 36, 0.05)',
                position: 'relative',
              }}
            >
              <form
                onSubmit={handleSubmit}
                aria-busy={status === 'processing'}
                noValidate
                style={{
                  width: x(1002),
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  paddingTop: y(132),
                }}
              >
                <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
                  <legend
                    id="payment-method-title"
                    style={{
                      marginBottom: y(18),
                      padding: 0,
                      fontSize: x(30),
                      fontWeight: 500,
                      color: '#666a74',
                      letterSpacing: '-0.02em',
                    }}
                  >
                    Payment method
                  </legend>

                  <div
                    className="grid"
                    style={{
                      gridTemplateColumns: '1fr 1fr 1fr',
                      borderRadius: x(44),
                      border: `${x(2)} solid #ece7e2`,
                      background: '#f3f0ec',
                      padding: `${y(10)} ${x(10)}`,
                      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.75)',
                    }}
                  >
                    <PaymentMethodCard active={paymentMethod === 'card'} label="Bank card" onClick={() => setPaymentMethod('card')}>
                      <div className="flex items-center" style={{ gap: x(14), color: '#b0b1b6' }}>
                        <div className="relative" style={{ width: x(64), height: y(30) }}>
                          <span className="absolute left-0 top-0 rounded-full bg-current opacity-55" style={{ width: x(30), height: x(30) }} />
                          <span className="absolute right-0 top-0 rounded-full bg-current opacity-35" style={{ width: x(30), height: x(30) }} />
                        </div>
                        <span style={{ fontSize: x(42), fontWeight: 700, fontStyle: 'italic', letterSpacing: '-0.05em' }}>VISA</span>
                      </div>
                    </PaymentMethodCard>

                    <PaymentMethodCard active={paymentMethod === 'crypto'} label="Crypto" onClick={() => setPaymentMethod('crypto')}>
                      <div className="flex items-center" style={{ gap: x(12), color: '#a8abb2' }}>
                        {['S', 'E', '$', 'T'].map((symbol) => (
                          <span
                            key={symbol}
                            className="flex items-center justify-center rounded-full border border-current/10 bg-white/70"
                            style={{ width: x(28), height: x(28), fontSize: x(18), fontWeight: 700 }}
                            aria-hidden="true"
                          >
                            {symbol}
                          </span>
                        ))}
                      </div>
                    </PaymentMethodCard>

                    <PaymentMethodCard active={paymentMethod === 'applepay'} label="ApplePay" onClick={() => setPaymentMethod('applepay')}>
                      <div className="flex items-center" style={{ gap: x(12), color: '#b6b7bc' }}>
                        <span className="relative block" style={{ width: x(30), height: y(30) }} aria-hidden="true">
                          <span className="absolute inset-x-0 bottom-0 rounded-[40%_40%_48%_48%] bg-current" style={{ height: y(26) }} />
                          <span
                            className="absolute right-0 top-0 rounded-[60%_20%_60%_20%] bg-current"
                            style={{ width: x(10), height: y(10), transform: 'rotate(-25deg)' }}
                          />
                        </span>
                        <span style={{ fontSize: x(42), fontWeight: 600 }}>Pay</span>
                      </div>
                    </PaymentMethodCard>
                  </div>

                  <AnimatePresence initial={false}>
                    {errors.method ? (
                      <motion.p
                        initial={prefersReducedMotion ? false : { opacity: 0, y: 6 }}
                        animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                        exit={prefersReducedMotion ? undefined : { opacity: 0, y: -4 }}
                        transition={{ duration: 0.18 }}
                        style={{
                          marginTop: y(14),
                          marginBottom: 0,
                          fontSize: x(24),
                          fontWeight: 600,
                          color: '#c04646',
                          letterSpacing: '-0.01em',
                        }}
                      >
                        {errors.method}
                      </motion.p>
                    ) : null}
                  </AnimatePresence>
                </fieldset>

                <div style={{ marginTop: y(44), display: 'grid', gap: y(32) }}>
                  <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: fieldGridGap }}>
                    <Field
                      id="payment-full-name"
                      label="Full name"
                      value={fullName}
                      onChange={setFullName}
                      autoComplete="cc-name"
                      error={errors.fullName}
                    />
                    <Field
                      id="payment-company-name"
                      label="Company name"
                      value={companyName}
                      onChange={setCompanyName}
                      autoComplete="organization"
                      error={errors.companyName}
                    />
                  </div>

                  <Field
                    id="payment-email"
                    label="Billing email"
                    value={email}
                    onChange={setEmail}
                    inputMode="email"
                    autoComplete="email"
                    error={errors.email}
                  />

                  <div className="grid" style={{ gridTemplateColumns: `1fr ${x(214)} ${x(172)}`, gap: x(26) }}>
                    <Field
                      id="payment-card-number"
                      label="Card details"
                      value={cardNumber}
                      onChange={(value) => setCardNumber(normalizeCardNumber(value))}
                      inputMode="numeric"
                      autoComplete="cc-number"
                      maxLength={19}
                      error={errors.cardNumber}
                      rightSlot={
                        <span
                          aria-hidden="true"
                          style={{
                            fontSize: x(58),
                            fontWeight: 700,
                            fontStyle: 'italic',
                            color: '#1878ff',
                            letterSpacing: '-0.08em',
                          }}
                        >
                          VISA
                        </span>
                      }
                    />

                    <Field
                      id="payment-expiry"
                      label="Expiration"
                      value={expiry}
                      onChange={(value) => setExpiry(normalizeExpiry(value))}
                      inputMode="numeric"
                      autoComplete="cc-exp"
                      maxLength={5}
                      error={errors.expiry}
                    />

                    <Field
                      id="payment-cvv"
                      label="CVV"
                      value={cvv}
                      onChange={(value) => setCvv(normalizeCvv(value))}
                      type="password"
                      inputMode="numeric"
                      autoComplete="cc-csc"
                      maxLength={3}
                      error={errors.cvv}
                    />
                  </div>

                  <Field
                    id="payment-discount"
                    label="Discount code"
                    value={discountCode}
                    onChange={setDiscountCode}
                    muted
                    rightSlot={
                      <button
                        type="button"
                        aria-label="Copy discount code"
                        className="text-[#676b77] transition-colors duration-150 hover:text-[#177dff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2382ff]/50"
                        onClick={() => navigator.clipboard?.writeText(discountCode)}
                      >
                        <Copy size={18} strokeWidth={1.9} />
                      </button>
                    }
                  />
                </div>

                <label
                  className="flex items-center"
                  style={{
                    gap: x(18),
                    marginTop: y(24),
                    fontSize: x(40),
                    fontWeight: 500,
                    color: '#6a6e79',
                    letterSpacing: '-0.02em',
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={savePayment}
                    onChange={(event) => setSavePayment(event.target.checked)}
                    className="appearance-none"
                    style={{
                      width: x(32),
                      height: x(32),
                      borderRadius: x(8),
                      border: `${x(2)} solid ${savePayment ? '#177dff' : '#dddfe4'}`,
                      background: savePayment ? '#177dff' : '#ffffff',
                      boxShadow: '0 6px 14px rgba(21,24,31,0.035)',
                      display: 'grid',
                      placeItems: 'center',
                      margin: 0,
                    }}
                  />
                  <span>Save payment data for the future</span>
                  <span className="text-[#b8bbc3]" aria-hidden="true">
                    <ShieldCheck size={14} strokeWidth={1.9} />
                  </span>
                </label>

                <div style={{ minHeight: y(24), marginTop: y(10) }} aria-live="polite">
                  <AnimatePresence initial={false}>
                    {status === 'success' ? (
                      <motion.div
                        initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
                        animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                        exit={prefersReducedMotion ? undefined : { opacity: 0, y: -6 }}
                        transition={{ duration: 0.22 }}
                        role="status"
                        className="inline-flex items-center rounded-full"
                        style={{
                          gap: x(12),
                          padding: `${y(8)} ${x(18)}`,
                          background: 'rgba(38, 168, 96, 0.08)',
                          color: '#2a7f52',
                          fontSize: x(28),
                          fontWeight: 600,
                          letterSpacing: '-0.02em',
                        }}
                      >
                        <CheckCircle2 size={16} strokeWidth={2} />
                        Payment submitted successfully for this demo.
                      </motion.div>
                    ) : status === 'processing' ? (
                      <motion.p
                        key="summary"
                        initial={false}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                          margin: 0,
                          fontSize: x(24),
                          fontWeight: 500,
                          color: '#177dff',
                          letterSpacing: '-0.01em',
                        }}
                      >
                        Processing the demo payment...
                      </motion.p>
                    ) : null}
                  </AnimatePresence>
                </div>

                <motion.button
                  type="submit"
                  whileTap={prefersReducedMotion ? undefined : { scale: 0.992 }}
                  disabled={status === 'processing'}
                  className="flex items-center justify-center rounded-[18px] text-white transition-[filter,transform] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#177dff]/40 disabled:cursor-wait disabled:saturate-75"
                  style={{
                    marginTop: y(10),
                    width: '100%',
                    height: y(96),
                    background: 'linear-gradient(180deg, #2f96ff 0%, #0874ff 100%)',
                    boxShadow: '0 20px 34px rgba(8,116,255,0.26)',
                    fontSize: x(44),
                    fontWeight: 600,
                    letterSpacing: '-0.03em',
                  }}
                >
                  {buttonLabel}
                </motion.button>

                <div
                  className="flex items-center justify-center"
                  style={{
                    gap: x(44),
                    marginTop: y(22),
                    fontSize: x(31),
                    fontWeight: 500,
                    color: '#b0b3bb',
                    letterSpacing: '-0.02em',
                  }}
                >
                  <SecurityBadge label="3D Secure" />
                  <SecurityBadge label="SSL Secured" />
                  <SecurityBadge label="MoR Protected" />
                </div>
              </form>
            </section>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
