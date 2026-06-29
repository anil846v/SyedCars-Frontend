import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, Eye, EyeOff, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { authApi } from '../utils/api';
import logo from '../assets/logo1.png';

export default function ResetPassword() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const resetToken = location.state?.resetToken ?? '';
  const email      = location.state?.email ?? '';

  const [form,    setForm]    = useState({ password: '', confirm: '' });
  const [showPw,  setShowPw]  = useState(false);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const [done,    setDone]    = useState(false);

  // Guard: if arrived without a resetToken, redirect
  if (!resetToken) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0A0A12', fontFamily: "'DM Sans',sans-serif" }}>
        <div style={{ background: '#fff', borderRadius: 16, padding: '36px 40px', maxWidth: 400, width: '100%', textAlign: 'center', boxShadow: '0 24px 64px rgba(0,0,0,0.4)' }}>
          <p style={{ color: '#DC2626', marginBottom: 16 }}>Invalid or expired reset session.</p>
          <Link to="/admin/forgot-password" style={{ color: '#FF5A09', fontWeight: 600 }}>â† Request a new OTP</Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return; }
    if (form.password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    setError(''); setLoading(true);
    try {
      await authApi.resetPassword({ resetToken, password: form.password });
      setDone(true);
    } catch (err) {
      setError(err.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#0A0A12', fontFamily: "'DM Sans', sans-serif", padding: '24px',
    }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32, justifyContent: 'center' }}>
          <img src={logo} alt="Syed Cars" style={{ height: 36 }} />
          <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.3rem', color: '#fff', fontWeight: 500 }}>
            Syed <strong style={{ color: '#FF5A09' }}>Cars</strong>
          </span>
        </div>

        <div style={{
          background: '#fff', borderRadius: 16, padding: '36px 40px',
          boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
        }}>
          {!done ? (
            <>
              <Link to="/admin/login" style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                fontSize: '0.82rem', color: '#6B7280', marginBottom: 20, textDecoration: 'none',
              }}
                onMouseEnter={e => e.currentTarget.style.color = '#FF5A09'}
                onMouseLeave={e => e.currentTarget.style.color = '#6B7280'}
              >
                <ArrowLeft size={14} /> Back to Login
              </Link>

              <div style={{ marginBottom: 24 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12, marginBottom: 14,
                  background: 'rgba(255,90,9,0.08)', border: '1px solid rgba(255,90,9,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Lock size={22} color="#FF5A09" />
                </div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#111', marginBottom: 6 }}>Set New Password</h2>
                {email && (
                  <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                    Creating new password for <strong style={{ color: '#111' }}>{email}</strong>
                  </p>
                )}
              </div>

              {error && (
                <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, padding: '10px 14px', color: '#DC2626', fontSize: '0.875rem', marginBottom: 16 }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* New Password */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#374151', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    New Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={16} color="#9CA3AF" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                    <input
                      type={showPw ? 'text' : 'password'} required minLength={8}
                      value={form.password}
                      onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                      placeholder="Min 8 characters"
                      style={{
                        width: '100%', border: '1.5px solid #E5E7EB', borderRadius: 10,
                        padding: '11px 44px 11px 40px', fontSize: '0.875rem', color: '#111',
                        outline: 'none', background: '#F9FAFB', fontFamily: 'inherit',
                        boxSizing: 'border-box',
                      }}
                      onFocus={e => e.target.style.borderColor = '#FF5A09'}
                      onBlur={e => e.target.style.borderColor = '#E5E7EB'}
                    />
                    <button type="button" onClick={() => setShowPw(s => !s)}
                      style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}>
                      {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#374151', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Confirm Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={16} color="#9CA3AF" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                    <input
                      type={showPw ? 'text' : 'password'} required
                      value={form.confirm}
                      onChange={e => setForm(p => ({ ...p, confirm: e.target.value }))}
                      placeholder="Re-enter password"
                      style={{
                        width: '100%', border: '1.5px solid #E5E7EB', borderRadius: 10,
                        padding: '11px 12px 11px 40px', fontSize: '0.875rem', color: '#111',
                        outline: 'none', background: '#F9FAFB', fontFamily: 'inherit',
                        boxSizing: 'border-box',
                      }}
                      onFocus={e => e.target.style.borderColor = '#FF5A09'}
                      onBlur={e => e.target.style.borderColor = '#E5E7EB'}
                    />
                  </div>
                </div>

                {/* Strength hint */}
                {form.password && (
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: 4, margin: 0, padding: 0, listStyle: 'none' }}>
                    {[
                      { label: 'At least 8 characters', pass: form.password.length >= 8 },
                      { label: 'Passwords match', pass: form.password === form.confirm && form.confirm.length > 0 },
                    ].map(({ label, pass }) => (
                      <li key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: pass ? '#059669' : '#6B7280' }}>
                        <CheckCircle2 size={13} color={pass ? '#059669' : '#D1D5DB'} /> {label}
                      </li>
                    ))}
                  </ul>
                )}

                <button type="submit" disabled={loading} style={{
                  width: '100%', background: '#FF5A09', color: '#fff',
                  border: 'none', borderRadius: 10, padding: '12px',
                  fontWeight: 700, fontSize: '0.9rem',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.65 : 1,
                  boxShadow: '0 4px 16px rgba(255,90,9,0.3)',
                  fontFamily: 'inherit',
                }}>
                  {loading ? 'Resettingâ€¦' : 'Reset Password'}
                </button>
              </form>
            </>
          ) : (
            /* â”€â”€ Success State â”€â”€ */
            <div style={{ textAlign: 'center', padding: '12px 0' }}>
              <div style={{
                width: 64, height: 64, borderRadius: '50%', margin: '0 auto 20px',
                background: 'rgba(5,150,105,0.08)', border: '2px solid rgba(5,150,105,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <CheckCircle2 size={30} color="#059669" />
              </div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#111', marginBottom: 8 }}>Password Reset!</h2>
              <p style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: 24 }}>
                Your password has been updated. You can now sign in with your new password.
              </p>
              <button
                onClick={() => navigate('/admin/login')}
                style={{
                  width: '100%', background: '#FF5A09', color: '#fff',
                  border: 'none', borderRadius: 10, padding: '12px',
                  fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(255,90,9,0.3)', fontFamily: 'inherit',
                }}>
                Back to Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

