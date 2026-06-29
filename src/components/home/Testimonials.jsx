import React, { useState } from 'react';
import { Star, Quote, ShieldCheck } from 'lucide-react';

const ORANGE = '#E8631A';
const LIME = '#C8D900';
const GOLD = '#F8D800';

const TESTIMONIALS = [
  {
    id: 1,
    text: "Bought my BMW 5 Series through Syed Cars and the entire process was seamless. Full documentation, transparent pricing, zero hassle. I couldn't have asked for a better experience.",
    name: "Ravi Kumar",
    role: "Business Owner, Madanapalle",
    initials: "RK",
    rating: 5,
    car: "BMW 5 Series",
    badge: "Verified Buyer",
  },
  {
    id: 2,
    text: "Sold my Mercedes through them in less than a week. Fair commission, great exposure, and they handled every bit of paperwork professionally. Will definitely return.",
    name: "Fatima Begum",
    role: "Teacher, Chittoor",
    initials: "FB",
    rating: 5,
    car: "Mercedes E-Class",
    badge: "Verified Seller",
  },
  {
    id: 3,
    text: "The team was honest about the car's condition and history. Exactly what you want when buying a pre-owned luxury vehicle. Transparent and trustworthy from start to finish.",
    name: "Suresh Reddy",
    role: "Software Engineer, Bangalore",
    initials: "SR",
    rating: 5,
    car: "Audi A6",
    badge: "Verified Buyer",
  },
  {
    id: 4,
    text: "I was nervous about buying a used car but Syed Cars made the whole thing feel safe. They showed me every document, arranged a test drive, and the price was fair. Highly recommend.",
    name: "Priya Nair",
    role: "Doctor, Hyderabad",
    initials: "PN",
    rating: 5,
    car: "Honda City",
    badge: "Verified Buyer",
  },
  {
    id: 5,
    text: "Listed my car with Syed Cars and got a buyer within 4 days. The process was smooth, the team was supportive and I got a fair price. Highly recommended!",
    name: "Vikram Singh",
    role: "Business Owner, Vijayawada",
    initials: "VS",
    rating: 5,
    car: "Toyota Fortuner",
    badge: "Verified Seller",
  },
];

function TestimonialCard({ t }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#ffffff',
        border: hovered ? `1.5px solid ${ORANGE}` : '1.5px solid #EDE0D4',
        borderRadius: 16,
        padding: '24px 22px',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        position: 'relative',
        overflow: 'hidden',
        boxShadow: hovered ? '0 16px 40px rgba(232,99,26,0.10)' : '0 2px 12px rgba(0,0,0,0.04)',
        transform: hovered ? 'translateY(-5px)' : 'translateY(0)',
        transition: 'all 0.3s ease',
        cursor: 'default',
        height: '100%',
        boxSizing: 'border-box',
      }}
    >
      {/* Watermark quote */}
      <div style={{
        position: 'absolute', top: 14, right: 14,
        opacity: hovered ? 0.09 : 0.05,
        transition: 'opacity 0.3s ease',
        pointerEvents: 'none',
      }}>
        <Quote style={{ width: 58, height: 58, color: ORANGE }} />
      </div>

      {/* Stars + Car tag */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 3 }}>
          {[...Array(t.rating)].map((_, idx) => (
            <Star key={idx} style={{
              width: 15, height: 15,
              fill: GOLD, stroke: GOLD, strokeWidth: 1.5,
              transform: hovered ? 'scale(1.15)' : 'scale(1)',
              transition: `transform 0.2s ease ${idx * 0.04}s`,
            }} />
          ))}
        </div>
        <span style={{
          fontSize: '0.68rem', fontWeight: 700, color: ORANGE,
          background: '#FFF2EC', border: '1px solid #F0D0BA',
          borderRadius: 20, padding: '3px 10px',
        }}>
          {t.car}
        </span>
      </div>

      {/* Quote */}
      <p style={{
        fontSize: '0.875rem', fontStyle: 'italic',
        color: hovered ? '#2A1A0A' : '#080808',
        lineHeight: 1.8, margin: 0, flex: 1,
        transition: 'color 0.3s ease',
      }}>
        "{t.text}"
      </p>

      {/* Accent line */}
      <div style={{ position: 'relative', height: 2, background: '#EDE0D4', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, height: '100%',
          width: hovered ? '100%' : '32px',
          background: ORANGE, borderRadius: 2,
          transition: 'width 0.4s ease',
        }} />
      </div>

      {/* Initials avatar + name + badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 44, height: 44, borderRadius: '50%',
          background: '#FFF2EC',
          border: `2px solid ${hovered ? ORANGE : '#FADFC8'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '13px', fontWeight: 700, color: ORANGE,
          flexShrink: 0,
          transform: hovered ? 'scale(1.06)' : 'scale(1)',
          transition: 'all 0.25s ease',
        }}>
          {t.initials}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap' }}>
            <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, color: '#1A1209' }}>
              {t.name}
            </p>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              fontSize: '0.67rem', fontWeight: 600, color: ORANGE,
              background: '#FFF2EC', border: '1px solid #F0D0BA',
              borderRadius: 20, padding: '2px 8px',
            }}>
              <ShieldCheck style={{ width: 10, height: 10, strokeWidth: 2.5 }} />
              {t.badge}
            </span>
          </div>
          <p style={{ margin: '3px 0 0', fontSize: '0.74rem', color: '#0b0b0b' }}>
            {t.role}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  return (
    <section style={{
      position: 'relative',
      padding: '80px 60px',
      fontFamily: "'Inter', sans-serif",
      overflow: 'hidden',
      borderTop: '1px solid #EDE0D4',
    }}>

      {/* ── LIME BACKGROUND — hero-matching diagonal stripes ── */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden' }}>
        {/* Base: very light lime tint so it reads as lime, not white */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(160deg, #F5F9D0 0%, #EDEFD8 50%, #F8F8F2 100%)`,
        }} />
        {/* Primary diagonal stripe — same angle & style as hero */}
        <div style={{
          position: 'absolute',
          width: '120%', height: 260,
          background: `linear-gradient(120deg, ${LIME} 0%, #D8EB00 100%)`,
          transform: 'rotate(-28deg)',
          top: '-8%', right: '-20%',
          opacity: 0.28,
        }} />
        {/* Secondary thinner stripe */}
        <div style={{
          position: 'absolute',
          width: '120%', height: 90,
          background: `linear-gradient(120deg, ${LIME} 0%, #D8EB00 100%)`,
          transform: 'rotate(-28deg)',
          top: '52%', right: '-20%',
          opacity: 0.16,
        }} />
        {/* Soft sky tint to break monotony, matching hero */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, rgba(160,195,240,0.07) 0%, transparent 50%)',
        }} />
      </div>

      <style>{`
        @keyframes testiFadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .testi-header { animation: testiFadeUp 0.6s ease both; }
        .testi-card-0 { animation: testiFadeUp 0.5s ease 0.10s both; }
        .testi-card-1 { animation: testiFadeUp 0.5s ease 0.20s both; }
        .testi-card-2 { animation: testiFadeUp 0.5s ease 0.30s both; }
        .testi-card-3 { animation: testiFadeUp 0.5s ease 0.15s both; }
        .testi-card-4 { animation: testiFadeUp 0.5s ease 0.25s both; }

        .testi-grid-row1 {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-bottom: 20px;
        }
        .testi-grid-row2 {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          max-width: 820px;
          margin: 0 auto;
        }

        @media (max-width: 900px) {
          .testi-grid-row1 {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 600px) {
          .testi-section {
            padding: 52px 18px !important;
          }
          .testi-grid-row1,
          .testi-grid-row2 {
            grid-template-columns: 1fr !important;
            max-width: 100% !important;
          }
          .testi-header-row {
            flex-direction: column !important;
            align-items: flex-start !important;
          }
          .testi-rating-pill {
            width: 100% !important;
          }
          .testi-heading {
            font-size: 1.8rem !important;
          }
        }
      `}</style>

      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* ── Header ── */}
        <div className="testi-header" style={{ marginBottom: 52 }}>

          {/* Eyebrow */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            fontSize: '0.72rem', letterSpacing: '0.2em',
            textTransform: 'uppercase', color: ORANGE,
            fontWeight: 700, marginBottom: 16,
          }}>
            <span>Customer Stories</span>
            <span style={{ display: 'inline-block', width: 36, height: 2, background: ORANGE }} />
          </div>

          <div className="testi-header-row" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>

            {/* Heading + sub */}
            <div>
              <h2 className="testi-heading" style={{
                fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 600,
                color: '#1A1209', margin: '0 0 14px', lineHeight: 1.1,
              }}>
                What Our <span style={{ color: ORANGE }}>Clients</span> Say
              </h2>
              <p style={{ margin: 0, color: '#060606', fontSize: '0.95rem', lineHeight: 1.7, maxWidth: 440 }}>
                Real stories from buyers and sellers who experienced the Syed Cars difference first-hand.
              </p>
            </div>

            {/* Rating pill */}
            <div className="testi-rating-pill" style={{
              display: 'flex', alignItems: 'stretch',
              background: '#fff',
              border: '1.5px solid #EDE0D4',
              borderRadius: 16, overflow: 'hidden',
              boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
              flexShrink: 0,
            }}>
              <div style={{ padding: '18px 22px', borderRight: '1.5px solid #EDE0D4', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ fontSize: '2.2rem', fontWeight: 600, color: '#1A1209', lineHeight: 1 }}>4.9</div>
                <div style={{ fontSize: '0.72rem', color: '#121111', marginTop: 4 }}>out of 5.0</div>
              </div>
              <div style={{ padding: '18px 22px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ display: 'flex', gap: 3, marginBottom: 5 }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} style={{ width: 15, height: 15, fill: ORANGE, stroke: ORANGE, strokeWidth: 1.5 }} />
                  ))}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#121111', marginBottom: 6 }}>1000+ reviews</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.72rem', color: '#0c0c0c' }}>
                  <ShieldCheck style={{ width: 13, height: 13, color: ORANGE, strokeWidth: 2.5 }} />
                  Rated by real customers
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Row 1: 3 cards ── */}
        <div className="testi-grid-row1">
          {TESTIMONIALS.slice(0, 3).map((t, i) => (
            <div key={t.id} className={`testi-card-${i}`} style={{ display: 'flex' }}>
              <TestimonialCard t={t} />
            </div>
          ))}
        </div>

        {/* ── Row 2: 2 cards centered ── */}
        <div className="testi-grid-row2">
          {TESTIMONIALS.slice(3, 5).map((t, i) => (
            <div key={t.id} className={`testi-card-${i + 3}`} style={{ display: 'flex' }}>
              <TestimonialCard t={t} />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}