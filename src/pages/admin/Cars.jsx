import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import imageCompression from 'browser-image-compression';
import { adminCarsApi, commissionsApi, getMediaUrl } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { formatINR } from '../../utils/helpers';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import { Eye, Pencil, Trash2, Plus } from 'lucide-react';
import { useToast } from '../../components/ui/Toaster';
import Pagination from '../../components/admin/Pagination';

const CAR_STATUSES = ['AVAILABLE','RESERVED','BOOKED','SOLD','ON_HOLD','UNDER_INSPECTION','REMOVED'];
const FUEL_TYPES   = ['Petrol','Diesel','CNG','Electric','Hybrid'];
const TRANS_TYPES  = ['Manual','Automatic','AMT','CVT','DCT'];
const PAYMENT_MODES = ['Cash', 'Bank Transfer', 'Cheque', 'UPI'];
const statusVariant = (s) => ({ AVAILABLE:'green', SOLD:'gray', RESERVED:'blue', BOOKED:'blue', ON_HOLD:'gray', UNDER_INSPECTION:'gray', REMOVED:'red' }[s] || 'gray');

const I = { // shared input styles
  base: { width:'100%', background:'#fff', border:'1px solid #E5E7EB', borderRadius:8, padding:'9px 12px', fontSize:'0.875rem', color:'#111', outline:'none', fontFamily:'inherit', transition:'border-color 0.15s' },
  label: { display:'block', fontSize:'0.68rem', fontFamily:"'Space Mono',monospace", textTransform:'uppercase', letterSpacing:'0.08em', color:'#6B7280', marginBottom:5 },
  sectionTitle: { display:'flex', alignItems:'center', gap:10, marginBottom:12 },
};
const sectionDivider = (label) => (
  <div style={I.sectionTitle}>
    <div style={{ flex:1, height:1, background:'#E5E7EB' }} />
    <span style={{ fontSize:'0.65rem', fontFamily:"'Space Mono',monospace", textTransform:'uppercase', letterSpacing:'0.12em', color:'#F0A500' }}>{label}</span>
    <div style={{ flex:1, height:1, background:'#E5E7EB' }} />
  </div>
);

const MAX_PHOTOS = 4;

function PhotoUploader({ media = [], onChange }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const remaining = MAX_PHOTOS - media.length;
  const handleFiles = async (e) => {
    const files = Array.from(e.target.files).slice(0, remaining);
    if (!files.length) return;
    const oversized = files.filter(f => f.size > 5 * 1024 * 1024);
    if (oversized.length) { setError(`Photo${oversized.length > 1 ? 's' : ''} too large (max 5 MB per photo): ${oversized.map(f => f.name).join(', ')}`); e.target.value = ''; return; }
    setUploading(true); setError('');
    try {
      const compressed = await Promise.all(
        files.map(f => imageCompression(f, { maxSizeMB: 2, maxWidthOrHeight: 1920, useWebWorker: false }))
      );
      const fd = new FormData();
      compressed.forEach(f => fd.append('photos', f));
      const res = await adminCarsApi.uploadPhotos(fd);
      if (res?.success && Array.isArray(res.data)) onChange([...media, ...res.data.map(url => ({ image_url: url, title:'' }))]);
      else throw new Error('Upload failed');
    } catch (err) { setError(err.message); }
    finally { setUploading(false); e.target.value = ''; }
  };
  return (
    <div>
      {error && <p style={{ fontSize:'0.78rem', color:'#EF4444', marginBottom:8 }}>{error}</p>}
      <p style={{ fontSize:'0.72rem', color:'#6B7280', fontFamily:"'Space Mono',monospace", marginBottom:8 }}>
        {media.length}/{MAX_PHOTOS} photos{media.length >= MAX_PHOTOS ? ' — limit reached' : ''}
      </p>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(110px, 1fr))', gap:10 }}>
        {media.map((item, i) => {
          const url = typeof item === 'string' ? item : item.image_url;
          return (
            <div key={i} style={{ position:'relative', borderRadius:8, overflow:'hidden', border:'1px solid #E5E7EB', background:'#F9FAFB' }}>
              <img src={getMediaUrl(url)} alt="" loading="lazy" style={{ width:'100%', height:72, objectFit:'cover', display:'block' }} />
              <button type="button" onClick={() => onChange(media.filter((_,j)=>j!==i))} style={{
                position:'absolute', top:4, right:4, width:20, height:20, borderRadius:'50%',
                background:'#EF4444', border:'none', color:'#fff', fontSize:'0.6rem', cursor:'pointer',
                display:'flex', alignItems:'center', justifyContent:'center',
              }}>✕</button>
            </div>
          );
        })}
        {media.length < MAX_PHOTOS && (
          <label style={{ border:'1px dashed #D1D5DB', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', cursor: uploading ? 'not-allowed' : 'pointer', minHeight:80, background:'#F9FAFB', opacity: uploading ? 0.5 : 1 }}>
            <input type="file" multiple accept="image/*" onChange={handleFiles} style={{ display:'none' }} disabled={uploading} />
            <span style={{ fontSize:'0.72rem', color:'#6B7280', fontFamily:"'Space Mono',monospace", textAlign:'center' }}>
              {uploading ? 'Uploading…' : `+ Photo\n(${remaining} left)`}
            </span>
          </label>
        )}
      </div>
    </div>
  );
}

const YEAR_MIN = 1980;
const YEAR_MAX = new Date().getFullYear();
const ALL_YEARS = Array.from({ length: YEAR_MAX - YEAR_MIN + 1 }, (_, i) => YEAR_MAX - i);

function YearPicker({ value, onChange, baseStyle }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();
  useEffect(() => {
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <div
        onClick={() => setOpen(o => !o)}
        style={{ ...baseStyle, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', userSelect: 'none' }}
        onFocus={e => e.currentTarget.style.borderColor = '#FF5A09'}
        onBlur={e => e.currentTarget.style.borderColor = '#E5E7EB'}
        tabIndex={0}
        onKeyDown={e => e.key === 'Enter' && setOpen(o => !o)}
      >
        <span style={{ color: value ? '#111' : '#9CA3AF' }}>{value || 'Select Year…'}</span>
        <span style={{ fontSize: '0.6rem', color: '#9CA3AF' }}>{open ? '▲' : '▼'}</span>
      </div>
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, zIndex: 1000,
          background: '#fff', border: '1px solid #E5E7EB', borderRadius: 8,
          maxHeight: 200, overflowY: 'auto', boxShadow: '0 6px 20px rgba(0,0,0,0.12)',
        }}>
          {ALL_YEARS.map(y => (
            <div
              key={y}
              onMouseDown={() => { onChange(y); setOpen(false); }}
              style={{
                padding: '8px 12px', fontSize: '0.875rem', cursor: 'pointer',
                background: value == y ? '#FFF3EE' : '#fff',
                color: value == y ? '#FF5A09' : '#111',
                fontWeight: value == y ? 600 : 400,
              }}
              onMouseEnter={e => { if (value != y) e.currentTarget.style.background = '#F9FAFB'; }}
              onMouseLeave={e => { e.currentTarget.style.background = value == y ? '#FFF3EE' : '#fff'; }}
            >
              {y}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CarForm({ form, onChange, ownersList = [] }) {
  const f = (k) => (e) => onChange({ ...form, [k]: e.target.value });
  const digitsOnly = (k) => (e) => onChange({ ...form, [k]: e.target.value.replace(/\D/g, '') });
  return (
    <div style={{ overflowY:'auto', maxHeight:'72vh', paddingRight:4 }}>
      {/* Owner */}
      <div style={{ marginBottom:20 }}>
        {sectionDivider('Owner / Seller Details')}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
          {[['owner.name','Owner Name','Enter Owner Name'],['owner.email','Email','Enter Email'],['owner.address','Address','Madanapalle'],['owner.location','Location','Andhra Pradesh']].map(([k,l,ph])=>(
            <div key={k}>
              <label style={I.label}>{l}</label>
              <input value={form[k]||''} onChange={e=>onChange({...form,[k]:e.target.value})} placeholder={ph} style={I.base} onFocus={e=>e.target.style.borderColor='#FF5A09'} onBlur={e=>e.target.style.borderColor='#252628'} />
            </div>
          ))}
          <div>
            <label style={I.label}>Phone</label>
            <input
              value={form['owner.phone_no']||''}
              onChange={e=>onChange({...form,'owner.phone_no':e.target.value.replace(/\D/g,'').slice(0,10)})}
              placeholder="Enter Phone"
              inputMode="numeric"
              maxLength={10}
              style={I.base}
              onFocus={e=>e.target.style.borderColor='#FF5A09'}
              onBlur={e=>e.target.style.borderColor='#252628'}
            />
          </div>
        </div>
      </div>
      {/* Car Details */}
      <div style={{ marginBottom:20 }}>
        {sectionDivider('Car Details')}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
          {[['brand_name','Brand *','Mercedes-Benz'],['Model','Model *','E-Class'],['color','Colour','Obsidian Black'],['registration_no','Reg. No','TS09AB1234'],['kms_driven','KMs Driven','28,400'],['location','Location','Madanapalle']].map(([k,l,ph])=>(
            <div key={k}>
              <label style={I.label}>{l}</label>
              <input value={form[k]||''} onChange={f(k)} placeholder={ph} style={I.base} onFocus={e=>e.target.style.borderColor='#FF5A09'} onBlur={e=>e.target.style.borderColor='#E5E7EB'} />
            </div>
          ))}
          <div>
            <label style={I.label}>Year</label>
            <YearPicker
              value={form.manufacturing_year || ''}
              onChange={y => onChange({ ...form, manufacturing_year: y })}
              baseStyle={I.base}
            />
          </div>
          <div>
            <label style={I.label}>Fuel Type</label>
            <select value={form.fuel_type||''} onChange={f('fuel_type')} style={{...I.base, background:'#fff', cursor:'pointer', appearance:'none'}}>
              <option value="">Select…</option>
              {FUEL_TYPES.map(t=><option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label style={I.label}>Transmission</label>
            <select value={form.Transmission||''} onChange={f('Transmission')} style={{...I.base, background:'#fff', cursor:'pointer', appearance:'none'}}>
              <option value="">Select…</option>
              {TRANS_TYPES.map(t=><option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label style={I.label}>Asking Price (₹)</label>
            <input type="text" inputMode="numeric" value={form.asking_price||''} onChange={digitsOnly('asking_price')} placeholder="5200000" style={I.base} onFocus={e=>e.target.style.borderColor='#FF5A09'} onBlur={e=>e.target.style.borderColor='#E5E7EB'} />
          </div>
          <div>
            <label style={I.label}>Market Price (₹)</label>
            <input type="text" inputMode="numeric" value={form.market_price||''} onChange={digitsOnly('market_price')} placeholder="5800000" style={I.base} onFocus={e=>e.target.style.borderColor='#FF5A09'} onBlur={e=>e.target.style.borderColor='#E5E7EB'} />
          </div>
          <div>
            <label style={I.label}>Status</label>
            <select value={form.status||'AVAILABLE'} onChange={f('status')} style={{...I.base, background:'#fff', cursor:'pointer', appearance:'none'}}>
              {CAR_STATUSES.map(s=><option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </div>
      {/* Docs */}
      <div style={{ marginBottom:20 }}>
        {sectionDivider('Documents & Insurance')}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
          {[['insurance_no','Insurance No.','INS2021'],['insurance_company','Insurance Co.','New India Assurance']].map(([k,l,ph])=>(
            <div key={k}>
              <label style={I.label}>{l}</label>
              <input value={form[k]||''} onChange={f(k)} placeholder={ph} style={I.base} onFocus={e=>e.target.style.borderColor='#FF5A09'} onBlur={e=>e.target.style.borderColor='#E5E7EB'} />
            </div>
          ))}
          <div>
            <label style={I.label}>Expiry Date</label>
            <input type="date" value={form.insurance_expiry_date||''} onChange={f('insurance_expiry_date')} style={I.base} onFocus={e=>e.target.style.borderColor='#FF5A09'} onBlur={e=>e.target.style.borderColor='#E5E7EB'} />
          </div>
          <div>
            <label style={I.label}>Insurance Status</label>
            <select value={form.insurance_active ?? ''} onChange={e => onChange({ ...form, insurance_active: e.target.value === '' ? null : Number(e.target.value) })} style={{...I.base, background:'#fff', cursor:'pointer', appearance:'none'}}>
              <option value="">Unknown</option>
              <option value="1">Active</option>
              <option value="0">Expired / None</option>
            </select>
          </div>
        </div>
      </div>
      {/* Photos */}
      <div style={{ marginBottom:20 }}>
        {sectionDivider('Car Photos')}
        <PhotoUploader media={form.media||[]} onChange={(m)=>onChange({...form, media:m})} />
      </div>
      {/* Media */}
      <div>
        {sectionDivider('Media Links')}
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {[['video_url','YouTube URL','https://youtube.com/watch?v=...'],['insta_url','Instagram URL','https://instagram.com/p/...']].map(([k,l,ph])=>(
            <div key={k}>
              <label style={I.label}>{l}</label>
              <input value={form[k]||''} onChange={f(k)} placeholder={ph} style={I.base} onFocus={e=>e.target.style.borderColor='#FF5A09'} onBlur={e=>e.target.style.borderColor='#E5E7EB'} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function flattenCar(car) {
  const flat = { ...car };
  // Normalize BOOLEAN → 0/1/null so the insurance select value matches option values
  if (flat.insurance_active === true)  flat.insurance_active = 1;
  else if (flat.insurance_active === false) flat.insurance_active = 0;
  if (car.owner) { flat['owner.name']=car.owner.name||''; flat['owner.phone_no']=car.owner.phone_no||''; flat['owner.email']=car.owner.email||''; flat['owner.address']=car.owner.address||''; flat['owner.location']=car.owner.location||''; }
  return flat;
}
function buildPayload(form) {
  const { 'owner.name':name,'owner.phone_no':phone_no,'owner.email':email,'owner.address':address,'owner.location':location, ...car } = form;
  const payload = { ...car };
  if (payload.manufacturing_year) payload.manufacturing_year = Number(payload.manufacturing_year);
  if (form.owner_id) { payload.owner_id = Number(form.owner_id); delete payload.owner; if (name||phone_no||email) payload.owner = { name, phone_no, email, address, location }; }
  else if (name||phone_no||email) { payload.owner = { name, phone_no, email, address, location }; }
  else { payload.owner = { name:'Syed Cars (Self)', phone_no:'', email:'' }; }
  return payload;
}

export default function AdminCars() {
  const { canOp } = useAuth();
  const toast = useToast();
  const location = useLocation();
  const [cars, setCars] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterFuel, setFilterFuel] = useState('');
  const [filterTrans, setFilterTrans] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [filterMinPrice, setFilterMinPrice] = useState('');
  const [filterMaxPrice, setFilterMaxPrice] = useState('');
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editCar, setEditCar] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [viewCar, setViewCar] = useState(null);
  const [buyerModalOpen, setBuyerModalOpen] = useState(false);
  const [buyerCar, setBuyerCar] = useState(null);
  const [buyerStatus, setBuyerStatus] = useState('');
  const [buyerForm, setBuyerForm] = useState({ name:'', phone:'', email:'', address:'', price:'', adhar_no:'', driving_license_no:'', payment_mode:'', notes:'', bank_account:'', bank_name:'', ifsc_code:'', upi_id:'', cheque_number:'' });
  const [buyerSaving, setBuyerSaving] = useState(false);
  const [buyerError, setBuyerError] = useState('');
  const [buyerCommForm, setBuyerCommForm] = useState({ seller_amount: '', buyer_amount: '' });

  const load = useCallback(async (p=1) => {
    setLoading(true); setError('');
    try {
      const params = { page:p, limit:9 };
      if (search)        params.brand        = search;
      if (filterStatus)  params.status       = filterStatus;
      if (filterFuel)    params.fuel_type    = filterFuel;
      if (filterTrans)   params.transmission = filterTrans;
      if (filterYear)    params.year         = filterYear;
      if (filterMinPrice) params.min_price   = filterMinPrice;
      if (filterMaxPrice) params.max_price   = filterMaxPrice;
      const res = await adminCarsApi.list(params);
      const d = res?.data;
      setCars(d?.cars ?? []);
      setTotal(d?.pagination?.total ?? 0);
      setTotalPages(d?.pagination?.totalPages ?? 1);
      setPage(p);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }, [search, filterStatus, filterFuel, filterTrans, filterYear, filterMinPrice, filterMaxPrice]);

  useEffect(() => { load(1); }, [load]);

  const openEdit = async (car) => {
    setEditCar(car); setFormError('');
    try { const res = await adminCarsApi.get(car.id); setForm(flattenCar(res?.data ?? car)); }
    catch { setForm(flattenCar(car)); }
    setModalOpen(true);
  };
  const openView = async (car) => {
    try { const res = await adminCarsApi.get(car.id); setViewCar(res?.data ?? car); }
    catch { setViewCar(car); }
  };

  // Open view modal when navigated here with ?view=ID (e.g. from Dashboard)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const viewId = params.get('view');
    if (viewId) openView({ id: viewId });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  const save = async () => {
    setSaving(true); setFormError('');
    try {
      const payload = buildPayload(form);
      if (editCar) await adminCarsApi.update(editCar.id, payload);
      else await adminCarsApi.create(payload);
      toast.success(editCar ? 'Car updated successfully!' : 'Car added to inventory!');
      setModalOpen(false); load(page);
    } catch (err) {
      setFormError(err.message || 'Save failed');
      toast.error(err.message || 'Failed to save car');
    }
    finally { setSaving(false); }
  };
  const changeStatus = async (car, status) => {
    if (status === 'RESERVED' || status === 'BOOKED' || status === 'SOLD') {
      setBuyerStatus(status); setBuyerError('');
      setBuyerCommForm({ seller_amount: '', buyer_amount: '' });
      // Fetch full car to get commission info when marking SOLD
      let fullCar = car;
      if (status === 'SOLD') {
        try { const res = await adminCarsApi.get(car.id); fullCar = res?.data ?? car; } catch {}
      }
      setBuyerCar(fullCar);
      setBuyerForm({ name:'', phone:'', email:'', address:'', price:fullCar.asking_price||'', adhar_no:'', driving_license_no:'', payment_mode:'', notes:'', bank_account:'', bank_name:'', ifsc_code:'', upi_id:'', cheque_number:'' });
      setBuyerModalOpen(true); return;
    }
    try {
      await adminCarsApi.changeStatus(car.id, status);
      toast.success(`Status changed to ${status}`);
      load(page);
    }
    catch (err) { toast.error(err.message || 'Failed to change status'); }
  };
  const saveBuyerDetails = async () => {
    if (!buyerForm.name || !buyerForm.phone || !buyerForm.price) { setBuyerError('Name, Phone and Price are required.'); return; }
    setBuyerSaving(true); setBuyerError('');
    try {
      await adminCarsApi.changeStatus(buyerCar.id, buyerStatus, buyerForm);
      // Record commission payment if SOLD and amounts entered
      if (buyerStatus === 'SOLD' && buyerCar.commission) {
        const { seller_amount, buyer_amount } = buyerCommForm;
        if (seller_amount || buyer_amount) {
          const parties = [];
          if (seller_amount) parties.push('seller');
          if (buyer_amount) parties.push('buyer');
          try {
            await commissionsApi.recordPayment(buyerCar.commission.id, { parties, seller_amount: Number(seller_amount)||0, buyer_amount: Number(buyer_amount)||0 });
          } catch {}
        }
      }
      toast.success('Buyer details saved!');
      setBuyerModalOpen(false); load(page);
    }
    catch (err) {
      setBuyerError(err.message || 'Failed to save');
      toast.error(err.message || 'Failed to save buyer details');
    }
    finally { setBuyerSaving(false); }
  };
  const deleteCar = async (id) => {
    if (!confirm('Remove this car?')) return;
    try {
      await adminCarsApi.changeStatus(id, 'REMOVED');
      toast.success('Car removed from inventory');
      load(page);
    }
    catch (err) { toast.error(err.message || 'Failed to remove car'); }
  };

  const btnStyle = (color='#FF5A09') => ({
    display:'flex', alignItems:'center', gap:6, padding:'7px 14px', borderRadius:6,
    background:`rgba(${color === '#FF5A09' ? '255,90,9' : color === '#EF4444' ? '239,68,68' : '59,130,246'},0.12)`,
    border:`1px solid rgba(${color === '#FF5A09' ? '255,90,9' : color === '#EF4444' ? '239,68,68' : '59,130,246'},0.25)`,
    color, fontSize:'0.78rem', fontWeight:500, cursor:'pointer', fontFamily:'inherit',
    transition:'all 0.15s',
  });

  const specItem = (label, val) => (
    <div key={label} style={{ background:'#F9FAFB', border:'1px solid #E5E7EB', borderRadius:8, padding:'10px 14px' }}>
      <p style={{ fontSize:'0.65rem', fontFamily:"'Space Mono',monospace", textTransform:'uppercase', letterSpacing:'0.08em', color:'#6B7280', marginBottom:4 }}>{label}</p>
      <p style={{ fontSize:'0.875rem', color:'#111', fontWeight:500 }}>{val || '—'}</p>
    </div>
  );

  return (
    <div style={{ padding:'28px 28px 60px', maxWidth:1400, margin:'0 auto' }}>
      <AdminPageHeader
        title="Cars Management"
        sub={`${total} total listings`}
        action={canOp('cars','add') && (
          <button onClick={() => { setEditCar(null); setForm({}); setFormError(''); setModalOpen(true); }} style={{
            display:'flex', alignItems:'center', gap:6, padding:'9px 18px',
            background:'#FF5A09', color:'#fff', border:'none', borderRadius:8,
            fontWeight:600, fontSize:'0.875rem', cursor:'pointer', fontFamily:'inherit',
            boxShadow:'0 2px 12px rgba(255,90,9,0.3)',
          }}>
            <Plus size={15} /> Add Car
          </button>
        )}
      />

      {/* Filters */}
      <div style={{ background:'#fff', border:'1px solid #E5E7EB', borderRadius:10, padding:'14px 16px', marginBottom:20 }}>
        <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr 1fr', gap:8, marginBottom:8 }}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search brand or model…"
            style={{ background:'#F9FAFB', border:'1px solid #E5E7EB', borderRadius:7, padding:'8px 12px', fontSize:'0.875rem', color:'#111', outline:'none', fontFamily:'inherit', transition:'border-color 0.15s' }}
            onFocus={e=>e.target.style.borderColor='#FF5A09'} onBlur={e=>e.target.style.borderColor='#E5E7EB'} />
         
          <select value={filterFuel} onChange={e=>setFilterFuel(e.target.value)}
            style={{ background:'#F9FAFB', border:'1px solid #E5E7EB', borderRadius:7, padding:'8px 10px', fontSize:'0.875rem', color:'#111', outline:'none', appearance:'none', cursor:'pointer', fontFamily:'inherit' }}>
            <option value="">Any Fuel</option>
            {FUEL_TYPES.map(f=><option key={f} value={f}>{f}</option>)}
          </select>
          <select value={filterTrans} onChange={e=>setFilterTrans(e.target.value)}
            style={{ background:'#F9FAFB', border:'1px solid #E5E7EB', borderRadius:7, padding:'8px 10px', fontSize:'0.875rem', color:'#111', outline:'none', appearance:'none', cursor:'pointer', fontFamily:'inherit' }}>
            <option value="">Any Gear</option>
            {TRANS_TYPES.map(t=><option key={t} value={t}>{t}</option>)}
          </select>
          <input type="number" value={filterYear} onChange={e=>setFilterYear(e.target.value)} placeholder="Year e.g. 2021"
            min="1990" max="2030"
            style={{ background:'#F9FAFB', border:'1px solid #E5E7EB', borderRadius:7, padding:'8px 12px', fontSize:'0.875rem', color:'#111', outline:'none', fontFamily:'inherit', transition:'border-color 0.15s' }}
            onFocus={e=>e.target.style.borderColor='#FF5A09'} onBlur={e=>e.target.style.borderColor='#E5E7EB'} />
             <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}
            style={{ background:'#F9FAFB', border:'1px solid #E5E7EB', borderRadius:7, padding:'8px 10px', fontSize:'0.875rem', color:'#111', outline:'none', appearance:'none', cursor:'pointer', fontFamily:'inherit' }}>
            <option value="">All Statuses</option>
            {CAR_STATUSES.map(s=><option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {error && <div style={{ background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:8, padding:'10px 16px', color:'#EF4444', fontSize:'0.875rem', marginBottom:16 }}>{error}</div>}

      {/* Cars Grid */}
      {loading ? (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:14 }}>
          {[...Array(6)].map((_,i) => (
            <div key={i} style={{ background:'#fff', border:'1px solid #E5E7EB', borderRadius:12, height:220, animation:'pulse 1.5s infinite' }} />
          ))}
        </div>
      ) : cars.length === 0 ? (
        <div style={{ textAlign:'center', padding:'80px 0', color:'#9CA3AF' }}>
          <p style={{ fontFamily:"inherit", fontSize:'1.5rem', marginBottom:8, color:'#040404' }}>No cars found</p>
          <p style={{ fontSize:'0.875rem' }}>Add your first listing or adjust filters.</p>
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:14 }}>
          {cars.map(car => (
            <div key={car.id}
              style={{ background:'#fff', border:'1px solid #E5E7EB', borderRadius:12, overflow:'hidden', transition:'all 0.2s', cursor:'pointer' }}
              onClick={() => openView(car)}
              onMouseEnter={e=>{ e.currentTarget.style.borderColor='rgba(255,90,9,0.35)'; e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 4px 16px rgba(255,90,9,0.1)'; }}
              onMouseLeave={e=>{ e.currentTarget.style.borderColor='#E5E7EB'; e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='none'; }}
            >
              {/* Image */}
              <div style={{ position:'relative', height:190, background:'#F3F4F6', overflow:'hidden' }}>
                {car.media?.[0]?.image_url ? (
                  <img src={getMediaUrl(car.media[0].image_url)} alt={car.brand_name} loading="lazy" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                ) : (
                  <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <span style={{ fontFamily:"inherit", fontSize:'3rem', color:'rgba(0,0,0,0.08)' }}>{car.brand_name?.[0]||'⊞'}</span>
                  </div>
                )}
                <div style={{ position:'absolute', top:8, right:8 }}><Badge variant={statusVariant(car.status)}>{car.status || 'Active'}</Badge></div>
                {/* <div style={{ position:'absolute', top:8, left:8, background:'rgba(255,255,255,0.85)', border:'1px solid #E5E7EB', borderRadius:4, padding:'2px 7px', fontSize:'0.62rem', fontFamily:"'Space Mono',monospace", color:'#040404' }}>#{car.id}</div> */}
              </div>
              {/* Info */}
              <div style={{ padding:'14px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:8, marginBottom:6 }}>
                  <div>
                    <h3 style={{ fontSize:'0.9rem', color:'#111', fontWeight:600 }}>{car.brand_name} {car.Model}</h3>
                    <p style={{ fontSize:'0.7rem', color:'#6B7280', fontFamily:"'Space Mono',monospace", marginTop:2 }}>{car.manufacturing_year} · {car.fuel_type}</p>
                  </div>
                  <p style={{ fontFamily:"inherit", fontSize:'1.1rem', color:'#F0A500', fontWeight:600, flexShrink:0 }}>{formatINR(car.asking_price)}</p>
                </div>
                {car.owner && <p style={{ fontSize:'0.72rem', color:'#6B7280', marginBottom:10 }}>Seller: <span style={{ color:'#111' }}>{car.owner.name}</span></p>}
                {/* Actions — stopPropagation so card click doesn't also fire */}
                <div style={{ display:'flex', gap:6, alignItems:'center' }} onClick={e => e.stopPropagation()}>
                  <button title="View" onClick={()=>openView(car)} style={{...btnStyle('#3B82F6'), padding:'6px 10px'}}><Eye size={13} /></button>
                  {canOp('cars','update') && <button onClick={()=>openEdit(car)} style={btnStyle('#FF5A09')}><Pencil size={12} /> Edit</button>}
                  {canOp('cars','update') && (
                    <select value={car.status||''} onChange={e=>changeStatus(car,e.target.value)} style={{ background:'#fff', border:'1px solid #E5E7EB', borderRadius:6, padding:'6px 8px', color:'#040404', fontSize:'0.72rem', cursor:'pointer', outline:'none', appearance:'none', flex:1, fontFamily:'inherit' }}>
                      {CAR_STATUSES.map(s=><option key={s} value={s}>{s}</option>)}
                    </select>
                  )}
                  {canOp('cars','delete') && <button title="Delete" onClick={()=>deleteCar(car.id)} style={{...btnStyle('#EF4444'), padding:'6px 10px'}}><Trash2 size={13} /></button>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} onPageChange={load} total={total} limit={9} />

      {/* Add/Edit Modal */}
      <Modal open={modalOpen} onClose={()=>setModalOpen(false)} title={editCar ? `Edit — ${editCar.brand_name} ${editCar.Model}` : 'Add New Car'} wide>
        {formError && <div style={{ background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:8, padding:'9px 14px', color:'#EF4444', fontSize:'0.875rem', marginBottom:14 }}>{formError}</div>}
        <CarForm form={form} onChange={setForm} />
        <div style={{ display:'flex', justifyContent:'flex-end', gap:10, paddingTop:16, borderTop:'1px solid #E5E7EB', marginTop:16 }}>
          <button onClick={()=>setModalOpen(false)} style={{ padding:'9px 18px', background:'#F3F4F6', border:'1px solid #E5E7EB', borderRadius:8, color:'#040404', cursor:'pointer', fontFamily:'inherit' }}>Cancel</button>
          <button onClick={save} disabled={saving} style={{ padding:'9px 20px', background:'#FF5A09', color:'#d6d3d3', border:'none', borderRadius:8, fontWeight:600, fontSize:'0.875rem', cursor:saving?'not-allowed':'pointer', opacity:saving?0.6:1, boxShadow:'0 2px 12px rgba(255,90,9,0.3)', fontFamily:'inherit' }}>
            {saving ? 'Saving…' : editCar ? 'Save Changes' : 'Add Car'}
          </button>
        </div>
      </Modal>

      {/* View Modal */}
      <Modal open={!!viewCar} onClose={()=>setViewCar(null)} title="Car Details" wide>
        {viewCar && (() => {
          // Extract YouTube video ID for thumbnail
          const ytMatch = viewCar.video_url?.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
          const ytId = ytMatch?.[1];
          return (
            <div style={{ overflowY:'auto', maxHeight:'75vh', paddingRight:4 }}>
              {/* Hero: image gallery + info */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 2fr', gap:16, marginBottom:20 }}>
                {/* Photo gallery */}
                <div>
                  <div style={{ borderRadius:10, overflow:'hidden', background:'#F3F4F6', aspectRatio:'4/3', marginBottom:8, position:'relative' }}>
                    {viewCar.media?.[0]?.image_url
                      ? <img src={getMediaUrl(viewCar.media[0].image_url)} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                      : <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center' }}><span style={{ fontFamily:"inherit", fontSize:'3rem', color:'rgba(0,0,0,0.1)' }}>{viewCar.brand_name?.[0]}</span></div>
                    }
                    <div style={{ position:'absolute', top:6, right:6 }}><Badge variant={statusVariant(viewCar.status)}>{viewCar.status}</Badge></div>
                  </div>
                  {/* Thumbnails row */}
                  {viewCar.media?.length > 1 && (
                    <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                      {viewCar.media.slice(1).map((m, i) => (
                        <div key={i} style={{ width:52, height:40, borderRadius:6, overflow:'hidden', border:'1px solid #E5E7EB', flexShrink:0 }}>
                          <img src={getMediaUrl(m.image_url)} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {/* Info */}
                <div style={{ display:'flex', flexDirection:'column', justifyContent:'flex-start', gap:10 }}>
                  <div>
                    <p style={{ fontSize:'0.65rem', fontFamily:"inherit", textTransform:'uppercase', letterSpacing:'0.1em', color:'#9CA3AF', marginBottom:4 }}>#{viewCar.id}</p>
                    <h3 style={{ fontFamily:"inherit", fontSize:'1.6rem', color:'#111', fontWeight:500, margin:0 }}>{viewCar.brand_name} {viewCar.Model}</h3>
                    <p style={{ fontSize:'0.8rem', color:'#3a3b3e', fontFamily:"inherit", marginTop:4 }}>
                      {viewCar.manufacturing_year} · {viewCar.color} · {viewCar.fuel_type || '—'} · {viewCar.Transmission || '—'}
                    </p>
                  </div>
                  <div style={{ display:'flex', gap:10, alignItems:'baseline' }}>
                    <p style={{ fontFamily:"inherit", fontSize:'1.5rem', color:'#F0A500', fontWeight:600, margin:0 }}>{formatINR(viewCar.asking_price)}</p>
                    {viewCar.market_price && <p style={{ fontFamily:"inherit", fontSize:'1.1rem', color:'#9CA3AF', textDecoration:'line-through', margin:0 }}>{formatINR(viewCar.market_price)}</p>}
                  </div>
                </div>
              </div>
              {/* Specs grid */}
              <div style={{ marginBottom:16 }}>{sectionDivider('Specifications')}</div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(160px, 1fr))', gap:8, marginBottom:20 }}>
                {[['Fuel',viewCar.fuel_type],['Gearbox',viewCar.Transmission],['KMs Driven',viewCar.kms_driven ? `${Number(viewCar.kms_driven).toLocaleString('en-IN')} km` : null],['Reg. No',viewCar.registration_no],['Location',viewCar.location],['Added On',viewCar.created_at ? new Date(viewCar.created_at).toLocaleString('en-IN',{day:'numeric',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit',hour12:true}) : null],['Added By',viewCar.added_by || '—']].map(([l,v])=>specItem(l,v))}
              </div>
              {/* Insurance */}
              <div style={{ marginBottom:16 }}>{sectionDivider('Insurance & Documents')}</div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(160px, 1fr))', gap:8, marginBottom:20 }}>
                {[['Insurance No.',viewCar.insurance_no],['Company',viewCar.insurance_company],['Expiry',viewCar.insurance_expiry_date],['Status',(viewCar.insurance_active === 1 || viewCar.insurance_active === true) ? '✓ Active' : (viewCar.insurance_active === 0 || viewCar.insurance_active === false) ? '✕ Expired' : '—']].map(([l,v])=>specItem(l,v))}
              </div>
              {/* Owner */}
              {viewCar.owner && (<>
                <div style={{ marginBottom:16 }}>{sectionDivider('Owner / Seller')}</div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(160px, 1fr))', gap:8, marginBottom:20 }}>
                  {[['Name',viewCar.owner.name],['Phone',viewCar.owner.phone_no],['Email',viewCar.owner.email],['Address',viewCar.owner.address]].map(([l,v])=>specItem(l,v))}
                </div>
              </>)}
              {/* Media Links — YouTube & Instagram at the bottom */}
              {(ytId || viewCar.insta_url) && (<>
                <div style={{ marginBottom:16 }}>{sectionDivider('Media Links')}</div>
                <div style={{ display:'flex', gap:16, flexWrap:'wrap', marginBottom:8 }}>
                  {ytId && (
                    <div style={{ flex:'1 1 260px', minWidth:220, maxWidth:320 }}>
                      <p style={{ fontSize:'0.65rem', fontFamily:"'Space Mono',monospace", textTransform:'uppercase', letterSpacing:'0.08em', color:'#6B7280', marginBottom:8 }}>YouTube Video</p>
                      <a href={viewCar.video_url} target="_blank" rel="noreferrer"
                        style={{ display:'block', position:'relative', borderRadius:10, overflow:'hidden', border:'1px solid #E5E7EB' }}>
                        <img src={`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`} alt="YouTube thumbnail"
                          style={{ width:'100%', height:160, objectFit:'cover', display:'block' }} />
                        <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(0,0,0,0.22)' }}>
                          <div style={{ width:52, height:52, borderRadius:'50%', background:'rgba(255,0,0,0.88)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                            <span style={{ color:'#fff', fontSize:'1.3rem', marginLeft:4 }}>▶</span>
                          </div>
                        </div>
                        <div style={{ position:'absolute', bottom:6, left:8, fontSize:'0.6rem', color:'rgba(255,255,255,0.95)', fontFamily:"'Space Mono',monospace", background:'rgba(0,0,0,0.55)', padding:'2px 8px', borderRadius:4 }}>
                          Watch on YouTube ↗
                        </div>
                      </a>
                    </div>
                  )}
                  {viewCar.insta_url && (
                    <div style={{ flex:'1 1 200px', minWidth:180 }}>
                      <p style={{ fontSize:'0.65rem', fontFamily:"'Space Mono',monospace", textTransform:'uppercase', letterSpacing:'0.08em', color:'#6B7280', marginBottom:8 }}>Instagram Post</p>
                      <a href={viewCar.insta_url} target="_blank" rel="noreferrer"
                        style={{ display:'inline-flex', alignItems:'center', gap:8, background:'linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)', color:'#fff', borderRadius:10, padding:'12px 18px', textDecoration:'none', fontSize:'0.875rem', fontWeight:600 }}>
                        <span style={{ fontSize:'1.2rem' }}>📸</span>
                        View Instagram Post ↗
                      </a>
                    </div>
                  )}
                </div>
              </>)}
            </div>
          );
        })()}
      </Modal>

      {/* Buyer Modal */}
      <Modal open={buyerModalOpen} onClose={()=>setBuyerModalOpen(false)} title={`Buyer Details — ${buyerStatus}`}>
        {buyerError && <div style={{ background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:8, padding:'9px 14px', color:'#EF4444', fontSize:'0.875rem', marginBottom:14 }}>{buyerError}</div>}
        <div style={{ display:'flex', flexDirection:'column', gap:12, maxHeight:'70vh', overflowY:'auto', paddingRight:4 }}>
          {sectionDivider('Buyer Details')}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
            {[['name','Buyer Name *','Name',true],['phone','Phone *','Phone',true],['email','Email','Email',false],['address','Address','Address',false],['price','Deal Price (₹) *','Price',true],['adhar_no','Aadhar No.','Aadhar',false],['driving_license_no','Driving License','DL No.',false]].map(([k,l,ph,req])=>(
              <div key={k}>
                <label style={I.label}>{l}</label>
                <input value={buyerForm[k]} onChange={e=>setBuyerForm(p=>({...p,[k]:e.target.value}))} placeholder={ph} required={req} style={I.base} onFocus={e=>e.target.style.borderColor='#FF5A09'} onBlur={e=>e.target.style.borderColor='#E5E7EB'} />
              </div>
            ))}
          </div>
          {sectionDivider('Transaction')}
          <div>
            <label style={I.label}>Payment Mode</label>
            <select value={buyerForm.payment_mode||''} onChange={e=>setBuyerForm(p=>({...p, payment_mode:e.target.value}))} style={{...I.base, background:'#fff', cursor:'pointer', appearance:'none'}}>
              <option value="">Select…</option>
              {PAYMENT_MODES.map(m=><option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          {buyerForm.payment_mode === 'Bank Transfer' && (
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              <div>
                <label style={I.label}>Bank Name</label>
                <input value={buyerForm.bank_name||''} onChange={e=>setBuyerForm(p=>({...p, bank_name:e.target.value}))} placeholder="HDFC Bank" style={I.base} />
              </div>
              <div>
                <label style={I.label}>Account Number</label>
                <input value={buyerForm.bank_account||''} onChange={e=>setBuyerForm(p=>({...p, bank_account:e.target.value}))} placeholder="1234567890" style={I.base} />
              </div>
              <div>
                <label style={I.label}>IFSC Code</label>
                <input value={buyerForm.ifsc_code||''} onChange={e=>setBuyerForm(p=>({...p, ifsc_code:e.target.value}))} placeholder="HDFC0001234" style={I.base} />
              </div>
            </div>
          )}
          {buyerForm.payment_mode === 'UPI' && (
            <div>
              <label style={I.label}>UPI ID</label>
              <input value={buyerForm.upi_id||''} onChange={e=>setBuyerForm(p=>({...p, upi_id:e.target.value}))} placeholder="user@upi" style={I.base} />
            </div>
          )}
          {buyerForm.payment_mode === 'Cheque' && (
            <div>
              <label style={I.label}>Cheque Number</label>
              <input value={buyerForm.cheque_number||''} onChange={e=>setBuyerForm(p=>({...p, cheque_number:e.target.value}))} placeholder="123456" style={I.base} />
            </div>
          )}
          <div>
            <label style={I.label}>Notes</label>
            <textarea value={buyerForm.notes||''} onChange={e=>setBuyerForm(p=>({...p, notes:e.target.value}))} rows={2} placeholder="Additional notes…" style={{...I.base, resize:'none', minHeight:60}} />
          </div>
          {/* Commission Payment — only shown when SOLD and car has a commission record */}
          {buyerStatus === 'SOLD' && buyerCar?.commission && (
            <>
              {sectionDivider('Commission Payment (Optional)')}
              <div style={{ background:'rgba(240,165,0,0.06)', border:'1px solid rgba(240,165,0,0.2)', borderRadius:8, padding:'10px 14px', fontSize:'0.78rem' }}>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6, color:'#6B7280' }}>
                  <span>Seller due: <strong style={{ color:'#111' }}>{formatINR(buyerCar.commission.seller_commission - buyerCar.commission.seller_paid)}</strong></span>
                  <span>Buyer due: <strong style={{ color:'#111' }}>{formatINR(buyerCar.commission.buyer_commission - buyerCar.commission.buyer_paid)}</strong></span>
                </div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                <div>
                  <label style={I.label}>Seller Payment (₹)</label>
                  <input type="text" inputMode="numeric" value={buyerCommForm.seller_amount} onChange={e=>setBuyerCommForm(p=>({...p,seller_amount:e.target.value.replace(/\D/g,'')}))} placeholder="0" style={I.base} onFocus={e=>e.target.style.borderColor='#FF5A09'} onBlur={e=>e.target.style.borderColor='#E5E7EB'} />
                </div>
                <div>
                  <label style={I.label}>Buyer Payment (₹)</label>
                  <input type="text" inputMode="numeric" value={buyerCommForm.buyer_amount} onChange={e=>setBuyerCommForm(p=>({...p,buyer_amount:e.target.value.replace(/\D/g,'')}))} placeholder="0" style={I.base} onFocus={e=>e.target.style.borderColor='#FF5A09'} onBlur={e=>e.target.style.borderColor='#E5E7EB'} />
                </div>
              </div>
            </>
          )}
        </div>
        <div style={{ display:'flex', justifyContent:'flex-end', gap:10, paddingTop:16, borderTop:'1px solid #E5E7EB', marginTop:16 }}>
          <button onClick={()=>setBuyerModalOpen(false)} style={{ padding:'9px 18px', background:'#F3F4F6', border:'1px solid #E5E7EB', borderRadius:8, color:'#040404', cursor:'pointer', fontFamily:'inherit' }}>Cancel</button>
          <button onClick={saveBuyerDetails} disabled={buyerSaving} style={{ padding:'9px 20px', background:'#FF5A09', color:'#fff', border:'none', borderRadius:8, fontWeight:600, fontSize:'0.875rem', cursor:buyerSaving?'not-allowed':'pointer', opacity:buyerSaving?0.6:1, fontFamily:'inherit' }}>
            {buyerSaving ? 'Saving…' : 'Save Details'}
          </button>
        </div>
      </Modal>
    </div>
  );
}
