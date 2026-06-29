// Premium colored stat cards for admin dashboard
export default function StatCard({ icon: Icon, label, value, sub, color = 'orange' }) {
  const COLORS = {
    orange:  { bg: 'linear-gradient(135deg, #FF5A09 0%, #E04D00 100%)',  text: '#fff', sub: 'rgba(255,255,255,0.72)' },
    blue:    { bg: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',  text: '#fff', sub: 'rgba(255,255,255,0.72)' },
    emerald: { bg: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',  text: '#fff', sub: 'rgba(255,255,255,0.72)' },
    purple:  { bg: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)',  text: '#fff', sub: 'rgba(255,255,255,0.72)' },
    gold:    { bg: 'linear-gradient(135deg, #F0A500 0%, #D97706 100%)',  text: '#fff', sub: 'rgba(255,255,255,0.72)' },
    pink:    { bg: 'linear-gradient(135deg, #EC4899 0%, #BE185D 100%)',  text: '#fff', sub: 'rgba(255,255,255,0.72)' },
    teal:    { bg: 'linear-gradient(135deg, #14B8A6 0%, #0F766E 100%)',  text: '#fff', sub: 'rgba(255,255,255,0.72)' },
    indigo:  { bg: 'linear-gradient(135deg, #6366F1 0%, #4338CA 100%)',  text: '#fff', sub: 'rgba(255,255,255,0.72)' },
  };

  const c = COLORS[color] || COLORS.orange;

  return (
    <div
      style={{
        background: c.bg, borderRadius: 14, padding: '5px 22px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.22)',
        position: 'relative', overflow: 'hidden',
        transition: 'transform 0.2s',
      }}
      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'none'}
    >
      {/* Background decorative circles */}
      <div style={{ position:'absolute', top:-22, right:-22, width:80, height:80, borderRadius:'50%', background:'rgba(255,255,255,0.1)' }} />
      <div style={{ position:'absolute', bottom:-28, right:16, width:56, height:56, borderRadius:'50%', background:'rgba(255,255,255,0.06)' }} />

      <div style={{ position: 'relative' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
          {/* Icon box */}
          <div style={{
            width:34, height:34, borderRadius:8,
            background:'rgba(255,255,255,0.2)',
            display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
          }}>
            {Icon && <Icon size={17} color="#fff" />}
          </div>
          <span style={{
            fontSize:'0.66rem', fontFamily:"'Space Mono',monospace",
            textTransform:'uppercase', letterSpacing:'0.1em', color: c.sub,
          }}>
            {label}
          </span>
        </div>

        <div style={{
          fontFamily:"'Plus Jakarta Sans', sans-serif", fontSize:'2rem',
          fontWeight:600, color: c.text, lineHeight:1,
        }}>
          {value}
        </div>

        {sub && (
          <div style={{ fontSize:'0.75rem', color: c.sub, marginTop:6 }}>{sub}</div>
        )}
      </div>
    </div>
  );
}

