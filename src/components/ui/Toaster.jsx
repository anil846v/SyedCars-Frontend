import { createContext, useContext, useState, useCallback, useRef } from 'react';

const ToastCtx = createContext(null);

const ICONS  = { success: '✓', error: '✕', info: 'ℹ' };
const COLORS = {
  success: { bg: '#ECFDF5', border: '#6EE7B7', text: '#065F46' },
  error:   { bg: '#FEF2F2', border: '#FECACA', text: '#991B1B' },
  info:    { bg: '#EFF6FF', border: '#BFDBFE', text: '#1E40AF' },
};

function ToastItem({ id, message, type, onClose }) {
  const c = COLORS[type] || COLORS.info;
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 10,
      background: c.bg, border: `1px solid ${c.border}`, color: c.text,
      borderRadius: 10, padding: '12px 14px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
      minWidth: 280, maxWidth: 380,
      fontFamily: "'DM Sans', sans-serif",
      animation: 'toast-slide-in 0.22s ease',
    }}>
      <span style={{ fontWeight: 700, flexShrink: 0, marginTop: 1, fontSize: '0.9rem' }}>
        {ICONS[type]}
      </span>
      <span style={{ fontSize: '0.875rem', lineHeight: 1.45, flex: 1 }}>{message}</span>
      <button
        onClick={() => onClose(id)}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'inherit', opacity: 0.5, fontSize: '0.75rem',
          padding: '0 0 0 6px', flexShrink: 0, lineHeight: 1,
        }}
      >✕</button>
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const counter = useRef(0);

  const dismiss = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const add = useCallback((message, type, duration) => {
    const id  = ++counter.current;
    const dur = duration ?? (type === 'error' ? 5000 : 3500);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), dur);
  }, []);

  const toast = {
    success: (msg, dur) => add(msg, 'success', dur),
    error:   (msg, dur) => add(msg, 'error',   dur),
    info:    (msg, dur) => add(msg, 'info',     dur),
  };

  return (
    <ToastCtx.Provider value={toast}>
      {children}
      {toasts.length > 0 && (
        <>
          <style>{`
            @keyframes toast-slide-in {
              from { opacity: 0; transform: translateY(10px); }
              to   { opacity: 1; transform: translateY(0); }
            }
          `}</style>
          <div style={{
            position: 'fixed', top: 24, right: 24,
            zIndex: 99999,
            display: 'flex', flexDirection: 'column', gap: 8,
            pointerEvents: 'none',
          }}>
            {toasts.map(t => (
              <div key={t.id} style={{ pointerEvents: 'auto' }}>
                <ToastItem {...t} onClose={dismiss} />
              </div>
            ))}
          </div>
        </>
      )}
    </ToastCtx.Provider>
  );
}

export const useToast = () => useContext(ToastCtx);
