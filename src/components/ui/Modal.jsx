import { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({ open, isOpen, onClose, title, children, wide, size }) {
  const visible = open || isOpen;
  const isWide  = wide || size === 'lg';

  useEffect(() => {
    if (visible) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#fff',
          border: '1px solid #E5E7EB',
          borderRadius: 16,
          width: '100%',
          maxWidth: isWide ? 820 : 540,
          maxHeight: '92vh',
          overflowY: 'auto',
          boxShadow: '0 24px 64px rgba(0,0,0,0.12)',
          animation: 'slideDown 0.18s ease',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 22px',
          borderBottom: '1px solid #F3F4F6',
          position: 'sticky', top: 0, background: '#fff', zIndex: 1, borderRadius: '16px 16px 0 0',
        }}>
          <h2 style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: '1.2rem', color: '#111', fontWeight: 500,
          }}>{title}</h2>
          <button
            onClick={onClose}
            style={{
              padding: 6, borderRadius: 6, color: '#6B7280',
              background: 'none', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#111'; e.currentTarget.style.background = '#F3F4F6'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#6B7280'; e.currentTarget.style.background = 'none'; }}
          >
            <X size={18} />
          </button>
        </div>
        {/* Body */}
        <div style={{ padding: '20px 22px' }}>{children}</div>
      </div>
    </div>
  );
}

