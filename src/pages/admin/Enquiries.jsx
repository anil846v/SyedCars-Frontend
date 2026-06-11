import { useState, useEffect, useCallback } from 'react';
import { enquiriesApi } from '../../utils/api';
import { formatINR } from '../../utils/helpers';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';

const STATUSES = [
  'NEW', 'CONTACTED', 'FOLLOW_UP', 'INTERESTED',
  'NEGOTIATION', 'TEST_DRIVE', 'BOOKED',
  'PURCHASED', 'NOT_INTERESTED', 'CLOSED'
];

const statusVariant = (s) => {
  const norm = (s || '').toUpperCase();
  if (norm === 'NEW') return 'blue';
  if (['CONTACTED', 'FOLLOW_UP', 'NEGOTIATION', 'TEST_DRIVE'].includes(norm)) return 'gold';
  if (['INTERESTED', 'BOOKED', 'PURCHASED'].includes(norm)) return 'green';
  if (norm === 'NOT_INTERESTED') return 'red';
  return 'smoke';
};

const displayStatus = (s) => {
  if (!s) return 'New';
  return s.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
};

export default function AdminEnquiries() {
  const [enquiries,  setEnquiries]  = useState([]);
  const [total,      setTotal]      = useState(0);
  const [page,       setPage]       = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState('');
  const [stats,      setStats]      = useState(null);
  const [viewEnq,    setViewEnq]    = useState(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [previewCar,   setPreviewCar]   = useState(null);

  const load = useCallback(async (p = 1) => {
    setLoading(true);
    try {
      const params = { page: p, limit: 15 };
      if (filterStatus) params.status = filterStatus;
      const [listRes, statsRes] = await Promise.allSettled([
        enquiriesApi.list(params),
        enquiriesApi.stats(),
      ]);
      if (listRes.status === 'fulfilled') {
        const d = listRes.value?.data;
        setEnquiries(d?.enquiries ?? []);
        setTotal(d?.pagination?.total ?? 0);
        setTotalPages(d?.pagination?.totalPages ?? 1);
        setPage(p);
      }
      if (statsRes.status === 'fulfilled') setStats(statsRes.value?.data ?? statsRes.value);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filterStatus]);

  useEffect(() => { load(1); }, [load]);

  const updateStatus = async (id, status) => {
    try {
      await enquiriesApi.updateStatus(id, status);
      load(page);
      if (viewEnq?.id === id) setViewEnq(e => ({ ...e, status }));
    } catch (err) { alert(err.message); }
  };

  const deleteEnq = async (id) => {
    if (!confirm('Delete this enquiry?')) return;
    try {
      await enquiriesApi.delete(id);
      load(page);
      if (viewEnq?.id === id) setViewEnq(null);
    } catch (err) { alert(err.message); }
  };

  return (
    <div className="p-8 pb-12 flex flex-col gap-6 max-[480px]:p-5">
      <AdminPageHeader title="Enquiries" sub={`${total} total`} />

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label:'Total', value: stats.total ?? total },
            { label:'New',   value: stats.new ?? 0, color:'text-sky' },
            { label:'Contacted', value: stats.contacted ?? 0, color:'text-emerald' },
            { label:'Today', value: stats.today ?? 0, color:'text-gold' },
          ].map(item => (
            <div key={item.label} className="bg-ink-2 border border-ink-4 rounded-lg p-4">
              <p className="text-xs font-mono uppercase tracking-wide text-smoke mb-1">{item.label}</p>
              <p className={`text-2xl font-display font-medium ${item.color || 'text-white'}`}>{item.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Filter */}
      <div className="flex gap-3 flex-wrap">
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="bg-ink-2 border border-ink-4 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-gold">
          <option value="">All Statuses</option>
          {STATUSES.map(s => <option key={s} value={s}>{displayStatus(s)}</option>)}
        </select>
      </div>

      {error && <div className="bg-crimson/10 border border-crimson/30 rounded-md px-4 py-3 text-crimson text-sm">{error}</div>}

      {/* Table */}
      <div className="bg-ink-2 border border-ink-4 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink-4">
                {['#','Name','Phone','Email','Car','Status','Date','Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-mono uppercase tracking-widest text-smoke font-normal">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="px-4 py-8 text-center text-smoke">Loading…</td></tr>
              ) : enquiries.length === 0 ? (
                <tr><td colSpan={8} className="px-4 py-8 text-center text-smoke">No enquiries found.</td></tr>
              ) : enquiries.map(enq => (
                <tr key={enq.id} className="border-b border-ink-4 hover:bg-ink-3 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-smoke">#{enq.id}</td>
                  <td className="px-4 py-3 font-medium">
                    <button onClick={() => setViewEnq(enq)} className="text-left text-white hover:text-gold hover:underline font-medium focus:outline-none transition-all">
                      {enq.name || '—'}
                    </button>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">{enq.phone || '—'}</td>
                  <td className="px-4 py-3 text-smoke text-xs">{enq.email || '—'}</td>
                  <td className="px-4 py-3 text-xs">
                    {enq.car ? (
                      <button onClick={() => setPreviewCar(enq.car)}
                        className="text-left text-gold hover:underline font-medium focus:outline-none transition-all">
                        {enq.car.brand_name} {enq.car.Model}
                      </button>
                    ) : (
                      <span className="text-smoke font-mono">General</span>
                    )}
                  </td>
                  <td className="px-4 py-3"><Badge variant={statusVariant(enq.status)}>{displayStatus(enq.status)}</Badge></td>
                  <td className="px-4 py-3 font-mono text-xs text-smoke">{enq.created_at ? new Date(enq.created_at).toLocaleDateString('en-IN') : '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => setViewEnq(enq)} className="w-7 h-7 rounded-sm flex items-center justify-center text-smoke hover:text-white bg-ink-4 hover:bg-ink-5 transition-colors text-xs">👁</button>
                      <select value={enq.status||'NEW'} onChange={e => updateStatus(enq.id, e.target.value)}
                        className="bg-ink-4 border-0 text-smoke text-xs rounded-sm px-2 py-1 focus:outline-none hover:bg-ink-5 transition-colors">
                        {STATUSES.map(s => <option key={s} value={s}>{displayStatus(s)}</option>)}
                      </select>
                      <button onClick={() => deleteEnq(enq.id)} className="w-7 h-7 rounded-sm flex items-center justify-center text-smoke hover:text-crimson bg-ink-4 hover:bg-crimson/10 transition-colors text-xs">✕</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button disabled={page===1} onClick={() => load(page-1)} className="px-4 py-2 bg-ink-2 border border-ink-4 rounded-md text-sm text-smoke hover:text-white disabled:opacity-30">← Prev</button>
          <span className="text-smoke text-sm font-mono">Page {page} / {totalPages}</span>
          <button disabled={page===totalPages} onClick={() => load(page+1)} className="px-4 py-2 bg-ink-2 border border-ink-4 rounded-md text-sm text-smoke hover:text-white disabled:opacity-30">Next →</button>
        </div>
      )}

      {/* View Modal */}
      <Modal isOpen={!!viewEnq} onClose={() => setViewEnq(null)} title="Enquiry Detail" size="md">
        {viewEnq && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {[
                ['Name', viewEnq.name],
                ['Phone', viewEnq.phone],
                ['Email', viewEnq.email],
                ['Car', viewEnq.car ? `${viewEnq.car.brand_name} ${viewEnq.car.Model} (#${viewEnq.car.id})` : 'General Enquiry'],
                ['Address', viewEnq.address],
                ['Date', viewEnq.created_at ? new Date(viewEnq.created_at).toLocaleString('en-IN') : '—'],
              ].map(([label, val]) => (
                <div key={label}>
                  <p className="text-xs font-mono uppercase tracking-wide text-smoke mb-1">{label}</p>
                  <p className="text-white text-sm">{val || '—'}</p>
                </div>
              ))}
            </div>
            {viewEnq.message && (
              <div>
                <p className="text-xs font-mono uppercase tracking-wide text-smoke mb-2">Message</p>
                <div className="bg-ink-3 rounded-md p-4 text-mist text-sm leading-relaxed">{viewEnq.message}</div>
              </div>
            )}
            {viewEnq.car && (
              <div className="border border-ink-4 rounded-lg bg-ink-3 p-3 flex gap-3 items-center">
                <div className="w-16 h-16 rounded bg-ink-2 overflow-hidden shrink-0 border border-ink-4">
                  {viewEnq.car.media?.[0]?.image_url ? (
                    <img
                      src={viewEnq.car.media[0].image_url}
                      alt={viewEnq.car.brand_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-ink-5 text-lg font-display">{viewEnq.car.brand_name?.[0]}</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-mono uppercase tracking-wide text-smoke mb-0.5">Enquired Car</p>
                  <p className="text-white text-sm font-medium truncate">
                    {viewEnq.car.brand_name} {viewEnq.car.Model}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-gold text-xs font-semibold">{formatINR(viewEnq.car.asking_price)}</span>
                    <span className="text-smoke text-[0.65rem] font-mono">·</span>
                    <Badge variant={({
                      AVAILABLE: 'green', SOLD: 'smoke', RESERVED: 'blue', BOOKED: 'blue',
                      ON_HOLD: 'smoke', UNDER_INSPECTION: 'smoke', REMOVED: 'red'
                    }[viewEnq.car.status] || 'smoke')}>
                      {viewEnq.car.status || 'AVAILABLE'}
                    </Badge>
                  </div>
                </div>
              </div>
            )}
            <div className="flex justify-between items-center pt-2">
              <div className="flex flex-wrap gap-2">
                {STATUSES.map(s => (
                  <button key={s} onClick={() => updateStatus(viewEnq.id, s)}
                    className={`px-3 py-1 rounded-sm text-xs transition-colors ${viewEnq.status===s ? 'bg-gold text-ink' : 'bg-ink-4 text-smoke hover:text-white hover:bg-ink-5'}`}>
                    {displayStatus(s)}
                  </button>
                ))}
              </div>
              <Button variant="ghost" size="sm" onClick={() => { deleteEnq(viewEnq.id); setViewEnq(null); }}>Delete</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Car Full View Modal */}
      <Modal isOpen={!!previewCar} onClose={() => setPreviewCar(null)} title="Car Specifications & Details" size="lg">
        {previewCar && (
          <div className="space-y-6 max-h-[72vh] overflow-y-auto pr-1">
            {/* Header / Media */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="md:col-span-1 h-48 bg-ink-3 rounded-lg overflow-hidden border border-ink-4 relative">
                {previewCar.media?.[0]?.image_url ? (
                  <img
                    src={previewCar.media[0].image_url}
                    alt={previewCar.brand_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-ink-2">
                    <span className="text-ink-5 text-4xl font-display">{previewCar.brand_name?.[0] || '⊞'}</span>
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <Badge variant={({
                    AVAILABLE: 'green', SOLD: 'smoke', RESERVED: 'blue', BOOKED: 'blue',
                    ON_HOLD: 'smoke', UNDER_INSPECTION: 'smoke', REMOVED: 'red'
                  }[previewCar.status] || 'smoke')}>
                    {previewCar.status || 'AVAILABLE'}
                  </Badge>
                </div>
                <div className="absolute top-2 left-2">
                  <span className="font-mono text-[0.65rem] bg-ink/80 text-smoke px-2 py-1 rounded-sm">#{previewCar.id}</span>
                </div>
              </div>

              {/* Quick Summary Info */}
              <div className="md:col-span-2 flex flex-col justify-between">
                <div>
                  <h3 className="text-white font-display text-xl font-bold leading-tight">
                    {previewCar.brand_name} {previewCar.Model}
                  </h3>
                  <p className="text-smoke text-sm mt-1">
                    {previewCar.manufacturing_year ? `${previewCar.manufacturing_year} Model` : 'Year unknown'}
                    {previewCar.color ? ` · ${previewCar.color}` : ''}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-ink-4">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-smoke">Asking Price</span>
                    <p className="text-gold font-display text-xl font-bold mt-0.5">{formatINR(previewCar.asking_price)}</p>
                  </div>
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-smoke">Market Price</span>
                    <p className="text-white font-display text-xl font-medium mt-0.5">{formatINR(previewCar.market_price)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Technical Specifications */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-px flex-1 bg-ink-4" />
                <span className="text-xs font-mono uppercase tracking-widest text-gold px-2">Specifications</span>
                <div className="h-px flex-1 bg-ink-4" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-ink-3 rounded-lg p-4 border border-ink-4 text-sm">
                {[
                  ['Fuel Type', previewCar.fuel_type],
                  ['Transmission', previewCar.Transmission],
                  ['KMs Driven', previewCar.kms_driven ? `${previewCar.kms_driven} km` : null],
                  ['Registration No.', previewCar.registration_no],
                  ['Engine No.', previewCar.engine_no],
                  ['Chassis No.', previewCar.chassis_no],
                ].map(([label, val]) => (
                  <div key={label}>
                    <span className="block text-[0.7rem] font-mono uppercase tracking-wider text-smoke mb-0.5">{label}</span>
                    <span className="text-white font-medium">{val || '—'}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Insurance Details */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-px flex-1 bg-ink-4" />
                <span className="text-xs font-mono uppercase tracking-widest text-gold px-2">Insurance & Location</span>
                <div className="h-px flex-1 bg-ink-4" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-ink-3 rounded-lg p-4 border border-ink-4 text-sm">
                {[
                  ['Insurance Company', previewCar.insurance_company],
                  ['Insurance Expiry', previewCar.insurance_expiry_date],
                  ['Insurance Status', previewCar.insurance_active === 1 ? 'Active' : previewCar.insurance_active === 0 ? 'Expired' : 'Unknown'],
                  ['Car Location', previewCar.location],
                ].map(([label, val]) => (
                  <div key={label}>
                    <span className="block text-[0.7rem] font-mono uppercase tracking-wider text-smoke mb-0.5">{label}</span>
                    <span className="text-white font-medium">{val || '—'}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Owner/Seller Details */}
            {previewCar.owner && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-px flex-1 bg-ink-4" />
                  <span className="text-xs font-mono uppercase tracking-widest text-gold px-2">Owner / Seller Details</span>
                  <div className="h-px flex-1 bg-ink-4" />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-ink-3 rounded-lg p-4 border border-ink-4 text-sm">
                  {[
                    ['Owner Name', previewCar.owner.name],
                    ['Phone', previewCar.owner.phone_no],
                    ['Email', previewCar.owner.email],
                    ['Address', previewCar.owner.address],
                    ['Location', previewCar.owner.location],
                  ].map(([label, val]) => (
                    <div key={label}>
                      <span className="block text-[0.7rem] font-mono uppercase tracking-wider text-smoke mb-0.5">{label}</span>
                      <span className="text-white font-medium">{val || '—'}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Links & Action */}
            <div className="flex justify-between items-center pt-4 border-t border-ink-4 mt-6">
              <div className="flex gap-4 text-xs font-mono">
                {previewCar.video_url && (
                  <a href={previewCar.video_url} target="_blank" rel="noreferrer" className="text-gold hover:underline">
                    📺 YouTube Video
                  </a>
                )}
                {previewCar.insta_url && (
                  <a href={previewCar.insta_url} target="_blank" rel="noreferrer" className="text-gold hover:underline">
                    📸 Instagram Post
                  </a>
                )}
              </div>
              <Button variant="primary" size="sm" onClick={() => setPreviewCar(null)}>Close</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
