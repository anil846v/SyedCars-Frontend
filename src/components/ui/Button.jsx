export default function Button({ children, variant = 'primary', size, onClick, disabled, type = 'button', style }) {
  const pad = size === 'sm' ? '7px 14px' : size === 'lg' ? '13px 28px' : '10px 20px';
  const fs  = size === 'sm' ? '0.8rem' : size === 'lg' ? '1rem' : '0.875rem';

  const base = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    gap: 7, padding: pad, borderRadius: 8, fontWeight: 600, fontSize: fs,
    border: 'none', cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1, transition: 'all 0.2s', fontFamily: 'inherit',
    whiteSpace: 'nowrap',
  };

  const variants = {
    primary:  { background: '#FF5A09', color: '#fff', boxShadow: '0 2px 12px rgba(255,90,9,0.3)' },
    ghost:    { background: '#F3F4F6', color: '#040404', border: '1px solid #E5E7EB' },
    danger:   { background: 'rgba(239,68,68,0.12)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.25)' },
    secondary:{ background: '#F3F4F6', color: '#111' },
    outline:  { background: 'transparent', color: '#FF5A09', border: '1.5px solid #FF5A09' },
    success:  { background: 'rgba(16,185,129,0.12)', color: '#10B981', border: '1px solid rgba(16,185,129,0.25)' },
    blue:     { background: 'rgba(59,130,246,0.12)', color: '#3B82F6', border: '1px solid rgba(59,130,246,0.25)' },
  };

  return (
    <button
      type={type} onClick={onClick} disabled={disabled}
      style={{ ...base, ...(variants[variant] || variants.primary), ...style }}
    >
      {children}
    </button>
  );
}
