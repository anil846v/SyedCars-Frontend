import React, { useState } from 'react';
import { Star, Quote } from 'lucide-react';

const ORANGE = '#E8631A';

const TESTIMONIALS = [
  {
    id: 1,
    text: "Bought my BMW 5 Series through Syed Cars and the entire process was seamless. Full documentation, transparent pricing, zero hassle. I couldn't have asked for a better experience.",
    name: "Ravi Kumar",
    role: "Business Owner, Madanapalle",
    avatar: "RK",
    rating: 5,
    car: "BMW 5 Series",
  },
  {
    id: 2,
    text: "Sold my Mercedes through them in less than a week. Fair commission, great exposure, and they handled every bit of paperwork professionally. Will definitely return.",
    name: "Fatima Begum",
    role: "Teacher, Chittoor",
    avatar: "FB",
    rating: 5,
    car: "Mercedes E-Class",
  },
  {
    id: 3,
    text: "The team was honest about the car's condition and history. Exactly what you want when buying a pre-owned luxury vehicle. Transparent and trustworthy from start to finish.",
    name: "Suresh Reddy",
    role: "Software Engineer, Bangalore",
    avatar: "SR",
    rating: 5,
    car: "Audi A6",
  },
  {
    id: 4,
    text: "I was nervous about buying a used car but Syed Cars made the whole thing feel safe. They showed me every document, arranged a test drive, and the price was fair. Highly recommend.",
    name: "Priya Nair",
    role: "Doctor, Hyderabad",
    avatar: "PN",
    rating: 5,
    car: "Honda City",
  },
  {
    id: 5,
    text: "Listed my car with Syed Cars and got a buyer within 4 days. The process was smooth, the team was responsive, and I got the best price without any haggling. Outstanding service.",
    name: "Mohammed Saleem",
    role: "Entrepreneur, Tirupati",
    avatar: "MS",
    rating: 5,
    car: "Toyota Fortuner",
  },
];

function TestimonialCard({ t, index }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? '#FFF8F5' : '#fff',
        border: hovered ? `1.5px solid ${ORANGE}` : '1.5px solid #EDE0D4',
        borderRadius: 16,
        padding: '28px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        position: 'relative',
        overflow: 'hidden',
        boxShadow: hovered
          ? '0 16px 40px rgba(232,99,26,0.10)'
          : '0 2px 12px rgba(0,0,0,0.04)',
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
        transition: 'all 0.3s ease',
        cursor: 'default',
        animationDelay: `${index * 0.1}s`,
      }}
    >
      {/* Background quote watermark */}
      <div style={{
        position: 'absolute',
        top: 16,
        right: 16,
        opacity: hovered ? 0.08 : 0.04,
        transition: 'opacity 0.3s ease',
        pointerEvents: 'none',
      }}>
        <Quote style={{ width: 64, height: 64, color: ORANGE }} />
      </div>

      {/* Top: Stars + Car tag */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 3 }}>
          {[...Array(t.rating)].map((_, idx) => (
            <Star
              key={idx}
              style={{
                width: 14,
                height: 14,
                fill: ORANGE,
                stroke: ORANGE,
                strokeWidth: 1.5,
                transform: hovered ? 'scale(1.15)' : 'scale(1)',
                transition: `transform 0.2s ease ${idx * 0.04}s`,
              }}
            />
          ))}
        </div>
        <span style={{
          fontSize: '0.68rem',
          fontWeight: 700,
          color: ORANGE,
          background: '#FFF2EC',
          border: `1px solid #F0D0BA`,
          borderRadius: 20,
          padding: '3px 10px',
          fontFamily: "'Inter', monospace",
          letterSpacing: '0.03em',
        }}>
          {t.car}
        </span>
      </div>

      {/* Quote text */}
      <p style={{
        fontSize: '0.9rem',
        fontStyle: 'italic',
        fontWeight: 400,
        color: hovered ? '#3A2A1A' : '#555',
        lineHeight: 1.8,
        margin: 0,
        flex: 1,
        fontFamily: "'Inter', sans-serif",
        transition: 'color 0.3s ease',
      }}>
        "{t.text}"
      </p>

      {/* Animated accent line */}
      <div style={{ position: 'relative', height: 2, background: '#EDE0D4', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: 0, left: 0,
          height: '100%',
          width: hovered ? '100%' : '32px',
          background: ORANGE,
          borderRadius: 2,
          transition: 'width 0.4s ease',
        }} />
      </div>

      {/* Avatar + name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 42,
          height: 42,
          borderRadius: '50%',
          background: hovered ? '#FFE8D6' : '#FFF2EC',
          border: `2px solid ${hovered ? ORANGE : '#FADFC8'}`,
          color: ORANGE,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '12px',
          fontWeight: 700,
          fontFamily: 'monospace',
          flexShrink: 0,
          transform: hovered ? 'scale(1.08)' : 'scale(1)',
          transition: 'all 0.25s ease',
          boxShadow: hovered ? `0 4px 12px rgba(232,99,26,0.2)` : 'none',
        }}>
          {t.avatar}
        </div>
        <div>
          <p style={{
            margin: 0,
            fontSize: '0.88rem',
            fontWeight: 700,
            color: '#1A1209',
            fontFamily: "'Inter', sans-serif",
          }}>
            {t.name}
          </p>
          <p style={{
            margin: 0,
            fontSize: '0.72rem',
            color: '#888',
            fontFamily: 'monospace',
            marginTop: 2,
            letterSpacing: '0.02em',
          }}>
            {t.role}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  return (
    <section
      style={{
        background: '#ffffff',
        padding: '88px 60px',
        fontFamily: "'Inter', sans-serif",
        position: 'relative',
        overflow: 'hidden',
        borderTop: '1px solid #EDE0D4',
      }}
    >
      <style>{`
        @keyframes testiFadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .testi-header { animation: testiFadeUp 0.6s ease both; }
        .testi-card-0 { animation: testiFadeUp 0.5s ease 0.1s both; }
        .testi-card-1 { animation: testiFadeUp 0.5s ease 0.2s both; }
        .testi-card-2 { animation: testiFadeUp 0.5s ease 0.3s both; }
        .testi-card-3 { animation: testiFadeUp 0.5s ease 0.15s both; }
        .testi-card-4 { animation: testiFadeUp 0.5s ease 0.25s both; }
      `}</style>

      {/* Subtle background glow */}
      <div style={{
        position: 'absolute',
        bottom: '5%',
        left: '5%',
        width: 300,
        height: 300,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(232,99,26,0.04) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* ── Header ── */}
        <div className="testi-header" style={{ marginBottom: 52 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontSize: '0.72rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: ORANGE,
            fontWeight: 700,
            marginBottom: 16,
          }}>
            <span>Customer Stories</span>
            <span style={{ display: 'inline-block', width: 36, height: 2, background: ORANGE }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <h2 style={{
                fontSize: '2.6rem',
                fontWeight: 800,
                color: '#1A1209',
                margin: '0 0 12px',
                lineHeight: 1.1,
                fontFamily: "'Inter', sans-serif",
              }}>
                What Our Clients{' '}
                <span style={{ fontWeight: 400, color: ORANGE }}>Say</span>
              </h2>
              <p style={{
                margin: 0,
                color: '#6B6055',
                fontSize: '0.95rem',
                lineHeight: 1.7,
                maxWidth: 440,
                fontFamily: "'Inter', sans-serif",
              }}>
                Real stories from buyers and sellers who experienced
                the Syed Cars difference first-hand.
              </p>
            </div>

            {/* Aggregate rating pill */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              background: '#fff',
              border: '1.5px solid #EDE0D4',
              borderRadius: 12,
              padding: '14px 20px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
              flexShrink: 0,
            }}>
              <div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1A1209', lineHeight: 1 }}>4.9</div>
                <div style={{ fontSize: '0.7rem', color: '#888', marginTop: 3, fontFamily: 'monospace' }}>out of 5.0</div>
              </div>
              <div>
                <div style={{ display: 'flex', gap: 2, marginBottom: 4 }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} style={{ width: 14, height: 14, fill: ORANGE, stroke: ORANGE, strokeWidth: 1.5 }} />
                  ))}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#888', fontFamily: 'monospace' }}>1000+ reviews</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Cards — Row 1: 3 cards ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 20,
          marginBottom: 20,
        }}>
          {TESTIMONIALS.slice(0, 3).map((t, i) => (
            <div key={t.id} className={`testi-card-${i}`}>
              <TestimonialCard t={t} index={i} />
            </div>
          ))}
        </div>

        {/* ── Cards — Row 2: 2 cards centered ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 20,
          maxWidth: 820,
          margin: '0 auto',
        }}>
          {TESTIMONIALS.slice(3, 5).map((t, i) => (
            <div key={t.id} className={`testi-card-${i + 3}`}>
              <TestimonialCard t={t} index={i + 3} />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}