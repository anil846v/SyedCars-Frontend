import { useState, useRef, useEffect } from 'react';
import { NavLink, Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ToastProvider } from '../ui/Toaster';
import logo from '../../assets/logo.png';
import {
  LayoutDashboard, Car, Users, MessageSquare, CheckSquare,
  DollarSign, Menu, ChevronLeft, Globe, LogOut, ChevronDown, UserCog, ShieldCheck, X, ClipboardList,
  Download,
} from 'lucide-react';

const ORANGE = '#FF5A09';
const LIME   = '#C8D900';
const MOBILE_BP = 768;
const SIDEBAR_FULL = 240;
const SIDEBAR_MINI = 64;

const SIDEBAR_LINKS = [
  {
    section: 'OVERVIEW',
    links: [{ to: '/admin/dashboard', label: 'Dashboard', Icon: LayoutDashboard, permKey: 'dashboard' }],
  },
  {
    section: 'INVENTORY',
    links: [
      { to: '/admin/cars',           label: 'Cars',              Icon: Car,           permKey: 'cars'   },
      { to: '/admin/owners',         label: 'Owners',            Icon: Users,         permKey: 'owners' },
      { to: '/admin/sale-requests',  label: 'Car Sale Requests', Icon: ClipboardList, permKey: 'cars'   },
    ],
  },
  {
    section: 'SALES',
    links: [
      { to: '/admin/enquiries',  label: 'Enquiries', Icon: MessageSquare, permKey: 'enquiries'  },
      { to: '/admin/sold-cars',  label: 'Sold Cars', Icon: CheckSquare,   permKey: 'sold-cars'  },
    ],
  },
  {
    section: 'FINANCE',
    links: [
      { to: '/admin/commissions', label: 'Commissions', Icon: DollarSign, permKey: 'commissions' },
    ],
  },
  {
    section: 'ADMIN',
    links: [
      { to: '/admin/users',      label: 'Users',      Icon: UserCog,    permKey: 'users', adminOnly: true },
      { to: '/admin/privileges', label: 'Privileges', Icon: ShieldCheck, permKey: 'users', adminOnly: true },
    ],
  },
];

export default function AdminLayout() {
  const [collapsed,      setCollapsed]      = useState(false);
  const [mobileOpen,     setMobileOpen]     = useState(false);
  const [isMobile,       setIsMobile]       = useState(() => window.innerWidth < MOBILE_BP);
  const [profileOpen,    setProfileOpen]    = useState(false);
  const [installPrompt,  setInstallPrompt]  = useState(null);
  const [installDismissed, setInstallDismissed] = useState(
    () => sessionStorage.getItem('pwa-dismissed') === '1'
  );
  const profileRef = useRef(null);
  const { user, logout, isFullAdmin, can } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();

  // Register PWA service worker only for admin users
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
  }, []);

  // Capture browser install prompt so we can trigger it from our own button
  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', () => setInstallPrompt(null));
    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') setInstallPrompt(null);
  };

  const dismissInstall = () => {
    sessionStorage.setItem('pwa-dismissed', '1');
    setInstallDismissed(true);
  };

  // Track mobile breakpoint
  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < MOBILE_BP;
      setIsMobile(mobile);
      if (!mobile) setMobileOpen(false);
    };
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Close mobile drawer on navigation
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const isLinkVisible = (link) => {
    if (link.adminOnly) return isFullAdmin;
    return can(link.permKey);
  };

  const pageTitle = (() => {
    const flat = SIDEBAR_LINKS.flatMap(s => s.links);
    return flat.find(l => location.pathname.startsWith(l.to))?.label || 'Admin';
  })();

  const handleLogout = () => { logout(); navigate('/admin/login'); };

  const initial   = user?.username?.[0]?.toUpperCase() || 'A';

  // Sidebar geometry
  const sidebarW   = isMobile ? SIDEBAR_FULL : (collapsed ? SIDEBAR_MINI : SIDEBAR_FULL);
  const sidebarLeft = isMobile ? (mobileOpen ? 0 : -SIDEBAR_FULL) : 0;
  const mainMargin  = isMobile ? 0 : sidebarW;
  // On mobile, sidebar always shows full labels; on desktop honour collapsed state
  const showLabels  = isMobile ? true : !collapsed;

  return (
    <ToastProvider>
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F8F9F2', fontFamily: "'DM Sans', sans-serif" }}>

      {/* ── Mobile backdrop overlay ── */}
      {isMobile && mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.52)',
            backdropFilter: 'blur(2px)',
            zIndex: 49,
            transition: 'opacity 0.25s',
          }}
        />
      )}

      {/* ── Sidebar ── */}
      <aside style={{
        width: sidebarW,
        background: '#0D0D0D',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', flexDirection: 'column',
        position: 'fixed', top: 0, left: sidebarLeft, height: '100vh', zIndex: 50,
        transition: 'width 0.28s ease, left 0.28s ease',
        overflow: 'hidden',
        boxShadow: isMobile && mobileOpen ? '4px 0 24px rgba(0,0,0,0.35)' : 'none',
      }}>

        {/* Lime diagonal stripe decoration */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
          <div style={{
            position: 'absolute', width: '220%', height: 140,
            background: `linear-gradient(120deg, ${LIME} 0%, #D8EB00 100%)`,
            transform: 'rotate(-28deg)', top: '-6%', left: '-60%', opacity: 0.07,
          }} />
          <div style={{
            position: 'absolute', width: '220%', height: 50,
            background: `linear-gradient(120deg, ${LIME} 0%, #D8EB00 100%)`,
            transform: 'rotate(-28deg)', top: '28%', left: '-60%', opacity: 0.04,
          }} />
        </div>

        {/* Logo row */}
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: showLabels ? 'space-between' : 'center',
          padding: showLabels ? '0 16px' : '0 12px',
          height: 64, borderBottom: '1px solid rgba(255,255,255,0.06)',
          flexShrink: 0, position: 'relative', zIndex: 1,
        }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, overflow: 'hidden', textDecoration: 'none' }}>
            <img src={logo} alt="Syed Cars" style={{ height: 30, width: 30, objectFit: 'contain', flexShrink: 0 }} />
            {showLabels && (
              <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.05rem', color: '#fff', fontWeight: 500, whiteSpace: 'nowrap' }}>
                Syed <strong style={{ color: ORANGE }}>Cars</strong>
              </span>
            )}
          </Link>

          {/* Desktop collapse button */}
          {!isMobile && showLabels && (
            <button onClick={() => setCollapsed(true)} style={{
              padding: 6, borderRadius: 6, color: 'rgba(200,217,0,0.45)',
              background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0,
              transition: 'color 0.15s, background 0.15s',
            }}
              onMouseEnter={e => { e.currentTarget.style.color = LIME; e.currentTarget.style.background = 'rgba(200,217,0,0.08)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(200,217,0,0.45)'; e.currentTarget.style.background = 'none'; }}
            >
              <ChevronLeft size={16} />
            </button>
          )}

          {/* Mobile close button */}
          {isMobile && (
            <button onClick={() => setMobileOpen(false)} style={{
              padding: 6, borderRadius: 6, color: 'rgba(255,255,255,0.4)',
              background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0,
              transition: 'color 0.15s',
            }}
              onMouseEnter={e => e.currentTarget.style.color = '#fff'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Desktop collapsed expand button */}
        {!isMobile && collapsed && (
          <button onClick={() => setCollapsed(false)} style={{
            margin: '10px auto 4px', padding: 8, borderRadius: 6,
            color: 'rgba(200,217,0,0.5)', background: 'none', border: 'none', cursor: 'pointer',
            position: 'relative', zIndex: 1,
          }}>
            <Menu size={18} />
          </button>
        )}

        {/* Nav Links */}
        <nav style={{ flex: 1, padding: '8px', overflowY: 'auto', marginTop: 4, position: 'relative', zIndex: 1 }}>
          {SIDEBAR_LINKS.map(({ section, links }) => {
            const visibleLinks = links.filter(isLinkVisible);
            if (visibleLinks.length === 0) return null;
            return (
              <div key={section} style={{ marginBottom: 6 }}>
                {showLabels
                  ? <p style={{ fontSize: '0.58rem', fontFamily: "'Space Mono',monospace", textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(200,217,0,0.5)', padding: '10px 10px 6px' }}>
                      {section}
                    </p>
                  : <div style={{ margin: '8px 6px', height: 1, background: 'rgba(200,217,0,0.12)' }} />
                }
                {visibleLinks.map(({ to, label, Icon }) => (
                  <NavLink key={to} to={to} title={showLabels ? undefined : label} style={{ textDecoration: 'none' }}>
                    {({ isActive }) => (
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '9px 10px', borderRadius: 8, marginBottom: 2,
                        cursor: 'pointer',
                        justifyContent: showLabels ? 'flex-start' : 'center',
                        background: isActive ? 'rgba(255,90,9,0.14)' : 'transparent',
                        color: isActive ? ORANGE : 'rgba(255,255,255,0.5)',
                        border: isActive ? '1px solid rgba(255,90,9,0.25)' : '1px solid transparent',
                        transition: 'all 0.15s',
                        fontSize: '0.875rem', fontWeight: isActive ? 600 : 400,
                        whiteSpace: 'nowrap',
                      }}
                        onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'rgba(200,217,0,0.05)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(200,217,0,0.1)'; } }}
                        onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; e.currentTarget.style.borderColor = 'transparent'; } }}
                      >
                        <Icon size={17} style={{ flexShrink: 0 }} />
                        {showLabels && <span>{label}</span>}
                      </div>
                    )}
                  </NavLink>
                ))}
              </div>
            );
          })}
        </nav>

        {/* Bottom user info strip (mobile only) */}
        {isMobile && (
          <div style={{
            borderTop: '1px solid rgba(255,255,255,0.06)',
            padding: '14px 16px', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            position: 'relative', zIndex: 1,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                background: `${ORANGE}18`, border: `1.5px solid ${ORANGE}40`,
                color: ORANGE, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.82rem', fontWeight: 700,
              }}>{initial}</div>
              <div style={{ minWidth: 0 }}>
                <p style={{ fontSize: '0.82rem', color: '#fff', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user?.username || 'Admin'}
                </p>
                <p style={{ fontSize: '0.66rem', color: 'rgba(255,255,255,0.35)', fontFamily: "'Space Mono',monospace" }}>
                  {isFullAdmin ? 'Full Admin' : 'Staff'}
                </p>
              </div>
            </div>
            <button onClick={handleLogout} title="Sign Out" style={{
              padding: 8, borderRadius: 6, background: 'none', border: 'none',
              cursor: 'pointer', color: 'rgba(255,255,255,0.4)',
              transition: 'color 0.15s',
            }}
              onMouseEnter={e => e.currentTarget.style.color = '#EF4444'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
            >
              <LogOut size={16} />
            </button>
          </div>
        )}
      </aside>

      {/* ── Main Content ── */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        marginLeft: mainMargin,
        transition: 'margin-left 0.28s ease',
        minHeight: '100vh',
        minWidth: 0,
      }}>

        {/* Top Header */}
        <header style={{
          position: 'sticky', top: 0, zIndex: 40,
          background: 'rgba(255,255,255,0.97)',
          backdropFilter: 'blur(12px)',
          borderBottom: `2px solid ${ORANGE}22`,
          boxShadow: `0 1px 0 0 ${ORANGE}18`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 20px', height: 64, flexShrink: 0,
          gap: 12,
        }}>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0, flex: 1 }}>
            {/* Hamburger — mobile only */}
            {isMobile && (
              <button
                onClick={() => setMobileOpen(v => !v)}
                style={{
                  padding: 8, borderRadius: 8, background: 'none', border: `1px solid ${ORANGE}20`,
                  cursor: 'pointer', color: '#374151', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = `${ORANGE}0D`; e.currentTarget.style.color = ORANGE; e.currentTarget.style.borderColor = `${ORANGE}40`; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#374151'; e.currentTarget.style.borderColor = `${ORANGE}20`; }}
              >
                <Menu size={18} />
              </button>
            )}

            {/* Orange accent bar + page title */}
            <div style={{ width: 3, height: 28, borderRadius: 2, background: ORANGE, flexShrink: 0 }} />
            <div style={{ minWidth: 0 }}>
              <h1 style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: isMobile ? '0.95rem' : '1.05rem',
                color: '#0D0D0D', fontWeight: 600, margin: 0,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {pageTitle}
              </h1>
              {!isMobile && (
                <p style={{ fontSize: '0.68rem', color: '#111212', fontFamily: "'Space Mono',monospace", marginTop: 1 }}>
                  {new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              )}
            </div>
          </div>

          {/* PWA Install button — appears when browser is ready */}
          {installPrompt && !installDismissed && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: `${ORANGE}12`, border: `1px solid ${ORANGE}35`,
              borderRadius: 8, padding: '5px 10px 5px 8px', flexShrink: 0,
            }}>
              <button
                onClick={handleInstall}
                style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: ORANGE, fontSize: '0.78rem', fontWeight: 600,
                  fontFamily: 'inherit', padding: 0,
                }}
              >
                <Download size={13} />
                {!isMobile && 'Install App'}
              </button>
              <button
                onClick={dismissInstall}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#9CA3AF', padding: '0 2px', lineHeight: 1,
                  fontSize: '0.7rem',
                }}
                title="Dismiss"
              >✕</button>
            </div>
          )}

          {/* Profile dropdown */}
          <div ref={profileRef} style={{ position: 'relative', flexShrink: 0 }}>
            <button onClick={() => setProfileOpen(v => !v)} style={{
              display: 'flex', alignItems: 'center', gap: isMobile ? 0 : 8,
              padding: isMobile ? '6px' : '6px 14px 6px 8px', borderRadius: 10,
              background: '#fff', border: `1px solid ${ORANGE}28`,
              cursor: 'pointer', transition: 'all 0.15s',
              boxShadow: `0 1px 4px ${ORANGE}12`,
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: `${ORANGE}18`, border: `1.5px solid ${ORANGE}40`,
                color: ORANGE, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.78rem', fontWeight: 700,
              }}>{initial}</div>
              {!isMobile && (
                <>
                  <span style={{ fontSize: '0.85rem', color: '#0D0D0D', fontWeight: 500, whiteSpace: 'nowrap' }}>
                    {user?.username || 'Admin'}
                  </span>
                  <ChevronDown size={13} color="#9CA3AF" style={{ transform: profileOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                </>
              )}
            </button>

            {profileOpen && (
              <div style={{
                position: 'absolute', right: 0, top: '100%', marginTop: 6,
                width: 210, background: '#fff', border: `1px solid ${ORANGE}20`,
                borderRadius: 12, boxShadow: `0 16px 40px rgba(0,0,0,0.1), 0 0 0 1px ${ORANGE}10`,
                overflow: 'hidden', zIndex: 50,
              }}>
                <div style={{ padding: '12px 16px', borderBottom: `1px solid ${ORANGE}14`, background: `${ORANGE}07` }}>
                  <p style={{ fontSize: '0.875rem', color: '#0D0D0D', fontWeight: 600, fontFamily: "'Poppins',sans-serif" }}>
                    {user?.username || 'Admin'}
                  </p>
                  <p style={{ fontSize: '0.68rem', color: '#9CA3AF', fontFamily: "'Space Mono',monospace", marginTop: 2 }}>
                    {isFullAdmin ? 'Full Admin' : 'Staff'}
                  </p>
                </div>
                <div style={{ padding: 6 }}>
                  <Link to="/" onClick={() => setProfileOpen(false)} style={{
                    display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px',
                    borderRadius: 8, color: '#374151', fontSize: '0.84rem', textDecoration: 'none',
                    transition: 'all 0.15s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = `${ORANGE}0D`; e.currentTarget.style.color = ORANGE; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#374151'; }}
                  >
                    <Globe size={15} /> Public Site
                  </Link>
                  <div style={{ margin: '4px 0', height: 1, background: '#F3F4F6' }} />
                  <button onClick={handleLogout} style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px',
                    borderRadius: 8, color: '#374151', fontSize: '0.84rem',
                    background: 'none', border: 'none', cursor: 'pointer', transition: 'all 0.15s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; e.currentTarget.style.color = '#EF4444'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#374151'; }}
                  >
                    <LogOut size={15} /> Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main style={{ flex: 1, minWidth: 0 }}>
          <Outlet />
        </main>
      </div>

      <style>{`
        @keyframes slideDown { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:translateY(0); } }

        /* Inline-styled admin pages (Cars, Dashboard, Privileges) — tighten padding on mobile */
        @media (max-width: 767px) {
          main > div {
            padding-left: 16px !important;
            padding-right: 16px !important;
            padding-top: 18px !important;
          }
          /* Stat card grids stay 2-col on phone */
          main .stat-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </div>
    </ToastProvider>
  );
}
