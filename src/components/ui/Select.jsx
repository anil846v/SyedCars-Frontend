export default function Select({ label, value, onChange, children, required }) {
  return (
    <div>
      {label && <label style={{ display: 'block', fontSize: '0.72rem', fontFamily: "'Space Mono',monospace", textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>{label}</label>}
      <select value={value} onChange={onChange} required={required} style={{
        width: '100%', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8,
        padding: '10px 12px', fontSize: '0.875rem', color: '#fff',
        background: '#1A1A24', outline: 'none', cursor: 'pointer', appearance: 'none', fontFamily: 'inherit',
      }}
        onFocus={e => e.target.style.borderColor = '#FF5A09'}
        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
      >
        {children}
      </select>
    </div>
  );
}
