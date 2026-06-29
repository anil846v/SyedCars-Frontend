import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck, BadgePercent, Star, Trophy,
  Search, RotateCcw, Car, Fuel, Settings2, Calendar,
  IndianRupee, CheckCircle2, ArrowRight,
} from 'lucide-react';
import heroCar from '../../assets/hero.png';

const ORANGE = '#FF5A09';
const LIME   = '#C8D900';

const STATS = [
  { icon: ShieldCheck,  value: '500+', label: 'Verified Cars',       iconColor: '#22C55E' },
  { icon: BadgePercent, value: '100%', label: 'Transparent',         iconColor: '#FF5A09' },
  { icon: Star,         value: '4.9★', label: 'Customer Rating',     iconColor: '#F59E0B' },
  { icon: Trophy,       value: '#1',   label: 'In Madanapalle',      iconColor: '#FF5A09' },
];
const TRUST = [
  { icon: ShieldCheck,   label: 'Verified & Inspected', sub: 'Multi-point quality check' },
  { icon: ShieldCheck,   label: 'Insurance Active',     sub: 'Complete peace of mind' },
  { icon: BadgePercent,  label: 'Best Price Promise',   sub: 'Market competitive pricing' },
  { icon: CheckCircle2,  label: 'Easy & Secure',        sub: 'Hassle-free buying experience' },
];

const FUEL_TYPES  = ['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid'];
const TRANS_TYPES = ['Manual', 'Automatic', 'AMT', 'CVT', 'DCT'];
const fieldInput = {
  width: '100%',
  background: '#fff',
  border: '1.5px solid #E5E7EB',
  borderRadius: 5,
  padding: '10px 14px',
  fontSize: '0.9rem',
  color: '#111',
  outline: 'none',
  transition: 'all 0.2s ease',
  fontFamily: "'DM Sans', sans-serif",
};
const fieldSelect = {
  width: '100%',
  background: '#fff',
  border: '1.5px solid #E5E7EB',
  borderRadius: 5,
  padding: '10px 14px',
  fontSize: '0.9rem',
  color: '#111',
  outline: 'none',
  appearance: 'none',
  cursor: 'pointer',
  fontFamily: "'DM Sans', sans-serif",
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23FF5A09' stroke-width='2.5'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'calc(100% - 12px) center',
  transition: 'all 0.2s ease',
};

function SearchField({ icon, label, children, bordered }) {
  return (
    <div style={{
      padding: '14px 18px',
      background: '#fff',
      borderLeft: bordered ? '1px solid #E5E7EB' : 'none',
      display: 'flex', flexDirection: 'column', justifyContent: 'center',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
        {icon}
        <span style={{
          fontSize: '0.6rem', fontFamily: "'DM Sans', 'Inter', sans-serif",
          textTransform: 'uppercase', letterSpacing: '0.1em',
          color: '#0f0f10', fontWeight: 700,
        }}>{label}</span>
      </div>
      {children}
    </div>
  );
}

export default function Hero() {
  const navigate = useNavigate();
  const [f, setF] = useState({ brand: '', fuel_type: '', transmission: '', year: '', min_price: '', max_price: '' });

  const upd = (k, v) => setF(p => ({ ...p, [k]: v }));

  const handleSearch = () => {
    const params = new URLSearchParams();
    Object.entries(f).forEach(([k, v]) => { if (v) params.append(k, v); });
    navigate(`/cars?${params.toString()}`);
  };

  const handleReset = () => {
    setF({ brand: '', fuel_type: '', transmission: '', year: '', min_price: '', max_price: '' });
    navigate('/cars');
  };

  return (
    <section style={{ background: 'linear-gradient(160deg, #F0F2F6 0%, #EAECF0 100%)', position: 'relative' }}>

      {/* ── MAIN CONTENT ── */}
      <div className="container hero-container" style={{ paddingTop: 70, paddingBottom: 32 }}>
        <div className="hero-grid">

          {/* LEFT COLUMN */}
          <div style={{ animation: 'fadeUp 0.6s ease both' }}>

            {/* Green badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: '#DCFCE7', border: '1px solid #86EFAC',
              borderRadius: 30, padding: '6px 14px', marginBottom: 26,
            }}>
              <CheckCircle2 size={14} color="#22C55E" />
              <span style={{
                fontSize: '0.63rem', fontFamily: "'DM Sans', 'Inter', sans-serif",
                textTransform: 'uppercase', letterSpacing: '0.1em',
                color: '#15803D', fontWeight: 700,
              }}>
                Madanapalle's Premier Pre-Owned Auto Marketplace
              </span>
            </div>

            {/* H1 */}
            <h1 style={{
              fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
              fontWeight: 600,
              color: '#1a1a1a',
              lineHeight: 1.08,
              marginBottom: 20,
            }}>
              Drive Your Dream,<br />
              <span style={{ color: ORANGE, fontStyle: 'inherit' }}>Own </span>
              <span style={{ color: ORANGE, fontStyle: 'inherit' }}>It </span>
              <span style={{ color: ORANGE }}>Today.</span>
            </h1>

            {/* Description */}
            <p style={{ fontSize: '1rem', color: '#060607', lineHeight: 1.75, maxWidth: 480, marginBottom: 32 }}>
              Premium collection of verified, insurance-active luxury automobiles.
              Transparent pricing. 100% verified. Documentation guaranteed.
            </p>

            {/* CTA Buttons */}
            <div style={{ display: 'flex', gap: 14, marginBottom: 36, flexWrap: 'wrap' }}>
              <button onClick={() => navigate('/cars')} style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                padding: '12px 20px 12px 22px',
                background: ORANGE, color: '#fff',
                border: 'none', borderRadius: 10, fontWeight: 600, fontSize: '0.9rem',
                cursor: 'pointer', transition: 'all 0.2s',
                boxShadow: '0 6px 24px rgba(255,90,9,0.4)',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 32px rgba(255,90,9,0.5)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 6px 24px rgba(255,90,9,0.4)'; }}
              >
                <Search size={15} />
                Browse All Cars
                <span style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.22)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}><ArrowRight size={14} /></span>
              </button>

              <button onClick={() => navigate('/sell-your-car')} style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                padding: '12px 20px 12px 22px',
                background: '#fff', color: '#0D0D0D',
                border: '1.5px solid #E5E7EB', borderRadius: 10, fontWeight: 600, fontSize: '0.9rem',
                cursor: 'pointer', transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = LIME; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#E5E7EB'; }}
              >
                Sell Your Car
                <span style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: 'rgba(200,217,0,0.18)', border: `1.5px solid ${LIME}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}><ArrowRight size={14} color="#5A6200" /></span>
              </button>
            </div>

            {/* Stats row */}
           {/* Compact Stats Row - Matching About Page + Screenshot */}
{/* <div style={{ 
  display: 'grid', 
  gridTemplateColumns: 'repeat(4, 1fr)', 
  gap: 8,
  background: '#fff',
  borderRadius: 12,
  padding: '16px 12px',
  border: '1px solid #E5E7EB',
  boxShadow: '0 2px 12px rgba(0,0,0,0.04)'
}}>
  {STATS.map(({ icon: Icon, value, label, iconColor }, i) => (
    <div key={i} style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      gap: 6,
    }}>
      <div style={{
        width: 38, 
        height: 38, 
        borderRadius: '50%', 
        background: i === 0 ? '#DCFCE7' : i === 1 ? '#FFF2EC' : i === 2 ? '#FEFCE8' : '#FFF2EC',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        border: `2px solid ${iconColor}20`
      }}>
        <Icon size={18} color={iconColor} />
      </div>
      <div style={{ 
        fontSize: '1.35rem', 
        fontWeight: 700, 
        color: '#0D0D0D', 
        lineHeight: 1,
        fontFamily: "'Poppins', sans-serif"
      }}>
        {value}
      </div>
      <div style={{ 
        fontSize: '0.68rem', 
        fontFamily: "'DM Sans', 'Inter', sans-serif", 
        textTransform: 'uppercase', 
        letterSpacing: '0.08em', 
        color: '#6B7280',
        lineHeight: 1.2,
        textAlign: 'center'
      }}>
        {label}
      </div>
    </div>
  ))}
</div> */}
          </div>

          {/* RIGHT COLUMN — Car + decorations */}
          <div style={{ position: 'relative', minHeight: 440, animation: 'fadeUp 0.7s 0.15s ease both' }}>

            {/* Lime diagonal stripes */}
            <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: 24 }}>
              <div style={{
                position: 'absolute', width: '170%', height: 270,
                background: `linear-gradient(120deg, ${LIME} 0%, #D8EB00 100%)`,
                transform: 'rotate(-28deg)', top: '5%', left: '-35%', opacity: 0.92,
              }} />
              <div style={{
                position: 'absolute', width: '170%', height: 90,
                background: `linear-gradient(120deg, ${LIME} 0%, #D8EB00 100%)`,
                transform: 'rotate(-28deg)', top: '48%', left: '-35%', opacity: 0.42,
              }} />
            </div>

            {/* Sky gradient (city background effect) */}
            <div style={{
              position: 'absolute', inset: 0, zIndex: 1, borderRadius: 24,
              background: 'linear-gradient(180deg, rgba(160,195,240,0.22) 0%, transparent 60%)',
            }} />

            {/* Orange dot matrix — top right */}
            <div style={{ position: 'absolute', top: 14, right: 14, zIndex: 3, display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 5 }}>
              {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: ORANGE, opacity: 0.3 }} />
              ))}
            </div>

            {/* Car image */}
            <img
              src={heroCar}
              alt="Premium Car"
              style={{
                position: 'relative', zIndex: 2, width: '100%',
                maxHeight: 400, objectFit: 'contain',
                filter: 'drop-shadow(0 28px 64px rgba(0,0,0,0.18))',
                marginTop: 24,
              }}
            />

            {/* Glass verification card */}
            <div style={{
              position: 'absolute', bottom: 28, right: 12, zIndex: 4,
              background: 'rgba(8,8,16,0.80)',
              backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.13)',
              borderRadius: 14, padding: '1px 18px', minWidth: 215,
            }}>
              {[
                { icon: ShieldCheck,  text: '100% Verified Cars' },
                { icon: CheckCircle2, text: 'Full Documentation Guaranteed' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#fff', fontSize: '0.78rem', fontWeight: 500, padding: '4px 0' }}>
                  <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(34,197,94,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={12} color="#4ADE80" />
                  </div>
                  {text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── SEARCH BAR (inside hero) ── */}
        <div style={{ marginTop: 10 }}>
          {/* Label */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(255,90,9,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Search size={12} color={ORANGE} />
            </div>
            <span style={{ fontSize: '0.68rem', fontFamily: "'DM Sans', 'Inter', sans-serif", textTransform: 'uppercase', letterSpacing: '0.14em', color: '#111', fontWeight: 700 }}>
              Find Your <span style={{ color: ORANGE }}>Perfect Car</span>
            </span>
          </div>

          {/* Search fields row */}
          <div className="search-bar-grid" style={{
            border: '1px solid #E5E7EB', borderRadius: 12, overflow: 'hidden',
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1fr 1.6fr auto',
            boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
          }}>
            <SearchField icon={<Car size={13} color={ORANGE} />} label="Make / Model">
              <input value={f.brand} onChange={e => upd('brand', e.target.value)} placeholder="e.g. BMW, Audi, Toyota" style={fieldInput} />
            </SearchField>

            <SearchField icon={<Fuel size={13} color={ORANGE} />} label="Fuel Type" bordered>
              <select value={f.fuel_type} onChange={e => upd('fuel_type', e.target.value)} style={fieldSelect}>
                <option value="">Any Fuel</option>
                {FUEL_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </SearchField>

            <SearchField icon={<Settings2 size={13} color={ORANGE} />} label="Transmission" bordered>
              <select value={f.transmission} onChange={e => upd('transmission', e.target.value)} style={fieldSelect}>
                <option value="">Any Gear</option>
                {TRANS_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </SearchField>

            <SearchField icon={<Calendar size={13} color={ORANGE} />} label="Year" bordered>
              <input type="number" value={f.year} onChange={e => upd('year', e.target.value)} placeholder="e.g. 2021" min="1990" max="2026" style={fieldInput} />
            </SearchField>

            <SearchField icon={<IndianRupee size={13} color={ORANGE} />} label="Budget (₹)" bordered>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ fontSize: '0.8rem', color: '#090a0a', flexShrink: 0 }}>₹</span>
                  <input type="number" value={f.min_price} onChange={e => upd('min_price', e.target.value)} placeholder="Min" style={{ ...fieldInput }} />
                </div>
                <span style={{ color: '#0c0c0c', fontSize: '0.8rem' }}>–</span>
                <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ fontSize: '0.8rem', color: '#101111', flexShrink: 0 }}>₹</span>
                  <input type="number" value={f.max_price} onChange={e => upd('max_price', e.target.value)} placeholder="Max" style={{ ...fieldInput }} />
                </div>
              </div>
            </SearchField>

            {/* Action buttons */}
            <div style={{
              padding: '14px 16px', background: '#FAFAFA',
              borderLeft: '1px solid #E5E7EB',
              display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 6,
            }}>
              <button onClick={handleSearch} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '10px 18px', background: ORANGE, color: '#fff',
                border: 'none', borderRadius: 8, fontWeight: 600, fontSize: '0.85rem',
                cursor: 'pointer', whiteSpace: 'nowrap',
                boxShadow: '0 4px 14px rgba(255,90,9,0.4)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
              onMouseLeave={e => e.currentTarget.style.transform = ''}
              >
                <Search size={13} /> Search Cars
              </button>
              <button onClick={handleReset} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                padding: '7px 12px', background: 'transparent', color: '#6B7280',
                border: 'none', borderRadius: 8, fontWeight: 500, fontSize: '0.78rem',
                cursor: 'pointer',
              }}>
                <RotateCcw size={11} /> Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── TRUST BADGES ── */}
      {/* <div style={{ background: '#fff', borderBottom: '1px solid #E5E7EB' }}>
        <div className="container trust-grid" style={{ padding: '0 clamp(1rem,4vw,4rem)' }}>
          {TRUST.map(({ icon: Icon, label, sub }, i) => (
            <div key={label} style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '18px 20px',
              borderLeft: i > 0 ? '1px solid #E5E7EB' : 'none',
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
                border: `2px solid ${LIME}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon size={20} color={LIME} />
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#0D0D0D' }}>{label}</div>
                <div style={{ fontSize: '0.74rem', color: '#6B7280', marginTop: 2 }}>{sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div> */}

      <style>{`
        .hero-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 36px;
          align-items: center;
        }
        .trust-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
        }
        .search-bar-grid input:focus,
        .search-bar-grid select:focus {
          border-bottom-color: #FF5A09 !important;
          outline: none;
        }
        .search-bar-grid input::placeholder {
          color: #C4C4C4;
          font-size: 0.82rem;
        }
        .search-bar-grid select option {
          color: #111;
          background: #fff;
          padding: 6px;
        }
        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr; gap: 32px; }
          .hero-grid > div:last-child { min-height: 300px; }
          .search-bar-grid { grid-template-columns: 1fr 1fr !important; }
          .trust-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 600px) {
          .hero-container { padding-top: 40px !important; padding-bottom: 24px !important; }
          .search-bar-grid { grid-template-columns: 1fr !important; }
          .trust-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  );
}
