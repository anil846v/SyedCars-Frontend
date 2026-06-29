import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { carSaleRequestsApi, getMediaUrl } from '../../utils/api';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import StatCard from '../../components/admin/StatCard';
import Pagination from '../../components/admin/Pagination';
import { ClipboardList, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '../../components/ui/Toaster';

const ORANGE = '#FF5A09';
const LIME   = '#C8D900';

/* ── Status badge ── */
const STATUS_STYLES = {
  PENDING:  { bg: '#FFF7ED', color: '#C2410C', border: '#FDBA74' },
  APPROVED: { bg: '#ECFDF5', color: '#065F46', border: '#6EE7B7' },
  REJECTED: { bg: '#FEF2F2', color: '#991B1B', border: '#FECACA' },
};

function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES.PENDING;
  return (
    <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 20, fontSize: '0.72rem', fontWeight: 700, background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
      {status}
    </span>
  );
}

/* ── Detail row in modal ── */
function DRow({ label, value }) {
  if (!value && value !== 0) return null;
  return (
    <div style={{ display: 'flex', gap: 12, padding: '9px 0', borderBottom: '1px solid #F3F4F6' }}>
      <span style={{ fontSize: '0.78rem', color: '#9CA3AF', fontWeight: 600, minWidth: 160, flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: '0.85rem', color: '#111', wordBreak: 'break-word' }}>{String(value)}</span>
    </div>
  );
}

function SectionHead({ children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '20px 0 10px' }}>
      <span style={{ width: 3, height: 14, background: ORANGE, borderRadius: 2, flexShrink: 0 }} />
      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{children}</span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MODAL — View / Approve / Reject
 ═══════════════════════════════════════════════════════ */
function RequestModal({ request, onClose, onApproved, onRejected }) {
  const [action, setAction]     = useState(''); // 'approve' | 'reject'
  const [notes, setNotes]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const toast = useToast();

  const fmt = (v) => v != null && v !== '' ? v : null;
  const fmtPrice = (v) => v ? `₹${Number(v).toLocaleString('en-IN')}` : null;

  const handle = async () => {
    setError('');
    setLoading(true);
    try {
      if (action === 'approve') {
        await carSaleRequestsApi.approve(request.id, { admin_notes: notes || undefined });
        toast.success('Request approved!');
        onApproved(request.id);
      } else {
        await carSaleRequestsApi.reject(request.id, { admin_notes: notes || undefined });
        toast.info('Request rejected.');
        onRejected(request.id);
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Operation failed');
      toast.error(err.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const photos = Array.isArray(request.photos) ? request.photos : [];

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 680, maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Header */}
        <div style={{ padding: '18px 24px', borderBottom: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#111', fontFamily: "'Poppins', sans-serif" }}>
              {request.brand_name} {request.Model}
            </h2>
            <div style={{ display: 'flex', gap: 8, marginTop: 6, alignItems: 'center' }}>
              <StatusBadge status={request.status} />
              <span style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>#{request.id} · {new Date(request.created_at).toLocaleString('en-IN', {day:'numeric',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit',hour12:true})}</span>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: '#9CA3AF', padding: 4, lineHeight: 1 }}>✕</button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 24px 20px' }}>

          {/* Photos */}
          {photos.length > 0 && (
            <>
              <SectionHead>Photos</SectionHead>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                {photos.map((url, i) => (
                  <img key={i} src={getMediaUrl(url)} alt="" style={{ width: 90, height: 70, objectFit: 'cover', borderRadius: 8, border: '1px solid #E5E7EB' }} />
                ))}
              </div>
            </>
          )}

          <SectionHead>Seller Details</SectionHead>
          <DRow label="Name"         value={request.owner_name} />
          <DRow label="Phone"        value={request.owner_phone} />
          <DRow label="Email"        value={request.owner_email} />
          <DRow label="Address"      value={request.owner_address} />
          <DRow label="City / State" value={request.owner_location} />

          <SectionHead>Car Details</SectionHead>
          <DRow label="Brand"          value={request.brand_name} />
          <DRow label="Model"          value={request.Model} />
          <DRow label="Year"           value={request.manufacturing_year} />
          <DRow label="Colour"         value={request.color} />
          <DRow label="Reg. Number"    value={request.registration_no} />
          <DRow label="KMs Driven"     value={request.kms_driven} />
          <DRow label="Location"       value={request.location} />
          <DRow label="Fuel Type"      value={request.fuel_type} />
          <DRow label="Transmission"   value={request.Transmission} />
          <DRow label="Asking Price"   value={fmtPrice(request.asking_price)} />
          <DRow label="Market Price"   value={fmtPrice(request.market_price)} />

          {request.insurance_no && (
            <>
              <SectionHead>Documents &amp; Insurance</SectionHead>
              <DRow label="Insurance No."      value={request.insurance_no} />
              <DRow label="Insurance Company"  value={request.insurance_company} />
              <DRow label="Expiry Date"        value={request.insurance_expiry_date} />
              <DRow label="Insurance Status"   value={request.insurance_active === true ? 'Active' : request.insurance_active === false ? 'Expired / None' : null} />
            </>
          )}

          {(request.video_url || request.insta_url) && (
            <>
              <SectionHead>Media Links</SectionHead>
              <DRow label="YouTube URL"   value={request.video_url} />
              <DRow label="Instagram URL" value={request.insta_url} />
            </>
          )}

          {request.admin_notes && (
            <>
              <SectionHead>Admin Notes</SectionHead>
              <p style={{ fontSize: '0.875rem', color: '#374151', margin: 0 }}>{request.admin_notes}</p>
            </>
          )}

          {/* Approve / Reject action */}
          {request.status === 'PENDING' && (
            <div style={{ marginTop: 20, padding: 16, background: '#F9FAFB', borderRadius: 10, border: '1px solid #E5E7EB' }}>
              <div style={{ display: 'flex', gap: 10, marginBottom: action ? 12 : 0 }}>
                <button onClick={() => setAction(a => a === 'approve' ? '' : 'approve')} style={{
                  flex: 1, padding: '10px', borderRadius: 8, border: `1.5px solid ${action === 'approve' ? '#10B981' : '#D1FAE5'}`,
                  background: action === 'approve' ? '#ECFDF5' : '#fff', color: action === 'approve' ? '#065F46' : '#374151',
                  fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', transition: 'all 0.15s',
                }}>
                  ✓ Approve &amp; Publish
                </button>
                <button onClick={() => setAction(a => a === 'reject' ? '' : 'reject')} style={{
                  flex: 1, padding: '10px', borderRadius: 8, border: `1.5px solid ${action === 'reject' ? '#EF4444' : '#FEE2E2'}`,
                  background: action === 'reject' ? '#FEF2F2' : '#fff', color: action === 'reject' ? '#991B1B' : '#374151',
                  fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', transition: 'all 0.15s',
                }}>
                  ✕ Reject
                </button>
              </div>

              {action && (
                <>
                  <textarea
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder={action === 'approve' ? 'Optional notes for approval…' : 'Reason for rejection (optional)…'}
                    rows={3}
                    style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: 8, border: '1.5px solid #E5E7EB', fontSize: '0.875rem', resize: 'vertical', outline: 'none', fontFamily: "'DM Sans', sans-serif" }}
                  />
                  {error && <div style={{ color: '#DC2626', fontSize: '0.8rem', marginTop: 6 }}>{error}</div>}
                  <button onClick={handle} disabled={loading} style={{
                    marginTop: 10, width: '100%', padding: '11px', borderRadius: 8, border: 'none',
                    background: action === 'approve' ? '#10B981' : '#EF4444', color: '#fff',
                    fontWeight: 700, fontSize: '0.9rem', cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.7 : 1,
                  }}>
                    {loading ? 'Processing…' : action === 'approve' ? 'Confirm Approval' : 'Confirm Rejection'}
                  </button>
                </>
              )}
            </div>
          )}

          {request.status === 'APPROVED' && request.car_id && (
            <div style={{ marginTop: 16, padding: '12px 16px', background: '#ECFDF5', borderRadius: 10, fontSize: '0.85rem', color: '#065F46', border: '1px solid #A7F3D0' }}>
              Car published to inventory — Car ID #{request.car_id}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN PAGE
 ═══════════════════════════════════════════════════════ */
export default function CarSaleRequests() {
  const toast = useToast();
  const [requests, setRequests]     = useState([]);
  const [stats, setStats]           = useState(null);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [statusFilter, setStatus]   = useState('');
  const [search, setSearch]         = useState('');
  const [loading, setLoading]       = useState(true);
  const [selected, setSelected]     = useState(null);
  const [isMobile, setIsMobile]     = useState(() => window.innerWidth < 768);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const load = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: 9 };
      if (statusFilter) params.status = statusFilter;
      if (search.trim()) params.search = search.trim();
      const [res, statsRes] = await Promise.all([
        carSaleRequestsApi.list(params),
        carSaleRequestsApi.stats(),
      ]);
      setRequests(res.data.requests);
      setPagination(res.data.pagination);
      setStats(statsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search]);

  useEffect(() => { load(1); }, [load]);

  const handleApproved = (id) => {
    setRequests(r => r.map(x => x.id === id ? { ...x, status: 'APPROVED' } : x));
    setStats(s => s ? { ...s, pending: s.pending - 1, approved: s.approved + 1 } : s);
  };
  const handleRejected = (id) => {
    setRequests(r => r.map(x => x.id === id ? { ...x, status: 'REJECTED' } : x));
    setStats(s => s ? { ...s, pending: s.pending - 1, rejected: s.rejected + 1 } : s);
  };
  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this request?')) return;
    try {
      await carSaleRequestsApi.delete(id);
      setRequests(r => r.filter(x => x.id !== id));
      setStats(s => {
        if (!s) return s;
        const req = requests.find(x => x.id === id);
        const key = req?.status?.toLowerCase();
        return { ...s, total: s.total - 1, [key]: Math.max(0, (s[key] || 0) - 1) };
      });
      toast.success('Request deleted.');
    } catch (err) {
      toast.error(err.message || 'Failed to delete request');
    }
  };

  const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '';
  const fmtPrice = (v) => v ? `₹${Number(v).toLocaleString('en-IN')}` : '—';

  /* ── Skeleton ── */
  const Skeleton = () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
      {[...Array(6)].map((_, i) => (
        <div key={i} style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E7EB', padding: 20, height: 160 }}>
          <div style={{ height: 14, background: '#F3F4F6', borderRadius: 6, marginBottom: 10, width: '60%', animation: 'pulse 1.4s ease-in-out infinite' }} />
          <div style={{ height: 11, background: '#F3F4F6', borderRadius: 6, marginBottom: 8, width: '40%' }} />
          <div style={{ height: 11, background: '#F3F4F6', borderRadius: 6, width: '80%' }} />
        </div>
      ))}
    </div>
  );

  return (
    <div style={{ padding: isMobile ? '16px 14px 60px' : '28px 28px 60px', fontFamily: "'DM Sans', sans-serif" }}>

      {/* Stats — always 2×2 on mobile */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: isMobile ? 10 : 12, marginBottom: isMobile ? 16 : 24 }}>
          <StatCard icon={ClipboardList} label="Total"    value={stats.total}    sub="All requests"    color="indigo"  />
          <StatCard icon={Clock}         label="Pending"  value={stats.pending}  sub="Awaiting review" color="orange"  />
          <StatCard icon={CheckCircle}   label="Approved" value={stats.approved} sub="Published"       color="emerald" />
          <StatCard icon={XCircle}       label="Rejected" value={stats.rejected} sub="Declined"        color="pink"    />
        </div>
      )}

      {/* Filters */}
      <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 10, marginBottom: 20, alignItems: isMobile ? 'stretch' : 'center' }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && load(1)}
          placeholder="Search by name, phone, brand…"
          style={{ flex: '1 1 220px', maxWidth: isMobile ? '100%' : 320, padding: '9px 13px', borderRadius: 8, border: '1.5px solid #E5E7EB', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }}
          onFocus={e => e.target.style.borderColor = ORANGE}
          onBlur={e => e.target.style.borderColor = '#E5E7EB'}
        />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
          {['', 'PENDING', 'APPROVED', 'REJECTED'].map(s => (
            <button key={s} onClick={() => setStatus(s)} style={{
              padding: isMobile ? '8px 4px' : '8px 16px', borderRadius: 8, fontSize: isMobile ? '0.72rem' : '0.8rem', fontWeight: 600, cursor: 'pointer',
              background: statusFilter === s ? ORANGE : '#fff',
              color: statusFilter === s ? '#fff' : '#6B7280',
              border: `1.5px solid ${statusFilter === s ? ORANGE : '#E5E7EB'}`,
              transition: 'all 0.15s', whiteSpace: 'nowrap',
            }}>
              {s || 'All'}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {loading ? <Skeleton /> : requests.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#9CA3AF' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>📋</div>
          <div style={{ fontWeight: 600, fontSize: '1rem', color: '#374151', marginBottom: 6 }}>No requests found</div>
          <div style={{ fontSize: '0.875rem' }}>Requests from the Sell Your Car form will appear here.</div>
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16, marginBottom: 24 }}>
            {requests.map(req => {
              const photos = Array.isArray(req.photos) ? req.photos : [];
              return (
                <div
                  key={req.id}
                  onClick={() => setSelected(req)}
                  style={{
                    background: '#fff', borderRadius: 12, border: '1px solid #E5E7EB',
                    cursor: 'pointer', overflow: 'hidden', transition: 'all 0.2s',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.09)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'; e.currentTarget.style.transform = ''; }}
                >
                  {/* Thumb */}
                  <div style={{ height: 190, background: photos[0] ? 'none' : '#F9FAFB', overflow: 'hidden', position: 'relative' }}>
                    {photos[0]
                      ? <img src={getMediaUrl(photos[0])} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '2.2rem', opacity: 0.3 }}>🚗</div>
                    }
                    <div style={{ position: 'absolute', top: 8, right: 8 }}>
                      <StatusBadge status={req.status} />
                    </div>
                  </div>

                  <div style={{ padding: '14px 16px' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#111', marginBottom: 3, fontFamily: "'Poppins', sans-serif" }}>
                      {req.brand_name} {req.Model} {req.manufacturing_year ? `(${req.manufacturing_year})` : ''}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#6B7280', marginBottom: 6 }}>
                      {req.owner_name} · {req.owner_phone}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: ORANGE }}>{fmtPrice(req.asking_price)}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>{fmtDate(req.created_at)}</span>
                        {/* <button
                          onClick={(e) => handleDelete(req.id, e)}
                          title="Delete"
                          style={{ padding: '3px 7px', borderRadius: 6, border: '1px solid #FECACA', background: '#FEF2F2', color: '#EF4444', fontSize: '0.72rem', cursor: 'pointer', lineHeight: 1.4 }}
                          onMouseEnter={e => e.currentTarget.style.background = '#EF4444'}
                          onMouseLeave={e => e.currentTarget.style.background = '#FEF2F2'}
                          onMouseOver={e => e.currentTarget.style.color = e.currentTarget.style.background === '#EF4444' ? '#fff' : '#EF4444'}
                        >
                          ✕
                        </button> */}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <Pagination page={pagination.page} totalPages={pagination.totalPages} onPageChange={load} total={pagination.total} limit={9} />
        </>
      )}

      {/* Detail Modal */}
      {selected && (
        <RequestModal
          request={selected}
          onClose={() => setSelected(null)}
          onApproved={(id) => { handleApproved(id); setSelected(r => r?.id === id ? { ...r, status: 'APPROVED' } : r); }}
          onRejected={(id) => { handleRejected(id); setSelected(r => r?.id === id ? { ...r, status: 'REJECTED' } : r); }}
        />
      )}

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.45} }
        @media (max-width: 600px) {
          div[style*="padding: '28px 28px"] { padding: 18px 16px !important; }
        }
      `}</style>
    </div>
  );
}
