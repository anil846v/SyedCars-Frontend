import { useState, useEffect, useCallback } from 'react';
import { adminCarsApi } from '../../utils/api';
import { formatINR } from '../../utils/helpers';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';

const CAR_STATUSES = ['AVAILABLE','RESERVED','BOOKED','SOLD','ON_HOLD','UNDER_INSPECTION','REMOVED'];

const statusVariant = (s) => ({
  AVAILABLE:'green', SOLD:'smoke', RESERVED:'blue', BOOKED:'blue',
  ON_HOLD:'smoke', UNDER_INSPECTION:'smoke', REMOVED:'red',
}[s] || 'smoke');

const FUEL_TYPES  = ['Petrol','Diesel','CNG','Electric','Hybrid','LPG'];
const TRANS_TYPES = ['Manual','Automatic','AMT','CVT','DCT'];

function CarForm({ form, onChange, ownersList = [] }) {
  const f = (k) => (e) => onChange({ ...form, [k]: e.target.value });

  const inputClass = "w-full bg-ink border border-ink-4 rounded-md px-3 py-2 text-white text-sm placeholder-ink-5 focus:outline-none focus:border-gold transition-colors";
  const labelClass = "block text-xs font-mono uppercase tracking-wider text-smoke mb-1";

  return (
    <div className="overflow-y-auto max-h-[72vh] pr-1">
      {/* Owner Section */}
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-px flex-1 bg-ink-4" />
          <span className="text-xs font-mono uppercase tracking-widest text-gold px-2">Owner / Seller Details</span>
          <div className="h-px flex-1 bg-ink-4" />
        </div>
        <p className="text-xs text-smoke mb-4">
          Select an existing owner, or choose "+ Add New Owner" and fill details below.
        </p>

        {/* <div className="mb-4">
          <label className={labelClass}>Link to Existing Owner</label>
          <select
            value={form.owner_id || ''}
            onChange={(e) => {
              const oId = e.target.value;
              if (oId === '') {
                onChange({
                  ...form,
                  owner_id: '',
                  'owner.name': '',
                  'owner.phone_no': '',
                  'owner.email': '',
                  'owner.address': '',
                  'owner.location': '',
                });
              } else {
                const selectedOwner = ownersList.find(o => String(o.id) === String(oId));
                if (selectedOwner) {
                  onChange({
                    ...form,
                    owner_id: Number(oId),
                    'owner.name': selectedOwner.name || '',
                    'owner.phone_no': selectedOwner.phone_no || '',
                    'owner.email': selectedOwner.email || '',
                    'owner.address': selectedOwner.address || '',
                    'owner.location': selectedOwner.location || '',
                  });
                }
              }
            }}
            className={inputClass}
          >
            <option value="">+ Add New Owner / Syed Cars (Self)</option>
            {ownersList.map(o => (
              <option key={o.id} value={o.id}>
                {o.name || `Owner #${o.id}`} {o.email ? `(${o.email})` : o.phone_no ? `(${o.phone_no})` : ''}
              </option>
            ))}
          </select>
        </div> */}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            ['owner.name',     'Owner Name',    'Mohammed Rafi'],
            ['owner.phone_no', 'Phone',         '9876543210'],
            ['owner.email',    'Email',         'owner@example.com'],
            ['owner.address',  'Address',       'Madanapalle'],
            ['owner.location', 'Location',      'Andhra Pradesh'],
          ].map(([k, label, ph]) => (
            <div key={k}>
              <label className={labelClass}>{label}</label>
              <input
                value={form[k] || ''}
                onChange={e => onChange({ ...form, [k]: e.target.value })}
                placeholder={ph}
                disabled={!!form.owner_id}
                className={`${inputClass} ${form.owner_id ? 'opacity-60 cursor-not-allowed bg-ink-2' : ''}`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Car Details */}
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-px flex-1 bg-ink-4" />
          <span className="text-xs font-mono uppercase tracking-widest text-gold px-2">Car Details</span>
          <div className="h-px flex-1 bg-ink-4" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Brand Name *</label>
            <input value={form.brand_name||''} onChange={f('brand_name')} placeholder="Mercedes-Benz" required className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Model *</label>
            <input value={form.Model||''} onChange={f('Model')} placeholder="E-Class" required className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Manufacturing Year</label>
            <input type="number" value={form.manufacturing_year||''} onChange={f('manufacturing_year')} placeholder="2021" min="1990" max="2025" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Color</label>
            <input value={form.color||''} onChange={f('color')} placeholder="Obsidian Black" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Registration No.</label>
            <input value={form.registration_no||''} onChange={f('registration_no')} placeholder="TS09AB1234" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Fuel Type</label>
            <select value={form.fuel_type||''} onChange={f('fuel_type')} className={inputClass}>
              <option value="">Select…</option>
              {FUEL_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Transmission</label>
            <select value={form.Transmission||''} onChange={f('Transmission')} className={inputClass}>
              <option value="">Select…</option>
              {TRANS_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>KMs Driven</label>
            <input value={form.kms_driven||''} onChange={f('kms_driven')} placeholder="28,400" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Asking Price (₹)</label>
            <input type="number" value={form.asking_price||''} onChange={f('asking_price')} placeholder="5200000" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Market Price (₹)</label>
            <input type="number" value={form.market_price||''} onChange={f('market_price')} placeholder="5800000" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Location</label>
            <input value={form.location||''} onChange={f('location')} placeholder="Madanapalle, Andhra Pradesh" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Status</label>
            <select value={form.status||'AVAILABLE'} onChange={f('status')} className={inputClass}>
              {CAR_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Documents */}
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-px flex-1 bg-ink-4" />
          <span className="text-xs font-mono uppercase tracking-widest text-gold px-2">Documents & Insurance</span>
          <div className="h-px flex-1 bg-ink-4" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            ['engine_no','Engine No.','ENG78345612'],
            ['chassis_no','Chassis No.','CHS98712300'],
            ['insurance_no','Insurance No.','INS20210045'],
            ['insurance_company','Insurance Company','New India Assurance'],
            ['insurance_expiry_date','Insurance Expiry','2025-12-31'],
          ].map(([k, label, ph]) => (
            <div key={k}>
              <label className={labelClass}>{label}</label>
              <input value={form[k]||''} onChange={f(k)} placeholder={ph} className={inputClass} />
            </div>
          ))}
          <div>
            <label className={labelClass}>Insurance Active</label>
            <select value={form.insurance_active ?? ''} onChange={e => onChange({ ...form, insurance_active: e.target.value === '' ? null : Number(e.target.value) })} className={inputClass}>
              <option value="">Unknown</option>
              <option value="1">Active</option>
              <option value="0">Not Active / Expired</option>
            </select>
          </div>
        </div>
      </div>

      {/* Media */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="h-px flex-1 bg-ink-4" />
          <span className="text-xs font-mono uppercase tracking-widest text-gold px-2">Media Links</span>
          <div className="h-px flex-1 bg-ink-4" />
        </div>
        <div className="grid grid-cols-1 gap-3">
          <div>
            <label className={labelClass}>YouTube Video URL</label>
            <input value={form.video_url||''} onChange={f('video_url')} placeholder="https://youtube.com/watch?v=..." className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Instagram Post URL</label>
            <input value={form.insta_url||''} onChange={f('insta_url')} placeholder="https://instagram.com/p/..." className={inputClass} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Helpers to flatten/unflatten owner fields ───────────────────────────────
function flattenCar(car) {
  const flat = { ...car };
  if (car.owner) {
    flat['owner.name']     = car.owner.name     || '';
    flat['owner.phone_no'] = car.owner.phone_no || '';
    flat['owner.email']    = car.owner.email     || '';
    flat['owner.address']  = car.owner.address   || '';
    flat['owner.location'] = car.owner.location  || '';
  }
  return flat;
}

function buildPayload(form) {
  const { 'owner.name':name, 'owner.phone_no':phone_no, 'owner.email':email, 'owner.address':address, 'owner.location':location, ...car } = form;
  const payload = { ...car };
  if (form.owner_id) {
    payload.owner_id = Number(form.owner_id);
    delete payload.owner;
  } else {
    // Only include owner if at least phone or email provided (minimum to identify)
    if (phone_no || email) {
      payload.owner = { name, phone_no, email, address, location };
    } else if (name) {
      payload.owner = { name, phone_no:'', email:'', address, location };
    }
  }
  return payload;
}

export default function AdminCars() {
  const [cars,      setCars]      = useState([]);
  const [total,     setTotal]     = useState(0);
  const [page,      setPage]      = useState(1);
  const [totalPages,setTotalPages]= useState(1);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState('');
  const [search,    setSearch]    = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editCar,   setEditCar]   = useState(null);
  const [form,      setForm]      = useState({});
  const [saving,    setSaving]    = useState(false);
  const [formError, setFormError] = useState('');
  const [viewCar,   setViewCar]   = useState(null);
  const [ownersList, setOwnersList] = useState([]);

  const loadOwners = useCallback(async () => {
    try {
      const res = await adminCarsApi.listOwners({ limit: 100 });
      setOwnersList(res?.data?.owners ?? []);
    } catch {}
  }, []);

  const load = useCallback(async (p = 1) => {
    setLoading(true);
    setError('');
    try {
      const params = { page: p, limit: 10 };
      if (search)       params.brand  = search;
      if (filterStatus) params.status = filterStatus;
      const res = await adminCarsApi.list(params);
      const d   = res?.data;
      setCars(d?.cars ?? []);
      setTotal(d?.pagination?.total ?? 0);
      setTotalPages(d?.pagination?.totalPages ?? 1);
      setPage(p);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [search, filterStatus]);

  useEffect(() => { load(1); loadOwners(); }, [load, loadOwners]);

  const openAdd  = () => { setEditCar(null); setForm({}); setFormError(''); setModalOpen(true); };
  const openView = async (car) => {
    try {
      const res = await adminCarsApi.get(car.id);
      setViewCar(res?.data ?? car);
    } catch {
      setViewCar(car);
    }
  };
  const openEdit = async (car) => {
    setEditCar(car);
    setFormError('');
    try {
      const res = await adminCarsApi.get(car.id);
      setForm(flattenCar(res?.data ?? car));
    } catch {
      setForm(flattenCar(car));
    }
    setModalOpen(true);
  };

  const save = async () => {
    setSaving(true);
    setFormError('');
    try {
      const payload = buildPayload(form);
      // Backend requires owner (upserts). If none provided, send minimal owner with car name
      if (!payload.owner && !payload.owner_id) {
        payload.owner = { name: 'Syed Cars (Self)', phone_no: '', email: '' };
      }
      if (editCar) {
        await adminCarsApi.update(editCar.id, payload);
      } else {
        await adminCarsApi.create(payload);
      }
      setModalOpen(false);
      load(page);
      loadOwners();
    } catch (err) {
      setFormError(err.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (car) => {
    try {
      await adminCarsApi.changeStatus(car.id, car.is_active ? 'REMOVED' : 'AVAILABLE');
      load(page);
    } catch (err) {
      alert(err.message);
    }
  };

  const changeStatus = async (car, status) => {
    try {
      await adminCarsApi.changeStatus(car.id, status);
      load(page);
    } catch (err) {
      alert(err.message);
    }
  };

  const deleteCar = async (id) => {
    if (!confirm('Remove this car from listings?')) return;
    try {
      await adminCarsApi.delete(id);
      load(page);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="p-8 pb-12 flex flex-col gap-6 max-[480px]:p-5">
      <AdminPageHeader
        title="Cars Management"
        sub={`${total} total listings`}
        action={<Button variant="primary" size="sm" onClick={openAdd}>+ Add Car</Button>}
      />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="max-w-[320px] flex-1">
          <input
            placeholder="Search brand, model…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-ink-2 border border-ink-4 rounded-md px-4 py-2 text-white text-sm placeholder-smoke focus:outline-none focus:border-gold transition-colors"
          />
        </div>
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="bg-ink-2 border border-ink-4 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-gold transition-colors"
        >
          <option value="">All Statuses</option>
          {CAR_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {error && <div className="bg-crimson/10 border border-crimson/30 rounded-md px-4 py-3 text-crimson text-sm">{error}</div>}

      {/* Car Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-ink-2 border border-ink-4 rounded-lg h-56 animate-pulse" />
          ))}
        </div>
      ) : cars.length === 0 ? (
        <div className="text-center py-16 text-smoke">
          <p className="text-4xl mb-4">⊞</p>
          <p className="font-display text-xl text-mist">No cars found</p>
          <p className="text-sm mt-2">Add your first listing or adjust filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cars.map(car => (
            <div key={car.id} className="bg-ink-2 border border-ink-4 rounded-lg overflow-hidden group hover:border-ink-5 transition-colors">
              {/* Image */}
              <div className="relative h-40 bg-ink-3 overflow-hidden">
                {car.media?.[0]?.image_url ? (
                  <img src={car.media[0].image_url} alt={car.brand_name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-ink-5 text-4xl font-display">{car.brand_name?.[0] || '⊞'}</span>
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <Badge variant={statusVariant(car.status)}>{car.status || (car.is_active ? 'Active':'Hidden')}</Badge>
                </div>
                <div className="absolute top-2 left-2">
                  <span className="font-mono text-[0.65rem] bg-ink/80 text-smoke px-2 py-1 rounded-sm">#{car.id}</span>
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div>
                    <h3 className="text-white font-medium text-sm">{car.brand_name} {car.Model}</h3>
                    <p className="text-smoke text-xs font-mono">{car.manufacturing_year} · {car.color}</p>
                  </div>
                  <p className="text-gold font-display text-base shrink-0">{formatINR(car.asking_price)}</p>
                </div>
                <div className="flex items-center gap-2 text-xs text-smoke font-mono mt-2 mb-3 flex-wrap">
                  {car.fuel_type && <span>{car.fuel_type}</span>}
                  {car.Transmission && <><span>·</span><span>{car.Transmission}</span></>}
                  {car.kms_driven  && <><span>·</span><span>{car.kms_driven} km</span></>}
                </div>
                {car.owner && (
                  <p className="text-xs text-smoke mb-3">Owner: <span className="text-mist">{car.owner.name}</span></p>
                )}
                <div className="flex items-center gap-1 justify-between">
                  <div className="flex items-center gap-1">
                    <button onClick={() => openView(car)}
                      className="w-7 h-[26px] flex items-center justify-center bg-ink-4 hover:bg-ink-5 text-smoke hover:text-white rounded-sm text-xs transition-colors">👁</button>
                    <button onClick={() => openEdit(car)}
                      className="px-3 py-1.5 bg-ink-4 hover:bg-ink-5 text-smoke hover:text-white rounded-sm text-xs transition-colors">Edit</button>
                    <select value={car.status || ''} onChange={e => changeStatus(car, e.target.value)}
                      className="bg-ink-4 border-0 text-smoke text-xs rounded-sm px-2 py-1.5 focus:outline-none hover:bg-ink-5 transition-colors">
                      {CAR_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <button onClick={() => deleteCar(car.id)}
                    className="px-2 py-1.5 bg-ink-4 hover:bg-crimson/20 text-smoke hover:text-crimson rounded-sm text-xs transition-colors">✕</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button disabled={page === 1} onClick={() => load(page - 1)}
            className="px-4 py-2 bg-ink-2 border border-ink-4 rounded-md text-sm text-smoke hover:text-white hover:border-ink-5 disabled:opacity-30 transition-colors">← Prev</button>
          <span className="text-smoke text-sm font-mono">Page {page} / {totalPages}</span>
          <button disabled={page === totalPages} onClick={() => load(page + 1)}
            className="px-4 py-2 bg-ink-2 border border-ink-4 rounded-md text-sm text-smoke hover:text-white hover:border-ink-5 disabled:opacity-30 transition-colors">Next →</button>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editCar ? `Edit — ${editCar.brand_name} ${editCar.Model}` : 'Add New Car'} size="lg">
        {formError && (
          <div className="bg-crimson/10 border border-crimson/30 rounded-md px-4 py-3 text-crimson text-sm mb-4">{formError}</div>
        )}
        <CarForm form={form} onChange={setForm} ownersList={ownersList} />
        <div className="flex justify-end gap-3 pt-4 border-t border-ink-4 mt-4">
          <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button variant="primary" onClick={save} disabled={saving}>{saving ? 'Saving…' : editCar ? 'Save Changes' : 'Add Car'}</Button>
        </div>
      </Modal>

      {/* Car Full View Modal */}
      <Modal isOpen={!!viewCar} onClose={() => setViewCar(null)} title="Car Specifications & Details" size="lg">
        {viewCar && (
          <div className="space-y-6 max-h-[72vh] overflow-y-auto pr-1">
            {/* Header / Media */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="md:col-span-1 h-48 bg-ink-3 rounded-lg overflow-hidden border border-ink-4 relative">
                {viewCar.media?.[0]?.image_url ? (
                  <img
                    src={viewCar.media[0].image_url}
                    alt={viewCar.brand_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-ink-2">
                    <span className="text-ink-5 text-4xl font-display">{viewCar.brand_name?.[0] || '⊞'}</span>
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <Badge variant={({
                    AVAILABLE: 'green', SOLD: 'smoke', RESERVED: 'blue', BOOKED: 'blue',
                    ON_HOLD: 'smoke', UNDER_INSPECTION: 'smoke', REMOVED: 'red'
                  }[viewCar.status] || 'smoke')}>
                    {viewCar.status || 'AVAILABLE'}
                  </Badge>
                </div>
                <div className="absolute top-2 left-2">
                  <span className="font-mono text-[0.65rem] bg-ink/80 text-smoke px-2 py-1 rounded-sm">#{viewCar.id}</span>
                </div>
              </div>

              {/* Quick Summary Info */}
              <div className="md:col-span-2 flex flex-col justify-between">
                <div>
                  <h3 className="text-white font-display text-xl font-bold leading-tight">
                    {viewCar.brand_name} {viewCar.Model}
                  </h3>
                  <p className="text-smoke text-sm mt-1">
                    {viewCar.manufacturing_year ? `${viewCar.manufacturing_year} Model` : 'Year unknown'}
                    {viewCar.color ? ` · ${viewCar.color}` : ''}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-ink-4">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-smoke">Asking Price</span>
                    <p className="text-gold font-display text-xl font-bold mt-0.5">{formatINR(viewCar.asking_price)}</p>
                  </div>
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-smoke">Market Price</span>
                    <p className="text-white font-display text-xl font-medium mt-0.5">{formatINR(viewCar.market_price)}</p>
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
                  ['Fuel Type', viewCar.fuel_type],
                  ['Transmission', viewCar.Transmission],
                  ['KMs Driven', viewCar.kms_driven ? `${viewCar.kms_driven} km` : null],
                  ['Registration No.', viewCar.registration_no],
                  ['Engine No.', viewCar.engine_no],
                  ['Chassis No.', viewCar.chassis_no],
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
                  ['Insurance Company', viewCar.insurance_company],
                  ['Insurance Expiry', viewCar.insurance_expiry_date],
                  ['Insurance Status', viewCar.insurance_active === 1 ? 'Active' : viewCar.insurance_active === 0 ? 'Expired' : 'Unknown'],
                  ['Car Location', viewCar.location],
                ].map(([label, val]) => (
                  <div key={label}>
                    <span className="block text-[0.7rem] font-mono uppercase tracking-wider text-smoke mb-0.5">{label}</span>
                    <span className="text-white font-medium">{val || '—'}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Owner/Seller Details */}
            {viewCar.owner && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-px flex-1 bg-ink-4" />
                  <span className="text-xs font-mono uppercase tracking-widest text-gold px-2">Owner / Seller Details</span>
                  <div className="h-px flex-1 bg-ink-4" />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-ink-3 rounded-lg p-4 border border-ink-4 text-sm">
                  {[
                    ['Owner Name', viewCar.owner.name],
                    ['Phone', viewCar.owner.phone_no],
                    ['Email', viewCar.owner.email],
                    ['Address', viewCar.owner.address],
                    ['Location', viewCar.owner.location],
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
                {viewCar.video_url && (
                  <a href={viewCar.video_url} target="_blank" rel="noreferrer" className="text-gold hover:underline">
                    📺 YouTube Video
                  </a>
                )}
                {viewCar.insta_url && (
                  <a href={viewCar.insta_url} target="_blank" rel="noreferrer" className="text-gold hover:underline">
                    📸 Instagram Post
                  </a>
                )}
              </div>
              <Button variant="primary" size="sm" onClick={() => setViewCar(null)}>Close</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
