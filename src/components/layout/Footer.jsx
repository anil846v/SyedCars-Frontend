import { Link } from 'react-router-dom';
import logo from '../../assets/logo1.png';

export default function Footer() {
  return (
    <footer style={{ background: '#fff', fontFamily: 'inherit', borderTop: '2px solid #E85D04' }}>

      {/* â”€â”€ Top section â”€â”€ */}
      <div style={{ position: 'relative', overflow: 'hidden', minHeight: 480 }}>

        {/* Car image â€” large, right-aligned, bottom-anchored like Image 2 */}
        <img
          src="/footercar.png"
          alt=""
          className="footer-car-img"
          style={{
            position: 'absolute',
            right: '-2%',
            bottom: 0,
            height: '100%',
            width: '70%',
            objectFit: 'cover',
objectPosition: 'center bottom',  // Keeps car visible nicely            display: 'block',
            zIndex: 0,
            opacity: 0.85,                    // Slight transparency so text remains readable
          }}
        />

        {/* Left fade â€” gentle, only covers text area */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1,
          background: 'linear-gradient(to right, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 30%, rgba(255,255,255,0.7) 42%, rgba(255,255,255,0) 52%)',
        }} />

        {/* Bottom fade â€” thin soft fade matching Image 2 */}
        <div style={{
          position: 'absolute', left: 0, right: 0, bottom: 0, height: '22%', zIndex: 2,
          background: 'linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.95) 100%)',
        }} />

        {/* Content */}
        <div className="footer-content" style={{ position: 'relative', zIndex: 3, maxWidth: 1200, margin: '0 auto', padding: '56px 48px 48px' }}>
          <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '300px 1fr 1fr 1fr', gap: 40 }}>

            {/* â”€â”€ Brand col â”€â”€ */}
            <div>
              {/* Logo + name */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 6 }}>
                <img src={logo} alt="Syed Cars" style={{ height: 76, width: 76, objectFit: 'contain', flexShrink: 0 }} />
                <div style={{ borderLeft: '2px solid #ddd', paddingLeft: 14 }}>
                  <div style={{ fontSize: '2.1rem', fontWeight: 600, color: '#111', lineHeight: 1.05, letterSpacing: '-0.02em' }}>
                    Syed <span style={{ color: '#E85D04' }}>Cars</span>
                  </div>
                  <div style={{ fontSize: '0.6rem', letterSpacing: '0.2em', color: '#353232', fontWeight: 700, textTransform: 'uppercase', marginTop: 5 }}>
                    Prestigious Car Marketplace
                  </div>
                </div>
              </div>

              <p style={{ fontSize: '0.95rem', color: '#151515', lineHeight: 1.8, margin: '18px 0 28px' }}>
                Madanapalle's most trusted marketplace for<br />premium pre-owned automobiles.
              </p>

              {/* Contact items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  { href: 'tel:+919177565639', label: 'SALES', text: '+91 9177565639', icon: 'M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z' },
                  { href: 'tel:+919177565639', label: 'SUPPORT', text: '+91 91775 65639', icon: 'M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z' },
                  { href: 'mailto:hello@syedcars.in', label: 'EMAIL', text: 'hello@syedcars.in', icon: 'M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z' },
                ].map(({ href, label, text, icon }) => (
                  <a key={text} href={href} style={{ display: 'flex', alignItems: 'center', gap: 14, textDecoration: 'none' }}>
                    <span style={{
                      width: 42, height: 42, borderRadius: 10,
                      background: '#E85D04',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <svg width="16" height="16" fill="#fff" viewBox="0 0 24 24"><path d={icon}/></svg>
                    </span>
                    <div>
                      <div style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.15em', color: '#E85D04', textTransform: 'uppercase' }}>{label}</div>
                      <div style={{ fontSize: '0.92rem', color: '#222', fontWeight: 600, marginTop: 1 }}>{text}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* â”€â”€ Browse col â”€â”€ */}
            <div style={{ paddingTop: 4 }}>
              <h4 style={{ fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#E85D04', margin: '0 0 12px' }}>Browse</h4>
              <div style={{ width: 32, height: 3, background: '#E85D04', borderRadius: 2, marginBottom: 24 }} />
              <nav style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                {[['All Cars', '/cars'], ['Petrol Cars', '/cars?fuel_type=Petrol'], ['Diesel Cars', '/cars?fuel_type=Diesel'], ['Electric Cars', '/cars?fuel_type=Electric']].map(([label, href]) => (
                  <Link key={label} to={href} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.97rem', color: '#333', textDecoration: 'none', fontWeight: 500 }}>
                    <svg width="8" height="13" viewBox="0 0 8 12" fill="none"><path d="M1 1l5 5-5 5" stroke="#E85D04" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    {label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* â”€â”€ Company col â”€â”€ */}
            <div style={{ paddingTop: 4 }}>
              <h4 style={{ fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#E85D04', margin: '0 0 12px' }}>Company</h4>
              <div style={{ width: 32, height: 3, background: '#E85D04', borderRadius: 2, marginBottom: 24 }} />
              <nav style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                {[['About Us', '/about'], ['Contact', '/contact'], ['List Your Car', '/sell-your-car']].map(([label, href]) => (
                  <Link key={label} to={href} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.97rem', color: '#333', textDecoration: 'none', fontWeight: 500 }}>
                    <svg width="8" height="13" viewBox="0 0 8 12" fill="none"><path d="M1 1l5 5-5 5" stroke="#E85D04" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    {label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* â”€â”€ Legal col â”€â”€ */}
            {/* <div style={{ paddingTop: 4 }}>
              <h4 style={{ fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#E85D04', margin: '0 0 12px' }}>Legal</h4>
              <div style={{ width: 32, height: 3, background: '#E85D04', borderRadius: 2, marginBottom: 24 }} />
              <nav style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                {['Privacy Policy', 'Terms of Service', 'Disclaimer'].map((label) => (
                  <span key={label} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.97rem', color: '#333', cursor: 'pointer', fontWeight: 500 }}>
                    <svg width="8" height="13" viewBox="0 0 8 12" fill="none"><path d="M1 1l5 5-5 5" stroke="#E85D04" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    {label}
                  </span>
                ))}
              </nav>
            </div> */}

          </div>
        </div>
      </div>

      {/* â”€â”€ Bottom bar â”€â”€ */}
      <div style={{ borderTop: '2.5px solid #E85D04', background: '#fff' }}>
        <div className="footer-bottom" style={{ maxWidth: 1200, margin: '0 auto', padding: '20px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>

          {/* Left */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <rect x="1" y="1" width="34" height="34" rx="6" stroke="#E85D04" strokeWidth="1.5" fill="none"/>
              <path d="M18 8l1.5 5h5.2l-4.2 3 1.6 5-4.1-3-4.1 3 1.6-5-4.2-3h5.2z" stroke="#E85D04" strokeWidth="1.3" fill="none" strokeLinejoin="round"/>
            </svg>
            <div>
              <p style={{ fontSize: '0.85rem', color: '#444', margin: 0, fontWeight: 600 }}>
                © {new Date().getFullYear()} Syed Cars. All rights reserved.
              </p>
              <p style={{ fontSize: '0.82rem', color: '#454242', margin: 0, display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
                <svg width="11" height="11" fill="#E85D04" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                Madanapalle, Andhra Pradesh, India.
              </p>
            </div>
          </div>

          {/* Center */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
              <circle cx="22" cy="22" r="20" stroke="#E85D04" strokeWidth="1.5" fill="none"/>
              <path d="M22 9l2.8 5.7L31 15.7l-4.5 4.4 1.1 6.3L22 23.6l-5.6 2.8 1.1-6.3L13 15.7l6.2-.9L22 9z" stroke="#E85D04" strokeWidth="1.4" fill="none" strokeLinejoin="round"/>
            </svg>
            <div style={{ fontSize: '0.85rem', color: '#666', lineHeight: 1.6, fontWeight: 500 }}>
              All prices are indicative<br />and subject to negotiation.
            </div>
          </div>

          {/* Right: socials */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {[
              { href: 'https://wa.me/919177565639', label: 'WhatsApp', path: 'M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.859-4.42 9.863-9.864.002-2.637-1.03-5.118-2.905-6.993-1.876-1.875-4.357-2.905-6.993-2.907-5.441 0-9.865 4.422-9.869 9.866-.001 1.636.45 3.238 1.311 4.654l-.99 3.612 3.703-.97zM17.487 14.4c-.27-.137-1.604-.792-1.852-.882-.25-.09-.431-.137-.61.137-.18.27-.697.882-.857 1.058-.16.177-.32.197-.59.06-.27-.137-1.144-.422-2.183-1.348-.807-.72-1.353-1.61-1.512-1.883-.16-.27-.016-.417.118-.552.122-.122.27-.315.405-.473.137-.158.18-.27.27-.45.09-.18.046-.338-.021-.473-.069-.137-.61-1.472-.837-2.013-.22-.53-.443-.457-.61-.466-.16-.008-.344-.01-.528-.01-.184 0-.485.07-.74.348-.253.279-.968.948-.968 2.31 0 1.361.99 2.674 1.13 2.86.137.184 1.948 2.973 4.72 4.17 1.258.544 2.02.7 2.766.589.824-.123 1.604-.656 1.83-1.288.225-.63.225-1.17.157-1.288-.07-.117-.25-.18-.52-.317z' },
              { href: 'https://www.instagram.com/syed_cars_/', label: 'Instagram', path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z' },
              { href: 'https://www.facebook.com/p/syed-cars-madanapalle-100093254552495/', label: 'Facebook', path: 'M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z' },
            ].map(({ href, label, path }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                style={{ width: 40, height: 40, borderRadius: '50%', border: '1.5px solid #E85D04', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', transition: 'all 0.18s ease' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#E85D04'; e.currentTarget.querySelector('svg').style.fill = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.querySelector('svg').style.fill = '#E85D04'; }}
              >
                <svg width="15" height="15" fill="#E85D04" viewBox="0 0 24 24"><path d={path}/></svg>
              </a>
            ))}
          </div>

        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .footer-car-img { height: 55% !important; width: 65% !important; opacity: 0.5 !important; }
          .footer-grid { grid-template-columns: 1fr 1fr !important; gap: 36px !important; }
          .footer-content { padding: 40px 28px 36px !important; }
          .footer-bottom { flex-wrap: wrap !important; padding: 18px 28px !important; gap: 16px !important; }
        }
        @media (max-width: 600px) {
          .footer-car-img { display: none !important; }
          .footer-grid { grid-template-columns: 1fr 1fr !important; gap: 24px !important; }
          .footer-grid > div:first-child { grid-column: 1 / -1 !important; }
          .footer-content { padding: 32px 18px 28px !important; }
          .footer-bottom { flex-wrap: wrap !important; align-items: flex-start !important; padding: 16px 18px !important; gap: 14px !important; }
        }
      `}</style>
    </footer>
  );
}
