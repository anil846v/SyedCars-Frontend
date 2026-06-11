import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { cx } from '../../utils/helpers';
import logo from '../../assets/logo.png';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/cars', label: 'Browse Cars' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
  { to: '/admin/dashboard', label: 'Admin', hasDropdown: true },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  const isHome = pathname === '/';
  const showDarkHeader = false;

  return (
    <header className={cx(
      "fixed top-0 left-0 right-0 z-[1000] h-[72px] transition-all duration-300 border-b",
      showDarkHeader 
        ? "bg-transparent border-transparent" 
        : "bg-ink-2/95 backdrop-blur-md border-ink-4 shadow-sm"
    )}>
      <div className="container h-full flex items-center gap-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 shrink-0 transition-colors">
          <img src={logo} alt="Syed Cars Logo" className="h-[56px] w-auto object-contain" />
          <div className="flex flex-col">
            <span className="font-display text-[1.4rem] font-bold tracking-tight text-white leading-none">
              Syed <strong className="font-bold text-gold-light">Cars</strong>
            </span>
            <span className="text-[0.62rem] font-mono uppercase tracking-[0.06em] text-smoke mt-1 block leading-none">
              Trusted Used Car Marketplace
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1 ml-auto" aria-label="Main navigation">
          {NAV_LINKS.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) => cx(
                "px-[0.85rem] py-1.5 text-[0.875rem] font-normal rounded-sm transition-all duration-150 tracking-wide flex items-center gap-1",
                showDarkHeader
                  ? cx(
                      "text-true-white/85 hover:text-gold-light hover:bg-true-white/5",
                      isActive ? "text-gold-light bg-true-white/10 font-semibold" : ""
                    )
                  : cx(
                      "text-smoke hover:text-gold hover:bg-ink-3",
                      isActive ? "text-gold bg-ink-4 font-semibold" : ""
                    )
              )}
            >
              {link.label}
              {link.hasDropdown && <span className="text-[10px] opacity-75">▾</span>}
            </NavLink>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center shrink-0">
          <Link to="/cars" className="px-5 py-2 text-[0.85rem] font-semibold rounded-sm transition-all duration-150 tracking-wide bg-gold-light text-true-white hover:bg-[#111111] hover:shadow-[0_0_20px_rgba(255,107,0,0.3)]">
            View Cars
          </Link>
        </div>

        {/* Hamburger */}
        <button
          className="flex md:hidden flex-col gap-[5px] p-1 ml-auto cursor-pointer border-none bg-transparent"
          onClick={() => setMenuOpen(v => !v)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span className={cx(
            "block w-[22px] h-[2px] rounded-[2px] transition-all duration-300 origin-center",
            showDarkHeader ? "bg-[#111111]" : "bg-smoke",
            menuOpen ? "translate-y-[7px] rotate-45" : ""
          )} />
          <span className={cx(
            "block w-[22px] h-[2px] rounded-[2px] transition-all duration-300 origin-center",
            showDarkHeader ? "bg-[#111111]" : "bg-smoke",
            menuOpen ? "opacity-0" : ""
          )} />
          <span className={cx(
            "block w-[22px] h-[2px] rounded-[2px] transition-all duration-300 origin-center",
            showDarkHeader ? "bg-[#111111]" : "bg-smoke",
            menuOpen ? "-translate-y-[7px] -rotate-45" : ""
          )} />
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="flex md:hidden flex-col bg-ink-2 border-t border-ink-4 px-[var(--container-pad)] py-4 animate-[slideDown_0.2s_ease]">
          {NAV_LINKS.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) => cx(
                "py-3 text-base text-mist border-b border-ink-4 transition-colors duration-150 hover:text-white last:border-b-0",
                isActive ? "text-[#FF6B00] font-medium" : ""
              )}
            >
              {link.label}
            </NavLink>
          ))}
          <Link
            to="/admin/dashboard"
            className="py-3 text-base text-mist border-b border-ink-4 transition-colors duration-150 hover:text-white last:border-b-0 opacity-50"
          >
            Admin Dashboard ↗
          </Link>
        </div>
      )}
    </header>
  );
}