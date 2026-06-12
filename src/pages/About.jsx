const ORANGE = '#E8631A';

// ── Shared SVG icon primitives ──────────────────────────────────────────────
const Icon = ({ children, size = 22, ...rest }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={ORANGE}
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...rest}
  >
    {children}
  </svg>
);

// ── Reusable UI primitives ───────────────────────────────────────────────────
const Eyebrow = ({ children }) => (
  <p style={{
    display: 'flex', alignItems: 'center', gap: 12,
    color: ORANGE, fontSize: 11, fontWeight: 700,
    letterSpacing: '2.5px', textTransform: 'uppercase',
    margin: '0 0 16px',
  }}>
    {children}
    <span style={{ display: 'inline-block', height: 1.5, width: 40, background: ORANGE }} />
  </p>
);

const Underline = () => (
  <>
    <div style={{ width: 36, height: 3, background: ORANGE, borderRadius: 2, marginBottom: 4 }} />
    <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: ORANGE, marginBottom: 20 }} />
  </>
);

const IconCircle = ({ children, size = 52, iconSize = 28 }) => (
  <div style={{
    width: size, height: size, borderRadius: '50%',
    background: 'rgba(232,99,26,0.09)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  }}>
    {children}
  </div>
);

// ── Data ─────────────────────────────────────────────────────────────────────
const MILESTONES = [
  {
    year: '2013',
    icon: <Icon><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><line x1="4" y1="22" x2="4" y2="15" /></Icon>,
    event: 'Syed Cars was established in Madanapalle with a mission to create an honest, transparent marketplace for pre-owned vehicles in Andhra Pradesh.',
  },
  {
    year: '2018',
    icon: <Icon><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></Icon>,
    event: 'Formalized operations with a full team. Launched verified listings and built a growing base of 200+ trusted customers across the region.',
  },
  {
    year: '2020',
    icon: <Icon><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" /></Icon>,
    event: 'Expanded operations to serve all of Andhra Pradesh. Crossed 100 verified listings and built a loyal customer base of 200+.',
  },
  {
    year: '2022',
    icon: <Icon><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></Icon>,
    event: 'Launched a digital enquiry system and WhatsApp support. Served 500+ customers with a 4.9★ satisfaction rating.',
  },
  {
    year: '2024',
    icon: <Icon><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /><polyline points="22 20 2 20" /></Icon>,
    event: "Reached ₹50Cr+ in total transactions. Grew to a team of 12 professionals. Madanapalle's most trusted car marketplace.",
  },
];

const STATS = [
  {
    value: '950+', label: 'Happy Customers',
    icon: <Icon size={28}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></Icon>,
  },
  {
    value: '₹50Cr+', label: 'Total Transactions',
    icon: <Icon size={28}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></Icon>,
  },
  {
    value: '500+', label: 'Cars Sold',
    icon: <Icon size={28}><rect x="1" y="3" width="15" height="13" rx="2" /><path d="M16 8h4l3 5v3h-7V8z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></Icon>,
  },
  {
    value: '4.9★', label: 'Customer Rating',
    icon: <Icon size={28}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></Icon>,
  },
];

const MISSION_ITEMS = [
  {
    title: 'Fair Pricing', sub: 'No inflated markups',
    icon: <Icon><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" /></Icon>,
  },
  {
    title: 'Full Docs', sub: 'Every paper verified',
    icon: <Icon><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" /></Icon>,
  },
  {
    title: 'Zero Hidden Fees', sub: 'What you see, you pay',
    icon: <Icon><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></Icon>,
  },
];

const FOUNDER_STATS = [
  {
    val: '950+', lbl: 'Happy Customers',
    icon: <Icon size={20}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></Icon>,
  },
  {
    val: '₹50Cr+', lbl: 'Transactions',
    icon: <Icon size={20}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></Icon>,
  },
  {
    val: '11+', lbl: 'Years Experience',
    icon: <Icon size={20}><circle cx="12" cy="8" r="6" /><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" /></Icon>,
  },
];

// ── Styles (defined once, referenced everywhere) ─────────────────────────────
const S = {
  divider: { width: 24, height: 2.5, background: ORANGE, borderRadius: 2, marginBottom: 14, marginLeft: 'auto', marginRight: 'auto' },
  sectionBorder: { borderLeft: '1px solid #F0E6DC', borderTop: '1px solid #F0E6DC', borderBottom: '1px solid #F0E6DC' },
};

// ── Component ────────────────────────────────────────────────────────────────
export default function About() {
  return (
    <div style={{ fontFamily: 'inherit', background: '#fff' }}>

      {/* ── Hero ── */}
      <div style={{ background: '#FDF9F6', borderBottom: '1px solid #F0E6DC', padding: '72px 0 0', overflow: 'hidden' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'flex-end' }}>

            {/* Left text */}
            <div style={{ paddingBottom: 72 }}>
              <Eyebrow>OUR STORY</Eyebrow>
              <h1 style={{ fontSize: 'clamp(2.4rem,5vw,3.8rem)', fontWeight: 800, color: '#1a1a1a', margin: '0 0 8px', lineHeight: 1.08 }}>
                About <span style={{ color: ORANGE }}>Syed Cars</span>
              </h1>
              <Underline />
              <p style={{ fontSize: '1rem', color: '#555', lineHeight: 1.8, maxWidth: 480, margin: 0 }}>
                Born in Madanapalle, built on trust. For more than 6 years, we have been Andhra Pradesh's
                most reliable marketplace for premium pre-owned automobiles — where every deal is
                transparent, fair, and stress-free.
              </p>
            </div>

            {/* Right car image */}
            <div style={{ position: 'relative', display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
              <div style={{
                position: 'absolute', right: -40, top: -20,
                width: 340, height: 340, borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(232,99,26,0.08) 0%, transparent 70%)',
              }} />
              <img
                src="/contact.png"
                alt="Car"
                style={{ width: '100%', maxWidth: 520, objectFit: 'contain', display: 'block', position: 'relative', zIndex: 1, filter: 'drop-shadow(0 16px 40px rgba(0,0,0,0.15))' }}
              />
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div style={{ background: '#fff', borderTop: '1px solid #F0E6DC' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
              {STATS.map((s, i) => (
                <div key={i} style={{ padding: '28px 24px', textAlign: 'center', borderRight: i < 3 ? '1px solid #F0E6DC' : 'none' }}>
                  <IconCircle size={52}>{s.icon}</IconCircle>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: ORANGE, lineHeight: 1, marginTop: 12 }}>{s.value}</div>
                  <div style={{ fontSize: '0.72rem', color: '#888', fontFamily: 'monospace', letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 6 }}>{s.label}</div>
                  <div style={{ width: 28, height: 2, background: ORANGE, borderRadius: 2, margin: '10px auto 0' }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Mission ── */}
      <section style={{ padding: '80px 0', background: '#fff' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
            <div>
              <Eyebrow>OUR MISSION</Eyebrow>
              <h2 style={{ fontSize: 'clamp(2rem,4vw,2.75rem)', fontWeight: 800, color: '#1a1a1a', margin: '0 0 8px', lineHeight: 1.1 }}>
                Transparency First, <span style={{ color: ORANGE }}>Always</span>
              </h2>
              <div style={{ width: 36, height: 3, background: ORANGE, borderRadius: 2, marginBottom: 24 }} />
              <p style={{ color: '#555', fontSize: '0.97rem', lineHeight: 1.85, margin: '0 0 16px' }}>
                The pre-owned car market has always been clouded by information gaps. Buyers end up
                overpaying for cars with hidden issues, while honest sellers get undercut. We built
                Syed Cars to permanently change that equation in Andhra Pradesh.
              </p>
              <p style={{ color: '#555', fontSize: '0.97rem', lineHeight: 1.85, margin: '0 0 36px' }}>
                Every listing on Syed Cars shows the complete picture — verified odometer readings,
                insurance status, engine and chassis numbers, service history, and pricing benchmarked
                against the real market. No fluff, no fine print.
              </p>
              <div style={{ display: 'flex', gap: 32 }}>
                {MISSION_ITEMS.map(({ title, sub, icon }) => (
                  <div key={title}>
                    <IconCircle size={48}>{icon}</IconCircle>
                    <div style={{ width: 28, height: 2.5, background: ORANGE, borderRadius: 2, margin: '12px 0 8px' }} />
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1a1a1a' }}>{title}</div>
                    <div style={{ fontSize: '0.78rem', color: '#999', marginTop: 2 }}>{sub}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mission image */}
            <div style={{ position: 'relative', borderRadius: 20, overflow: 'hidden', aspectRatio: '4/3', border: '1px solid #F0E6DC', boxShadow: '0 8px 40px rgba(0,0,0,0.08)', background: '#F5F3F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img
                src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=900&q=85"
                alt="Premium Car"
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.30) 0%, transparent 50%)', pointerEvents: 'none' }} />
              <div style={{ position: 'absolute', bottom: 24, left: 24, background: 'rgba(255,255,255,0.97)', border: '1px solid #F0E6DC', borderRadius: 10, padding: '14px 20px' }}>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: ORANGE, lineHeight: 1 }}>₹50Cr+</div>
                <div style={{ fontSize: '0.7rem', color: '#888', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 4 }}>Total Transactions</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Timeline ── */}
      <section style={{ padding: '80px 0', background: '#FDF9F6', borderTop: '1px solid #F0E6DC', borderBottom: '1px solid #F0E6DC' }}>
        <div className="container">
          <Eyebrow>OUR JOURNEY</Eyebrow>
          <h2 style={{ fontSize: 'clamp(2rem,4vw,2.75rem)', fontWeight: 800, color: '#1a1a1a', margin: '0 0 8px', lineHeight: 1.1 }}>
            More Than <span style={{ color: ORANGE }}>6 Years</span><br />of Milestones
          </h2>
          <div style={{ width: 36, height: 3, background: ORANGE, borderRadius: 2, marginBottom: 8 }} />
          <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: ORANGE, marginBottom: 16 }} />
          <p style={{ fontSize: '0.95rem', color: '#666', margin: '0 0 48px', lineHeight: 1.6 }}>
            From a simple idea to Andhra Pradesh's most trusted<br />pre-owned car marketplace.
          </p>

          <div style={{ position: 'relative' }}>
            {/* Connecting line */}
            <div style={{ position: 'absolute', top: 24, left: '10%', right: '10%', height: 2, background: ORANGE, zIndex: 0 }} />

            {/* Icon row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', marginBottom: 24, position: 'relative', zIndex: 1 }}>
              {MILESTONES.map((m, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'center' }}>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#fff', border: '2px solid #F0E6DC', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 12px rgba(232,99,26,0.10)' }}>
                    {m.icon}
                  </div>
                </div>
              ))}
            </div>

            {/* Card row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)' }}>
              {MILESTONES.map((m, i) => (
                <div
                  key={i}
                  style={{
                    padding: '28px 20px', textAlign: 'center', background: '#fff',
                    borderLeft: '1px solid #F0E6DC', borderTop: '1px solid #F0E6DC', borderBottom: '1px solid #F0E6DC',
                    borderRight: i === MILESTONES.length - 1 ? '1px solid #F0E6DC' : 'none',
                    transition: 'background 0.25s, box-shadow 0.25s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#FFF8F4'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(232,99,26,0.07)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: ORANGE, marginBottom: 8, lineHeight: 1 }}>{m.year}</div>
                  <div style={S.divider} />
                  <p style={{ fontSize: '0.84rem', color: '#555', lineHeight: 1.75, margin: 0 }}>{m.event}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Founder ── */}
      <section style={{ padding: '80px 0', background: '#fff' }}>
        <div className="container">
          <Eyebrow>THE FOUNDER</Eyebrow>
          <h2 style={{ fontSize: 'clamp(2rem,4vw,2.75rem)', fontWeight: 800, color: '#1a1a1a', margin: '0 0 8px', lineHeight: 1.1 }}>
            Meet <span style={{ color: ORANGE }}>Mohammed Syed</span>
          </h2>
          <div style={{ width: 36, height: 3, background: ORANGE, borderRadius: 2, marginBottom: 8 }} />
          <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: ORANGE, marginBottom: 40 }} />

          <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 56, alignItems: 'center', border: '1.5px solid #F0E6DC', borderRadius: 20, padding: '40px 48px' }}>
            {/* Founder photo */}
            <div style={{ width: '100%', aspectRatio: '3/4', borderRadius: 14, overflow: 'hidden', background: '#F7F3EF' }}>
              <img
                src="/contact.png"
                alt="Mohammed Syed"
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block' }}
              />
            </div>

            {/* Founder info */}
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: '0.7rem', fontFamily: 'monospace', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#fff', background: ORANGE, padding: '6px 16px', borderRadius: 20, marginBottom: 20, fontWeight: 700 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                SINCE 2013
              </div>
              <h3 style={{ fontSize: '2rem', fontWeight: 800, color: '#1a1a1a', margin: '0 0 4px' }}>Mohammed Syed</h3>
              <p style={{ fontSize: '0.75rem', fontFamily: 'monospace', letterSpacing: '0.18em', textTransform: 'uppercase', color: ORANGE, margin: '0 0 8px', fontWeight: 700 }}>FOUNDER &amp; CEO</p>
              <div style={{ width: 36, height: 2, background: '#F0E6DC', borderRadius: 2, marginBottom: 24 }} />
              <p style={{ fontSize: '0.97rem', color: '#555', lineHeight: 1.85, margin: '0 0 16px' }}>
                With over 15 years of hands-on experience in the automobile industry across Madanapalle,
                Hyderabad and Mumbai, Mohammed built Syed Cars to bring honesty and transparency to
                every car deal in Andhra Pradesh.
              </p>
              <p style={{ fontSize: '0.97rem', color: '#555', lineHeight: 1.85, margin: 0 }}>
                His vision was simple — every buyer deserves full information, every seller deserves
                a fair price, and every deal should be stress-free from start to finish.
              </p>

              {/* Founder stats strip */}
              <div style={{ display: 'flex', marginTop: 32, border: '1px solid #F0E6DC', borderRadius: 12, overflow: 'hidden' }}>
                {FOUNDER_STATS.map(({ val, lbl, icon }, i) => (
                  <div key={lbl} style={{ flex: 1, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12, borderRight: i < 2 ? '1px solid #F0E6DC' : 'none' }}>
                    <IconCircle size={40}>{icon}</IconCircle>
                    <div>
                      <div style={{ fontSize: '1.3rem', fontWeight: 800, color: ORANGE, lineHeight: 1 }}>{val}</div>
                      <div style={{ fontSize: '0.65rem', color: '#999', fontFamily: 'monospace', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 3 }}>{lbl}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Strip ── */}
      <div style={{ background: '#FDF9F6', borderTop: '1px solid #F0E6DC', padding: '56px 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 32, flexWrap: 'wrap' }}>
          <div>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1a1a1a', margin: '0 0 8px' }}>
              Ready to find your <span style={{ color: ORANGE }}>perfect car?</span>
            </h3>
            <p style={{ margin: 0, fontSize: '0.95rem', color: '#777' }}>Browse our verified inventory or list your car with us today.</p>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <a
              href="/cars"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 28px', background: ORANGE, color: '#fff', fontWeight: 700, fontSize: '0.88rem', borderRadius: 8, textDecoration: 'none', transition: 'background 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background = '#c44d10'}
              onMouseLeave={e => e.currentTarget.style.background = ORANGE}
            >
              Browse Cars
            </a>
            <a
              href="/contact"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 28px', background: 'transparent', color: ORANGE, fontWeight: 700, fontSize: '0.88rem', borderRadius: 8, textDecoration: 'none', border: `2px solid ${ORANGE}`, transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = ORANGE; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = ORANGE; }}
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>

    </div>
  );
}