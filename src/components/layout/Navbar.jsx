import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, LayoutDashboard, Car } from 'lucide-react';
import logo from '../../assets/logo1.png';

function hasValidSession() {
  try {
    const token = sessionStorage.getItem('sc_admin_token');
    if (!token) return false;
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/cars', label: 'Browse Cars' },
  { to: '/sell-your-car', label: 'Sell Car' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [scrolled,    setScrolled]    = useState(false);
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [loggedIn,    setLoggedIn]    = useState(hasValidSession);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); setLoggedIn(hasValidSession()); }, [pathname]);

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      height: 72, background: scrolled ? 'rgba(255,255,255,0.97)' : '#fff',
      borderBottom: '1px solid #E5E7EB',
      backdropFilter: 'blur(12px)',
      boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.08)' : 'none',
      transition: 'all 0.3s',
    }}>
      <div className="container" style={{ height: '100%', display: 'flex', alignItems: 'center', gap: 32 }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <img src={logo} alt="Syed Cars" style={{ height: 48, width: 'auto', objectFit: 'contain' }} />
          <div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.35rem', fontWeight: 700, color: '#111', lineHeight: 1 }}>
              Syed <span style={{ color: '#FF5A09' }}>Cars</span>
            </div>
            <div style={{ fontSize: '0.58rem', fontFamily: "'DM Sans', 'Inter', sans-serif", color: '#090909', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 2 }}>
              Premium Pre-Owned Vehicles
            </div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 4, marginLeft: 'auto' }} className="desktop-nav">
          {NAV_LINKS.map(link => (
            <NavLink key={link.to} to={link.to} end={link.to === '/'}>
              {({ isActive }) => (
                <span style={{
                  display: 'block',
                  padding: '6px 14px',
                  fontSize: '0.875rem',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? '#FF5A09' : '#374151',
                  borderBottom: isActive ? '2px solid #FF5A09' : '2px solid transparent',
                  transition: 'all 0.15s',
                }}>
                  {link.label}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }} className="desktop-nav">
          {loggedIn ? (
            <Link to="/admin/dashboard" style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '7px 16px', borderRadius: 6, fontSize: '0.84rem',
              fontWeight: 600, color: '#FF5A09', border: '1px solid rgba(255,90,9,0.3)',
              background: 'rgba(255,90,9,0.06)', transition: 'all 0.15s',
            }}>
              <LayoutDashboard size={14} /> Dashboard
            </Link>
          ) : (
            <Link to="/admin/login" style={{
              padding: '7px 16px', borderRadius: 6, fontSize: '0.84rem',
              fontWeight: 500, color: '#374151', border: '1px solid #E5E7EB',
              background: '#F9FAFB', transition: 'all 0.15s',
            }}>Login</Link>
          )}
          <Link to="/cars" style={{
            display: 'flex', alignItems: 'center', gap: 7,
            padding: '8px 18px', borderRadius: 8, fontSize: '0.84rem',
            fontWeight: 600, color: '#fff', background: '#FF5A09',
            boxShadow: '0 2px 12px rgba(255,90,9,0.3)', transition: 'all 0.15s',
          }}>
            <Car size={15} /> View Cars
          </Link>
        </div>

        {/* Mobile burger */}
        <button onClick={() => setMenuOpen(v => !v)} className="mobile-only"
          style={{ marginLeft: 'auto', padding: 8, color: '#374151' }}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{
          position: 'absolute', top: 72, left: 0, right: 0,
          background: '#fff', borderBottom: '1px solid #E5E7EB',
          padding: '12px 0', animation: 'slideDown 0.2s ease',
          boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
        }}>
          {NAV_LINKS.map(link => (
            <NavLink key={link.to} to={link.to} end={link.to === '/'}>
              {({ isActive }) => (
                <div style={{
                  display: 'block', padding: '10px 24px',
                  color: isActive ? '#FF5A09' : '#374151',
                  fontWeight: isActive ? 600 : 400,
                  fontSize: '0.95rem',
                }}>
                  {link.label}
                </div>
              )}
            </NavLink>
          ))}
          <div style={{ padding: '12px 24px 4px', borderTop: '1px solid #F3F4F6', marginTop: 8, display: 'flex', gap: 10 }}>
            {loggedIn ? (
              <Link to="/admin/dashboard" style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 16px', borderRadius: 6, fontSize: '0.84rem',
                fontWeight: 600, color: '#FF5A09', border: '1px solid rgba(255,90,9,0.3)', background: 'rgba(255,90,9,0.06)',
              }}>
                <LayoutDashboard size={14} /> Dashboard
              </Link>
            ) : (
              <Link to="/admin/login" style={{
                padding: '8px 16px', borderRadius: 6, fontSize: '0.84rem',
                fontWeight: 500, color: '#374151', border: '1px solid #E5E7EB', background: '#F9FAFB',
              }}>Login</Link>
            )}
            <Link to="/cars" style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 16px', borderRadius: 8, fontSize: '0.84rem',
              fontWeight: 600, color: '#fff', background: '#FF5A09',
            }}><Car size={14} /> View Cars</Link>
          </div>
        </div>
      )}

      <style>{`
        .desktop-nav { display: flex; }
        .mobile-only { display: none; }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-only { display: block; }
        }
      `}</style>
    </header>
  );
}

