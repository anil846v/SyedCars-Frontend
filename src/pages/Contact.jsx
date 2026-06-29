import { useState } from 'react';
import { enquiriesApi } from '../utils/api';
import SEO from '../components/SEO'


const CAR_IMG = '/contact1.png';
const ORANGE  = '#E8631A';
const LIME    = '#C8D900';

/* ── Realistic coloured icons ── */
const PhoneIcon = () => (
  <svg width="20" height="20" viewBox="0 0 48 48" fill="none">
    <rect width="48" height="48" rx="12" fill="#25D366"/>
    <path d="M35.4 29.9c-1.2-1.2-2.9-1.2-4.1 0l-1.7 1.7c-.3.3-.7.3-1 .1-1.5-.9-3.9-2.9-6-5-2.1-2.1-4.1-4.5-5-6-.2-.3-.2-.7.1-1l1.7-1.7c1.2-1.2 1.2-2.9 0-4.1l-2.6-2.6c-1.2-1.2-2.9-1.2-4.1 0l-1.5 1.5c-1.5 1.5-2 3.6-1.5 5.8 1.1 4.5 4.5 9.6 8.9 14 4.4 4.4 9.5 7.8 14 8.9 2.2.5 4.3 0 5.8-1.5l1.5-1.5c1.2-1.2 1.2-2.9 0-4.1l-2.5-2.5z" fill="#fff"/>
  </svg>
);

const EmailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 48 48" fill="none">
    <rect width="48" height="48" rx="12" fill="#EA4335"/>
    <rect x="8" y="13" width="32" height="22" rx="3" fill="#fff"/>
    <path d="M8 16l16 11 16-11" stroke="#EA4335" strokeWidth="2.5" fill="none"/>
  </svg>
);

const MapIcon = () => (
  <svg width="20" height="20" viewBox="0 0 48 48" fill="none">
    <rect width="48" height="48" rx="12" fill="#4285F4"/>
    <path d="M24 10c-5.5 0-10 4.5-10 10 0 7.5 10 18 10 18s10-10.5 10-18c0-5.5-4.5-10-10-10z" fill="#fff"/>
    <circle cx="24" cy="20" r="3.5" fill="#4285F4"/>
  </svg>
);

const ClockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 48 48" fill="none">
    <rect width="48" height="48" rx="12" fill="#7C3AED"/>
    <circle cx="24" cy="24" r="13" stroke="#fff" strokeWidth="2.5" fill="none"/>
    <path d="M24 15v9l5.5 5.5" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
  </svg>
);

const INFO_CARDS = [
  {
    Icon: PhoneIcon,
    bg: '#E8F8F0',
    border: '#A7E8C8',
    label: 'Phone',
    value: '+91 9177565639',
    sub: 'Mon – Sat, 9 AM – 6 PM',
    href: 'tel:+919177565639',
  },
  {
    Icon: EmailIcon,
    bg: '#FEF2F2',
    border: '#FECACA',
    label: 'Email',
    value: 'info@syedcars.com',
    sub: 'We reply within 24 hours',
    href: 'mailto:info@syedcars.com',
  },
  {
    Icon: MapIcon,
    bg: '#EFF6FF',
    border: '#BFDBFE',
    label: 'Address',
    value: 'Syed Cars,Madanapalle',
    sub: 'India',
    href: 'https://www.google.com/maps/place/Syed+Cars+Madanapalli/@13.5543533,78.5269861,17z/data=!3m1!4b1!4m6!3m5!1s0x3bb2654e47aedfc3:0x3610a7b225f324d!8m2!3d13.5543481!4d78.529561!16s%2Fg%2F11wh6d8fjz?entry=ttu&g_ep=EgoyMDI2MDYyNC4wIKXMDSoASAFQAw%3D%3D',
  },
  {
    Icon: ClockIcon,
    bg: '#F5F3FF',
    border: '#DDD6FE',
    label: 'Working Hours',
    value: 'Mon – Sat: 9 AM – 6 PM',
    sub: 'Sunday: Closed',
    href: null,
  },
];

export default function Contact() {
  const [form,    setForm]    = useState({ name: '', phone: '', email: '', address: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent,    setSent]    = useState(false);
  const [error,   setError]   = useState('');

  const f = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true); setError('');
    try {
      await enquiriesApi.submit(form);
      setSent(true);
    } catch (err) {
      setError(err.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const inputStyle = {
    width: '100%', boxSizing: 'border-box',
    border: '1.5px solid #E5E7EB', borderRadius: 8,
    padding: '10px 14px', fontSize: 14, color: '#111',
    outline: 'none', background: '#FAFAFA',
    transition: 'border-color .2s',
    fontFamily: 'inherit',
  };

  return (
    <div style={{ fontFamily: 'inherit', background: '#F8F9FA', minHeight: '100vh' }}>
      <SEO
  title="Contact Us"
  description="Get in touch with Syed Cars for any queries about buying or selling pre-owned cars. We're here to help you find the right car at the right price."
  keywords="contact Syed Cars, used car dealer contact, car buying enquiry India, reach Syed Cars, Syed Cars phone number"
  url="https://syedcars.com/contact"
/>

      {/* ── Hero Banner ── */}
      <div className="contact-hero" style={{ position: 'relative', borderBottom: '1px solid #E8E0D4' }}>
        {/* Diagonal stripe background — mirrors About hero exactly */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 0, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(155deg, #F2F4EE 0%, #EEF0EA 60%, #F5F3EE 100%)' }} />
          <div style={{ position: 'absolute', width: '170%', height: 270, background: `linear-gradient(120deg, ${ORANGE} 0%, #FF8A4D 100%)`, transform: 'rotate(-28deg)', top: '-4%', right: '-38%', opacity: 0.22 }} />
          <div style={{ position: 'absolute', width: '170%', height: 88, background: `linear-gradient(120deg, ${ORANGE} 0%, #FF8A4D 100%)`, transform: 'rotate(-28deg)', top: '50%', right: '-38%', opacity: 0.38 }} />
          <div style={{ position: 'absolute', width: '80%', height: 220, background: `linear-gradient(120deg, ${LIME} 0%, #D8EB00 100%)`, transform: 'rotate(-28deg)', bottom: '-18%', left: '-22%', opacity: 0.09 }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(160,195,240,0.10) 0%, transparent 50%)' }} />
        </div>
        <div className="container contact-hero-inner" style={{ padding: '20px 60px 24px', position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 32 }}>
          <div style={{ maxWidth: 460, flexShrink: 0 }}>
            <p style={{
              color: ORANGE, fontWeight: 700, fontSize: 11,
              letterSpacing: '2.5px', textTransform: 'uppercase',
              margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 12,
            }}>
              GET IN TOUCH
              <span style={{ display: 'inline-block', height: 1.5, width: 40, background: ORANGE }} />
            </p>
            <h1 style={{
              fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
              fontWeight: 600, color: '#1a1a1a',
              lineHeight: 1.08, margin: '0 0 8px',
            }}>
              Contact <span style={{ color: ORANGE }}>Us</span>
            </h1>
            <div style={{ width: 36, height: 3, background: ORANGE, borderRadius: 2, marginBottom: 4 }} />
            <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: ORANGE, marginBottom: 20 }} />
            <p style={{ color: '#121111', fontSize: '1rem', lineHeight: 1.8, margin: 0, maxWidth: 380 }}>
              Have a question or want to visit our showroom? We'd love to hear from you.
            </p>
          </div>

          <div className="contact-hero-img-panel" style={{ position: 'relative', flexShrink: 0, minHeight: 200, width: 380, borderRadius: 24, overflow: 'hidden' }}>
            {/* Lime diagonal stripe */}
            {/* <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: 24 }}>
              <div style={{
                position: 'absolute', width: '200%', height: 1000,
                background: 'linear-gradient(18deg, #cc8108 0%, #d1ce00 100%)',
                transform: 'rotate(-1deg)', top: '-5%', left: '-38%', opacity: 0.95,
              }} />
            </div> */}
            {/* Sky gradient */}
            <div style={{
              position: 'absolute', inset: 0, zIndex: 1, borderRadius: 24,
              background: 'linear-gradient(360deg, rgba(232, 174, 57, 0.4) 100%)',
            }} />
            {/* Orange dot matrix */}
            <div style={{ position: 'absolute', top: 16, right: 16, zIndex: 3, display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 5 }}>
              {Array.from({ length: 24 }).map((_, i) => (
                <div key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: ORANGE, opacity: i % 3 === 0 ? 0.45 : 0.28 }} />
              ))}
            </div>
            {/* Car image */}
            <img
              src={CAR_IMG}
              alt="Premium Car"
              style={{
                position: 'relative', zIndex: 2,
                width: '100%', maxHeight: 300,
                objectFit: 'contain', display: 'block',
                filter: 'drop-shadow(0 24px 50px rgba(0,0,0,0.18))',
                marginTop: 10,
              }}
              onError={e => { e.currentTarget.style.display = 'none'; }}
            />
          </div>
        </div>
      </div>

      {/* ── Main Content: two-column layout ── */}
      <div className="contact-body" style={{ padding: '5px 64px 64px', display: 'flex', gap: 28, alignItems: 'flex-start' }}>

        {/* ── LEFT: Contact Info Cards stacked ── */}
        <div className="contact-info-col" style={{ display: 'flex', flexDirection: 'column', gap: 5, width: 260, flexShrink: 0 }}>
          {INFO_CARDS.map(({ Icon, bg, border, label, value, sub, href }) => (
            <div
              key={label}
              style={{
                background: '#fff',
                border: '1px solid #E5E7EB',
                borderRadius: 14,
                padding: '16px 18px',
                boxShadow: '0 1px 6px rgba(0,0,0,0.05)',
                display: 'flex',
                gap: 14,
                alignItems: 'flex-start',
                transition: 'box-shadow .2s, border-color .2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.09)'; e.currentTarget.style.borderColor = '#D1D5DB'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 6px rgba(0,0,0,0.05)'; e.currentTarget.style.borderColor = '#E5E7EB'; }}
            >
              {/* Colored icon circle */}
              <div style={{
                width: 42, height: 42, borderRadius: 12,
                background: bg, border: `1.5px solid ${border}`,
                flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon />
              </div>

              <div style={{ minWidth: 0 }}>
                <p style={{ fontWeight: 700, fontSize: 11, color: '#525458', margin: '0 0 3px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {label}
                </p>
                {href ? (
                  <a
                    href={href}
                    target={href.startsWith('http') ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    style={{ fontWeight: 600, fontSize: 13, color: '#111', margin: '0 0 2px', display: 'block', textDecoration: 'none', wordBreak: 'break-word' }}
                    onMouseEnter={e => e.currentTarget.style.color = ORANGE}
                    onMouseLeave={e => e.currentTarget.style.color = '#111'}
                  >
                    {value}
                  </a>
                ) : (
                  <p style={{ fontWeight: 600, fontSize: 13, color: '#111', margin: '0 0 2px', wordBreak: 'break-word' }}>{value}</p>
                )}
                <p style={{ fontSize: 12, color: '#57585b', margin: 0 }}>{sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── RIGHT: Contact Form ── */}
        <div style={{
          flex: 1, minWidth: 0,
          background: '#fff',
          border: '1px solid #E5E7EB',
          borderRadius: 16,
          padding: '32px 36px',
          boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
        }}>
          {sent ? (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{
                width: 72, height: 72, borderRadius: '50%',
                background: '#ECFDF5', border: '2px solid #10B981',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 24px',
              }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111', fontFamily: "'Poppins', sans-serif", margin: '0 0 10px' }}>
                Message Sent!
              </h2>
              <p style={{ color: '#6B7280', fontSize: '0.95rem', lineHeight: 1.7, maxWidth: 340, margin: '0 auto 28px' }}>
                Thank you for reaching out. Our team will review your message and get back to you shortly.
              </p>
              <button
                onClick={() => { setSent(false); setForm({ name: '', phone: '', email: '', address: '', message: '' }); }}
                style={{
                  padding: '11px 28px', borderRadius: 9,
                  background: ORANGE, color: '#fff',
                  border: 'none', fontWeight: 600, fontSize: '0.9rem',
                  cursor: 'pointer', fontFamily: 'Inter, system-ui, sans-serif',
                }}
              >
                Send Another Message
              </button>
            </div>
          ) : (
          <>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111', margin: '0 0 6px' }}>Send us a Message</h2>
          <p style={{ fontSize: 13, color: '#46484a', margin: '0 0 24px' }}>Fill out the form and we'll get back to you shortly.</p>

          {error && (
            <div style={{
              background: '#fef2f2', border: '1px solid #fca5a5',
              borderRadius: 8, padding: '12px 16px', marginBottom: 20,
              color: '#dc2626', fontSize: 14,
            }}>
              {error}
            </div>
          )}

          {/* Row 1: Name + Phone */}
          <div className="contact-form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 18 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Name <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                value={form.name}
                onChange={f('name')}
                placeholder="Your full name"
                required
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = ORANGE}
                onBlur={e => e.target.style.borderColor = '#E5E7EB'}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Phone <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                value={form.phone}
                onChange={f('phone')}
                placeholder="9177565639"
                required
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = ORANGE}
                onBlur={e => e.target.style.borderColor = '#E5E7EB'}
              />
            </div>
          </div>

          {/* Email */}
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Email <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type="email"
              value={form.email}
              onChange={f('email')}
              placeholder="you@example.com"
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = ORANGE}
              onBlur={e => e.target.style.borderColor = '#E5E7EB'}
            />
          </div>

          {/* Address */}
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Address
            </label>
            <input
              value={form.address}
              onChange={f('address')}
              placeholder="Your city / locality"
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = ORANGE}
              onBlur={e => e.target.style.borderColor = '#E5E7EB'}
            />
          </div>

          {/* Message */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Message <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <textarea
              value={form.message}
              onChange={f('message')}
              placeholder="How can we help you?"
              rows={5}
              required
              style={{ ...inputStyle, resize: 'none' }}
              onFocus={e => e.target.style.borderColor = ORANGE}
              onBlur={e => e.target.style.borderColor = '#E5E7EB'}
            />
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={sending}
            style={{
              width: '100%',
              background: sending ? '#fdba74' : ORANGE,
              color: '#fff', border: 'none', borderRadius: 10,
              padding: '13px 0', fontSize: 15, fontWeight: 600,
              cursor: sending ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              transition: 'background .2s',
              fontFamily: 'inherit',
            }}
            onMouseEnter={e => { if (!sending) e.currentTarget.style.background = '#cf5514'; }}
            onMouseLeave={e => { if (!sending) e.currentTarget.style.background = ORANGE; }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
            {sending ? 'Sending…' : 'Send Message'}
          </button>
          </>
          )}
        </div>
      </div>

      {/* ── Responsive styles ── */}
      <style>{`
        @media (max-width: 960px) {
          .contact-hero-inner { flex-direction: column !important; padding: 32px 28px 28px !important; gap: 20px !important; align-items: flex-start !important; }
          .contact-hero-img-panel { width: 100% !important; min-height: 220px !important; }
          .contact-body     { flex-direction: column !important; padding: 28px 24px 48px !important; }
          .contact-info-col { width: 100% !important; flex-direction: row !important; flex-wrap: wrap !important; }
          .contact-info-col > div { flex: 1 1 calc(50% - 8px) !important; min-width: 200px !important; }
        }
        @media (max-width: 600px) {
          .contact-hero-inner { padding: 28px 18px 28px !important; }
          .contact-hero-img-panel { width: 100% !important; min-height: 180px !important; border-radius: 16px !important; }
          .contact-body     { padding: 20px 14px 40px !important; }
          .contact-form-row { grid-template-columns: 1fr !important; gap: 14px !important; }
          .contact-info-col > div { flex: 1 1 100% !important; }
        }
      `}</style>
    </div>
  );
}