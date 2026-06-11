import { useState, useEffect, useCallback } from 'react';
import { adminCarsApi } from '../../utils/api';
import { formatINR, cx } from '../../utils/helpers';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

const statusVariant = (s) => ({
  AVAILABLE: 'green',
  SOLD: 'smoke',
  RESERVED: 'blue',
  BOOKED: 'blue',
  ON_HOLD: 'smoke',
  UNDER_INSPECTION: 'smoke',
  REMOVED: 'red',
}[s] || 'smoke');

export default function AdminOwners() {
  const [owners,         setOwners]         = useState([]);
  const [total,          setTotal]          = useState(0);
  const [page,           setPage]           = useState(1);
  const [totalPages,     setTotalPages]     = useState(1);
  const [loading,        setLoading]        = useState(true);
  const [error,          setError]          = useState('');
  const [search,         setSearch]         = useState('');
  const [editOwner,      setEditOwner]      = useState(null);
  const [selectedOwner,  setSelectedOwner]  = useState(null);
  const [form,           setForm]           = useState({});
  const [saving,         setSaving]         = useState(false);
  const [formError,      setFormError]      = useState('');

  // Reassignment States
  const [reassignCar,    setReassignCar]    = useState(null);
  const [allOwners,      setAllOwners]      = useState([]);
  const [reassignForm,   setReassignForm]   = useState({ owner_id: '', name: '', phone_no: '', email: '', address: '', location: '' });
  const [reassignSaving, setReassignSaving] = useState(false);

  const load = useCallback(async (p = 1) => {
    setLoading(true);
    setError('');
    try {
      const params = { page: p, limit: 10 };
      if (search) params.search = search;
      const res = await adminCarsApi.listOwners(params);
      const d   = res?.data;
      const freshOwners = d?.owners ?? [];
      setOwners(freshOwners);
      setTotal(d?.pagination?.total ?? 0);
      setTotalPages(d?.pagination?.totalPages ?? 1);
      setPage(p);

      // Sync active detail modal owner data if it's currently open
      setSelectedOwner(current => {
        if (!current) return null;
        const fresh = freshOwners.find(o => o.id === current.id);
        return fresh || null;
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => { load(1); }, [load]);

  const openEdit = (owner) => { setEditOwner(owner); setForm({ ...owner }); setFormError(''); };
  const f = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const save = async () => {
    setSaving(true);
    setFormError('');
    try {
      const res = await adminCarsApi.updateOwner(editOwner.id, form);
      const msg = res?.data?.message || res?.message || 'Owner updated successfully';
      const isMerged = res?.data?.merged || res?.merged;
      if (isMerged) {
        alert(msg);
        setSelectedOwner(null);
      }
      setEditOwner(null);
      load(page);
    } catch (err) {
      setFormError(err.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const openReassign = async (car) => {
    setReassignCar(car);
    setReassignForm({ owner_id: '', name: '', phone_no: '', email: '', address: '', location: '' });
    try {
      const res = await adminCarsApi.listOwners({ limit: 100 });
      setAllOwners(res?.data?.owners ?? []);
    } catch (err) {
      console.error('Failed to load owners:', err);
    }
  };

  const saveReassign = async () => {
    if (!reassignForm.owner_id && !reassignForm.name) {
      alert('Please select an owner or enter a new owner name.');
      return;
    }
    setReassignSaving(true);
    try {
      const payload = {};
      if (reassignForm.owner_id) {
        payload.owner_id = Number(reassignForm.owner_id);
      } else {
        payload.owner = {
          name: reassignForm.name,
          phone_no: reassignForm.phone_no,
          email: reassignForm.email,
          address: reassignForm.address,
          location: reassignForm.location
        };
      }
      await adminCarsApi.update(reassignCar.id, payload);
      setReassignCar(null);
      alert('Car reassigned successfully!');
      load(page);
    } catch (err) {
      alert(err.message || 'Reassignment failed');
    } finally {
      setReassignSaving(false);
    }
  };

  const inputClass = "w-full bg-ink border border-ink-4 rounded-md px-3 py-2 text-white text-sm placeholder-ink-5 focus:outline-none focus:border-gold transition-colors";
  const labelClass = "block text-xs font-mono uppercase tracking-wider text-smoke mb-1";

  return (
    <div className="p-8 pb-12 flex flex-col gap-6 max-[480px]:p-5">
      <AdminPageHeader title="Owners / Sellers" sub={`${total} registered`} />

      <div className="max-w-[320px]">
        <input placeholder="Search name, phone, email…" value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-ink-2 border border-ink-4 rounded-md px-4 py-2 text-white text-sm placeholder-smoke focus:outline-none focus:border-gold transition-colors" />
      </div>

      {error && <div className="bg-crimson/10 border border-crimson/30 rounded-md px-4 py-3 text-crimson text-sm">{error}</div>}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_,i) => <div key={i} className="bg-ink-2 border border-ink-4 rounded-lg h-36 animate-pulse" />)}
        </div>
      ) : owners.length === 0 ? (
        <div className="text-center py-16 text-smoke">
          <p className="text-4xl mb-4">◉</p>
          <p className="font-display text-xl text-mist">No owners found</p>
          <p className="text-sm mt-2">Owners are created when adding cars.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {owners.map(owner => (
            <div
              key={owner.id}
              onClick={() => setSelectedOwner(owner)}
              className="bg-ink-2 border border-ink-4 rounded-lg p-5 hover:border-ink-5 hover:shadow-md transition-all duration-150 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gold-glow border border-gold-dark text-gold flex items-center justify-center text-sm font-bold shrink-0">
                    {owner.name?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-medium text-sm truncate">{owner.name || '—'}</h3>
                    <p className="text-smoke text-xs font-mono">{owner.phone_no || owner.email || '—'}</p>
                  </div>
                  <Badge variant={owner.isActive ? 'green' : 'smoke'}>{owner.isActive ? 'Active' : 'Inactive'}</Badge>
                </div>

                {owner.location && (
                  <p className="text-xs text-smoke mb-3">📍 {owner.location}</p>
                )}

                {/* Cars owned */}
                {owner.cars && owner.cars.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-smoke font-mono uppercase tracking-wide mb-2">Cars ({owner.cars.length})</p>
                    <div className="flex flex-wrap gap-1">
                      {owner.cars.slice(0, 3).map(car => (
                        <span key={car.id} className="text-xs bg-ink-3 text-mist px-2 py-1 rounded-sm">{car.brand_name} {car.Model}</span>
                      ))}
                      {owner.cars.length > 3 && <span className="text-xs text-smoke self-center ml-1">+{owner.cars.length - 3} more</span>}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={(e) => { e.stopPropagation(); openEdit(owner); }}
                className="w-full py-1.5 bg-ink-4 hover:bg-ink-5 text-smoke hover:text-white rounded-sm text-xs transition-colors mt-2"
              >
                Edit Owner
              </button>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <button 
            disabled={page === 1} 
            onClick={() => load(page - 1)}
            className="w-9 h-9 flex items-center justify-center bg-ink-2 border border-ink-4 rounded-md text-sm text-smoke hover:text-white disabled:opacity-30 transition-colors cursor-pointer"
          >
            ‹
          </button>
          {[...Array(totalPages)].map((_, idx) => {
            const p = idx + 1;
            return (
              <button
                key={p}
                onClick={() => load(p)}
                className={cx(
                  "w-9 h-9 flex items-center justify-center rounded-md text-sm font-mono transition-all cursor-pointer border",
                  p === page
                    ? "bg-orange-brand border-orange-brand text-true-white font-bold shadow-[0_2px_8px_rgba(231,94,22,0.25)]"
                    : "bg-ink-2 border-ink-4 text-smoke hover:text-white hover:border-ink-5"
                )}
              >
                {p}
              </button>
            );
          })}
          <button 
            disabled={page === totalPages} 
            onClick={() => load(page + 1)}
            className="w-9 h-9 flex items-center justify-center bg-ink-2 border border-ink-4 rounded-md text-sm text-smoke hover:text-white disabled:opacity-30 transition-colors cursor-pointer"
          >
            ›
          </button>
        </div>
      )}

      {/* Detail Modal */}
      <Modal isOpen={!!selectedOwner} onClose={() => setSelectedOwner(null)} title={`Owner Details — ${selectedOwner?.name}`} size="lg">
        {selectedOwner && (
          <div className="flex flex-col gap-6">
            {/* Grid details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-ink-3 p-5 rounded-lg border border-ink-4">
              <div>
                <p className="text-[0.7rem] font-mono uppercase tracking-wider text-smoke mb-1">Name</p>
                <p className="text-white text-sm font-semibold">{selectedOwner.name || '—'}</p>
              </div>
              <div>
                <p className="text-[0.7rem] font-mono uppercase tracking-wider text-smoke mb-1">Status</p>
                <Badge variant={selectedOwner.isActive ? 'green' : 'smoke'}>
                  {selectedOwner.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <div>
                <p className="text-[0.7rem] font-mono uppercase tracking-wider text-smoke mb-1">Phone</p>
                <p className="text-white text-sm font-mono">{selectedOwner.phone_no || '—'}</p>
              </div>
              <div>
                <p className="text-[0.7rem] font-mono uppercase tracking-wider text-smoke mb-1">Email</p>
                <p className="text-white text-sm font-mono">{selectedOwner.email || '—'}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-[0.7rem] font-mono uppercase tracking-wider text-smoke mb-1">Address / Location</p>
                <p className="text-white text-sm">{selectedOwner.address || '—'} {selectedOwner.location ? `(📍 ${selectedOwner.location})` : ''}</p>
              </div>
            </div>

            {/* Cars List */}
            <div>
              <h4 className="text-xs font-mono uppercase tracking-widest text-gold mb-3">
                Cars Managed ({selectedOwner.cars?.length || 0})
              </h4>
              
              {!selectedOwner.cars || selectedOwner.cars.length === 0 ? (
                <p className="text-xs text-smoke italic bg-ink-3 p-4 rounded-md border border-ink-4">No cars registered under this owner yet.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[40vh] overflow-y-auto pr-1">
                  {selectedOwner.cars.map(car => (
                    <div key={car.id} className="flex items-center gap-3 bg-ink-3 border border-ink-4 p-3 rounded-md hover:border-gold transition-colors">
                      {car.media?.[0]?.image_url ? (
                        <img src={car.media[0].image_url} alt="" className="w-16 h-12 object-cover rounded-sm bg-ink-4 shrink-0" />
                      ) : (
                        <div className="w-16 h-12 bg-ink-4 rounded-sm flex items-center justify-center text-smoke text-xs font-bold shrink-0">
                          {car.brand_name?.[0]?.toUpperCase()}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-xs font-semibold truncate">{car.brand_name} {car.Model}</p>
                        <p className="text-smoke text-[0.7rem] font-mono truncate">{car.registration_no || 'No Reg No'} · {car.manufacturing_year}</p>
                        <p className="text-[0.7rem] text-smoke font-mono">{car.fuel_type} · {car.Transmission}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-gold text-xs font-medium font-mono">{formatINR(car.asking_price)}</p>
                        <Badge variant={statusVariant(car.status)} className="text-[0.6rem] mt-1 block">{car.status}</Badge>
                        <button
                          onClick={() => openReassign(car)}
                          className="text-gold hover:text-gold-light text-[1rem] underline font-mono cursor-pointer mt-10 block text-right"
                        >
                          Edit Owner
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-ink-4 mt-2">
              <Button variant="ghost" onClick={() => setSelectedOwner(null)}>Close</Button>
              <Button variant="primary" onClick={() => { openEdit(selectedOwner); }}>Edit Owner Details</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Reassign Modal */}
      <Modal isOpen={!!reassignCar} onClose={() => setReassignCar(null)} title={`Reassign Car — ${reassignCar?.brand_name} ${reassignCar?.Model}`} size="md">
        {reassignCar && (
          <div className="flex flex-col gap-4">
            <p className="text-xs text-smoke">
              Move this car to another existing owner, or create a brand new owner profile for this car.
            </p>
            
            <div className="mb-3">
              <label className={labelClass}>Link to Existing Owner</label>
              <select
                value={reassignForm.owner_id || ''}
                onChange={e => {
                  const val = e.target.value;
                  setReassignForm(p => ({
                    ...p,
                    owner_id: val,
                    name: val ? '' : p.name,
                    phone_no: val ? '' : p.phone_no,
                    email: val ? '' : p.email,
                    address: val ? '' : p.address,
                    location: val ? '' : p.location
                  }));
                }}
                className={inputClass}
              >
                <option value="">+ Create New Owner for this car</option>
                {allOwners.map(o => (
                  <option key={o.id} value={o.id}>
                    {o.name || `Owner #${o.id}`} {o.email ? `(${o.email})` : o.phone_no ? `(${o.phone_no})` : ''}
                  </option>
                ))}
              </select>
            </div>

            {!reassignForm.owner_id && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-ink-4 pt-3 mt-1">
                {[
                  ['name', 'Owner Name', 'John Doe'],
                  ['phone_no', 'Phone', '9876543210'],
                  ['email', 'Email', 'newowner@example.com'],
                  ['address', 'Address', 'Madanapalle'],
                  ['location', 'Location', 'Andhra Pradesh'],
                ].map(([k, label, ph]) => (
                  <div key={k}>
                    <label className={labelClass}>{label}</label>
                    <input
                      value={reassignForm[k] || ''}
                      onChange={e => setReassignForm(p => ({ ...p, [k]: e.target.value }))}
                      placeholder={ph}
                      className={inputClass}
                    />
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-ink-4 mt-3">
              <Button variant="ghost" onClick={() => setReassignCar(null)}>Cancel</Button>
              <Button variant="primary" onClick={saveReassign} disabled={reassignSaving}>
                {reassignSaving ? 'Saving…' : 'Save Reassignment'}
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={!!editOwner} onClose={() => setEditOwner(null)} title={`Edit — ${editOwner?.name || 'Owner'}`} size="md">
        {formError && <div className="bg-crimson/10 border border-crimson/30 rounded-md px-4 py-3 text-crimson text-sm mb-4">{formError}</div>}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            ['name','Name','Mohammed Rafi'],
            ['phone_no','Phone','9876543210'],
            ['email','Email','owner@example.com'],
            ['address','Address','Madanapalle'],
            ['location','Location','Andhra Pradesh'],
          ].map(([k,label,ph]) => (
            <div key={k}>
              <label className={labelClass}>{label}</label>
              <input value={form[k]||''} onChange={f(k)} placeholder={ph} className={inputClass} />
            </div>
          ))}
          <div>
            <label className={labelClass}>Active</label>
            <select value={form.isActive ?? 1} onChange={e => setForm(p => ({...p, isActive: Number(e.target.value)}))} className={inputClass}>
              <option value={1}>Active</option>
              <option value={0}>Inactive</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-4 border-t border-ink-4 mt-4">
          <Button variant="ghost" onClick={() => setEditOwner(null)}>Cancel</Button>
          <Button variant="primary" onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save Changes'}</Button>
        </div>
      </Modal>
    </div>
  );
}
