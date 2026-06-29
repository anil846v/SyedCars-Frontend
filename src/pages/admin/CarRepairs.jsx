import { useState, useEffect, useCallback } from 'react';
import { repairsApi } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { formatINR } from '../../utils/helpers';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toaster';

const statusVariant = (s) => ({ Completed: 'green', 'In Progress': 'blue', Pending: 'smoke' }[s] || 'smoke');
const inputClass = 'w-full bg-ink border border-ink-4 rounded-md px-3 py-2 text-white text-sm placeholder-ink-5 focus:outline-none focus:border-gold transition-colors';
const labelClass = 'block text-xs font-mono uppercase tracking-wider text-smoke mb-1';

// SVG Icons
const EditIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);
const TrashIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4h6v2" />
  </svg>
);

export default function AdminCarRepairs() {
  const { canOp } = useAuth();
  const toast = useToast();
  const [repairs,      setRepairs]      = useState([]);
  const [total,        setTotal]        = useState(0);
  const [page,         setPage]         = useState(1);
  const [totalPages,   setTotalPages]   = useState(1);
  const [costSummary,  setCostSummary]  = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [search,       setSearch]       = useState('');
  const [availableCars,setAvailableCars]= useState([]);

  const [modal,        setModal]        = useState(null); // null | 'form'
  const [selected,     setSelected]     = useState(null);
  const [form,         setForm]         = useState({});
  const [saving,       setSaving]       = useState(false);
  const [formError,    setFormError]    = useState('');

  const load = useCallback(async (p = 1) => {
    setLoading(true); setError('');
    try {
      const params = { page: p, limit: 15 };
      if (filterStatus) params.status = filterStatus;
      if (search)       params.search = search;
      const res = await repairsApi.list(params);
      const d = res?.data;
      setRepairs(d?.repairs ?? []);
      setCostSummary(d?.costSummary ?? []);
      setAvailableCars(d?.availableCars ?? []);
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

  const openCreate = () => {
    setSelected(null);
    setForm({
      car_id: '', repair_type: '', description: '',
      cost: '', vendor_name: '',
      repair_date: new Date().toISOString().slice(0, 10),
      delivered_date: '',
      status: 'Pending', notes: '',
    });
    setFormError(''); setModal('form');
  };

  const openEdit = (r) => {
    setSelected(r);
    setForm({
      ...r,
      repair_date:    r.repair_date    ? r.repair_date.slice(0, 10)    : '',
      delivered_date: r.delivered_date ? r.delivered_date.slice(0, 10) : '',
    });
    setFormError(''); setModal('form');
  };

  const f = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const save = async () => {
    if (!form.car_id) { setFormError('Please select a car'); return; }
    setSaving(true); setFormError('');
    try {
      if (selected) await repairsApi.update(selected.id, form);
      else           await repairsApi.create(form);
      toast.success(selected ? 'Repair record updated!' : 'Repair record created!');
      setModal(null); load(page);
    } catch (err) {
      setFormError(err.message || 'Failed');
      toast.error(err.message || 'Failed to save repair record');
    } finally {
      setSaving(false);
    }
  };

  const deleteRepair = async (id) => {
    if (!confirm('Delete this repair record?')) return;
    try {
      await repairsApi.delete(id);
      toast.success('Repair record deleted');
      load(page);
    }
    catch (err) { toast.error(err.message || 'Failed to delete repair record'); }
  };

  const totalCost      = costSummary.reduce((sum, s) => sum + parseFloat(s.total_cost || 0), 0);
  const completedCost  = costSummary.find(s => s.status === 'Completed');
  const pendingCost    = costSummary.filter(s => s.status !== 'Completed').reduce((sum, s) => sum + parseFloat(s.total_cost || 0), 0);

  // Car status badge for dropdown
  const statusTag = (s) => {
    const map = { AVAILABLE: '🟢', RESERVED: '🔵', BOOKED: '🔵', ON_HOLD: '⚪', UNDER_INSPECTION: '🔧' };
    return map[s] || '⚪';
  };

  return (
    <div className="p-8 pb-12 flex flex-col gap-6 max-[480px]:p-5">
      <AdminPageHeader title="Car Repairs" sub={`${total} records`}
        action={canOp('repairs','add') && <Button variant="primary" size="sm" onClick={openCreate}>+ Add Repair</Button>} />

      {/* Cost Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { label: 'Total Repair Cost',    value: formatINR(totalCost),                      cls: 'text-white' },
          { label: 'Completed Cost',        value: formatINR(completedCost?.total_cost || 0), cls: 'text-green-400' },
          { label: 'Pending / In Progress', value: formatINR(pendingCost),                    cls: 'text-gold' },
        ].map(item => (
          <div key={item.label} className="bg-ink-2 border border-ink-4 rounded-lg p-4">
            <p className="text-xs font-mono uppercase tracking-wide text-smoke mb-1">{item.label}</p>
            <p className={`text-base font-display font-medium ${item.cls}`}>{item.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search repair type, vendor…"
          className="flex-1 min-w-[180px] max-w-xs bg-ink-2 border border-ink-4 rounded-md px-4 py-2 text-white text-sm placeholder-smoke focus:outline-none focus:border-gold" />
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="bg-ink-2 border border-ink-4 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-gold">
          <option value="">All Statuses</option>
          <option>Pending</option><option>In Progress</option><option>Completed</option>
        </select>
      </div>

      {error && <div className="bg-crimson/10 border border-crimson/30 rounded-md px-4 py-3 text-crimson text-sm">{error}</div>}

      {/* Table */}
      <div className="bg-ink-2 border border-ink-4 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink-4">
                {['#','Car','Repair Type','Vendor','Cost','Repair Date','Delivered Date','Status','Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-mono uppercase tracking-widest text-smoke font-normal whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={9} className="px-4 py-8 text-center text-smoke">Loading…</td></tr>
              ) : repairs.length === 0 ? (
                <tr><td colSpan={9} className="px-4 py-8 text-center text-smoke">No repair records found.</td></tr>
              ) : repairs.map(r => (
                <tr key={r.id} className="border-b border-ink-4 hover:bg-ink-3 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-smoke">#{r.id}</td>
                  <td className="px-4 py-3 text-xs">
                    <p className="text-white">{r.car ? `${r.car.brand_name} ${r.car.Model}` : `Car #${r.car_id}`}</p>
                    <p className="text-smoke font-mono text-[10px]">{r.car?.registration_no}</p>
                  </td>
                  <td className="px-4 py-3 text-white text-xs">{r.repair_type || '—'}</td>
                  <td className="px-4 py-3 text-smoke text-xs">{r.vendor_name || '—'}</td>
                  <td className="px-4 py-3 text-gold font-medium">{formatINR(r.cost)}</td>
                  <td className="px-4 py-3 text-smoke text-xs font-mono">
                    {r.repair_date ? new Date(r.repair_date).toLocaleDateString('en-IN') : '—'}
                  </td>
                  <td className="px-4 py-3 text-smoke text-xs font-mono">
                    {r.delivered_date ? new Date(r.delivered_date).toLocaleDateString('en-IN') : '—'}
                  </td>
                  <td className="px-4 py-3"><Badge variant={statusVariant(r.status)}>{r.status}</Badge></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      {canOp('repairs','update') && (
                        <button onClick={() => openEdit(r)} title="Edit"
                          className="w-7 h-7 flex items-center justify-center rounded-md bg-ink-4 hover:bg-gold/10 text-smoke hover:text-gold transition-colors">
                          <EditIcon />
                        </button>
                      )}
                      {canOp('repairs','delete') && (
                        <button onClick={() => deleteRepair(r.id)} title="Delete"
                          className="w-7 h-7 flex items-center justify-center rounded-md bg-ink-4 hover:bg-crimson/10 text-smoke hover:text-crimson transition-colors">
                          <TrashIcon />
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

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button disabled={page===1} onClick={() => load(page-1)} className="px-4 py-2 bg-ink-2 border border-ink-4 rounded-md text-sm text-smoke hover:text-white disabled:opacity-30">← Prev</button>
          <span className="text-smoke text-sm font-mono">Page {page} / {totalPages}</span>
          <button disabled={page===totalPages} onClick={() => load(page+1)} className="px-4 py-2 bg-ink-2 border border-ink-4 rounded-md text-sm text-smoke hover:text-white disabled:opacity-30">Next →</button>
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal isOpen={modal === 'form'} onClose={() => setModal(null)}
        title={selected ? 'Edit Repair Record' : 'Add Repair Record'} size="md">
        {formError && <div className="bg-crimson/10 border border-crimson/30 rounded-md px-4 py-3 text-crimson text-sm mb-4">{formError}</div>}
        {!selected && (
          <p className="text-smoke text-xs font-mono mb-4 bg-ink-3 border border-ink-4 rounded-md px-3 py-2">
            ℹ️ When a repair is added, the car status will automatically change to <strong className="text-gold">UNDER_INSPECTION</strong>.
          </p>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[65vh] overflow-y-auto pr-1">
          <div className="sm:col-span-2">
            <label className={labelClass}>Car * {!selected && <span className="text-gold ml-1">(non-sold cars only)</span>}</label>
            <select value={form.car_id || ''} onChange={f('car_id')} className={inputClass} disabled={!!selected}>
              <option value="">Select car…</option>
              {availableCars.map(c => (
                <option key={c.id} value={c.id}>
                  {statusTag(c.status)} {c.brand_name} {c.Model} — {c.registration_no || `#${c.id}`} [{c.status}]
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Repair Type</label>
            <input value={form.repair_type || ''} onChange={f('repair_type')} placeholder="Engine, Tyres, AC…" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Vendor / Garage</label>
            <input value={form.vendor_name || ''} onChange={f('vendor_name')} placeholder="Garage name" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Cost (₹)</label>
            <input type="number" value={form.cost || ''} onChange={f('cost')} placeholder="0" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Status</label>
            <select value={form.status || 'Pending'} onChange={f('status')} className={inputClass}>
              <option>Pending</option><option>In Progress</option><option>Completed</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Repair / Admitted Date</label>
            <input type="date" value={form.repair_date || ''} onChange={f('repair_date')} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Delivered / Resolved Date</label>
            <input type="date" value={form.delivered_date || ''} onChange={f('delivered_date')} className={inputClass} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Description</label>
            <textarea value={form.description || ''} onChange={f('description')} rows={2} className={`${inputClass} resize-none`} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Notes</label>
            <textarea value={form.notes || ''} onChange={f('notes')} rows={2} className={`${inputClass} resize-none`} />
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-4 border-t border-ink-4 mt-4">
          <Button variant="ghost" onClick={() => setModal(null)}>Cancel</Button>
          <Button variant="primary" onClick={save} disabled={saving}>{saving ? 'Saving…' : selected ? 'Save Changes' : 'Create'}</Button>
        </div>
      </Modal>
    </div>
  );
}
