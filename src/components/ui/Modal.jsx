import { useEffect } from 'react';
import { cx } from '../../utils/helpers';

export default function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-[420px]',
    md: 'max-w-[580px]',
    lg: 'max-w-[780px]',
    xl: 'max-w-[980px]',
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-[4px] flex items-center justify-center z-[9000] p-4 animate-[fadeIn_0.2s_ease]" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className={cx(
          "bg-ink-2 border border-ink-5 rounded-xl w-full max-h-[90vh] overflow-y-auto animate-[scaleIn_0.25s_ease]",
          sizeClasses[size]
        )}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-ink-4 sticky top-0 bg-ink-2 z-10">
          <h2 className="font-display text-[1.4rem] font-medium text-white">{title}</h2>
          <button className="w-8 h-8 flex items-center justify-center rounded-md text-smoke text-[0.85rem] transition-all duration-150 cursor-pointer border-none bg-transparent hover:bg-ink-4 hover:text-white" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
