import { ChevronLeft, ChevronRight } from 'lucide-react';

const ORANGE = '#FF5A09';

export default function Pagination({ page, totalPages, onPageChange, total, limit = 15 }) {
  if (totalPages <= 1) return null;

  // Build page number list with ellipsis
  const pages = [];
  const delta = 2;
  const lo = Math.max(1, page - delta);
  const hi = Math.min(totalPages, page + delta);
  if (lo > 1)  { pages.push(1); if (lo > 2) pages.push('…'); }
  for (let i = lo; i <= hi; i++) pages.push(i);
  if (hi < totalPages) { if (hi < totalPages - 1) pages.push('…'); pages.push(totalPages); }

  const from = total != null ? (page - 1) * limit + 1 : null;
  const to   = total != null ? Math.min(page * limit, total) : null;

  const mkBtn = (active, disabled) => ({
    width: 34, height: 34,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    borderRadius: 8,
    cursor: disabled ? 'not-allowed' : 'pointer',
    border: active ? `1px solid ${ORANGE}` : '1px solid #E5E7EB',
    background: active ? ORANGE : '#fff',
    color: active ? '#fff' : '#374151',
    fontFamily: "'Space Mono',monospace", fontSize: '0.78rem',
    fontWeight: active ? 700 : 400,
    boxShadow: active ? '0 2px 8px rgba(255,90,9,0.28)' : 'none',
    opacity: disabled ? 0.4 : 1,
    transition: 'all 0.15s',
  });

  const hoverOn  = (e, p) => { if (p !== page) { e.currentTarget.style.borderColor = ORANGE; e.currentTarget.style.color = ORANGE; } };
  const hoverOff = (e, p) => { if (p !== page) { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.color = '#374151'; } };
  const arrowHoverOn  = (e, disabled) => { if (!disabled) { e.currentTarget.style.borderColor = ORANGE; e.currentTarget.style.color = ORANGE; } };
  const arrowHoverOff = (e) => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.color = '#374151'; };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginTop: 20 }}>
      {from != null ? (
        <span style={{ fontSize: '0.75rem', color: '#9CA3AF', fontFamily: "'Space Mono',monospace" }}>
          {from}–{to} of {total}
        </span>
      ) : <div />}

      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
        {/* Prev */}
        <button
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          style={mkBtn(false, page === 1)}
          onMouseEnter={e => arrowHoverOn(e, page === 1)}
          onMouseLeave={arrowHoverOff}
        >
          <ChevronLeft size={14} />
        </button>

        {/* Page numbers */}
        {pages.map((p, i) => p === '…' ? (
          <span key={`el-${i}`} style={{ width: 28, textAlign: 'center', color: '#9CA3AF', fontSize: '0.84rem' }}>…</span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            style={mkBtn(p === page, false)}
            onMouseEnter={e => hoverOn(e, p)}
            onMouseLeave={e => hoverOff(e, p)}
          >
            {p}
          </button>
        ))}

        {/* Next */}
        <button
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
          style={mkBtn(false, page === totalPages)}
          onMouseEnter={e => arrowHoverOn(e, page === totalPages)}
          onMouseLeave={arrowHoverOff}
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
