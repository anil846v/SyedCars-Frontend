import { useState } from 'react';
import { Link } from 'react-router-dom';

const ORANGE = '#E8631A';
const FONT   = "'Inter', sans-serif";

const UsersIcon    = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={ORANGE} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const CarStatIcon  = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={ORANGE} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h5l2 4v4h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>;
const ShieldIcon   = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={ORANGE} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>;
const PriceIcon    = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={ORANGE} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>;
const HeadsetIcon  = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={ORANGE} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z"/><path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>;
const CarBtnIcon   = () => <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h5l2 4v4h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>;
const TagBtnIcon   = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>;
const ArrowIcon    = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;
const StarIcon     = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="#fff" stroke="#fff" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;

function DotGrid({ rows = 5, cols = 7, style = {} }) {
  const d = [];
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++)
      d.push(<circle key={`${r}-${c}`} cx={c * 14 + 7} cy={r * 14 + 7} r={1.6} fill="#C8B49E" />);
  return (
    <svg width={cols * 14} height={rows * 14} viewBox={`0 0 ${cols * 14} ${rows * 14}`} style={style} aria-hidden="true">
      {d}
    </svg>
  );
}

export default function CTASection() {
  const [imgH, setImgH]   = useState(false);
  const [brH, setBrH]     = useState(false);
  const [selH, setSelH]   = useState(false);

  return (
    <section style={{
      background: 'radial-gradient(ellipse at top left, rgba(232,99,26,0.13) 0%, transparent 45%), radial-gradient(ellipse at top right, rgba(232,99,26,0.10) 0%, transparent 45%), #F7F4F0',
      padding: '60px 0 72px',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: FONT,
    }}>
      <style>{`
        @keyframes ctaUp { from { opacity:0; transform:translateY(22px); } to { opacity:1; transform:translateY(0); } }
        .cl { animation: ctaUp .55s ease both; }
        .cr { animation: ctaUp .55s ease .15s both; }
        .cb { animation: ctaUp .55s ease .3s both; }
      `}</style>

      <DotGrid style={{ position:'absolute', top:20, right:20, opacity:0.28, pointerEvents:'none' }} />
      <DotGrid style={{ position:'absolute', bottom:20, left:20, opacity:0.28, pointerEvents:'none' }} />

      <div style={{ maxWidth:1160, margin:'0 auto', padding:'0 40px', position:'relative', zIndex:1 }}>
        <div style={{ display:'grid', gridTemplateColumns:'55fr 45fr', gap:52, alignItems:'center' }}>

          {/* ── LEFT ── */}
          <div className="cl">

            {/* Eyebrow */}
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:22 }}>
              <div style={{ width:32, height:32, borderRadius:'50%', background:'#FFF2EC', border:'1.5px solid #FDDCC8', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <CarBtnIcon />
              </div>
              <span style={{ fontSize:'0.72rem', fontWeight:600, letterSpacing:'0.16em', textTransform:'uppercase', color:ORANGE }}>READY TO DRIVE?</span>
              <span style={{ width:28, height:1.5, background:ORANGE, display:'inline-block' }} />
            </div>

            {/* Headline */}
            <h2 style={{ fontSize:'clamp(2rem, 3.6vw, 2.8rem)', fontWeight:700, color:'#111', lineHeight:1.12, margin:'0 0 6px', letterSpacing:'-0.025em' }}>
              Find Your Dream
            </h2>
            <h2 style={{ fontSize:'clamp(2rem, 3.6vw, 2.8rem)', fontWeight:700, color:'#111', lineHeight:1.12, margin:'0 0 22px', letterSpacing:'-0.025em' }}>
              Car{' '}
              <span style={{ color:ORANGE, fontWeight:700, position:'relative', display:'inline-block' }}>
                With Confidence
                <span style={{ position:'absolute', bottom:-4, left:0, width:'100%', height:3, background:ORANGE, opacity:0.3, borderRadius:2 }} />
              </span>
            </h2>

            {/* Sub-copy */}
            <p style={{ fontSize:'0.93rem', lineHeight:1.78, color:'#6B6055', maxWidth:440, marginBottom:28, fontWeight:400 }}>
              Browse 500+ verified pre-owned luxury cars — or list yours for a fast, transparent sale. No middlemen. No surprises.
            </p>

            {/* ── STATS BAR ── */}
            <div style={{
              display: 'flex',
              background: '#F0EBE5',
              borderRadius: 16,
              marginBottom: 32,
              overflow: 'hidden',
            }}>
              {[
                { Icon: UsersIcon,   num: '1000+', label: 'Happy Customers' },
                { Icon: CarStatIcon, num: '500+',  label: 'Cars Listed'     },
                { Icon: ShieldIcon,  num: '100%',  label: 'Verified'        },
              ].map(({ Icon, num, label }, i) => (
                <div key={i} style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: '20px 24px',
                  borderLeft: i > 0 ? '1px solid #DDD5CC' : 'none',
                }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: '50%',
                    background: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <Icon />
                  </div>
                  <div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 700, color: ORANGE, lineHeight: 1 }}>{num}</div>
                    <div style={{ fontSize: '0.75rem', color: '#888', marginTop: 5, fontWeight: 400 }}>{label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div style={{ display:'flex', gap:14, marginBottom:44 }}>
              <Link
                to="/cars"
                onMouseEnter={() => setBrH(true)}
                onMouseLeave={() => setBrH(false)}
                style={{
                  flex:1, display:'inline-flex', alignItems:'center', justifyContent:'center', gap:9,
                  padding:'15px 20px',
                  background: brH ? '#cf5514' : ORANGE,
                  color:'#fff', borderRadius:12, textDecoration:'none',
                  fontSize:'0.9rem', fontWeight:600,
                  boxShadow: brH ? '0 8px 24px rgba(232,99,26,0.38)' : '0 4px 16px rgba(232,99,26,0.28)',
                  transform: brH ? 'translateY(-2px)' : 'translateY(0)',
                  transition:'all 0.2s ease',
                }}
              >
                <CarBtnIcon /> Browse Cars <ArrowIcon />
              </Link>
              <Link
                to="/contact"
                onMouseEnter={() => setSelH(true)}
                onMouseLeave={() => setSelH(false)}
                style={{
                  flex:1, display:'inline-flex', alignItems:'center', justifyContent:'center', gap:9,
                  padding:'15px 20px',
                  background: selH ? ORANGE : 'transparent',
                  color: selH ? '#fff' : ORANGE,
                  border:`2px solid ${ORANGE}`, borderRadius:12, textDecoration:'none',
                  fontSize:'0.9rem', fontWeight:600,
                  transform: selH ? 'translateY(-2px)' : 'translateY(0)',
                  boxShadow: selH ? '0 8px 24px rgba(232,99,26,0.2)' : 'none',
                  transition:'all 0.2s ease',
                }}
              >
                <TagBtnIcon /> Sell Your Car <ArrowIcon />
              </Link>
            </div>

            {/* Trust badges */}
            <div className="cb" style={{
              display: 'flex',
              background: '#fff',
              borderRadius: 14,
              border: '1px solid #EDE5DE',
              overflow: 'hidden',
            }}>
              {[
                { Icon: ShieldIcon,  title:'Verified Listings', desc:'Every car is inspected and verified for your peace of mind.' },
                { Icon: PriceIcon,   title:'Best Prices',        desc:'Get the best deals with transparent pricing.' },
                { Icon: HeadsetIcon, title:'Expert Support',     desc:'Our experts are here to help you at every step.' },
              ].map(({ Icon, title, desc }, i) => (
                <div key={i} style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '16px 18px',
                  borderLeft: i > 0 ? '1px solid #EDE5DE' : 'none',
                }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: '50%',
                    background: '#FFF2EC',
                    border: '1.5px solid #FDDCC8',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <Icon />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#111', marginBottom: 3, lineHeight: 1.2 }}>{title}</div>
                    <div style={{ fontSize: '0.74rem', color: '#888', lineHeight: 1.55, fontWeight: 400 }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT — Car image ── */}
          <div
            className="cr"
            onMouseEnter={() => setImgH(true)}
            onMouseLeave={() => setImgH(false)}
            style={{ position:'relative' }}
          >
            <div style={{
              borderRadius:22, overflow:'hidden',
              boxShadow: imgH ? '0 20px 56px rgba(0,0,0,0.14)' : '0 8px 36px rgba(0,0,0,0.09)',
              transform: imgH ? 'translateY(-4px)' : 'translateY(0)',
              transition:'all 0.35s ease',
              background:'#fff',
              border:'1px solid #EDE5DE',
            }}>
              <div style={{ position:'relative', overflow:'hidden' }}>
                <img
                  src="/ctacar.png"
                  alt="Featured Car"
                  style={{
                    width:'100%', height:'auto', display:'block', objectFit:'cover',
                    transform: imgH ? 'scale(1.03)' : 'scale(1)',
                    transition:'transform 0.5s ease',
                  }}
                />
                <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(0,0,0,0.2) 0%, transparent 50%)', pointerEvents:'none' }} />

                {/* Top-right badge */}
                <div style={{
                  position:'absolute', top:16, right:16,
                  background:ORANGE, borderRadius:8, padding:'8px 14px',
                  display:'flex', alignItems:'center', gap:6,
                  boxShadow:'0 4px 16px rgba(232,99,26,0.4)',
                  transform: imgH ? 'translateY(-3px)' : 'translateY(0)',
                  transition:'transform 0.3s ease',
                }}>
                  <StarIcon />
                  <span style={{ fontSize:'0.78rem', fontWeight:700, color:'#fff' }}>Top Rated</span>
                </div>

                {/* Bottom-left badge */}
                <div style={{
                  position:'absolute', bottom:16, left:16,
                  background:'rgba(255,255,255,0.95)', backdropFilter:'blur(8px)',
                  borderRadius:12, padding:'10px 16px',
                  display:'flex', alignItems:'center', gap:12,
                  boxShadow:'0 4px 18px rgba(0,0,0,0.10)',
                  border:'1px solid rgba(232,99,26,0.15)',
                  transform: imgH ? 'translateY(-3px)' : 'translateY(0)',
                  transition:'transform 0.35s ease',
                }}>
                  <div style={{ width:36, height:36, borderRadius:'50%', background:'#FFF2EC', border:`1.5px solid ${ORANGE}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={ORANGE} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                      <polyline points="9 12 11 14 15 10"/>
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontSize:'0.82rem', fontWeight:700, color:'#111', lineHeight:1.2 }}>Fully Verified</div>
                    <div style={{ fontSize:'0.7rem', color:'#888', marginTop:2 }}>Docs · Inspection · History</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Carousel dots */}
            <div style={{ display:'flex', justifyContent:'center', gap:8, marginTop:16 }}>
              {[0,1,2].map(i => (
                <div key={i} style={{ width: i===0 ? 22 : 8, height:8, borderRadius:4, background: i===0 ? ORANGE : '#D9CFC6' }} />
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}