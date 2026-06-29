export default function Input({ label, type = 'text', value, onChange, placeholder, required, min, max, step }) {
  const inputStyle = {
    width: '100%', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8,
    padding: '10px 12px', fontSize: '0.875rem', color: '#fff',
    background: 'rgba(255,255,255,0.05)', outline: 'none', fontFamily: 'inherit',
    transition: 'border-color 0.15s',
  };
  return (
    <div>
      {label && <label style={{ display: 'block', fontSize: '0.72rem', fontFamily: "'Space Mono',monospace", textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>{label}</label>}
      <input type={type} value={value} onChange={onChange} placeholder={placeholder}
        required={required} min={min} max={max} step={step}
        style={inputStyle}
        onFocus={e => e.target.style.borderColor = '#FF5A09'}
        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
    </div>
  );
}
