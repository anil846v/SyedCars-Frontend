const ORANGE = '#E8631A';
const LIME   = '#C8D900';
import React from 'react';
import logo from '../assets/logo1.png';
import SEO from '../components/SEO'


const Icon = ({ children, size = 22, color = ORANGE, ...rest }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="1.6" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...rest}
  >
    {children}
  </svg>
);

const Eyebrow = ({ children }) => (
  <p style={{ display: 'flex', alignItems: 'center', gap: 12, color: ORANGE, fontSize: 11, fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase', margin: '0 0 16px' }}>
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

const IconCircle = ({ children, size = 52 }) => (
  <div style={{ width: size, height: size, borderRadius: '50%', background: 'rgba(232,99,26,0.09)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    {children}
  </div>
);

const MILESTONES = [
  {
    year: '2013',
    icon: <Icon color="#10B981" size={28}><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><line x1="4" y1="22" x2="4" y2="15" /></Icon>,
    event: 'Syed Cars was established in Madanapalle with a mission to create an honest, transparent marketplace for pre-owned vehicles in Andhra Pradesh.',
  },
  {
    year: '2018',
    icon: <Icon color="#22C55E" size={28}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></Icon>,
    event: 'Formalized operations with a full team. Launched verified listings and built a growing base of 200+ trusted customers across the region.',
  },
  {
    year: '2020',
    icon: <Icon color="#3B82F6" size={28}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" /></Icon>,
    event: 'Expanded operations to serve all of Andhra Pradesh. Crossed 100 verified listings and built a loyal customer base of 200+.',
  },
  {
    year: '2022',
    icon: <Icon color="#8B5CF6" size={28}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></Icon>,
    event: 'Launched a digital enquiry system and WhatsApp support. Served 500+ customers with a 4.9★ satisfaction rating.',
  },
  {
    year: '2026',
    icon: <Icon color="#FF5A09" size={28}><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /><polyline points="22 20 2 20" /></Icon>,
    event: "Reached ₹50Cr+ in total transactions. Grew to a team of 12 professionals. Madanapalle's most trusted car marketplace.",
  },
];

const STATS = [
  { 
    value: '950+', 
    label: 'Happy Customers',    
    icon: <Icon size={28}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></Icon>,
    color: '#22C55E'   // Green
  },
  { 
    value: '₹50Cr+', 
    label: 'Total Transactions', 
    icon: <Icon size={28}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></Icon>,
    color: '#FF5A09'   // Orange
  },
  { 
    value: '500+',  
    label: 'Cars Sold',           
    icon: <Icon size={28}><rect x="1" y="3" width="15" height="13" rx="2" /><path d="M16 8h4l3 5v3h-7V8z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></Icon>,
    color: '#157792'   // Blue
  },
  { 
    value: '4.9★', 
    label: 'Customer Rating',     
    icon: <Icon size={28}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></Icon>,
    color: '#F59E0B'   // Amber
  },
];

const MISSION_ITEMS = [
  { 
    title: 'Fair Pricing',      
    sub: 'No inflated markups',    
    icon: <Icon color="#10B981"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" /></Icon> 
  },
  { 
    title: 'Full Docs',         
    sub: 'Every paper verified',   
    icon: <Icon color="#684693"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" /></Icon> 
  },
  { 
    title: 'Zero Hidden Fees',  
    sub: 'What you see, you pay',  
    icon: <Icon color="#9ac222"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></Icon> 
  },
];

const FOUNDER_STATS = [
  { val: '950+',   lbl: 'Happy Customers',  icon: <Icon size={20}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></Icon> },
  { val: '₹50Cr+', lbl: 'Transactions',     icon: <Icon size={20}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></Icon> },
  { val: '11+',    lbl: 'Years Experience', icon: <Icon size={20}><circle cx="12" cy="8" r="6" /><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" /></Icon> },
];

const S = {
  divider: { width: 24, height: 2.5, background: ORANGE, borderRadius: 2, marginBottom: 14, marginLeft: 'auto', marginRight: 'auto' },
};

/* ─────────────────────────────────────────────────────────────
   STRIPE BACKGROUNDS  — Hero-matching intensity
   Each section has: a solid base + 2 bold diagonals clipped
   inside overflow:hidden so they never bleed out.
   Primary stripe ≈ 0.88–0.92 opacity (same as Hero.jsx)
   Secondary echo  ≈ 0.38–0.45 opacity
───────────────────────────────────────────────────────────── */

/**
 * HERO SECTION  — lime dominant, top-right sweep (mirrors Hero.jsx exactly)
 * Base: warm grey-white  →  bold lime top-right, thin echo mid-right
 * Orange: subtle warm wash bottom-left so it doesn't compete with page hero
 */
/**
 * HERO SECTION — Orange dominant (matching your request)
 * Base: warm off-white → bold orange top-right, thin echo + subtle lime accent
 */
const HeroBg = () => (
  <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 0, pointerEvents: 'none' }}>
    {/* Warm off-white base */}
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(155deg, #F2F4EE 0%, #EEF0EA 60%, #F5F3EE 100%)' }} />

    {/* BOLD Orange — top-right (main hero feel) */}
    <div style={{
      position: 'absolute', width: '170%', height: 270,
      background: `linear-gradient(120deg, ${ORANGE} 0%, #FF8A4D 100%)`,
      transform: 'rotate(-28deg)', top: '-4%', right: '-38%', opacity: 0.22,
    }} />

    {/* Thinner Orange echo */}
    <div style={{
      position: 'absolute', width: '170%', height: 88,
      background: `linear-gradient(120deg, ${ORANGE} 0%, #FF8A4D 100%)`,
      transform: 'rotate(-28deg)', top: '50%', right: '-38%', opacity: 0.38,
    }} />

    {/* Subtle Lime accent (bottom-left) */}
    <div style={{
      position: 'absolute', width: '80%', height: 220,
      background: `linear-gradient(120deg, ${LIME} 0%, #D8EB00 100%)`,
      transform: 'rotate(-28deg)', bottom: '-18%', left: '-22%', opacity: 0.09,
    }} />

    {/* Sky tint top */}
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(160,195,240,0.10) 0%, transparent 50%)' }} />
  </div>
);

/**
 * STATS BAR — reversed: orange dominant left sweep, lime right
 * Base: pure white so stat cards read cleanly
 */
const StatsBg = () => (
  <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 0, pointerEvents: 'none' }}>
    <div style={{ position: 'absolute', inset: 0, background: '#ffffff' }} />
    {/* Bold orange — sweeps in from left */}
    <div style={{
      position: 'absolute', width: '140%', height: 230,
      background: `linear-gradient(120deg, ${ORANGE} 0%, #F5A05A 100%)`,
      transform: 'rotate(-28deg)', top: '-30%', left: '-30%', opacity: 0.13,
    }} />
    {/* Bold lime — sweeps in from right */}
    <div style={{
      position: 'absolute', width: '140%', height: 200,
      background: `linear-gradient(120deg, ${LIME} 0%, #D8EB00 100%)`,
      transform: 'rotate(-28deg)', top: '-20%', right: '-32%', opacity: 0.88,
    }} />
    {/* Thin lime echo */}
    <div style={{
      position: 'absolute', width: '140%', height: 66,
      background: `linear-gradient(120deg, ${LIME} 0%, #D8EB00 100%)`,
      transform: 'rotate(-28deg)', bottom: '-14%', right: '-32%', opacity: 0.38,
    }} />
  </div>
);

/**
 * MISSION — lime from top-left, orange from bottom-right (flipped vs Hero)
 * Base: very light warm white
 */
const MissionBg = () => (
  <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 0, pointerEvents: 'none' }}>
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, #FDFCF8 0%, #FFFFFF 100%)' }} />
    {/* Bold lime — top-left corner */}
    <div style={{
      position: 'absolute', width: '170%', height: 260,
      background: `linear-gradient(120deg, ${LIME} 0%, #D8EB00 100%)`,
      transform: 'rotate(28deg)', top: '-14%', left: '-42%', opacity: 0.88,
    }} />
    {/* Thin lime echo */}
    <div style={{
      position: 'absolute', width: '170%', height: 80,
      background: `linear-gradient(120deg, ${LIME} 0%, #D8EB00 100%)`,
      transform: 'rotate(28deg)', top: '52%', left: '-42%', opacity: 0.38,
    }} />
    {/* Bold orange — bottom-right */}
    <div style={{
      position: 'absolute', width: '120%', height: 220,
      background: `linear-gradient(120deg, ${ORANGE} 0%, #F5A05A 100%)`,
      transform: 'rotate(-28deg)', bottom: '-18%', right: '-24%', opacity: 0.12,
    }} />
  </div>
);

/**
 * TIMELINE — both colors crossing: orange upper-left, lime upper-right
 * Base: light lime-grey tint (matches testimonials exactly)
 */
const TimelineBg = () => (
  <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 0, pointerEvents: 'none' }}>
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, #F5F9D0 0%, #EDEFD8 50%, #F8F8F2 100%)' }} />
    {/* Bold lime — top-right (dominant) */}
    {/* <div style={{
      position: 'absolute', width: '170%', height: 260,
      background: `linear-gradient(120deg, ${LIME} 0%, #D8EB00 100%)`,
      transform: 'rotate(-28deg)', top: '-8%', right: '-38%', opacity: 0.60,
    }} /> */}
    {/* Bold orange — top-left, crossing the lime */}
    <div style={{
      position: 'absolute', width: '120%', height: 200,
      background: `linear-gradient(120deg, ${ORANGE} 0%, #F5A05A 100%)`,
      transform: 'rotate(-28deg)', top: '-12%', left: '-24%', opacity: 0.15,
    }} />
    {/* Thin lime echo — mid */}
    <div style={{
      position: 'absolute', width: '170%', height: 86,
      background: `linear-gradient(120deg, ${LIME} 0%, #D8EB00 100%)`,
      transform: 'rotate(-28deg)', top: '50%', right: '-38%', opacity: 0.40,
    }} />
    {/* Thin orange echo — lower-left */}
    <div style={{
      position: 'absolute', width: '90%', height: 70,
      background: `linear-gradient(120deg, ${ORANGE} 0%, #F5A05A 100%)`,
      transform: 'rotate(-28deg)', bottom: '-8%', left: '-10%', opacity: 0.1,
    }} />
    {/* Sky tint */}
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(160,195,240,0.07) 0%, transparent 50%)' }} />
  </div>
);

/**
 * FOUNDER — orange dominant left (bold brand moment), lime top-right accent
 * Base: warm cream so the orange reads powerfully
 */
const FounderBg = () => (
  <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 0, pointerEvents: 'none' }}>
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(155deg, #FDF9F4 0%, #FEF8F0 100%)' }} />
    {/* Bold orange — sweeps from top-left down */}
    <div style={{
      position: 'absolute', width: '170%', height: 260,
      background: `linear-gradient(120deg, ${ORANGE} 0%, #F5A05A 100%)`,
      transform: 'rotate(-28deg)', top: '-10%', left: '-38%', opacity: 0.14,
    }} />
    {/* Thin orange echo */}
    <div style={{
      position: 'absolute', width: '170%', height: 80,
      background: `linear-gradient(120deg, ${ORANGE} 0%, #F5A05A 100%)`,
      transform: 'rotate(-28deg)', top: '52%', left: '-38%', opacity: 0.07,
    }} />
    {/* Bold lime — top-right accent */}
    <div style={{
      position: 'absolute', width: '140%', height: 240,
      background: `linear-gradient(120deg, ${LIME} 0%, #D8EB00 100%)`,
      transform: 'rotate(-28deg)', top: '-14%', right: '-32%', opacity: 0.88,
    }} />
    {/* Thin lime echo */}
    <div style={{
      position: 'absolute', width: '140%', height: 76,
      background: `linear-gradient(120deg, ${LIME} 0%, #D8EB00 100%)`,
      transform: 'rotate(-28deg)', bottom: '-6%', right: '-32%', opacity: 0.38,
    }} />
  </div>
);

/**
 * CTA STRIP — lime dominant (energetic close), orange pinch left edge
 * Base: light lime-tinted grey (matching testimonials section feel)
 */
const CtaBg = () => (
  <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 0, pointerEvents: 'none' }}>
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, #F5F9D0 0%, #EDEFD8 60%, #F0EFD8 100%)' }} />
    {/* Bold lime — top-left sweep */}
    <div style={{
      position: 'absolute', width: '170%', height: 250,
      background: `linear-gradient(120deg, ${LIME} 0%, #D8EB00 100%)`,
      transform: 'rotate(28deg)', top: '-40%', left: '-36%', opacity: 0.90,
    }} />
    {/* Thin lime echo */}
    <div style={{
      position: 'absolute', width: '170%', height: 80,
      background: `linear-gradient(120deg, ${LIME} 0%, #D8EB00 100%)`,
      transform: 'rotate(28deg)', bottom: '-10%', left: '-36%', opacity: 0.10,
    }} />
    {/* Orange — right edge punch */}
    <div style={{
      position: 'absolute', width: '100%', height: 220,
      background: `linear-gradient(120deg, ${ORANGE} 0%, #F5A05A 100%)`,
      transform: 'rotate(-28deg)', top: '-20%', right: '-20%', opacity: 0.13,
    }} />
  </div>
);


export default function About() {
  return (
    <div style={{ fontFamily: 'inherit' }}>
      <SEO
  title="About Syed Cars"
  description="Learn about Syed Cars — our story, our promise of quality, and why thousands of buyers trust us for premium pre-owned vehicles in Madanapalle."
  keywords="about Syed Cars, trusted used car dealer Madanapalle, who is Syed Cars, pre-owned car dealership Madanapalle, our story Syed Cars"
  url="https://syedcars.com/about"
/>

      {/* ══════════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════════ */}
      <div style={{ position: 'relative', borderBottom: '1px solid #E8E0D4' }}>
        <HeroBg />

        {/* Top content */}
        <div className="container about-hero-pad" style={{ padding: '34px 60px 48px', position: 'relative', zIndex: 1 }}>
          <div className="about-hero-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
            <div>
              <Eyebrow>OUR STORY</Eyebrow>
              <h1 style={{ fontSize: 'clamp(2.4rem,5vw,3.8rem)', fontWeight: 600, color: '#1a1a1a', margin: '0 0 8px', lineHeight: 1.08 }}>
                About <span style={{ color: ORANGE }}>Syed Cars</span>
              </h1>
              <Underline />
              <p style={{ fontSize: '1rem', color: '#121111', lineHeight: 1.8, maxWidth: 480, margin: 0 }}>
                Born in Madanapalle, built on trust. For more than 13 years, we have been Andhra Pradesh's
                most reliable marketplace for premium pre-owned automobiles — where every deal is
                transparent, fair, and stress-free.
              </p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <img
                src={logo}
                alt="Premium pre-owned car"
                style={{ width: '100%', maxWidth: 300, objectFit: 'contain', display: 'block' }}
              />
            </div>
          </div>
        </div>
        </div>
      <div style={{ position: 'relative', borderBottom: '1px solid #E8E0D4' }}>

        {/* Stats bar — its own stripe layer */}
        <div style={{ position: 'relative', borderTop: '1px solid #E8E0D4' }}>
          {/* <StatsBg /> */}
          <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="about-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
  {STATS.map((s, i) => (
    <div key={i} style={{
      padding: '28px 24px', textAlign: 'center',
      borderRight: i < 3 ? '1px solid rgba(240,230,220,0.7)' : 'none',
    }}>
      <IconCircle size={52}>
        {React.cloneElement(s.icon, { stroke: s.color })}
      </IconCircle>
      <div style={{ fontSize: '1.8rem', fontWeight: 600, color: s.color, lineHeight: 1, marginTop: 12 }}>{s.value}</div>
      <div style={{ fontSize: '0.72rem', color: '#444343', fontFamily: 'monospace', letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 6 }}>{s.label}</div>
      <div style={{ width: 28, height: 2, background: s.color, borderRadius: 2, margin: '10px auto 0' }} />
    </div>
  ))}
</div>
          </div>
        </div>
      </div>
  {/* ══════════════════════════════════════════
          FOUNDER SECTION
      ══════════════════════════════════════════ */}
      <section style={{ position: 'relative', padding: '80px 0', borderBottom: '1px solid #E8E0D4' }}>
        {/* <FounderBg /> */}
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <Eyebrow>THE FOUNDER</Eyebrow>
          <h2 style={{ fontSize: 'clamp(2rem,4vw,2.75rem)', fontWeight: 600, color: '#1a1a1a', margin: '0 0 8px', lineHeight: 1.1 }}>
            Meet <span style={{ color: ORANGE }}>Mohammed Syed</span>
          </h2>
          <div style={{ width: 36, height: 3, background: ORANGE, borderRadius: 2, marginBottom: 8 }} />
          <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: ORANGE, marginBottom: 40 }} />

          <div className="about-cta-box" style={{
            border: '1.5px solid rgba(240,230,220,0.9)',
            borderRadius: 20, padding: '48px 56px',
            background: 'rgba(255,255,255,0.82)',
            backdropFilter: 'blur(8px)',
          }}>
            <div className="about-cta-grid" style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 48, alignItems: 'center' }}>

              <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid #F0E6DC', aspectRatio: '3/4', boxShadow: '0 8px 28px rgba(0,0,0,0.06)' }}>
                <img
                  src="/about_founder.png"
                  alt="Mohammed Syed, Founder & CEO of Syed Cars"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </div>

              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: '0.7rem', fontFamily: 'monospace', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#fff', background: ORANGE, padding: '6px 16px', borderRadius: 20, marginBottom: 20, fontWeight: 700 }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  SINCE 2013
                </div>

                <h3 style={{ fontSize: '2rem', fontWeight: 600, color: '#1a1a1a', margin: '0 0 4px' }}>Mohammed Syed</h3>
                <p style={{ fontSize: '0.75rem', fontFamily: 'monospace', letterSpacing: '0.18em', textTransform: 'uppercase', color: ORANGE, margin: '0 0 8px', fontWeight: 700 }}>FOUNDER &amp; CEO</p>
                <div style={{ width: 36, height: 2, background: '#F0E6DC', borderRadius: 2, marginBottom: 28 }} />

                <div style={{ marginBottom: 36 }}>
                  <p style={{ fontSize: '0.97rem', color: '#151515', lineHeight: 1.85, margin: '0 0 16px' }}>
                    With over 15 years of hands-on experience in the automobile industry across Madanapalle,
                    Hyderabad and Mumbai, Mohammed built Syed Cars to bring honesty and transparency to
                    every car deal in Andhra Pradesh.
                  </p>
                  <p style={{ fontSize: '0.97rem', color: '#151515', lineHeight: 1.85, margin: 0 }}>
                    His vision was simple — every buyer deserves full information, every seller deserves
                    a fair price, and every deal should be stress-free from start to finish.
                  </p>
                </div>

                <div className="about-founder-stats" style={{ display: 'flex', border: '1px solid #F0E6DC', borderRadius: 12, overflow: 'hidden' }}>
                  {FOUNDER_STATS.map(({ val, lbl, icon }, i) => (
                    <div key={lbl} style={{ flex: 1, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12, borderRight: i < 2 ? '1px solid #F0E6DC' : 'none', background: 'rgba(255,255,255,0.75)' }}>
                      <IconCircle size={40}>{icon}</IconCircle>
                      <div>
                        <div style={{ fontSize: '1.3rem', fontWeight: 600, color: ORANGE, lineHeight: 1 }}>{val}</div>
                        <div style={{ fontSize: '0.65rem', color: '#343131', fontFamily: 'monospace', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 3 }}>{lbl}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
     

      {/* ══════════════════════════════════════════
          TIMELINE SECTION
      ══════════════════════════════════════════ */}
      <section style={{ position: 'relative', padding: '80px 0', borderBottom: '1px solid #E8E0D4' }}>
        <TimelineBg />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <Eyebrow>OUR JOURNEY</Eyebrow>
          <h2 style={{ fontSize: 'clamp(2rem,4vw,2.75rem)', fontWeight: 600, color: '#1a1a1a', margin: '0 0 8px', lineHeight: 1.1 }}>
            More Than <span style={{ color: ORANGE }}>10 Years</span><br />of Milestones
          </h2>
          <div style={{ width: 36, height: 3, background: ORANGE, borderRadius: 2, marginBottom: 8 }} />
          <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: ORANGE, marginBottom: 16 }} />
          <p style={{ fontSize: '0.95rem', color: '#151515', margin: '0 0 48px', lineHeight: 1.6 }}>
            From a simple idea to Andhra Pradesh's most trusted<br />pre-owned car marketplace.
          </p>

          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', top: 24, left: '10%', right: '10%', height: 2, background: ORANGE, zIndex: 0 }} />
            <div className="about-milestones-icons" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', marginBottom: 24, position: 'relative', zIndex: 1 }}>
              {MILESTONES.map((m, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'center' }}>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#fff', border: '2px solid #F0E6DC', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 12px rgba(232,99,26,0.10)' }}>
                    {m.icon}
                  </div>
                </div>
              ))}
            </div>
            <div className="about-milestones-text" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)' }}>
              {MILESTONES.map((m, i) => (
                <div
                  key={i}
                  style={{
                    padding: '28px 20px', textAlign: 'center',
                    background: 'rgba(255,255,255,0.86)',
                    backdropFilter: 'blur(6px)',
                    borderLeft: '1px solid rgba(240,230,220,0.8)',
                    borderTop: '1px solid rgba(240,230,220,0.8)',
                    borderBottom: '1px solid rgba(240,230,220,0.8)',
                    borderRight: i === MILESTONES.length - 1 ? '1px solid rgba(240,230,220,0.8)' : 'none',
                    transition: 'background 0.25s, box-shadow 0.25s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,248,244,0.97)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(232,99,26,0.07)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.86)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <div style={{ fontSize: '1.6rem', fontWeight: 600, color: ORANGE, marginBottom: 8, lineHeight: 1 }}>{m.year}</div>
                  <div style={S.divider} />
                  <p style={{ fontSize: '0.84rem', color: '#151515', lineHeight: 1.75, margin: 0 }}>{m.event}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
 {/* ══════════════════════════════════════════
          MISSION SECTION
      ══════════════════════════════════════════ */}
      <section style={{ position: 'relative', padding: '80px 0', borderBottom: '1px solid #E8E0D4' }}>
        {/* <MissionBg /> */}
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="about-mission-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
            <div>
              <Eyebrow>OUR MISSION</Eyebrow>
              <h2 style={{ fontSize: 'clamp(2rem,4vw,2.75rem)', fontWeight: 600, color: '#1a1a1a', margin: '0 0 8px', lineHeight: 1.1 }}>
                Transparency First, <span style={{ color: ORANGE }}>Always</span>
              </h2>
              <div style={{ width: 36, height: 3, background: ORANGE, borderRadius: 2, marginBottom: 24 }} />
              <p style={{ color: '#151515', fontSize: '0.97rem', lineHeight: 1.85, margin: '0 0 16px' }}>
                The pre-owned car market has always been clouded by information gaps. Buyers end up
                overpaying for cars with hidden issues, while honest sellers get undercut. We built
                Syed Cars to permanently change that equation in Andhra Pradesh.
              </p>
              <p style={{ color: '#1e1d1d', fontSize: '0.97rem', lineHeight: 1.85, margin: '0 0 36px' }}>
                Every listing on Syed Cars shows the complete picture — verified odometer readings,
                insurance status, engine and chassis numbers, service history, and pricing benchmarked
                against the real market. No fluff, no fine print.
              </p>
              <div style={{ display: 'flex', gap: 32 }}>
                {MISSION_ITEMS.map(({ title, sub, icon }) => (
                  <div key={title}>
                    <IconCircle size={48}>{icon}</IconCircle>
                    <div style={{ width: 28, height: 2.5, background: ORANGE, borderRadius: 2, margin: '12px 0 8px' }} />
                    <div style={{ fontSize: '0.90rem', fontWeight: 700, color: '#1a1a1a' }}>{title}</div>
                    <div style={{ fontSize: '0.78rem', color: '#4f4b4b', marginTop: 2 }}>{sub}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{
              position: 'relative', borderRadius: 20, overflow: 'hidden', aspectRatio: '4/3',
              border: '1px solid #F0E6DC', boxShadow: '0 8px 40px rgba(0,0,0,0.08)',
              background: '#F5F3F0', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <img
                src="https://images.unsplash.com/photo-1663852408695-f57f4d75a536?fm=jpg&q=80&w=1600&auto=format&fit=crop"
                alt="Cars on the road, trusted by Syed Cars customers"
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.18) 0%, transparent 60%)', pointerEvents: 'none' }} />
              <div style={{ position: 'absolute', bottom: 5, right: 5, background: 'rgba(255,255,255,0.97)', border: '1px solid #F0E6DC', borderRadius: 10, padding: '14px 20px' }}>
                <div style={{ fontSize: '1.6rem', fontWeight: 600, color: ORANGE, lineHeight: 1 }}>₹10Cr+</div>
                <div style={{ fontSize: '0.7rem', color: '#363434', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 4 }}>Total Transactions</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    

      {/* ══════════════════════════════════════════
          CTA STRIP
      ══════════════════════════════════════════ */}
      <div style={{ position: 'relative', padding: '56px 0' }}>
        <CtaBg />
        <div className="container" style={{
          position: 'relative', zIndex: 1,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 32, flexWrap: 'wrap',
        }}>
          <div>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 600, color: '#1a1a1a', margin: '0 0 8px' }}>
              Ready to find your <span style={{ color: ORANGE }}>perfect car?</span>
            </h3>
            <p style={{ margin: 0, fontSize: '0.95rem', color: '#151515' }}>Browse our verified inventory or list your car with us today.</p>
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
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 28px', background: 'transparent', color: ORANGE, fontWeight: 700, fontSize: '0.88rem', borderRadius: 8, textDecoration: 'none', border: '2px solid #E8631A', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = ORANGE; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = ORANGE; }}
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .about-hero-pad       { padding: 28px 24px 36px !important; }
          .about-hero-grid      { grid-template-columns: 1fr !important; gap: 32px !important; }
          .about-mission-grid   { grid-template-columns: 1fr !important; gap: 36px !important; }
          .about-stats-grid     { grid-template-columns: 1fr 1fr !important; }
          .about-milestones-icons { grid-template-columns: repeat(3, 1fr) !important; }
          .about-milestones-text  { grid-template-columns: repeat(3, 1fr) !important; }
          .about-cta-grid       { grid-template-columns: 1fr !important; gap: 28px !important; }
          .about-cta-box        { padding: 32px 24px !important; }
          .about-founder-stats  { flex-direction: column !important; }
          .about-founder-stats > div { border-right: none !important; border-bottom: 1px solid #F0E6DC !important; }
          .about-founder-stats > div:last-child { border-bottom: none !important; }
        }
        @media (max-width: 600px) {
          .about-hero-pad       { padding: 20px 16px 28px !important; }
          .about-stats-grid     { grid-template-columns: 1fr 1fr !important; }
          .about-milestones-icons { grid-template-columns: repeat(2, 1fr) !important; }
          .about-milestones-text  { grid-template-columns: repeat(2, 1fr) !important; }
          .about-hero-grid      { gap: 20px !important; }
          .about-cta-box        { padding: 24px 18px !important; }
        }
      `}</style>
    </div>
  );
}