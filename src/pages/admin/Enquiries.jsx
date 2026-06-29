import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { enquiriesApi, getMediaUrl } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { formatINR } from '../../utils/helpers';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import StatCard from '../../components/admin/StatCard';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import { MessageSquare, Bell, Phone, Clock, Car, Mail } from 'lucide-react';
import { useToast } from '../../components/ui/Toaster';
import Pagination from '../../components/admin/Pagination';

const STATUSES = [
  'NEW', 'CONTACTED', 'FOLLOW_UP', 'INTERESTED',
  'NEGOTIATION', 'TEST_DRIVE', 'BOOKED',
  'PURCHASED', 'NOT_INTERESTED', 'CLOSED',
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

const carStatusVariant = (s) => ({ AVAILABLE:'green', SOLD:'smoke', RESERVED:'blue', BOOKED:'blue', ON_HOLD:'smoke', UNDER_INSPECTION:'smoke', REMOVED:'red' }[s] || 'smoke');

// Shared table header cell
const TH = ({ children }) => (
  <th className="text-left px-4 py-3 text-xs font-mono uppercase tracking-widest text-orange-brand font-semibold whitespace-nowrap">
    {children}
  </th>
);

export default function AdminEnquiries() {
  const { canOp } = useAuth();
  const toast = useToast();
  const location = useLocation();

  // Active tab: 'car' | 'contact'
  const [activeTab, setActiveTab] = useState('car');

  // Per-tab state
  const [carEnqs,       setCarEnqs]       = useState([]);
  const [carTotal,      setCarTotal]      = useState(0);
  const [carPage,       setCarPage]       = useState(1);
  const [carTotalPages, setCarTotalPages] = useState(1);
  const [carLoading,    setCarLoading]    = useState(true);
  const [carStatus,     setCarStatus]     = useState('');

  const [ctcEnqs,       setCtcEnqs]       = useState([]);
  const [ctcTotal,      setCtcTotal]      = useState(0);
  const [ctcPage,       setCtcPage]       = useState(1);
  const [ctcTotalPages, setCtcTotalPages] = useState(1);
  const [ctcLoading,    setCtcLoading]    = useState(true);
  const [ctcStatus,     setCtcStatus]     = useState('');

  const [error,   setError]   = useState('');
  const [stats,   setStats]   = useState(null);
  const [viewEnq, setViewEnq] = useState(null);
  const [previewCar, setPreviewCar] = useState(null);

  // ── Loaders ─────────────────────────────────────────────────────────────
  const loadCar = useCallback(async (p = 1) => {
    setCarLoading(true);
    try {
      const params = { page: p, limit: 6, type: 'car' };
      if (carStatus) params.status = carStatus;
      const res = await enquiriesApi.list(params);
      const d = res?.data;
      setCarEnqs(d?.enquiries ?? []);
      setCarTotal(d?.pagination?.total ?? 0);
      setCarTotalPages(d?.pagination?.totalPages ?? 1);
      setCarPage(p);
    } catch (err) { setError(err.message); }
    finally { setCarLoading(false); }
  }, [carStatus]);

  const loadCtc = useCallback(async (p = 1) => {
    setCtcLoading(true);
    try {
      const params = { page: p, limit: 6, type: 'contact' };
      if (ctcStatus) params.status = ctcStatus;
      const res = await enquiriesApi.list(params);
      const d = res?.data;
      setCtcEnqs(d?.enquiries ?? []);
      setCtcTotal(d?.pagination?.total ?? 0);
      setCtcTotalPages(d?.pagination?.totalPages ?? 1);
      setCtcPage(p);
    } catch (err) { setError(err.message); }
    finally { setCtcLoading(false); }
  }, [ctcStatus]);

  useEffect(() => {
    loadCar(1);
    enquiriesApi.stats()
      .then(r => setStats(r?.data ?? r))
      .catch(() => {});
  }, [loadCar]);

  useEffect(() => { loadCtc(1); }, [loadCtc]);

  // Open view modal or filter by car when navigated here with ?view=ID or ?car_id=ID
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const viewId  = params.get('view');
    const carId   = params.get('car_id');
    if (viewId) {
      enquiriesApi.get(viewId)
        .then(res => { if (res?.data) setViewEnq(res.data); })
        .catch(() => {});
    }
    if (carId) {
      // Switch to Car Enquiries tab and filter by this car
      setActiveTab('car');
      // The backend supports filtering by car_id; reload with that param
      setCarLoading(true);
      enquiriesApi.list({ page: 1, limit: 6, type: 'car', car_id: carId })
        .then(res => {
          const d = res?.data;
          setCarEnqs(d?.enquiries ?? []);
          setCarTotal(d?.pagination?.total ?? 0);
          setCarTotalPages(d?.pagination?.totalPages ?? 1);
          setCarPage(1);
        })
        .catch(() => {})
        .finally(() => setCarLoading(false));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  // ── Actions ──────────────────────────────────────────────────────────────
  const updateStatus = async (id, status) => {
    try {
      await enquiriesApi.updateStatus(id, status);
      toast.success('Status updated');
      loadCar(carPage);
      loadCtc(ctcPage);
      if (viewEnq?.id === id) setViewEnq(e => ({ ...e, status }));
    } catch (err) { toast.error(err.message || 'Failed to update status'); }
  };

  const deleteEnq = async (id) => {
    if (!confirm('Delete this enquiry?')) return;
    try {
      await enquiriesApi.delete(id);
      toast.success('Enquiry deleted');
      loadCar(carPage);
      loadCtc(ctcPage);
      if (viewEnq?.id === id) setViewEnq(null);
    } catch (err) { toast.error(err.message || 'Failed to delete enquiry'); }
  };

  // ── Shared row actions cell ───────────────────────────────────────────────
  const ActionsCell = ({ enq }) => (
    <td className="px-4 py-3">
      <div className="flex items-center gap-1">
        <button onClick={() => setViewEnq(enq)}
          className="w-7 h-7 rounded-sm flex items-center justify-center text-smoke hover:text-white bg-ink-4 hover:bg-ink-5 transition-colors text-xs">
          👁
        </button>
        {canOp('enquiries', 'update') && (
          <select value={enq.status || 'NEW'} onChange={e => updateStatus(enq.id, e.target.value)}
            className="bg-ink-4 border-0 text-smoke text-xs rounded-sm px-2 py-1 focus:outline-none hover:bg-ink-5 transition-colors">
            {STATUSES.map(s => <option key={s} value={s}>{displayStatus(s)}</option>)}
          </select>
        )}
        {canOp('enquiries', 'delete') && (
          <button onClick={() => deleteEnq(enq.id)}
            className="w-7 h-7 rounded-sm flex items-center justify-center text-smoke hover:text-crimson bg-ink-4 hover:bg-crimson/10 transition-colors text-xs">
            ✕
          </button>
        )}
      </div>
    </td>
  );

  // ── Car cell (image + brand + model + year like SoldCars) ─────────────────
  const CarCell = ({ car }) => car ? (
    <td className="px-4 py-3">
      <button onClick={() => setPreviewCar(car)} className="flex items-center gap-2 text-left group">
        {car.media?.[0]?.image_url ? (
          <img src={getMediaUrl(car.media[0].image_url)} alt="" loading="lazy"
            className="w-9 h-7 object-cover rounded-sm shrink-0 border border-ink-4" />
        ) : (
          <div className="w-9 h-7 rounded-sm bg-ink-4 border border-ink-5 flex items-center justify-center shrink-0">
            <Car size={12} className="text-smoke" />
          </div>
        )}
        <div>
          <p className="text-white text-xs font-medium group-hover:text-gold transition-colors">
            {car.brand_name} {car.Model}
          </p>
          <p className="text-smoke text-[10px] font-mono">{car.manufacturing_year} · {car.registration_no || '—'}</p>
        </div>
      </button>
    </td>
  ) : (
    <td className="px-4 py-3 text-smoke text-xs font-mono">General</td>
  );

  return (
    <div className="p-8 pb-12 flex flex-col gap-6 max-[480px]:p-5">
      {/* <AdminPageHeader title="Enquiries" sub={`${carTotal + ctcTotal} total`} /> */}

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard icon={MessageSquare} label="Car Enquiries"     value={stats.car_enquiries ?? 0}     sub="For specific cars"  color="indigo" />
          <StatCard icon={Mail}          label="Contact Forms"     value={stats.contact_enquiries ?? 0} sub="General messages"   color="blue"   />
          <StatCard icon={Phone}         label="New"               value={stats.by_status?.find(b => b.status === 'NEW')?.count ?? 0} sub="Unread" color="emerald" />
          <StatCard icon={Clock}         label="Today"             value={stats.today_new ?? 0}         sub="Received today"     color="gold"   />
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 border-b border-ink-4">
        {[
          { key: 'car',     label: 'Car Enquiries',          count: carTotal },
          { key: 'contact', label: 'Contact Form Enquiries', count: ctcTotal },
        ].map(({ key, label, count }) => (
          <button key={key} onClick={() => setActiveTab(key)}
            className={`px-5 py-2.5 text-sm font-medium transition-colors relative border-b-2 -mb-px
              ${activeTab === key
                ? 'text-white border-gold'
                : 'text-smoke border-transparent hover:text-mist hover:border-ink-5'
              }`}
          >
            {label}
            <span className={`ml-2 text-xs font-mono px-1.5 py-0.5 rounded-full ${activeTab === key ? 'bg-gold/20 text-gold' : 'bg-ink-4 text-smoke'}`}>
              {count}
            </span>
          </button>
        ))}
      </div>

      {error && <div className="bg-crimson/10 border border-crimson/30 rounded-md px-4 py-3 text-crimson text-sm">{error}</div>}

      {/* ── Car Enquiries Tab ── */}
      {activeTab === 'car' && (
        <>
          <div className="flex gap-3 flex-wrap">
            <select value={carStatus} onChange={e => setCarStatus(e.target.value)}
              className="bg-ink-2 border border-ink-4 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-gold">
              <option value="">All Statuses</option>
              {STATUSES.map(s => <option key={s} value={s}>{displayStatus(s)}</option>)}
            </select>
          </div>

          <div className="bg-ink-2 border border-ink-4 rounded-lg overflow-hidden" style={{ borderTop: '3px solid #FF5A09' }}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-ink-4 bg-orange-tint">
                    {['#', 'Car', 'Name', 'Phone', 'Email', 'Status', 'Date', 'Actions'].map(h => (
                      <TH key={h}>{h}</TH>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {carLoading ? (
                    <tr><td colSpan={8} className="px-4 py-8 text-center text-smoke">Loading…</td></tr>
                  ) : carEnqs.length === 0 ? (
                    <tr><td colSpan={8} className="px-4 py-8 text-center text-smoke">No car enquiries found.</td></tr>
                  ) : carEnqs.map(enq => (
                    <tr key={enq.id} className="border-b border-ink-4 hover:bg-orange-row transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-smoke">#{enq.id}</td>
                      <CarCell car={enq.car} />
                      <td className="px-4 py-3 font-medium">
                        <button onClick={() => setViewEnq(enq)}
                          className="text-left text-white hover:text-gold hover:underline font-medium focus:outline-none transition-all">
                          {enq.name || '—'}
                        </button>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-smoke">{enq.phone || '—'}</td>
                      <td className="px-4 py-3 text-smoke text-xs">{enq.email || '—'}</td>
                      <td className="px-4 py-3"><Badge variant={statusVariant(enq.status)}>{displayStatus(enq.status)}</Badge></td>
                      <td className="px-4 py-3 font-mono text-xs text-smoke">
                        {enq.created_at ? new Date(enq.created_at).toLocaleString('en-IN',{day:'numeric',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit',hour12:true}) : '—'}
                      </td>
                      <ActionsCell enq={enq} />
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <Pagination page={carPage} totalPages={carTotalPages} onPageChange={loadCar} total={carTotal} limit={6} />
        </>
      )}

      {/* ── Contact Form Enquiries Tab ── */}
      {activeTab === 'contact' && (
        <>
          <div className="flex gap-3 flex-wrap">
            <select value={ctcStatus} onChange={e => setCtcStatus(e.target.value)}
              className="bg-ink-2 border border-ink-4 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-gold">
              <option value="">All Statuses</option>
              {STATUSES.map(s => <option key={s} value={s}>{displayStatus(s)}</option>)}
            </select>
          </div>

          <div className="bg-ink-2 border border-ink-4 rounded-lg overflow-hidden" style={{ borderTop: '3px solid #FF5A09' }}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-ink-4 bg-orange-tint">
                    {['#', 'Name', 'Phone', 'Email', 'Message', 'Status', 'Date', 'Actions'].map(h => (
                      <TH key={h}>{h}</TH>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ctcLoading ? (
                    <tr><td colSpan={8} className="px-4 py-8 text-center text-smoke">Loading…</td></tr>
                  ) : ctcEnqs.length === 0 ? (
                    <tr><td colSpan={8} className="px-4 py-8 text-center text-smoke">No contact enquiries found.</td></tr>
                  ) : ctcEnqs.map(enq => (
                    <tr key={enq.id} className="border-b border-ink-4 hover:bg-orange-row transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-smoke">#{enq.id}</td>
                      <td className="px-4 py-3 font-medium">
                        <button onClick={() => setViewEnq(enq)}
                          className="text-left text-white hover:text-gold hover:underline font-medium focus:outline-none transition-all">
                          {enq.name || '—'}
                        </button>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-smoke">{enq.phone || '—'}</td>
                      <td className="px-4 py-3 text-smoke text-xs">{enq.email || '—'}</td>
                      <td className="px-4 py-3 text-smoke text-xs max-w-[200px]">
                        <span className="line-clamp-2">{enq.message || '—'}</span>
                      </td>
                      <td className="px-4 py-3"><Badge variant={statusVariant(enq.status)}>{displayStatus(enq.status)}</Badge></td>
                      <td className="px-4 py-3 font-mono text-xs text-smoke">
                        {enq.created_at ? new Date(enq.created_at).toLocaleString('en-IN',{day:'numeric',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit',hour12:true}) : '—'}
                      </td>
                      <ActionsCell enq={enq} />
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <Pagination page={ctcPage} totalPages={ctcTotalPages} onPageChange={loadCtc} total={ctcTotal} limit={6} />
        </>
      )}

      {/* ── View Enquiry Modal ── */}
      <Modal isOpen={!!viewEnq} onClose={() => setViewEnq(null)} title="Enquiry Detail" size="md">
        {viewEnq && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {[
                ['Name',    viewEnq.name],
                ['Phone',   viewEnq.phone],
                ['Email',   viewEnq.email],
                ['Address', viewEnq.address],
                ['Type',    viewEnq.car ? 'Car Enquiry' : 'Contact Form'],
                ['Date',    viewEnq.created_at ? new Date(viewEnq.created_at).toLocaleString('en-IN') : '—'],
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
            {/* Car preview inside enquiry detail */}
            {viewEnq.car && (
              <div className="border border-ink-4 rounded-lg bg-ink-3 p-3 flex gap-3 items-center">
                <div className="w-16 h-12 rounded bg-ink-2 overflow-hidden shrink-0 border border-ink-4">
                  {viewEnq.car.media?.[0]?.image_url ? (
                    <img src={getMediaUrl(viewEnq.car.media[0].image_url)} alt={viewEnq.car.brand_name}
                      className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Car size={18} className="text-smoke" />
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
                    <Badge variant={carStatusVariant(viewEnq.car.status)}>{viewEnq.car.status || 'AVAILABLE'}</Badge>
                  </div>
                </div>
              </div>
            )}
            {/* Status change buttons */}
            <div className="flex justify-between items-center pt-2">
              {canOp('enquiries', 'update') ? (
                <div className="flex flex-wrap gap-2">
                  {STATUSES.map(s => (
                    <button key={s} onClick={() => updateStatus(viewEnq.id, s)}
                      className={`px-3 py-1 rounded-sm text-xs transition-colors
                        ${viewEnq.status === s ? 'bg-gold text-ink' : 'bg-ink-4 text-smoke hover:text-white hover:bg-ink-5'}`}>
                      {displayStatus(s)}
                    </button>
                  ))}
                </div>
              ) : <div />}
              {canOp('enquiries', 'delete') && (
                <Button variant="ghost" size="sm" onClick={() => { deleteEnq(viewEnq.id); setViewEnq(null); }}>Delete</Button>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* ── Car Preview Modal ── */}
      <Modal isOpen={!!previewCar} onClose={() => setPreviewCar(null)} title="Car Specifications & Details" size="lg">
        {previewCar && (
          <div className="space-y-6 max-h-[72vh] overflow-y-auto pr-1">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="md:col-span-1 h-48 bg-ink-3 rounded-lg overflow-hidden border border-ink-4 relative">
                {previewCar.media?.[0]?.image_url ? (
                  <img src={getMediaUrl(previewCar.media[0].image_url)} alt={previewCar.brand_name}
                    className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-ink-2">
                    <Car size={40} className="text-smoke" />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <Badge variant={carStatusVariant(previewCar.status)}>{previewCar.status || 'AVAILABLE'}</Badge>
                </div>
                <div className="absolute top-2 left-2">
                  <span className="font-mono text-[0.65rem] bg-ink/80 text-smoke px-2 py-1 rounded-sm">#{previewCar.id}</span>
                </div>
              </div>
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

            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-px flex-1 bg-ink-4" />
                <span className="text-xs font-mono uppercase tracking-widest text-gold px-2">Specifications</span>
                <div className="h-px flex-1 bg-ink-4" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-ink-3 rounded-lg p-4 border border-ink-4 text-sm">
                {[
                  ['Fuel Type',        previewCar.fuel_type],
                  ['Transmission',     previewCar.Transmission],
                  ['KMs Driven',       previewCar.kms_driven ? `${previewCar.kms_driven} km` : null],
                  ['Registration No.', previewCar.registration_no],
                ].map(([label, val]) => (
                  <div key={label}>
                    <span className="block text-[0.7rem] font-mono uppercase tracking-wider text-smoke mb-0.5">{label}</span>
                    <span className="text-white font-medium">{val || '—'}</span>
                  </div>
                ))}
              </div>
            </div>

            {previewCar.owner && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-px flex-1 bg-ink-4" />
                  <span className="text-xs font-mono uppercase tracking-widest text-gold px-2">Owner / Seller</span>
                  <div className="h-px flex-1 bg-ink-4" />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-ink-3 rounded-lg p-4 border border-ink-4 text-sm">
                  {[
                    ['Name',     previewCar.owner.name],
                    ['Phone',    previewCar.owner.phone_no],
                    ['Email',    previewCar.owner.email],
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

            <div className="flex justify-end pt-2 border-t border-ink-4">
              <Button variant="primary" size="sm" onClick={() => setPreviewCar(null)}>Close</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
