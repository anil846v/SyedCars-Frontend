import { useState } from 'react';
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import { cx } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo.png';

const SIDEBAR_LINKS = [
  { to: '/admin/dashboard',   label: 'Dashboard',   icon: '◈' },
  { to: '/admin/cars',        label: 'Cars',         icon: '⊞' },
  { to: '/admin/owners',      label: 'Owners',       icon: '◉' },
  { to: '/admin/enquiries',   label: 'Enquiries',    icon: '◎' },
  { to: '/admin/commissions', label: 'Commissions',  icon: '◇' },
];

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const initial = user?.username?.[0]?.toUpperCase() || 'A';

  return (
    <div className="flex min-h-screen bg-ink">
      {/* Sidebar */}
      <aside className={cx(
        "bg-ink-2 border-r border-ink-4 flex flex-col fixed top-0 left-0 h-screen z-50 transition-[width] duration-300 overflow-hidden",
        collapsed ? "w-[64px]" : "w-[64px] md:w-[260px]"
      )}>
        <div className="flex items-center justify-between p-5 border-b border-ink-4 min-h-[64px] shrink-0">
          <Link to="/" className="flex items-center gap-2.5 font-display text-[1.2rem] text-white whitespace-nowrap">
            <img src={logo} alt="Syed Cars Logo" className="h-7 w-auto object-contain shrink-0" />
            {!collapsed && <span className="font-medium tracking-tight">Syed <strong className="text-gold font-bold">Cars</strong></span>}
          </Link>
          <button className="text-smoke text-[1.1rem] px-[6px] py-[4px] rounded-sm transition-all duration-150 shrink-0 hover:text-white hover:bg-ink-4 cursor-pointer" onClick={() => setCollapsed(v => !v)}>
            {collapsed ? '›' : '‹'}
          </button>
        </div>

        <div className="text-[0.65rem] tracking-widest uppercase text-ink-5 px-4 pt-4 pb-1 font-mono whitespace-nowrap overflow-hidden min-h-[2rem]">
          {!collapsed && 'NAVIGATION'}
        </div>

        <nav className="flex flex-col gap-[2px] p-2 flex-1">
          {SIDEBAR_LINKS.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => cx(
                "flex items-center gap-3 px-3 py-[0.65rem] rounded-md text-smoke text-[0.875rem] transition-all duration-150 whitespace-nowrap hover:text-white hover:bg-ink-3",
                isActive ? "text-gold bg-gold-glow hover:text-gold" : ""
              )}
            >
              <span className="text-[1rem] shrink-0 w-5 text-center">{link.icon}</span>
              {!collapsed && <span>{link.label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-ink-4 p-4 flex flex-col gap-3">
          {!collapsed && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gold-glow border border-gold-dark text-gold flex items-center justify-center text-[0.8rem] font-bold shrink-0">{initial}</div>
              <div className="overflow-hidden">
                <p className="text-[0.82rem] text-white font-medium truncate">{user?.username || 'Admin'}</p>
                <p className="text-[0.72rem] text-smoke font-mono">{user?.role || 'ADMIN'}</p>
              </div>
            </div>
          )}
          <div className="flex flex-col gap-1">
            <Link to="/" className="text-[0.78rem] text-smoke font-mono transition-colors duration-150 whitespace-nowrap hover:text-gold">{collapsed ? '↗' : '↗ Public Site'}</Link>
            <button onClick={handleLogout} className="text-left text-[0.78rem] text-smoke font-mono transition-colors duration-150 whitespace-nowrap hover:text-crimson cursor-pointer">{collapsed ? '⏻' : '⏻ Sign Out'}</button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className={cx(
        "flex-1 min-h-screen overflow-x-hidden transition-[margin-left] duration-300",
        collapsed ? "ml-[64px]" : "ml-[64px] md:ml-[260px]"
      )}>
        <Outlet />
      </div>
    </div>
  );
}
