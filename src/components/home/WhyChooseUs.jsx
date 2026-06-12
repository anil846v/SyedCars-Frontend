import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardCheck, Scale, Handshake, ShieldCheck, Clock, Users, ArrowRight, Car } from 'lucide-react';
import whyChooseUsCar from '../../assets/why_choose_us_car.png';

const CARDS = [
  { icon: ClipboardCheck, title: 'Verified Listings',     desc: 'Every car undergoes thorough verification for documents, inspection & history.' },
  { icon: Scale,          title: 'Transparent Pricing',   desc: 'No hidden fees. No inflated prices. What you see is what you pay.' },
  { icon: Handshake,      title: 'End-to-End Assistance', desc: 'From test drive to paperwork, we handle everything for you.' },
  { icon: ShieldCheck,    title: 'Insurance Active',       desc: 'All cars come with valid insurance for your complete peace of mind.' },
];

const STATS = [
  { icon: ShieldCheck, label: '100% Verified Cars',      sub: 'Quality & trust, always.' },
  { rupee: true,       label: 'Best Price Guarantee',    sub: 'Get the best deal, always.' },
  { icon: Clock,       label: 'Quick & Easy Process',    sub: 'Hassle-free from start to finish.' },
  { icon: Users,       label: '1000+ Happy Customers',   sub: 'Join thousands of satisfied buyers.' },
];

// ── Tokens ─────────────────────────────────────────────────
const ORANGE = '#E8631A';
const BG     = '#F9F6F2';
const FONT   = "'Inter', sans-serif";

// ── Card ───────────────────────────────────────────────────
function Card({ icon: Icon, title, desc }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative', overflow: 'hidden',
        background: '#fff', borderRadius: 16,
        padding: '28px 24px 24px',
        border: `1.5px solid ${hovered ? ORANGE : '#EDE5DE'}`,
        boxShadow: hovered ? '0 10px 30px rgba(232,99,26,0.08)' : '0 2px 8px rgba(0,0,0,0.04)',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
        transition: 'border 0.2s, box-shadow 0.2s, transform 0.2s',
        display: 'flex', flexDirection: 'column', cursor: 'default',
      }}
    >
      {/* Watermark */}
      <Icon style={{ position: 'absolute', bottom: 10, right: 10, width: 50, height: 50, color: ORANGE, opacity: 0.06, pointerEvents: 'none' }} strokeWidth={0.7} />

      {/* Icon badge */}
      <div style={{ width: 46, height: 46, borderRadius: 12, background: '#FFF2EC', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
        <Icon style={{ width: 20, height: 20, color: ORANGE }} />
      </div>

      <h3 style={{ fontSize: '1rem', fontWeight: 500, color: '#111', margin: '0 0 10px', lineHeight: 1.3, fontFamily: FONT }}>
        {title}
      </h3>
      <p style={{ fontSize: '0.845rem', color: '#888', lineHeight: 1.7, margin: 0, fontFamily: FONT, fontWeight: 400, flexGrow: 1 }}>
        {desc}
      </p>
      <div style={{ width: 28, height: 2.5, background: ORANGE, borderRadius: 2, marginTop: 22 }} />
    </div>
  );
}

// ── Stat Item ──────────────────────────────────────────────
function StatItem({ stat, active, onClick, isLast }) {
  const [hovered, setHovered] = useState(false);
  const lit = active || hovered;
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 16,
        padding: '22px 28px',
        borderRight: !isLast ? '1px solid #EDE5DE' : 'none',
        cursor: 'pointer',
        background: active ? '#FFF4EE' : 'transparent',
        transition: 'background 0.22s ease',
        userSelect: 'none',
      }}
    >
      {/* Large outlined icon circle — matches screenshot */}
      <div style={{
        width: 48, height: 48, borderRadius: '50%', flexShrink: 0,
        border: `2px solid ${ORANGE}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: lit ? ORANGE : 'transparent',
        transition: 'background 0.22s ease',
      }}>
        {stat.rupee ? (
          <span style={{ fontSize: '1rem', fontWeight: 700, color: lit ? '#fff' : ORANGE, lineHeight: 1 }}>₹</span>
        ) : (
          <stat.icon size={20} color={lit ? '#fff' : ORANGE} strokeWidth={1.8} />
        )}
      </div>

      <div>
        <div style={{ fontSize: '0.92rem', fontWeight: 500, color: '#111', fontFamily: FONT, lineHeight: 1.25 }}>
          {stat.label}
        </div>
        <div style={{ fontSize: '0.78rem', color: '#999', fontFamily: FONT, fontWeight: 400, marginTop: 3 }}>
          {stat.sub}
        </div>
      </div>
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────
export default function WhyChooseUs() {
  const navigate = useNavigate();
  const [activeStatIndex, setActiveStatIndex] = useState(null);

  const handleStatClick = (i) => {
    setActiveStatIndex(prev => prev === i ? null : i);
  };

  return (
    <section style={{ background: BG, padding: '48px 0 56px', fontFamily: FONT }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px' }}>

        {/* ── Hero Row ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center', marginBottom: 60 }}>

          {/* Left */}
          <div>
            {/* Trust pill */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: '#fff', border: '1px solid #EDE0D8',
              borderRadius: 30, padding: '6px 14px',
              fontSize: '0.76rem', fontWeight: 500, color: '#444',
              marginBottom: 24, boxShadow: '0 1px 6px rgba(0,0,0,0.05)',
            }}>
              <ShieldCheck size={14} color={ORANGE} />
              Trusted by 1000+ customers
            </div>

            <h2 style={{
              fontSize: 'clamp(30px, 3.8vw, 46px)',
              fontWeight: 600, color: '#111',
              margin: '0 0 18px', lineHeight: 1.1,
              letterSpacing: '-0.03em', fontFamily: FONT,
            }}>
              The Smarter Way{' '}
              <span style={{ color: ORANGE, fontWeight: 600 }}>to Buy</span>
              <br />
              <span style={{ color: ORANGE, fontWeight: 600 }}>or Sell</span>
            </h2>

            <p style={{ color: '#777', fontSize: '0.93rem', lineHeight: 1.75, fontWeight: 400, marginBottom: 36, maxWidth: 420 }}>
              Trusted by 1000+ customers across India.<br />
              We make every car transaction simple, safe and smart.
            </p>

            <div style={{ display: 'flex', gap: 14 }}>
              <button
                onClick={() => navigate('/cars')}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: ORANGE, color: '#fff',
                  border: 'none', borderRadius: 10,
                  padding: '13px 26px', fontSize: '0.9rem', fontWeight: 500,
                  cursor: 'pointer', fontFamily: FONT,
                  boxShadow: '0 4px 16px rgba(232,99,26,0.28)',
                  transition: 'transform 0.15s, box-shadow 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(232,99,26,0.36)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(232,99,26,0.28)'; }}
              >
                Browse Cars <ArrowRight size={16} />
              </button>

              <button
                onClick={() => navigate('/contact')}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: 'transparent', color: ORANGE,
                  border: `1.5px solid ${ORANGE}`, borderRadius: 10,
                  padding: '13px 26px', fontSize: '0.9rem', fontWeight: 500,
                  cursor: 'pointer', fontFamily: FONT,
                  transition: 'background 0.15s, color 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = ORANGE; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = ORANGE; }}
              >
                Sell Your Car <Car size={16} />
              </button>
            </div>
          </div>

          {/* Right — Car */}
          <div style={{ position: 'relative', borderRadius: 24, overflow: 'hidden', background: 'linear-gradient(145deg, #f0ece8 0%, #e8e2dc 100%)', minHeight: 340 }}>

            {/* Dot pattern top-right */}
            <svg style={{ position: 'absolute', top: 16, right: 16, opacity: 0.55, zIndex: 1, pointerEvents: 'none' }} width="90" height="90">
              <defs>
                <pattern id="dp" width="13" height="13" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1.5" fill={ORANGE} fillOpacity="0.28" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#dp)" />
            </svg>

            {/* Bottom glow */}
            <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '85%', height: '55%', background: 'radial-gradient(ellipse, rgba(232,99,26,0.15) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 1 }} />

            {/* Side gradient fade */}
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '18%', background: 'linear-gradient(to right, rgba(232,226,220,0.9), transparent)', zIndex: 2, pointerEvents: 'none' }} />

            {/* Car image */}
            <img
              src={whyChooseUsCar}
              alt="Featured Car"
              style={{ width: '105%', marginLeft: '-2%', height: 'auto', display: 'block', objectFit: 'contain', position: 'relative', zIndex: 2, filter: 'drop-shadow(0 16px 36px rgba(0,0,0,0.18))' }}
            />

            {/* Floating top-left label */}
            <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 4, background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)', borderRadius: 10, padding: '8px 14px', border: '1px solid rgba(232,99,26,0.15)', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
              <div style={{ fontSize: '0.65rem', color: '#999', fontWeight: 400, fontFamily: FONT, lineHeight: 1 }}>Featured</div>
              <div style={{ fontSize: '0.8rem', color: '#111', fontWeight: 600, fontFamily: FONT, lineHeight: 1.4 }}>Premium Cars</div>
            </div>

            {/* Floating bottom-right km badge */}
            <div style={{ position: 'absolute', bottom: 20, right: 20, zIndex: 4, background: ORANGE, borderRadius: 10, padding: '8px 14px', boxShadow: '0 4px 14px rgba(232,99,26,0.35)' }}>
              <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.8)', fontWeight: 400, fontFamily: FONT, lineHeight: 1 }}>Starting from</div>
              <div style={{ fontSize: '0.82rem', color: '#fff', fontWeight: 600, fontFamily: FONT, lineHeight: 1.4 }}>₹3.5 Lakh</div>
            </div>

          </div>
        </div>

        {/* ── Cards ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18, marginBottom: 20 }}>
          {CARDS.map((c, i) => <Card key={i} icon={c.icon} title={c.title} desc={c.desc} />)}
        </div>

        {/* ── Stats bar ── */}
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #EDE5DE', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', overflow: 'hidden', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
          {STATS.map((s, i) => (
            <StatItem
              key={i}
              stat={s}
              active={activeStatIndex === i}
              onClick={() => handleStatClick(i)}
              isLast={i === STATS.length - 1}
            />
          ))}
        </div>

      </div>
    </section>
  );
}