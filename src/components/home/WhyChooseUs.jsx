import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardCheck, Scale, Handshake, ShieldCheck, Clock, Users, ArrowRight, Car } from 'lucide-react';

const ORANGE = '#FF5A09';
const LIME   = '#C8D900';

const CARDS = [
  { 
    icon: ClipboardCheck, 
    color: '#10B981', 
    title: 'Verified Listings', 
    desc: 'Every car undergoes thorough verification for documents, inspection & history.' 
  },
  { 
    icon: Scale, 
    color: '#3B82F6', 
    title: 'Transparent Pricing', 
    desc: 'No hidden fees. No inflated prices. What you see is what you pay.' 
  },
  { 
    icon: Handshake, 
    color: '#9ac041', 
    title: 'End-to-End Help', 
    desc: 'From test drive to paperwork, we handle everything for a smooth transaction.' 
  },
  { 
    icon: ShieldCheck, 
    color: '#FF5A09', 
    title: 'Insurance Active', 
    desc: 'All cars come with valid insurance for your complete peace of mind.' 
  },
];

const STATS = [
  { icon: ShieldCheck, label: '100% Verified',  sub: 'Quality & trust, always.' },
  { isRupee: true,     label: 'Best Price',      sub: 'Get the best deal, always.' },
  { icon: Clock,       label: 'Quick Process',   sub: 'Hassle-free from start to finish.' },
  { icon: Users,       label: '1000+ Buyers',    sub: 'Join satisfied customers.' },
];

export default function WhyChooseUs() {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState(null);
  const [activeStat, setActiveStat]   = useState(null);

  return (
    <section style={{ position: 'relative', padding: '72px 0 80px', fontFamily: "'DM Sans', sans-serif", overflow: 'hidden' }}>

      {/* ── Subtle lime background — same geometry as hero, very low opacity ── */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden' }}>
        {/* Warm off-white base — not pure white, not lime */}
        <div style={{ position: 'absolute', inset: 0, background: '#F8F9F2' }} />
        {/* Primary diagonal stripe — top-left corner, fading in */}
        <div style={{
          position: 'absolute', width: '70%', height: 220,
          background: `linear-gradient(120deg, ${LIME} 0%, #D8EB00 100%)`,
          transform: 'rotate(-28deg)',
          top: '-12%', left: '-18%',
          opacity: 0.18,
        }} />
        {/* Secondary thin stripe */}
        <div style={{
          position: 'absolute', width: '70%', height: 70,
          background: `linear-gradient(120deg, ${LIME} 0%, #D8EB00 100%)`,
          transform: 'rotate(-28deg)',
          top: '50%', left: '-18%',
          opacity: 0.10,
        }} />
        {/* Right-edge vignette so content area is clean */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to right, transparent 0%, rgba(248,249,242,0.6) 45%, #F8F9F2 68%)',
        }} />
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>

        {/* ── Section Header ── */}
        <div className="wyc-header" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center', marginBottom: 56 }}>

          {/* Left */}
          <div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: '#fff', border: '1px solid #EDE0D8',
              borderRadius: 30, padding: '5px 14px',
              fontSize: '0.72rem', fontWeight: 700,
              fontFamily: "'DM Sans', 'Inter', sans-serif",
              textTransform: 'uppercase', letterSpacing: '0.1em',
              color: '#666',
              marginBottom: 20, boxShadow: '0 1px 6px rgba(0,0,0,0.05)',
            }}>
              <ShieldCheck size={13} color={ORANGE} />
              Trusted by 1000+ customers
            </div>

            <h2 style={{
              fontSize: 'clamp(28px, 3.5vw, 42px)',
              fontWeight: 600,
              fontFamily: "'Poppins', sans-serif",
              color: '#0e0d0d',
              margin: '0 0 16px', lineHeight: 1.12,
              letterSpacing: '-0.01em',
            }}>
              The Smarter Way{' '}
              <span style={{ color: ORANGE }}>to Buy</span>
              <br />
              <span style={{ color: ORANGE }}>or Sell</span> a Car
            </h2>

            <p style={{ color: '#040404', fontSize: '0.93rem', lineHeight: 1.75, marginBottom: 28, maxWidth: 420 }}>
             We make every car transaction simple, safe, and smart. From browsing verified vehicles to completing your purchase with confidence, we ensure a seamless experience at every step. With transparency, quality assurance, and customer satisfaction at the heart of what we do, thousands of car buyers across India trust us to help them find the perfect vehicle.
            </p>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button onClick={() => navigate('/cars')} style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: ORANGE, color: '#fff',
                border: 'none', borderRadius: 10, padding: '12px 24px',
                fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer',
                fontFamily: "'DM Sans', sans-serif",
                boxShadow: `0 4px 16px rgba(255,90,9,0.32)`,
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(255,90,9,0.42)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 16px rgba(255,90,9,0.32)'; }}
              >
                Browse Cars <ArrowRight size={15} />
              </button>
              <button onClick={() => navigate('/sell-your-car')} style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'transparent', color: ORANGE,
                border: `1.5px solid ${ORANGE}`, borderRadius: 10,
                padding: '12px 24px', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer',
                fontFamily: "'DM Sans', sans-serif",
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#FFF2EC'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
              >
                Sell Your Car <Car size={15} />
              </button>
            </div>
          </div>

          {/* Right — car visual */}
          <div style={{
            position: 'relative', borderRadius: 20, overflow: 'hidden',
            background: 'linear-gradient(145deg, #f0ece8 0%, #e8e2dc 100%)',
            minHeight: 300,
          }}>
            <div style={{
              position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)',
              width: '80%', height: '50%',
              background: `radial-gradient(ellipse, rgba(255,90,9,0.15) 0%, transparent 70%)`,
              zIndex: 1, pointerEvents: 'none',
            }} />
            <img src="/why_choose_us_car.png" alt="Featured Car"
              style={{ width: '105%', marginLeft: '-2%', objectFit: 'contain', position: 'relative', zIndex: 2, filter: 'drop-shadow(0 16px 36px rgba(0,0,0,0.18))' }} />
            <div style={{
              position: 'absolute', top: 18, left: 18, zIndex: 4,
              background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)',
              borderRadius: 10, padding: '7px 14px', border: '1px solid rgba(255,90,9,0.15)',
            }}>
              <div style={{ fontSize: '0.6rem', color: '#111', lineHeight: 1, fontFamily: "'DM Sans', 'Inter', sans-serif", textTransform: 'uppercase', letterSpacing: '0.1em' }}>Featured</div>
              <div style={{ fontSize: '0.8rem', color: '#111', fontWeight: 600, fontFamily: "'Poppins', sans-serif" }}>Premium Cars</div>
            </div>
            <div style={{
              position: 'absolute', bottom: 18, right: 18, zIndex: 4,
              background: ORANGE, borderRadius: 10, padding: '7px 14px',
              boxShadow: '0 4px 14px rgba(255,90,9,0.35)',
            }}>
              <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1, fontFamily: "'DM Sans', 'Inter', sans-serif", textTransform: 'uppercase', letterSpacing: '0.1em' }}>Starting from</div>
              <div style={{ fontSize: '0.82rem', color: '#fff', fontWeight: 600, fontFamily: "'Poppins', sans-serif" }}>₹3.5 Lakh</div>
            </div>
          </div>
        </div>

        {/* ── Feature Cards ── */}
       {/* ── Feature Cards ── */}
<div className="wyc-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 20 }}>
  {CARDS.map((card, i) => {
    const Icon = card.icon;
    const isHovered = hoveredCard === i;
    
    return (
      <div 
        key={i}
        onMouseEnter={() => setHoveredCard(i)}
        onMouseLeave={() => setHoveredCard(null)}
        style={{
          position: 'relative', overflow: 'hidden',
          background: '#fff', borderRadius: 14, padding: '26px 22px 22px',
          border: `1.5px solid ${isHovered ? card.color : '#EDE5DE'}`,
          boxShadow: isHovered ? `0 10px 30px ${card.color}15` : '0 2px 8px rgba(0,0,0,0.04)',
          transform: isHovered ? 'translateY(-3px)' : 'none',
          transition: 'all 0.2s',
        }}
      >
        {/* Large faint background icon */}
        <Icon 
          style={{ 
            position: 'absolute', 
            bottom: 10, 
            right: 10, 
            width: 48, 
            height: 48, 
            color: card.color, 
            opacity: isHovered ? 0.12 : 0.06 
          }} 
          strokeWidth={0.7} 
        />

        {/* Small colored icon */}
        <div style={{
          width: 44, 
          height: 44, 
          borderRadius: 10, 
          background: `${card.color}15`,
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          marginBottom: 16,
        }}>
          <Icon size={20} color={card.color} />
        </div>

        <h3 style={{ 
          fontSize: '0.95rem', 
          fontWeight: 600, 
          color: '#0D0D0D', 
          margin: '0 0 8px', 
          lineHeight: 1.3, 
          fontFamily: "'Poppins', sans-serif" 
        }}>
          {card.title}
        </h3>
        
        <p style={{ 
          fontSize: '0.84rem', 
          color: '#423c3c', 
          lineHeight: 1.7, 
          margin: 0, 
          fontFamily: "'DM Sans', sans-serif" 
        }}>
          {card.desc}
        </p>

        <div style={{ 
          width: 26, 
          height: 2.5, 
          background: card.color, 
          borderRadius: 2, 
          marginTop: 18 
        }} />
      </div>
    );
  })}
</div>

        {/* ── Stats bar ── */}
        <div style={{
          background: '#fff', borderRadius: 14,
          border: '1px solid #EDE5DE',
          boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          overflow: 'hidden',
        }} className="wyc-stats">
          {STATS.map((s, i) => (
            <div key={i}
              onClick={() => setActiveStat(p => p === i ? null : i)}
              style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '20px 24px',
                borderRight: i < 3 ? '1px solid #EDE5DE' : 'none',
                background: activeStat === i ? '#FFF4EE' : 'transparent',
                transition: 'background 0.2s',
                cursor: 'pointer',
              }}>
              <div style={{
                width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
                border: `2px solid ${ORANGE}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: activeStat === i ? ORANGE : 'transparent',
                transition: 'background 0.2s',
              }}>
                {s.isRupee ? (
                  <span style={{ fontSize: '1rem', fontWeight: 700, color: activeStat === i ? '#fff' : ORANGE, fontFamily: "'Poppins', sans-serif" }}>₹</span>
                ) : (
                  <s.icon size={18} color={activeStat === i ? '#fff' : ORANGE} />
                )}
              </div>
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#0D0D0D', lineHeight: 1.2, fontFamily: "'Poppins', sans-serif" }}>{s.label}</div>
                <div style={{ fontSize: '0.74rem', color: '#363434', marginTop: 2, fontFamily: "'DM Sans', sans-serif" }}>{s.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .wyc-header { grid-template-columns: 1fr !important; gap: 28px !important; }
          .wyc-cards  { grid-template-columns: 1fr 1fr !important; }
          .wyc-stats  { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 600px) {
          .wyc-header { gap: 20px !important; }
          .wyc-cards  { grid-template-columns: 1fr 1fr !important; }
          .wyc-stats  { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </section>
  );
}