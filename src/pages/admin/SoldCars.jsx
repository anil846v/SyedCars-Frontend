import { useState, useEffect, useCallback } from 'react';
import { soldCarsApi, adminCarsApi, commissionsApi, getMediaUrl } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { formatINR } from '../../utils/helpers';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import StatCard from '../../components/admin/StatCard';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { CheckCircle, Bookmark, Clock } from 'lucide-react';
import { useToast } from '../../components/ui/Toaster';
import Pagination from '../../components/admin/Pagination';

const statusVariant = (s) => ({ SOLD: 'green', BOOKED: 'blue', RESERVED: 'blue' }[s] || 'smoke');
const inputClass = 'w-full bg-ink border border-ink-4 rounded-md px-3 py-2 text-white text-sm placeholder-ink-5 focus:outline-none focus:border-gold transition-colors';
const labelClass = 'block text-xs font-mono uppercase tracking-wider text-smoke mb-1';
const PAYMENT_MODES = ['Cash', 'Bank Transfer', 'Cheque', 'UPI'];

// SVG Icons
const EyeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
  </svg>
);
const EditIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);
const SellIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const EMPTY_BUYER = { name: '', phone: '', email: '', address: '', price: '', adhar_no: '', driving_license_no: '' };

const PaymentSelect = ({ value, onChange }) => (
  <select value={value} onChange={onChange} className={inputClass}>
    <option value="">Select…</option>
    {PAYMENT_MODES.map(m => <option key={m} value={m}>{m}</option>)}
  </select>
);

const BuyerFields = ({ vals, onChange, idPrefix = '' }) => {
  const handleChange = (k) => (e) => {
    let val = e.target.value;
    if (k === 'phone') val = val.replace(/\D/g, '').slice(0, 10);
    else if (k === 'price' || k === 'adhar_no') val = val.replace(/\D/g, '');
    onChange(k)({ target: { value: val } });
  };
  return (
    <>
      <div className="col-span-2 flex items-center gap-2 mt-2 mb-1">
        <div className="h-px flex-1 bg-ink-4" />
        <span className="text-[0.65rem] font-mono uppercase tracking-widest text-gold px-2">Buyer Details</span>
        <div className="h-px flex-1 bg-ink-4" />
      </div>
      {[
        { k: 'name',               label: 'Buyer Name *',            },
        { k: 'phone',              label: 'Phone Number *',          },
        { k: 'email',              label: 'Email Address',           },
        { k: 'address',            label: 'Address',                 },
        { k: 'price',              label: 'Deal / Sold Price (₹) *', },
        { k: 'adhar_no',           label: 'Aadhar Card No.',         },
        { k: 'driving_license_no', label: 'Driving License No.',     },
      ].map(({ k, label }) => (
        <div key={k}>
          <label className={labelClass}>{label}</label>
          <input
            id={`${idPrefix}-${k}`}
            type={k === 'email' ? 'email' : 'text'}
            inputMode={k === 'phone' || k === 'price' || k === 'adhar_no' ? 'numeric' : undefined}
            maxLength={k === 'phone' ? 10 : undefined}
            value={vals[k] || ''}
            onChange={handleChange(k)}
            className={inputClass}
            placeholder={label.replace(' *', '')}
          />
        </div>
      ))}
    </>
  );
};

export default function AdminSoldCars() {
  const { canOp, user } = useAuth();
  const toast = useToast();
  const [cars,        setCars]        = useState([]);
  const [total,       setTotal]       = useState(0);
  const [page,        setPage]        = useState(1);
  const [totalPages,  setTotalPages]  = useState(1);
  const [summary,     setSummary]     = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState('');
  const [filterStatus,setFilterStatus]= useState('');
  const [search,      setSearch]      = useState('');

  // Mark Sold modal state (for RESERVED/BOOKED cars in table)
  const [sellModal,   setSellModal]   = useState(false);
  const [sellCar,     setSellCar]     = useState(null);
  const [sellForm,    setSellForm]    = useState({ payment_mode: '', notes: '', buyer: { ...EMPTY_BUYER }, bank_name: '', bank_account: '', ifsc_code: '', upi_id: '', cheque_number: '' });
  const [selling,     setSelling]     = useState(false);
  const [sellError,   setSellError]   = useState('');

  // Direct Sell modal state ("Sell a Car" button — pick any non-sold car)
  const [directModal,   setDirectModal]   = useState(false);
  const [availableCars, setAvailableCars] = useState([]);
  const [avLoading,     setAvLoading]     = useState(false);
  const [selectedCarId, setSelectedCarId] = useState('');
  const [directForm,    setDirectForm]    = useState({ payment_mode: '', notes: '', buyer: { ...EMPTY_BUYER }, bank_name: '', bank_account: '', ifsc_code: '', upi_id: '', cheque_number: '' });
  const [directSelling, setDirectSelling] = useState(false);
  const [directError,   setDirectError]   = useState('');

  // View modal state
  const [viewModal,   setViewModal]   = useState(false);
  const [viewCar,     setViewCar]     = useState(null);

  // Commission payment state (for sell + edit modals)
  const EMPTY_COMM = { seller_amount: '', buyer_amount: '' };
  const [sellCommForm, setSellCommForm] = useState(EMPTY_COMM);
  const [editCommForm, setEditCommForm] = useState(EMPTY_COMM);

  // Edit modal state
  const [editModal,   setEditModal]   = useState(false);
  const [editCar,     setEditCar]     = useState(null);
  const [editForm,    setEditForm]    = useState({ buyer: { ...EMPTY_BUYER }, payment_mode: '', notes: '', bank_name: '', bank_account: '', ifsc_code: '', upi_id: '', cheque_number: '' });
  const [editSaving,  setEditSaving]  = useState(false);
  const [editError,   setEditError]   = useState('');

  const load = useCallback(async (p = 1) => {
    setLoading(true); setError('');
    try {
      const params = { page: p, limit: 6 };
      if (filterStatus) params.status = filterStatus;
      if (search)       params.search = search;
      const res = await soldCarsApi.list(params);
      const d = res?.data;
      setCars(d?.cars ?? []);
      setSummary(d?.summary ?? []);
      setTotal(d?.pagination?.total ?? 0);
      setTotalPages(d?.pagination?.totalPages ?? 1);
      setPage(p);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filterStatus, search]);

  useEffect(() => { load(1); }, [load]);

  // ── Open Sell Modal ──────────────────────────────────────────────────────
  const openSell = (car) => {
    setSellCar(car);
    const b = car.buyer;
    setSellForm({
      payment_mode: car.payment_mode || '',
      notes: car.notes || '',
      bank_name: car.bank_name || '',
      bank_account: car.bank_account || '',
      ifsc_code: car.ifsc_code || '',
      upi_id: car.upi_id || '',
      cheque_number: car.cheque_number || '',
      buyer: {
        name:                b?.name || b?.username || '',
        phone:               b?.phone_no || '',
        email:               b?.email || '',
        address:             b?.address || '',
        price:               b?.price || car.asking_price || '',
        adhar_no:            b?.adhar_no || '',
        driving_license_no:  b?.driving_license_no || '',
      }
    });
    setSellCommForm(EMPTY_COMM);
    setSellError('');
    setSellModal(true);
  };

  const confirmSell = async () => {
    if (!sellForm.buyer.name || !sellForm.buyer.phone || !sellForm.buyer.price) {
      setSellError('Buyer Name, Phone, and Price are required.');
      return;
    }
    setSelling(true); setSellError('');
    try {
      await soldCarsApi.markSold(sellCar.id, {
        sold_price: sellForm.buyer.price,
        payment_mode: sellForm.payment_mode,
        notes: sellForm.notes,
        bank_name: sellForm.bank_name,
        bank_account: sellForm.bank_account,
        ifsc_code: sellForm.ifsc_code,
        upi_id: sellForm.upi_id,
        cheque_number: sellForm.cheque_number,
        buyer: sellForm.buyer,
      });
      if (sellCar.commission && (sellCommForm.seller_amount || sellCommForm.buyer_amount)) {
        const parties = [];
        if (sellCommForm.seller_amount) parties.push('seller');
        if (sellCommForm.buyer_amount) parties.push('buyer');
        try { await commissionsApi.recordPayment(sellCar.commission.id, { parties, seller_amount: Number(sellCommForm.seller_amount)||0, buyer_amount: Number(sellCommForm.buyer_amount)||0 }); } catch {}
      }
      toast.success('Car marked as sold!');
      setSellModal(false);
      load(page);
    } catch (err) {
      setSellError(err.message || 'Failed');
      toast.error(err.message || 'Failed to mark as sold');
    } finally {
      setSelling(false);
    }
  };

  // ── Fetch non-sold cars for direct-sell picker ────────────────────────────
  const loadAvailableCars = async () => {
    setAvLoading(true);
    try {
      const res = await adminCarsApi.list({ limit: 200 });
      const all = res?.data?.cars ?? [];
      setAvailableCars(all.filter(c => c.status !== 'SOLD' && c.status !== 'REMOVED'));
    } catch {
      setAvailableCars([]);
    } finally {
      setAvLoading(false);
    }
  };

  // ── Open Direct Sell Modal ────────────────────────────────────────────────
  const openDirect = () => {
    setSelectedCarId('');
    setDirectForm({ payment_mode: '', notes: '', buyer: { ...EMPTY_BUYER }, bank_name: '', bank_account: '', ifsc_code: '', upi_id: '', cheque_number: '' });
    setDirectError('');
    setDirectModal(true);
    loadAvailableCars();
  };

  const handleCarSelect = (e) => {
    const id = e.target.value;
    setSelectedCarId(id);
    if (id) {
      const found = availableCars.find(c => String(c.id) === String(id));
      if (found) setDirectForm(p => ({ ...p, buyer: { ...p.buyer, price: found.asking_price || '' } }));
    }
  };

  const confirmDirect = async () => {
    if (!selectedCarId) { setDirectError('Please select a car.'); return; }
    if (!directForm.buyer.name || !directForm.buyer.phone || !directForm.buyer.price) {
      setDirectError('Buyer Name, Phone, and Price are required.');
      return;
    }
    setDirectSelling(true); setDirectError('');
    try {
      await soldCarsApi.markSold(selectedCarId, {
        sold_price: directForm.buyer.price,
        payment_mode: directForm.payment_mode,
        notes: directForm.notes,
        bank_name: directForm.bank_name,
        bank_account: directForm.bank_account,
        ifsc_code: directForm.ifsc_code,
        upi_id: directForm.upi_id,
        cheque_number: directForm.cheque_number,
        buyer: directForm.buyer,
      });
      toast.success('Car sold successfully!');
      setDirectModal(false);
      load(page);
    } catch (err) {
      setDirectError(err.message || 'Failed to sell car');
      toast.error(err.message || 'Failed to sell car');
    } finally {
      setDirectSelling(false);
    }
  };

  // ── Open View Modal ──────────────────────────────────────────────────────
  const openView = (car) => {
    setViewCar(car);
    setViewModal(true);
  };

  // ── Open Edit Modal ──────────────────────────────────────────────────────
  const openEdit = (car) => {
    setEditCar(car);
    const b = car.buyer;
    setEditForm({
      payment_mode: car.payment_mode || '',
      notes: car.notes || '',
      bank_name: car.bank_name || '',
      bank_account: car.bank_account || '',
      ifsc_code: car.ifsc_code || '',
      upi_id: car.upi_id || '',
      cheque_number: car.cheque_number || '',
      buyer: {
        name:               b?.name || b?.username || '',
        phone:              b?.phone_no || '',
        email:              b?.email || '',
        address:            b?.address || '',
        price:              b?.price || car.asking_price || '',
        adhar_no:           b?.adhar_no || '',
        driving_license_no: b?.driving_license_no || '',
      }
    });
    setEditCommForm(EMPTY_COMM);
    setEditError('');
    setEditModal(true);
  };

  const saveEdit = async () => {
    setEditSaving(true); setEditError('');
    try {
      await soldCarsApi.update(editCar.id, {
        buyer: editForm.buyer,
        payment_mode: editForm.payment_mode,
        notes: editForm.notes,
        bank_name: editForm.bank_name,
        bank_account: editForm.bank_account,
        ifsc_code: editForm.ifsc_code,
        upi_id: editForm.upi_id,
        cheque_number: editForm.cheque_number,
      });
      if (editCar.commission && (editCommForm.seller_amount || editCommForm.buyer_amount)) {
        const parties = [];
        if (editCommForm.seller_amount) parties.push('seller');
        if (editCommForm.buyer_amount) parties.push('buyer');
        try { await commissionsApi.recordPayment(editCar.commission.id, { parties, seller_amount: Number(editCommForm.seller_amount)||0, buyer_amount: Number(editCommForm.buyer_amount)||0 }); } catch {}
      }
      toast.success('Details updated!');
      setEditModal(false);
      load(page);
    } catch (err) {
      setEditError(err.message || 'Failed to update');
      toast.error(err.message || 'Failed to update');
    } finally {
      setEditSaving(false);
    }
  };

  const summaryMap = summary.reduce((acc, s) => { acc[s.status] = s; return acc; }, {});

  const bf = (k) => (e) => setSellForm(p => ({ ...p, buyer: { ...p.buyer, [k]: e.target.value } }));
  const df = (k) => (e) => setDirectForm(p => ({ ...p, buyer: { ...p.buyer, [k]: e.target.value } }));
  const ef = (k) => (e) => setEditForm(p => ({ ...p, buyer: { ...p.buyer, [k]: e.target.value } }));

  return (
    <div className="p-8 pb-12 flex flex-col gap-6 max-[480px]:p-5">
      {/* Header with Sell a Car button */}
     

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard icon={CheckCircle} label="Sold" value={summaryMap['SOLD']?.count ?? 0} sub="Completed sales" color="emerald" />
        <StatCard icon={Bookmark} label="Booked" value={summaryMap['BOOKED']?.count ?? 0} sub="Awaiting sale" color="blue" />
        <StatCard icon={Clock} label="Reserved" value={summaryMap['RESERVED']?.count ?? 0} sub="On hold" color="gold" />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search brand, model, reg no…"
          className="flex-1 min-w-[180px] max-w-xs bg-ink-2 border border-ink-4 rounded-md px-4 py-2 text-white text-sm placeholder-smoke focus:outline-none focus:border-gold" />
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="bg-ink-2 border border-ink-4 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-gold">
          <option value="">All (Sold / Booked / Reserved)</option>
          <option value="SOLD">SOLD</option>
          <option value="BOOKED">BOOKED</option>
          <option value="RESERVED">RESERVED</option>
        </select>
         <div className="flex items-center justify-between gap-4 flex-wrap">
        {/* <AdminPageHeader title="Sold Cars" sub={`${total} records`} /> */}
        {canOp('sold-cars','add') && (
          <button
            onClick={openDirect}
            className="flex items-center gap-1 px-4 py-1 h-10 rounded-md bg-gold text-ink text-sm font-semibold hover:bg-gold/90 transition-colors"
          >
             + Sell a Car
          </button>
        )}
      </div>
      </div>

      {error && <div className="bg-crimson/10 border border-crimson/30 rounded-md px-4 py-3 text-crimson text-sm">{error}</div>}

      {/* Table */}
      <div className="bg-ink-2 border border-ink-4 rounded-lg overflow-hidden" style={{ borderTop: '3px solid #FF5A09' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink-4 bg-orange-tint">
                {['#','Car','Reg No.','Owner','Buyer','Deal Price','Transaction Date','Commission','Status','Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-mono uppercase tracking-widest text-orange-brand font-semibold whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={10} className="px-4 py-8 text-center text-smoke">Loading…</td></tr>
              ) : cars.length === 0 ? (
                <tr><td colSpan={10} className="px-4 py-8 text-center text-smoke">No records found.</td></tr>
              ) : cars.map(car => (
                <tr key={car.id} className="border-b border-ink-4 hover:bg-orange-row transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-smoke">#{car.id}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {car.media?.[0]?.image_url && (
                        <img src={getMediaUrl(car.media[0].image_url)} alt="" loading="lazy" className="w-9 h-7 object-cover rounded-sm shrink-0" />
                      )}
                      <div>
                        <p className="text-white text-xs font-medium">{car.brand_name} {car.Model}</p>
                        <p className="text-smoke text-[10px] font-mono">{car.manufacturing_year} · {car.color}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-smoke text-xs font-mono">{car.registration_no || '—'}</td>
                  <td className="px-4 py-3 text-smoke text-xs">{car.owner?.name || '—'}</td>
                  <td className="px-4 py-3 text-xs">
                    {car.buyer ? (
                      <div>
                        <p className="text-white">{car.buyer.name || car.buyer.username}</p>
                        <p className="text-smoke font-mono text-[10px]">{car.buyer.phone_no}</p>
                      </div>
                    ) : <span className="text-smoke">—</span>}
                  </td>
                  <td className="px-4 py-3 text-gold font-medium text-xs">{car.buyer?.price ? formatINR(car.buyer.price) : formatINR(car.asking_price)}</td>
                  <td className="px-4 py-3 text-smoke text-xs font-mono">
                    {car.status_changed_at
                      ? new Date(car.status_changed_at).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })
                      : car.buyer?.booking_date
                        ? new Date(car.buyer.booking_date).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })
                        : '—'}
                  </td>
                  <td className="px-4 py-3 text-xs">
                    {car.commission ? (
                      <div className="text-[10px] font-mono">
                        <p className="text-smoke">S: <span className="text-white">{formatINR(car.commission.seller_commission)}</span></p>
                        <p className="text-smoke">B: <span className="text-white">{formatINR(car.commission.buyer_commission)}</span></p>
                      </div>
                    ) : <span className="text-smoke text-[10px]">No record</span>}
                  </td>
                  <td className="px-4 py-3"><Badge variant={statusVariant(car.status)}>{car.status}</Badge></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      {/* View */}
                      <button onClick={() => openView(car)} title="View details"
                        className="w-7 h-7 flex items-center justify-center rounded-md bg-ink-4 hover:bg-ink-5 text-smoke hover:text-white transition-colors">
                        <EyeIcon />
                      </button>
                      {/* Edit */}
                      {canOp('sold-cars','update') && (
                        <button onClick={() => openEdit(car)} title="Edit buyer details"
                          className="w-7 h-7 flex items-center justify-center rounded-md bg-ink-4 hover:bg-gold/10 text-smoke hover:text-gold transition-colors">
                          <EditIcon />
                        </button>
                      )}
                      {/* Mark Sold */}
                      {car.status !== 'SOLD' && canOp('sold-cars','add') && (
                        <button onClick={() => openSell(car)} title="Mark as Sold"
                          className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-gold/10 hover:bg-gold/20 text-gold text-xs transition-colors whitespace-nowrap">
                          <SellIcon /><span>Mark Sold</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination page={page} totalPages={totalPages} onPageChange={load} total={total} limit={6} />

      {/* ── Direct Sell Modal ("Sell a Car" from header) ── */}
      <Modal isOpen={directModal} onClose={() => setDirectModal(false)} title="Sell a Car" size="md">
        {directError && <div className="bg-crimson/10 border border-crimson/30 rounded-md px-4 py-3 text-crimson text-sm mb-4">{directError}</div>}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[65vh] overflow-y-auto pr-1">
          {/* Car selector */}
          <div className="col-span-2">
            <label className={labelClass}>Select Car *</label>
            {avLoading ? (
              <div className="text-smoke text-sm py-2">Loading cars…</div>
            ) : (
              <select value={selectedCarId} onChange={handleCarSelect} className={inputClass}>
                <option value="">— Choose a car —</option>
                {availableCars.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.brand_name} {c.Model} ({c.manufacturing_year}) — {c.registration_no || 'No Reg'} [{c.status}]
                  </option>
                ))}
              </select>
            )}
          </div>
          {/* Buyer fields */}
          <BuyerFields vals={directForm.buyer} onChange={df} idPrefix="direct" />
          {/* Transaction */}
          <div className="col-span-2 flex items-center gap-2 mt-2 mb-1">
            <div className="h-px flex-1 bg-ink-4" />
            <span className="text-[0.65rem] font-mono uppercase tracking-widest text-smoke px-2">Transaction</span>
            <div className="h-px flex-1 bg-ink-4" />
          </div>
          <div>
            <label className={labelClass}>Payment Mode</label>
            <PaymentSelect value={directForm.payment_mode} onChange={e => setDirectForm(p => ({ ...p, payment_mode: e.target.value }))} />
          </div>
          {directForm.payment_mode === 'Bank Transfer' && (
            <>
              <div>
                <label className={labelClass}>Bank Name</label>
                <input type="text" value={directForm.bank_name||''} onChange={e => setDirectForm(p => ({ ...p, bank_name: e.target.value }))} placeholder="HDFC Bank" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Account Number</label>
                <input type="text" value={directForm.bank_account||''} onChange={e => setDirectForm(p => ({ ...p, bank_account: e.target.value }))} placeholder="1234567890" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>IFSC Code</label>
                <input type="text" value={directForm.ifsc_code||''} onChange={e => setDirectForm(p => ({ ...p, ifsc_code: e.target.value }))} placeholder="HDFC0001234" className={inputClass} />
              </div>
            </>
          )}
          {directForm.payment_mode === 'UPI' && (
            <div>
              <label className={labelClass}>UPI ID</label>
              <input type="text" value={directForm.upi_id||''} onChange={e => setDirectForm(p => ({ ...p, upi_id: e.target.value }))} placeholder="user@upi" className={inputClass} />
            </div>
          )}
          {directForm.payment_mode === 'Cheque' && (
            <div>
              <label className={labelClass}>Cheque Number</label>
              <input type="text" value={directForm.cheque_number||''} onChange={e => setDirectForm(p => ({ ...p, cheque_number: e.target.value }))} placeholder="123456" className={inputClass} />
            </div>
          )}
          <div>
            <label className={labelClass}>Notes</label>
            <textarea value={directForm.notes} onChange={e => setDirectForm(p => ({ ...p, notes: e.target.value }))} rows={2} className={`${inputClass} resize-none`} />
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-4 border-t border-ink-4 mt-4">
          <Button variant="ghost" onClick={() => setDirectModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={confirmDirect} disabled={directSelling}>
            {directSelling ? 'Processing…' : 'Confirm Sale'}
          </Button>
        </div>
      </Modal>

      {/* ── Mark as Sold Modal ── */}
      <Modal isOpen={sellModal} onClose={() => setSellModal(false)} title={`Mark as SOLD — ${sellCar?.brand_name} ${sellCar?.Model}`} size="md">
        {sellError && <div className="bg-crimson/10 border border-crimson/30 rounded-md px-4 py-3 text-crimson text-sm mb-4">{sellError}</div>}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[65vh] overflow-y-auto pr-1">
          <BuyerFields vals={sellForm.buyer} onChange={bf} idPrefix="sell" />
          <div className="col-span-2 flex items-center gap-2 mt-2 mb-1">
            <div className="h-px flex-1 bg-ink-4" />
            <span className="text-[0.65rem] font-mono uppercase tracking-widest text-smoke px-2">Transaction</span>
            <div className="h-px flex-1 bg-ink-4" />
          </div>
          <div>
            <label className={labelClass}>Payment Mode</label>
            <PaymentSelect
              value={sellForm.payment_mode}
              onChange={e => setSellForm(p => ({ ...p, payment_mode: e.target.value }))}
            />
          </div>
          {sellForm.payment_mode === 'Bank Transfer' && (
            <>
              <div>
                <label className={labelClass}>Bank Name</label>
                <input type="text" value={sellForm.bank_name||''} onChange={e => setSellForm(p => ({ ...p, bank_name: e.target.value }))} placeholder="HDFC Bank" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Account Number</label>
                <input type="text" value={sellForm.bank_account||''} onChange={e => setSellForm(p => ({ ...p, bank_account: e.target.value }))} placeholder="1234567890" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>IFSC Code</label>
                <input type="text" value={sellForm.ifsc_code||''} onChange={e => setSellForm(p => ({ ...p, ifsc_code: e.target.value }))} placeholder="HDFC0001234" className={inputClass} />
              </div>
            </>
          )}
          {sellForm.payment_mode === 'UPI' && (
            <div>
              <label className={labelClass}>UPI ID</label>
              <input type="text" value={sellForm.upi_id||''} onChange={e => setSellForm(p => ({ ...p, upi_id: e.target.value }))} placeholder="user@upi" className={inputClass} />
            </div>
          )}
          {sellForm.payment_mode === 'Cheque' && (
            <div>
              <label className={labelClass}>Cheque Number</label>
              <input type="text" value={sellForm.cheque_number||''} onChange={e => setSellForm(p => ({ ...p, cheque_number: e.target.value }))} placeholder="123456" className={inputClass} />
            </div>
          )}
          <div>
            <label className={labelClass}>Notes</label>
            <textarea value={sellForm.notes} onChange={e => setSellForm(p => ({ ...p, notes: e.target.value }))} rows={2} className={`${inputClass} resize-none`} />
          </div>
          {sellCar?.commission && (
            <>
              <div className="col-span-2 flex items-center gap-2 mt-2 mb-1">
                <div className="h-px flex-1 bg-ink-4" />
                <span className="text-[0.65rem] font-mono uppercase tracking-widest text-gold px-2">Commission Payment (Optional)</span>
                <div className="h-px flex-1 bg-ink-4" />
              </div>
              <div className="col-span-2 bg-gold/5 border border-gold/20 rounded-lg px-4 py-2 text-xs grid grid-cols-2 gap-1">
                <span className="text-smoke">Seller due: <strong className="text-white">{formatINR(sellCar.commission.seller_commission - sellCar.commission.seller_paid)}</strong></span>
                <span className="text-smoke">Buyer due: <strong className="text-white">{formatINR(sellCar.commission.buyer_commission - sellCar.commission.buyer_paid)}</strong></span>
              </div>
              <div>
                <label className={labelClass}>Seller Payment (₹)</label>
                <input type="text" inputMode="numeric" value={sellCommForm.seller_amount} onChange={e => setSellCommForm(p => ({...p, seller_amount: e.target.value.replace(/\D/g,'')}))} placeholder="0" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Buyer Payment (₹)</label>
                <input type="text" inputMode="numeric" value={sellCommForm.buyer_amount} onChange={e => setSellCommForm(p => ({...p, buyer_amount: e.target.value.replace(/\D/g,'')}))} placeholder="0" className={inputClass} />
              </div>
            </>
          )}
        </div>
        <div className="flex justify-end gap-3 pt-4 border-t border-ink-4 mt-4">
          <Button variant="ghost" onClick={() => setSellModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={confirmSell} disabled={selling}>{selling ? 'Saving…' : 'Confirm Sold'}</Button>
        </div>
      </Modal>

      {/* ── View Modal ── */}
      <Modal isOpen={viewModal} onClose={() => setViewModal(false)} title="Car & Buyer Details" size="md">
        {viewCar && (
          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
            {/* Car image banner */}
            <div style={{ borderRadius: 10, overflow: 'hidden', border: '1px solid #E5E7EB', position: 'relative', background: '#F3F4F6', height: 180 }}>
              {viewCar.media?.[0]?.image_url
                ? <img src={getMediaUrl(viewCar.media[0].image_url)} alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', color: '#D1D5DB' }}>🚗</div>
              }
              <div style={{ position: 'absolute', bottom: 10, left: 12, right: 12, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                <div style={{ background: 'rgba(0,0,0,0.55)', borderRadius: 8, padding: '6px 12px', backdropFilter: 'blur(4px)' }}>
                  <p style={{ color: '#fff', fontWeight: 600, fontSize: '0.95rem', margin: 0 }}>{viewCar.brand_name} {viewCar.Model}</p>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.72rem', fontFamily: "'Space Mono',monospace", margin: 0 }}>
                    {viewCar.manufacturing_year} · {viewCar.color} · {viewCar.registration_no || '—'}
                  </p>
                </div>
                <Badge variant={statusVariant(viewCar.status)}>{viewCar.status}</Badge>
              </div>
            </div>
            {/* Buyer details */}
            {viewCar.buyer && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-px flex-1 bg-ink-4" /><span className="text-xs font-mono uppercase tracking-widest text-gold px-2">Buyer Details</span><div className="h-px flex-1 bg-ink-4" />
                </div>
                <div className="grid grid-cols-2 gap-3 bg-ink-3 rounded-lg p-4 border border-ink-4 text-sm">
                  {[
                    ['Name',          viewCar.buyer.name || viewCar.buyer.username],
                    ['Phone',         viewCar.buyer.phone_no],
                    ['Email',         viewCar.buyer.email],
                    ['Address',       viewCar.buyer.address],
                    ['Deal Price',    viewCar.buyer.price ? formatINR(viewCar.buyer.price) : '—'],
                    ['Aadhar No.',    viewCar.buyer.adhar_no],
                    ['Driving Lic.',  viewCar.buyer.driving_license_no],
                    ['Booking Date',      viewCar.buyer.booking_date ? new Date(viewCar.buyer.booking_date).toLocaleString('en-IN',{day:'numeric',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit',hour12:true}) : '—'],
                    ['Transaction Date',  viewCar.status_changed_at ? new Date(viewCar.status_changed_at).toLocaleString('en-IN',{day:'numeric',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit',hour12:true}) : '—'],
                    ['Sold By', viewCar.sold_by || '—'],
                  ].map(([label, val]) => (
                    <div key={label}>
                      <span className="block text-[0.65rem] font-mono uppercase tracking-wider text-smoke mb-0.5">{label}</span>
                      <span className="text-white text-sm font-medium">{val || '—'}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Payment Details */}
            {(viewCar.payment_mode || viewCar.notes) && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-px flex-1 bg-ink-4" /><span className="text-xs font-mono uppercase tracking-widest text-gold px-2">Payment Details</span><div className="h-px flex-1 bg-ink-4" />
                </div>
                <div className="grid grid-cols-2 gap-3 bg-ink-3 rounded-lg p-4 border border-ink-4 text-sm">
                  {[
                    ['Payment Mode',    viewCar.payment_mode],
                    viewCar.payment_mode === 'Bank Transfer' && ['Bank Name',       viewCar.bank_name],
                    viewCar.payment_mode === 'Bank Transfer' && ['Account Number',  viewCar.bank_account],
                    viewCar.payment_mode === 'Bank Transfer' && ['IFSC Code',       viewCar.ifsc_code],
                    viewCar.payment_mode === 'UPI'           && ['UPI ID',          viewCar.upi_id],
                    viewCar.payment_mode === 'Cheque'        && ['Cheque Number',   viewCar.cheque_number],
                    ['Notes',           viewCar.notes],
                  ].filter(Boolean).map(([label, val]) => (
                    <div key={label} className={label === 'Notes' ? 'col-span-2' : ''}>
                      <span className="block text-[0.65rem] font-mono uppercase tracking-wider text-smoke mb-0.5">{label}</span>
                      <span className="text-white text-sm font-medium">{val || '—'}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Commission */}
            {viewCar.commission && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-px flex-1 bg-ink-4" /><span className="text-xs font-mono uppercase tracking-widest text-gold px-2">Commission</span><div className="h-px flex-1 bg-ink-4" />
                </div>
                <div className="grid grid-cols-2 gap-3 bg-ink-3 rounded-lg p-4 border border-ink-4 text-sm">
                  {[
                    ['Seller Commission', formatINR(viewCar.commission.seller_commission)],
                    ['Buyer Commission',  formatINR(viewCar.commission.buyer_commission)],
                    ['Seller Paid',       viewCar.commission.seller_paid > 0 ? 'Yes' : 'No'],
                    ['Buyer Paid',        viewCar.commission.buyer_paid > 0 ? 'Yes' : 'No'],
                    ['Status',            viewCar.commission.status],
                  ].map(([label, val]) => (
                    <div key={label}>
                      <span className="block text-[0.65rem] font-mono uppercase tracking-wider text-smoke mb-0.5">{label}</span>
                      <span className="text-white text-sm font-medium">{val || '—'}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        <div className="flex justify-end pt-4 border-t border-ink-4 mt-4">
          <Button variant="ghost" onClick={() => setViewModal(false)}>Close</Button>
        </div>
      </Modal>

      {/* ── Edit Modal ── */}
      <Modal isOpen={editModal} onClose={() => setEditModal(false)} title={`Edit — ${editCar?.brand_name} ${editCar?.Model}`} size="md">
        {editError && <div className="bg-crimson/10 border border-crimson/30 rounded-md px-4 py-3 text-crimson text-sm mb-4">{editError}</div>}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[65vh] overflow-y-auto pr-1">
          <BuyerFields vals={editForm.buyer} onChange={ef} idPrefix="edit" />
          <div className="col-span-2 flex items-center gap-2 mt-2 mb-1">
            <div className="h-px flex-1 bg-ink-4" /><span className="text-[0.65rem] font-mono uppercase tracking-widest text-smoke px-2">Transaction</span><div className="h-px flex-1 bg-ink-4" />
          </div>
          <div>
            <label className={labelClass}>Payment Mode</label>
            <PaymentSelect
              value={editForm.payment_mode}
              onChange={e => setEditForm(p => ({ ...p, payment_mode: e.target.value }))}
            />
          </div>
          {editForm.payment_mode === 'Bank Transfer' && (
            <>
              <div>
                <label className={labelClass}>Bank Name</label>
                <input type="text" value={editForm.bank_name||''} onChange={e => setEditForm(p => ({ ...p, bank_name: e.target.value }))} placeholder="HDFC Bank" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Account Number</label>
                <input type="text" value={editForm.bank_account||''} onChange={e => setEditForm(p => ({ ...p, bank_account: e.target.value }))} placeholder="1234567890" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>IFSC Code</label>
                <input type="text" value={editForm.ifsc_code||''} onChange={e => setEditForm(p => ({ ...p, ifsc_code: e.target.value }))} placeholder="HDFC0001234" className={inputClass} />
              </div>
            </>
          )}
          {editForm.payment_mode === 'UPI' && (
            <div>
              <label className={labelClass}>UPI ID</label>
              <input type="text" value={editForm.upi_id||''} onChange={e => setEditForm(p => ({ ...p, upi_id: e.target.value }))} placeholder="user@upi" className={inputClass} />
            </div>
          )}
          {editForm.payment_mode === 'Cheque' && (
            <div>
              <label className={labelClass}>Cheque Number</label>
              <input type="text" value={editForm.cheque_number||''} onChange={e => setEditForm(p => ({ ...p, cheque_number: e.target.value }))} placeholder="123456" className={inputClass} />
            </div>
          )}
          <div>
            <label className={labelClass}>Notes</label>
            <textarea value={editForm.notes} onChange={e => setEditForm(p => ({ ...p, notes: e.target.value }))} rows={2} className={`${inputClass} resize-none`} />
          </div>
          {editCar?.commission && (
            <>
              <div className="col-span-2 flex items-center gap-2 mt-2 mb-1">
                <div className="h-px flex-1 bg-ink-4" />
                <span className="text-[0.65rem] font-mono uppercase tracking-widest text-gold px-2">Commission Payment (Optional)</span>
                <div className="h-px flex-1 bg-ink-4" />
              </div>
              <div className="col-span-2 bg-gold/5 border border-gold/20 rounded-lg px-4 py-2 text-xs grid grid-cols-2 gap-1">
                <span className="text-smoke">Seller due: <strong className="text-white">{formatINR(editCar.commission.seller_commission - editCar.commission.seller_paid)}</strong></span>
                <span className="text-smoke">Buyer due: <strong className="text-white">{formatINR(editCar.commission.buyer_commission - editCar.commission.buyer_paid)}</strong></span>
              </div>
              <div>
                <label className={labelClass}>Seller Payment (₹)</label>
                <input type="text" inputMode="numeric" value={editCommForm.seller_amount} onChange={e => setEditCommForm(p => ({...p, seller_amount: e.target.value.replace(/\D/g,'')}))} placeholder="0" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Buyer Payment (₹)</label>
                <input type="text" inputMode="numeric" value={editCommForm.buyer_amount} onChange={e => setEditCommForm(p => ({...p, buyer_amount: e.target.value.replace(/\D/g,'')}))} placeholder="0" className={inputClass} />
              </div>
            </>
          )}
        </div>
        <div className="flex justify-end gap-3 pt-4 border-t border-ink-4 mt-4">
          <Button variant="ghost" onClick={() => setEditModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={saveEdit} disabled={editSaving}>{editSaving ? 'Saving…' : 'Save Changes'}</Button>
        </div>
      </Modal>
    </div>
  );
}
