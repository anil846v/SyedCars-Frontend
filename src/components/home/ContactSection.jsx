import { useState } from 'react';
import { enquiriesApi } from '../utils/api';

const CAR_IMG = '/contact.png';

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

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', background: '#fff', minHeight: '100vh' }}>

      {/* ── Hero Banner ── */}
      <div style={{
        background: '#fdf0e6',
        padding: '48px 64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 32,
        overflow: 'hidden',
        position: 'relative',
        minHeight: 160,
      }}>

        {/* Left: Text */}
        <div style={{ zIndex: 1 }}>
          <p style={{
            color: '#e07020', fontWeight: 600, fontSize: 12,
            letterSpacing: '0.10em', textTransform: 'uppercase',
            marginBottom: 6, margin: '0 0 6px 0',
          }}>
            Get in Touch
          </p>
          <h1 style={{
            fontSize: 42, fontWeight: 900, color: '#111',
            lineHeight: 1.1, margin: '0 0 14px 0',
            fontFamily: 'Inter, system-ui, sans-serif',
          }}>
            Contact Us
          </h1>
          <p style={{ color: '#555', fontSize: 14, maxWidth: 360, lineHeight: 1.65, margin: 0 }}>
            Have a question or want to visit our showroom? We'd love to hear from you.
            Reach out using the form below or through our contact details.
          </p>
        </div>

        {/* Center: Dot grid pattern */}
        <div style={{ position: 'absolute', right: 340, top: '50%', transform: 'translateY(-50%)', zIndex: 0 }}>
          <svg width="160" height="120" viewBox="0 0 160 120">
            {Array.from({ length: 6 }, (_, r) =>
              Array.from({ length: 8 }, (_, c) => (
                <circle
                  key={`${r}-${c}`}
                  cx={c * 20 + 10}
                  cy={r * 20 + 10}
                  r="2.5"
                  fill="#c97a30"
                  opacity="0.25"
                />
              ))
            )}
          </svg>
        </div>

        {/* Right: Car image */}
        <img
          src={CAR_IMG}
          alt="Car"
          style={{
            height: 130,
            objectFit: 'contain',
            flexShrink: 0,
            zIndex: 1,
            filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.10))',
          }}
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />
      </div>

      {/* ── Main Content ── */}
      <div style={{ padding: '40px 64px 60px', display: 'flex', gap: 24, alignItems: 'flex-start' }}>

        {/* ── Left: Form Card ── */}
        <div style={{
          flex: '1 1 0',
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: 16,
          padding: '36px 40px',
          boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
        }}>
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
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <span style={{ marginTop: 32, color: '#aaa' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                </svg>
              </span>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 6 }}>
                  Name <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  value={form.name}
                  onChange={f('name')}
                  placeholder="Your Name"
                  required
                  style={{
                    width: '100%', boxSizing: 'border-box',
                    border: '1px solid #e5e7eb', borderRadius: 8,
                    padding: '10px 14px', fontSize: 14, color: '#111',
                    outline: 'none', transition: 'border-color .2s', background: '#fff',
                  }}
                  onFocus={e => e.target.style.borderColor = '#fb923c'}
                  onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <span style={{ marginTop: 32, color: '#aaa' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 11.39 19 19.5 19.5 0 0 1 5 12.61 19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
              </span>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 6 }}>
                  Phone <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  value={form.phone}
                  onChange={f('phone')}
                  placeholder="9876543210"
                  required
                  style={{
                    width: '100%', boxSizing: 'border-box',
                    border: '1px solid #e5e7eb', borderRadius: 8,
                    padding: '10px 14px', fontSize: 14, color: '#111',
                    outline: 'none', transition: 'border-color .2s', background: '#fff',
                  }}
                  onFocus={e => e.target.style.borderColor = '#fb923c'}
                  onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>
            </div>
          </div>

          {/* Row 2: Email */}
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 20 }}>
            <span style={{ marginTop: 32, color: '#aaa' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="2" y="4" width="20" height="16" rx="2"/>
                <path d="M2 7l10 7 10-7"/>
              </svg>
            </span>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 6 }}>
                Email <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="email"
                value={form.email}
                onChange={f('email')}
                placeholder="you@example.com"
                style={{
                  width: '100%', boxSizing: 'border-box',
                  border: '1px solid #e5e7eb', borderRadius: 8,
                  padding: '10px 14px', fontSize: 14, color: '#111',
                  outline: 'none', transition: 'border-color .2s', background: '#fff',
                }}
                onFocus={e => e.target.style.borderColor = '#fb923c'}
                onBlur={e => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>
          </div>

          {/* Row 3: Address */}
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 20 }}>
            <span style={{ marginTop: 32, color: '#aaa' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                <circle cx="12" cy="9" r="2.5"/>
              </svg>
            </span>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 6 }}>
                Address
              </label>
              <input
                value={form.address}
                onChange={f('address')}
                placeholder="Your city / locality"
                style={{
                  width: '100%', boxSizing: 'border-box',
                  border: '1px solid #e5e7eb', borderRadius: 8,
                  padding: '10px 14px', fontSize: 14, color: '#111',
                  outline: 'none', transition: 'border-color .2s', background: '#fff',
                }}
                onFocus={e => e.target.style.borderColor = '#fb923c'}
                onBlur={e => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>
          </div>

          {/* Row 4: Message */}
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 28 }}>
            <span style={{ marginTop: 32, color: '#aaa' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </span>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 6 }}>
                Message <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <textarea
                value={form.message}
                onChange={f('message')}
                placeholder="How can we help you?"
                rows={5}
                required
                style={{
                  width: '100%', boxSizing: 'border-box',
                  border: '1px solid #e5e7eb', borderRadius: 8,
                  padding: '10px 14px', fontSize: 14, color: '#111',
                  outline: 'none', transition: 'border-color .2s',
                  resize: 'none', background: '#fff',
                }}
                onFocus={e => e.target.style.borderColor = '#fb923c'}
                onBlur={e => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={sending}
            style={{
              width: '100%', background: sending ? '#fdba74' : '#f97316',
              color: '#fff', border: 'none', borderRadius: 10,
              padding: '14px 0', fontSize: 15, fontWeight: 600,
              cursor: sending ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              transition: 'background .2s',
            }}
            onMouseEnter={e => { if (!sending) e.currentTarget.style.background = '#ea6c0a'; }}
            onMouseLeave={e => { if (!sending) e.currentTarget.style.background = '#f97316'; }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
            {sending ? 'Sending…' : 'Send Message'}
          </button>
        </div>

        {/* ── Right: Contact Info Card ── */}
        <div style={{
          width: 300,
          flexShrink: 0,
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: 16,
          padding: '32px 28px',
          boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
        }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111', marginBottom: 4, margin: '0 0 4px 0' }}>Get in Touch</h2>
          <div style={{ width: 40, height: 3, background: '#f97316', borderRadius: 2, marginBottom: 16 }} />
          <p style={{ fontSize: 14, color: '#555', lineHeight: 1.6, marginBottom: 28 }}>
            We're here to help and answer any question you might have. We look forward to hearing from you!
          </p>

          {[
            {
              icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="1.8">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 11.39 19 19.5 19.5 0 0 1 5 12.61 19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
              ),
              label: 'Phone',
              lines: ['9876543210', 'Mon – Sat, 9:00 AM – 6:00 PM'],
            },
            {
              icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="1.8">
                  <rect x="2" y="4" width="20" height="16" rx="2"/>
                  <path d="M2 7l10 7 10-7"/>
                </svg>
              ),
              label: 'Email',
              lines: ['info@syedcars.com', 'We reply within 24 hours'],
            },
            {
              icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="1.8">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                  <circle cx="12" cy="9" r="2.5"/>
                </svg>
              ),
              label: 'Address',
              lines: ['Madanapalle, Andhra Pradesh', 'India'],
            },
            {
              icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="1.8">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
              ),
              label: 'Working Hours',
              lines: ['Mon – Sat: 9:00 AM – 6:00 PM', 'Sunday: Closed'],
            },
          ].map(({ icon, label, lines }) => (
            <div key={label} style={{ display: 'flex', gap: 14, marginBottom: 22 }}>
              <div style={{
                width: 44, height: 44, borderRadius: '50%',
                background: '#fff5ed', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {icon}
              </div>
              <div>
                <p style={{ fontWeight: 600, fontSize: 14, color: '#111', margin: '0 0 2px 0' }}>{label}</p>
                {lines.map((l, i) => (
                  <p key={i} style={{ fontSize: 13, color: '#666', margin: 0 }}>{l}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Success Toast ── */}
      {sent && (
        <div style={{
          position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)',
          background: '#f0fdf4', border: '1px solid #86efac',
          borderRadius: 12, padding: '14px 24px',
          display: 'flex', alignItems: 'center', gap: 14,
          boxShadow: '0 4px 20px rgba(0,0,0,0.10)',
          minWidth: 360, maxWidth: 560,
          zIndex: 9999,
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%', background: '#22c55e',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 600, fontSize: 14, color: '#15803d', margin: 0 }}>Message Sent Successfully!</p>
            <p style={{ fontSize: 13, color: '#166534', margin: 0 }}>Thank you for contacting us. We'll get back to you as soon as possible.</p>
          </div>
          <button
            onClick={() => setSent(false)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666', padding: 4 }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}