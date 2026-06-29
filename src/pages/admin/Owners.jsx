import { useState, useEffect, useCallback } from 'react';
import { adminCarsApi, getMediaUrl } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { formatINR } from '../../utils/helpers';
import Pagination from '../../components/admin/Pagination';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { useToast } from '../../components/ui/Toaster';

// ─── helpers ────────────────────────────────────────────────────────────────

const statusVariant = (s) =>
  ({ AVAILABLE: 'green', SOLD: 'gray', RESERVED: 'blue', BOOKED: 'blue', ON_HOLD: 'gray', UNDER_INSPECTION: 'gray', REMOVED: 'red' }[s] || 'gray');

// Shared input / label styles (mirrors AdminCars exactly)
const I = {
  base: {
    width: '100%', background: '#fff', border: '1px solid #E5E7EB',
    borderRadius: 8, padding: '9px 12px', fontSize: '0.875rem', color: '#111',
    outline: 'none', fontFamily: 'inherit', transition: 'border-color 0.15s',
    boxSizing: 'border-box',
  },
  label: {
    display: 'block', fontSize: '0.68rem', fontFamily: "'Space Mono',monospace",
    textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6B7280', marginBottom: 5,
  },
};

const focusGold  = (e) => { e.target.style.borderColor = '#F0A500'; };
const blurGray   = (e) => { e.target.style.borderColor = '#E5E7EB'; };

const sectionDivider = (label) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
    <div style={{ flex: 1, height: 1, background: '#E5E7EB' }} />
    <span style={{ fontSize: '0.65rem', fontFamily: "'Space Mono',monospace", textTransform: 'uppercase', letterSpacing: '0.12em', color: '#F0A500' }}>{label}</span>
    <div style={{ flex: 1, height: 1, background: '#E5E7EB' }} />
  </div>
);

const specItem = (label, val) => (
  <div key={label} style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 8, padding: '10px 14px' }}>
    <p style={{ fontSize: '0.65rem', fontFamily: "'Space Mono',monospace", textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6B7280', marginBottom: 4 }}>{label}</p>
    <p style={{ fontSize: '0.875rem', color: '#111', fontWeight: 500 }}>{val || '—'}</p>
  </div>
);

// Avatar hue from name
const avatarHue = (str) =>
  Math.abs((str || '').split('').reduce((a, c) => a + c.charCodeAt(0), 0) % 360);

// ─── component ──────────────────────────────────────────────────────────────

export default function AdminOwners() {
  const { canOp } = useAuth();
  const toast = useToast();

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

  // Reassignment
  const [reassignCar,    setReassignCar]    = useState(null);
  const [allOwners,      setAllOwners]      = useState([]);
  const [reassignForm,   setReassignForm]   = useState({ owner_id: '', name: '', phone_no: '', email: '', address: '', location: '' });
  const [reassignSaving, setReassignSaving] = useState(false);

  // ── load ──────────────────────────────────────────────────────────────────
  const load = useCallback(async (p = 1) => {
    setLoading(true); setError('');
    try {
      const params = { page: p, limit: 9 };
      if (search) params.search = search;
      const res = await adminCarsApi.listOwners(params);
      const d   = res?.data;
      const freshOwners = d?.owners ?? [];
      setOwners(freshOwners);
      setTotal(d?.pagination?.total ?? 0);
      setTotalPages(d?.pagination?.totalPages ?? 1);
      setPage(p);
      setSelectedOwner(cur => {
        if (!cur) return null;
        return freshOwners.find(o => o.id === cur.id) || null;
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => { load(1); }, [load]);

  // ── edit owner ────────────────────────────────────────────────────────────
  const openEdit = (owner) => { setEditOwner(owner); setForm({ ...owner }); setFormError(''); };
  const f = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const save = async () => {
    setSaving(true); setFormError('');
    try {
      const res = await adminCarsApi.updateOwner(editOwner.id, form);
      const msg      = res?.data?.message || res?.message || 'Owner updated successfully';
      const isMerged = res?.data?.merged  || res?.merged;
      if (isMerged) {
        toast.info(msg);
        setSelectedOwner(null);
      } else {
        toast.success('Owner updated successfully');
      }
      setEditOwner(null);
      load(page);
    } catch (err) {
      setFormError(err.message || 'Save failed');
      toast.error(err.message || 'Failed to update owner');
    } finally {
      setSaving(false);
    }
  };

  // ── reassign car ──────────────────────────────────────────────────────────
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
      toast.error('Please select an owner or enter a new owner name.');
      return;
    }
    setReassignSaving(true);
    try {
      const payload = {};
      if (reassignForm.owner_id === 'syed_cars') {
        payload.owner = { name: 'Syed Cars (Self)', phone_no: '', email: '', address: '', location: '' };
      } else if (reassignForm.owner_id) {
        payload.owner_id = Number(reassignForm.owner_id);
      } else {
        payload.owner = { name: reassignForm.name, phone_no: reassignForm.phone_no, email: reassignForm.email, address: reassignForm.address, location: reassignForm.location };
      }
      await adminCarsApi.update(reassignCar.id, payload);
      setReassignCar(null);
      toast.success('Car reassigned successfully!');
      load(page);
    } catch (err) {
      toast.error(err.message || 'Reassignment failed');
    } finally {
      setReassignSaving(false);
    }
  };

  // ── shared button style (mirrors AdminCars) ───────────────────────────────
  const ghostBtn = {
    padding: '9px 18px', background: '#F3F4F6', border: '1px solid #E5E7EB',
    borderRadius: 8, color: '#040404', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.875rem',
  };
  const primaryBtn = (disabled) => ({
    padding: '9px 20px', background: '#FF5A09', color: '#fff', border: 'none',
    borderRadius: 8, fontWeight: 600, fontSize: '0.875rem',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    boxShadow: '0 2px 12px rgba(255,90,9,0.3)', fontFamily: 'inherit',
  });

  // ── render ────────────────────────────────────────────────────────────────
  return (
    <div style={{ padding: '28px 28px 60px', maxWidth: 1400, margin: '0 auto' }}>

      <AdminPageHeader title="Owners" sub={`${total} registered`} />

      {/* Search */}
      <div style={{ marginBottom: 20, maxWidth: 360 }}>
        <input
          placeholder="Search name, phone, email…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ ...I.base, padding: '9px 14px' }}
          onFocus={focusGold}
          onBlur={blurGray}
        />
      </div>

      {/* Error */}
      {error && (
        <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '10px 16px', color: '#EF4444', fontSize: '0.875rem', marginBottom: 16 }}>
          {error}
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
          {[...Array(6)].map((_, i) => (
            <div key={i} style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, height: 200, animation: 'pulse 1.5s infinite' }} />
          ))}
        </div>
      ) : owners.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0', color: '#9CA3AF' }}>
          <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.5rem', marginBottom: 8, color: '#040404' }}>No owners found</p>
          <p style={{ fontSize: '0.875rem' }}>Owners are created when adding cars.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
          {owners.map(owner => {
            const hue         = avatarHue(owner.name || String(owner.id));
            const accentColor = `hsl(${hue}, 75%, 50%)`;
            const avatarBg    = `hsl(${hue}, 80%, 55%)`;

            return (
              <div
                key={owner.id}
                onClick={() => setSelectedOwner(owner)}
                style={{
                  background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12,
                  overflow: 'hidden', cursor: 'pointer', transition: 'all 0.2s',
                  display: 'flex', flexDirection: 'column',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,90,9,0.3)'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.07)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                {/* Thin accent bar */}
                <div style={{ height: 3, background: accentColor, width: '100%' }} />

                <div style={{ padding: '16px 16px 12px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  {/* Header row */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
                    {/* Avatar */}
                    <div style={{
                      width: 44, height: 44, borderRadius: 10, flexShrink: 0,
                      background: avatarBg, color: '#fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.2rem', fontWeight: 700, fontFamily: "'Cormorant Garamond',serif",
                    }}>
                      {owner.name?.[0]?.toUpperCase() || '?'}
                    </div>

                    <div style={{ flex: 1, minWidth: 0, paddingTop: 2 }}>
                      <h3 style={{ fontSize: '0.9rem', color: '#111', fontWeight: 600, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {owner.name || 'Unnamed Owner'}
                      </h3>
                      <p style={{ fontSize: '0.72rem', color: '#6B7280', fontFamily: "'Space Mono',monospace", marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {owner.phone_no || owner.email || '—'}
                      </p>
                    </div>

                    {/* Status badge */}
                    {/* <div style={{ padding: '2px 8px', borderRadius: 20, background: owner.isActive ? 'rgba(34,197,94,0.1)' : 'rgba(107,114,128,0.1)', border: `1px solid ${owner.isActive ? 'rgba(34,197,94,0.3)' : 'rgba(107,114,128,0.2)'}`, fontSize: '0.62rem', fontFamily: "'Space Mono',monospace", color: owner.isActive ? '#16a34a' : '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', flexShrink: 0, marginTop: 2 }}>
                      {owner.isActive ? 'Active' : 'Inactive'}
                    </div> */}
                  </div>

                  {/* Location */}
                  {owner.location && (
                    <p style={{ fontSize: '0.72rem', color: '#6B7280', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span>📍</span>
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{owner.location}</span>
                    </p>
                  )}

                  {/* Cars chips */}
                  {owner.cars && owner.cars.length > 0 && (
                    <div style={{ marginTop: 'auto' }}>
                      <p style={{ fontSize: '0.62rem', fontFamily: "'Space Mono',monospace", textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9CA3AF', marginBottom: 6 }}>
                        Cars ({owner.cars.length})
                      </p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                        {owner.cars.slice(0, 3).map(car => (
                          <span key={car.id} style={{ fontSize: '0.7rem', background: '#F3F4F6', color: '#374151', padding: '3px 9px', borderRadius: 6, border: '1px solid #E5E7EB' }}>
                            {car.brand_name} {car.Model}
                          </span>
                        ))}
                        {owner.cars.length > 3 && (
                          <span style={{ fontSize: '0.7rem', color: '#353638', alignSelf: 'center' }}>+{owner.cars.length - 3}</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Edit button footer */}
                {canOp('owners', 'update') && (
                  <button
                    onClick={e => { e.stopPropagation(); openEdit(owner); }}
                    style={{
                      width: '100%', padding: '10px 0', background: '#F9FAFB',
                      border: 'none', borderTop: '1px solid #E5E7EB',
                      color: '#18191a', fontSize: '0.78rem', fontFamily: 'inherit',
                      cursor: 'pointer', transition: 'all 0.15s', fontWeight: 500,
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#F3F4F6'; e.currentTarget.style.color = '#111'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#F9FAFB'; e.currentTarget.style.color = '#242527'; }}
                  >
                    Edit Owner
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} onPageChange={load} total={total} limit={9} />

      {/* ── Detail Modal ──────────────────────────────────────────────────── */}
      <Modal isOpen={!!selectedOwner} onClose={() => setSelectedOwner(null)} title={`Owner — ${selectedOwner?.name}`} size="lg">
        {selectedOwner && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Info grid */}
            <div>
              {sectionDivider('Contact Details')}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 8 }}>
                {[
                  ['Name',     selectedOwner.name],
                  ['Phone',    selectedOwner.phone_no],
                  ['Email',    selectedOwner.email],
                  ['Address',  selectedOwner.address],
                  ['Location', selectedOwner.location],
                ].map(([l, v]) => specItem(l, v))}
                <div style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 8, padding: '10px 14px' }}>
                  <p style={{ fontSize: '0.65rem', fontFamily: "'Space Mono',monospace", textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6B7280', marginBottom: 6 }}>Status</p>
                  <div style={{ display: 'inline-block', padding: '2px 10px', borderRadius: 20, background: selectedOwner.isActive ? 'rgba(34,197,94,0.1)' : 'rgba(107,114,128,0.1)', border: `1px solid ${selectedOwner.isActive ? 'rgba(34,197,94,0.3)' : 'rgba(107,114,128,0.2)'}`, fontSize: '0.72rem', color: selectedOwner.isActive ? '#16a34a' : '#6B7280' }}>
                    {selectedOwner.isActive ? 'Active' : 'Inactive'}
                  </div>
                </div>
              </div>
            </div>

            {/* Cars list */}
            <div>
              {sectionDivider(`Cars Managed (${selectedOwner.cars?.length || 0})`)}
              {!selectedOwner.cars || selectedOwner.cars.length === 0 ? (
                <p style={{ fontSize: '0.82rem', color: '#9CA3AF', background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 8, padding: '14px 16px' }}>
                  No cars registered under this owner yet.
                </p>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 10, maxHeight: '40vh', overflowY: 'auto', paddingRight: 4 }}>
                  {selectedOwner.cars.map(car => (
                    <div key={car.id} style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 10, padding: '10px 12px', transition: 'border-color 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,90,9,0.3)'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = '#E5E7EB'}
                    >
                      {/* Car thumbnail — use getMediaUrl exactly like AdminCars */}
                      {car.media?.[0]?.image_url ? (
                        <img
                          src={getMediaUrl(car.media[0].image_url)}
                          alt=""
                          loading="lazy"
                          style={{ width: 64, height: 48, objectFit: 'cover', borderRadius: 6, background: '#E5E7EB', flexShrink: 0 }}
                        />
                      ) : (
                        <div style={{ width: 64, height: 48, background: '#E5E7EB', borderRadius: 6, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.4rem', color: 'rgba(0,0,0,0.15)' }}>{car.brand_name?.[0]?.toUpperCase()}</span>
                        </div>
                      )}

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: '0.82rem', color: '#111', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {car.brand_name} {car.Model}
                        </p>
                        <p style={{ fontSize: '0.68rem', color: '#6B7280', fontFamily: "'Space Mono',monospace", marginTop: 2 }}>
                          {car.registration_no || 'No Reg'} · {car.manufacturing_year}
                        </p>
                        <p style={{ fontSize: '0.68rem', color: '#6B7280', fontFamily: "'Space Mono',monospace" }}>
                          {car.fuel_type} · {car.Transmission}
                        </p>
                      </div>

                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1rem', color: '#F0A500', fontWeight: 600 }}>
                          {formatINR(car.asking_price)}
                        </p>
                        <div style={{ marginTop: 4, padding: '1px 7px', borderRadius: 4, background: statusVariant(car.status) === 'green' ? 'rgba(34,197,94,0.1)' : statusVariant(car.status) === 'red' ? 'rgba(239,68,68,0.1)' : 'rgba(107,114,128,0.1)', fontSize: '0.58rem', fontFamily: "'Space Mono',monospace", color: statusVariant(car.status) === 'green' ? '#16a34a' : statusVariant(car.status) === 'red' ? '#dc2626' : '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          {car.status}
                        </div>
                        {canOp('owners', 'update') && (
                          <button
                            onClick={() => openReassign(car)}
                            style={{ marginTop: 6, fontSize: '0.68rem', color: '#FF5A09', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', padding: 0, textDecoration: 'underline' }}
                          >
                            Reassign
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: 16, borderTop: '1px solid #E5E7EB' }}>
              <button onClick={() => setSelectedOwner(null)} style={ghostBtn}>Close</button>
              {canOp('owners', 'update') && (
                <button onClick={() => openEdit(selectedOwner)} style={primaryBtn(false)}>Edit Owner Details</button>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* ── Reassign Modal ────────────────────────────────────────────────── */}
      <Modal isOpen={!!reassignCar} onClose={() => setReassignCar(null)} title={`Reassign — ${reassignCar?.brand_name} ${reassignCar?.Model}`} size="md">
        {reassignCar && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <p style={{ fontSize: '0.82rem', color: '#6B7280' }}>
              Move this car to another existing owner, or create a new owner profile.
            </p>

            <div>
              <label style={I.label}>Link to Existing Owner</label>
              <select
                value={reassignForm.owner_id || ''}
                onChange={e => {
                  const val = e.target.value;
                  setReassignForm(p => ({ ...p, owner_id: val, name: val ? '' : p.name, phone_no: val ? '' : p.phone_no, email: val ? '' : p.email, address: val ? '' : p.address, location: val ? '' : p.location }));
                }}
                style={{ ...I.base, cursor: 'pointer', appearance: 'none' }}
                onFocus={focusGold} onBlur={blurGray}
              >
                <option value="">+ Create New Owner for this car</option>
                <option value="syed_cars">Syed Cars (Self / Admin)</option>
                {allOwners.map(o => (
                  <option key={o.id} value={o.id}>
                    {o.name || `Owner #${o.id}`} {o.email ? `(${o.email})` : o.phone_no ? `(${o.phone_no})` : ''}
                  </option>
                ))}
              </select>
            </div>

            {!reassignForm.owner_id && (
              <div>
                {sectionDivider('New Owner Details')}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {[
                    ['name',     'Owner Name',  'Name'],
                    ['phone_no', 'Phone',        'Phone'],
                    ['email',    'Email',        'Email'],
                    ['address',  'Address',      'Address'],
                    ['location', 'Location',     'Location'],
                  ].map(([k, label, ph]) => (
                    <div key={k}>
                      <label style={I.label}>{label}</label>
                      <input
                        value={reassignForm[k] || ''}
                        onChange={e => setReassignForm(p => ({
                          ...p,
                          [k]: k === 'phone_no' ? e.target.value.replace(/\D/g, '').slice(0, 10) : e.target.value,
                        }))}
                        inputMode={k === 'phone_no' ? 'numeric' : undefined}
                        maxLength={k === 'phone_no' ? 10 : undefined}
                        placeholder={ph}
                        style={I.base}
                        onFocus={focusGold} onBlur={blurGray}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: 14, borderTop: '1px solid #E5E7EB' }}>
              <button onClick={() => setReassignCar(null)} style={ghostBtn}>Cancel</button>
              <button onClick={saveReassign} disabled={reassignSaving} style={primaryBtn(reassignSaving)}>
                {reassignSaving ? 'Saving…' : 'Save Reassignment'}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* ── Edit Modal ────────────────────────────────────────────────────── */}
      <Modal isOpen={!!editOwner} onClose={() => setEditOwner(null)} title={`Edit — ${editOwner?.name || 'Owner'}`} size="md">
        {formError && (
          <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '9px 14px', color: '#EF4444', fontSize: '0.875rem', marginBottom: 14 }}>
            {formError}
          </div>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[
            ['name',     'Name',     'Mohammed Rafi'],
            ['phone_no', 'Phone',    '9177565639'],
            ['email',    'Email',    'owner@example.com'],
            ['address',  'Address',  'Madanapalle'],
            ['location', 'Location', 'Andhra Pradesh'],
          ].map(([k, label, ph]) => (
            <div key={k}>
              <label style={I.label}>{label}</label>
              <input
                value={form[k] || ''}
                onChange={k === 'phone_no'
                  ? e => setForm(p => ({ ...p, [k]: e.target.value.replace(/\D/g, '').slice(0, 10) }))
                  : f(k)}
                inputMode={k === 'phone_no' ? 'numeric' : undefined}
                maxLength={k === 'phone_no' ? 10 : undefined}
                placeholder={ph}
                style={I.base}
                onFocus={focusGold}
                onBlur={blurGray}
              />
            </div>
          ))}
          <div>
            <label style={I.label}>Status</label>
            <select
              value={form.isActive ?? 1}
              onChange={e => setForm(p => ({ ...p, isActive: Number(e.target.value) }))}
              style={{ ...I.base, cursor: 'pointer', appearance: 'none' }}
              onFocus={focusGold} onBlur={blurGray}
            >
              <option value={1}>Active</option>
              <option value={0}>Inactive</option>
            </select>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: 16, borderTop: '1px solid #E5E7EB', marginTop: 16 }}>
          <button onClick={() => setEditOwner(null)} style={ghostBtn}>Cancel</button>
          <button onClick={save} disabled={saving} style={primaryBtn(saving)}>
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </Modal>
    </div>
  );
}