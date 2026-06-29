import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo1.png';
import {
  Mail, Lock, Eye, EyeOff, Car, Users, ClipboardList,
  BarChart3, Headphones, Shield, Award, TrendingUp, CheckCircle2,
} from 'lucide-react';

export default function Login() {
  const { login, loading, isLoggedIn, initializing } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!initializing && isLoggedIn) {
      navigate('/admin', { replace: true });
    }
  }, [initializing, isLoggedIn, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(form.email, form.password);
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    }
  };

  const INFO_ITEMS = [
    { icon: Car,           title: 'Manage Vehicles',   desc: 'Add, edit and manage your car listings' },
    { icon: Users,         title: 'Track Enquiries',   desc: 'View and respond to customer enquiries' },
    { icon: ClipboardList, title: 'Inventory Control', desc: 'Keep your inventory up to date' },
    { icon: BarChart3,     title: 'Sales Analytics',   desc: 'Track performance and grow your business' },
  ];

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      background: '#0A0A12',
      fontFamily: "'DM Sans', sans-serif",
      overflow: 'hidden',
    }}>

      <div style={{
        flex: 2.5,                  /* 60% */
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        padding: '32px 1px',
      }} className="login-left">

        {/* Background */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0,
          backgroundImage: "url('/login-bg.png')",
          backgroundSize: 'cover', backgroundPosition: 'center',
          
        }} />

        {/* Content â€” space-between so stats sit at bottom */}
        <div style={{
          position: 'relative', zIndex: 2,
          height: '100%', display: 'flex',
          flexDirection: 'column', justifyContent: 'space-between',
        }}>

          {/* Top */}
          <div  style={{
    marginLeft: 20, // pushes content to right
    textAlign: 'left', // keep text normal
    marginbottom:90,
    width: 'fit-content'
  }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18, }}>
              <img src={logo} alt="Syed Cars" style={{ height: 62, width: 'auto' }} />
              <div>
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.5rem', fontWeight: 700, color: '#111010' }}>
                  Syed <span style={{ color: '#FF5A09' }}>Cars</span>
                </div>
                <div style={{ fontSize: '0.62rem', color: 'rgba(7, 7, 7, 0.6)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Trusted Used Car Marketplace
                </div>
              </div>
            </div>

            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'rgba(255,90,9,0.2)', border: '1px solid rgba(255,90,9,0.4)',
              borderRadius: 30, padding: '5px 14px', marginBottom: 16,
            }}>
              <span style={{ fontSize: '0.72rem', color: '#FF5A09', fontWeight: 600, letterSpacing: '0.5px' }}>
                POWERING DEALERS ACROSS INDIA
              </span>
            </div>

            <h2 style={{
              fontSize: 'clamp(1.5rem, 2.8vw, 2.3rem)',
              fontWeight: 500, color: '#101010',
              lineHeight: 1.15, marginBottom: 9,
            }}>
              Manage your dealership<br />
              <span style={{ color: '#FF5A09' }}>from anywhere.</span>
            </h2>

            <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
              {['Real-time Updates', 'Secure & Encrypted', 'Access Anytime, Anywhere'].map(item => (
                <li key={item} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  fontWeight: 500, marginBottom: 7, color: 'rgba(16,15,15,0.9)',
                }}>
                  <CheckCircle2 size={18} color="#FF5A09" />
                  <span style={{ fontSize: '0.95rem' }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Stats card â€” anchored to bottom */}
          <div style={{
            background: 'rgba(204,206,210,0.8)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(139,33,33,0.32)',
            borderRadius: 12, padding: '16px 20px',
             marginTop: '60px', // move downward
             transform: 'translateY(40px)',
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                { icon: Shield,     label: 'Trusted', sub: '100% Verified Listings' },
                { icon: Award,      label: 'Quality', sub: 'Best Pre-owned Cars' },
                { icon: Headphones, label: 'Support', sub: 'Dedicated Dealer Support' },
                { icon: TrendingUp, label: 'Growth',  sub: 'Grow Your Business' },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 9,
                    background: 'rgba(255,90,9,0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <Icon size={16} color="#FF5A09" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#060606' }}>{label}</div>
                    <div style={{ fontSize: '0.68rem', color: 'rgba(10,10,10,0.7)', lineHeight: 1.2 }}>{sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• RIGHT PANEL â€” 40% â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <div style={{
        flex: 2,                  /* 40% */
        height: '100vh',
        background: '#fff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center', /* vertically center everything */
        padding: '0 44px',
        boxSizing: 'border-box',
        overflow: 'hidden',       /* no scroll */
        position: 'relative',     /* for absolute Home button */
      }} className="login-right">

        {/* Home button â€” absolutely placed top-right, doesn't affect flow */}
        <Link to="/" style={{
          position: 'absolute', top: 20, right: 28,
          textDecoration: 'none', padding: '6px 14px', borderRadius: 9,
          border: '1px solid #E5E7EB', color: '#374151', fontWeight: 600,
          fontSize: '0.82rem', background: '#fff', zIndex: 10,
          display: 'inline-flex', alignItems: 'center', gap: 4,
        }}>
           Home
        </Link>

        {/* â”€â”€ Form content â”€â”€ */}
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111', marginBottom: 2 }}>
          Welcome Back!
        </h2>
        <p style={{ fontSize: '0.82rem', color: '#454647', marginBottom: 16 }}>
          Sign in to access your dashboard and manage listings.
        </p>

        {error && (
          <div style={{
            background: '#FEF2F2', border: '1px solid #FECACA',
            borderRadius: 8, padding: '8px 12px',
            color: '#DC2626', fontSize: '0.82rem', marginBottom: 12,
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

          {/* Email */}
          <div>
            <label style={{
              display: 'block', fontSize: '0.7rem', fontWeight: 600, color: '#374151',
              marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.06em',
            }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={15} color="#9CA3AF" style={{
                position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none',
              }} />
              <input
                type="email"
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                placeholder="Enter Your Email"
                required
                style={{
                  width: '100%', boxSizing: 'border-box',
                  border: '1.5px solid #E5E7EB', borderRadius: 9,
                  padding: '10px 12px 10px 36px', fontSize: '0.85rem', color: '#111',
                  outline: 'none', background: '#F9FAFB',
                }}
                onFocus={e => e.target.style.borderColor = '#FF5A09'}
                onBlur={e => e.target.style.borderColor = '#E5E7EB'}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label style={{
              display: 'block', fontSize: '0.7rem', fontWeight: 600, color: '#374151',
              marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.06em',
            }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={15} color="#9CA3AF" style={{
                position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none',
              }} />
              <input
                type={show ? 'text' : 'password'}
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                placeholder="Enter Your Password"
                required
                style={{
                  width: '100%', boxSizing: 'border-box',
                  border: '1.5px solid #E5E7EB', borderRadius: 9,
                  padding: '10px 42px 10px 36px', fontSize: '0.85rem', color: '#111',
                  outline: 'none', background: '#F9FAFB',
                }}
                onFocus={e => e.target.style.borderColor = '#FF5A09'}
                onBlur={e => e.target.style.borderColor = '#E5E7EB'}
              />
              <button
                type="button"
                onClick={() => setShow(s => !s)}
                style={{
                  position: 'absolute', right: 11, top: '50%', transform: 'translateY(-50%)',
                  color: '#9CA3AF', background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                }}
              >
                {show ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Forgot password */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: -2 }}>
            <Link to="/admin/forgot-password" style={{ fontSize: '0.78rem', color: '#FF5A09', fontWeight: 500 }}>
              Forgot Password?
            </Link>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', background: '#FF5A09', color: '#fff', border: 'none',
              borderRadius: 9, padding: '11px', fontWeight: 700, fontSize: '0.88rem',
              cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1,
              boxShadow: '0 4px 16px rgba(255,90,9,0.35)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}
          >
            <Lock size={14} />
            {loading ? 'Signing In' : 'Sign In to Dashboard'}
          </button>
        </form>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '14px 0' }}>
          <div style={{ flex: 1, height: 1, background: '#F3F4F6' }} />
          <span style={{ fontSize: '0.68rem', fontFamily: "'Space Mono',monospace", color: '#9CA3AF', whiteSpace: 'nowrap' }}>
            Admin Access Only
          </span>
          <div style={{ flex: 1, height: 1, background: '#F3F4F6' }} />
        </div>

        {/* Feature grid */}
        <div style={{
          border: '1px solid #F3F4F6', borderRadius: 10,
          padding: '12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10,
        }}>
          {INFO_ITEMS.map(({ icon: Icon, title, desc }) => (
            <div key={title} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <div style={{
                width: 28, height: 28, borderRadius: 7,
                background: 'rgba(255,90,9,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <Icon size={13} color="#FF5A09" />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#111' }}>{title}</div>
                <div style={{ fontSize: '0.65rem', color: '#454749', marginTop: 1 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Support Box */}
        <div style={{
          marginTop: 12,
          background: '#FFF9F6', border: '1px solid #FFE8D6',
          borderRadius: 9, padding: '10px 14px',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <Headphones size={16} color="#FF5A09" />
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#111' }}>Need Help?</div>
            <div style={{ fontSize: '0.72rem', color: '#525456', marginTop: 1 }}>
              support@syedcars.com | +91 9177565639
            </div>
          </div>
        </div>

      </div>{/* end right panel */}

      <style>{`
        @media (max-width: 900px) {
          .login-left  { display: none !important; }
          .login-right { flex: 1 !important; padding: 0 28px !important; }
        }
      `}</style>
    </div>
  );
}
