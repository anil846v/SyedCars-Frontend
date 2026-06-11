import { useState, useEffect, useCallback } from 'react';
import { commissionsApi, adminCarsApi } from '../../utils/api';
import { formatINR } from '../../utils/helpers';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';

const statusVariant = (s) => ({ Completed:'green', 'Partially Paid':'blue', Pending:'smoke' }[s] || 'smoke');

export default function AdminCommissions() {
  const [commissions, setCommissions] = useState([]);
  const [total,       setTotal]       = useState(0);
  const [page,        setPage]        = useState(1);
  const [totalPages,  setTotalPages]  = useState(1);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState('');
  const [summary,     setSummary]     = useState(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [modal,       setModal]       = useState(null); // null | 'create' | 'edit' | 'payment'
  const [selected,    setSelected]    = useState(null);
  const [form,        setForm]        = useState({});
  const [saving,      setSaving]      = useState(false);
  const [formError,   setFormError]   = useState('');
  const [cars,        setCars]        = useState([]);

  const load = useCallback(async (p = 1) => {
    setLoading(true);
    try {
      const params = { page: p, limit: 15 };
      if (filterStatus) params.status = filterStatus;
      const [listRes, summRes] = await Promise.allSettled([
        commissionsApi.list(params),
        commissionsApi.summary(),
      ]);
      if (listRes.status === 'fulfilled') {
        const d = listRes.value?.data;
        setCommissions(d?.commissions ?? []);
        setTotal(d?.pagination?.total ?? 0);
        setTotalPages(d?.pagination?.totalPages ?? 1);
        setPage(p);
      }
      if (summRes.status === 'fulfilled') setSummary(summRes.value?.data ?? summRes.value);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filterStatus]);

  useEffect(() => { load(1); }, [load]);

  // Load cars for dropdown
  useEffect(() => {
    adminCarsApi.list({ limit: 100 }).then(res => setCars(res?.data?.cars ?? [])).catch(() => {});
  }, []);

  const openCreate = () => { setSelected(null); setForm({ car_id: '', owner_id: '', seller_commission: 0, buyer_commission: 0, agreement_notes: '' }); setFormError(''); setModal('create'); };
  const openEdit   = (c) => { setSelected(c); setForm({ ...c }); setFormError(''); setModal('edit'); };
  const openPayment= (c) => { setSelected(c); setForm({ type:'seller', amount:0, notes:'' }); setFormError(''); setModal('payment'); };

  const f = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const save = async () => {
    setSaving(true); setFormError('');
    try {
      if (modal === 'create') await commissionsApi.create(form);
      else if (modal === 'edit') await commissionsApi.update(selected.id, form);
      else if (modal === 'payment') await commissionsApi.recordPayment(selected.id, form);
      setModal(null);
      load(page);
    } catch (err) {
      setFormError(err.message || 'Operation failed');
    } finally {
      setSaving(false);
    }
  };

  const deleteComm = async (id) => {
    if (!confirm('Delete this commission record?')) return;
    try {
      await commissionsApi.delete(id);
      load(page);
    } catch (err) { alert(err.message); }
  };

  const inputClass = "w-full bg-ink border border-ink-4 rounded-md px-3 py-2 text-white text-sm placeholder-ink-5 focus:outline-none focus:border-gold transition-colors";
  const labelClass = "block text-xs font-mono uppercase tracking-wider text-smoke mb-1";

  return (
    <div className="p-8 pb-12 flex flex-col gap-6 max-[480px]:p-5">
      <AdminPageHeader title="Commissions" sub={`${total} records`}
        action={<Button variant="primary" size="sm" onClick={openCreate}>+ Add Record</Button>} />

      {/* Summary */}
      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label:'Total Seller Due',  value: formatINR(summary.seller?.due) },
            { label:'Total Buyer Due',   value: formatINR(summary.buyer?.due) },
            { label:'Total Collected',   value: formatINR(summary.total_commission_paid), gold:true },
            { label:'Outstanding',       value: formatINR(summary.total_commission_pending), crimson:true },
          ].map(item => (
            <div key={item.label} className="bg-ink-2 border border-ink-4 rounded-lg p-4">
              <p className="text-xs font-mono uppercase tracking-wide text-smoke mb-1">{item.label}</p>
              <p className={`text-base font-display font-medium ${item.gold?'text-gold':item.crimson?'text-crimson':'text-white'}`}>{item.value}</p>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-3">
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="bg-ink-2 border border-ink-4 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-gold">
          <option value="">All Statuses</option>
          <option>Pending</option><option>Partially Paid</option><option>Completed</option>
        </select>
      </div>

      {error && <div className="bg-crimson/10 border border-crimson/30 rounded-md px-4 py-3 text-crimson text-sm">{error}</div>}

      <div className="bg-ink-2 border border-ink-4 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink-4">
                {['#','Car','Owner','Seller Comm.','Buyer Comm.','Seller Paid','Buyer Paid','Status','Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-mono uppercase tracking-widest text-smoke font-normal whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={9} className="px-4 py-8 text-center text-smoke">Loading…</td></tr>
              ) : commissions.length === 0 ? (
                <tr><td colSpan={9} className="px-4 py-8 text-center text-smoke">No commission records found.</td></tr>
              ) : commissions.map(c => (
                <tr key={c.id} className="border-b border-ink-4 hover:bg-ink-3 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-smoke">#{c.id}</td>
                  <td className="px-4 py-3 text-white text-xs">
                    {c.car ? `${c.car.brand_name} ${c.car.Model}` : `Car #${c.car_id}`}
                  </td>
                  <td className="px-4 py-3 text-smoke text-xs">{c.owner?.name || `#${c.owner_id}`}</td>
                  <td className="px-4 py-3 text-white">{formatINR(c.seller_commission)}</td>
                  <td className="px-4 py-3 text-white">{formatINR(c.buyer_commission)}</td>
                  <td className="px-4 py-3 text-gold">{formatINR(c.seller_paid)}</td>
                  <td className="px-4 py-3 text-gold">{formatINR(c.buyer_paid)}</td>
                  <td className="px-4 py-3"><Badge variant={statusVariant(c.status)}>{c.status}</Badge></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(c)} className="px-2 py-1 rounded-sm bg-ink-4 hover:bg-ink-5 text-smoke hover:text-white text-xs transition-colors">Edit</button>
                      <button onClick={() => openPayment(c)} className="px-2 py-1 rounded-sm bg-gold/10 hover:bg-gold/20 text-gold text-xs transition-colors">₹ Pay</button>
                      <button onClick={() => deleteComm(c.id)} className="w-6 h-6 rounded-sm flex items-center justify-center bg-ink-4 hover:bg-crimson/10 text-smoke hover:text-crimson text-xs transition-colors">✕</button>
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

      {/* Create/Edit Modal */}
      <Modal isOpen={modal==='create'||modal==='edit'} onClose={() => setModal(null)}
        title={modal==='create'?'Add Commission Record':'Edit Commission'} size="md">
        {formError && <div className="bg-crimson/10 border border-crimson/30 rounded-md px-4 py-3 text-crimson text-sm mb-4">{formError}</div>}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {modal==='create' && (
            <div className="sm:col-span-2">
              <label className={labelClass}>Car *</label>
              <select
                value={form.car_id || ''}
                onChange={(e) => {
                  const carId = e.target.value;
                  const selectedCar = cars.find(c => String(c.id) === String(carId));
                  setForm(p => ({
                    ...p,
                    car_id: carId ? Number(carId) : '',
                    owner_id: selectedCar ? selectedCar.owner_id : '',
                  }));
                }}
                className={inputClass}
              >
                <option value="">Select car…</option>
                {cars.map(c => <option key={c.id} value={c.id}>{c.brand_name} {c.Model} (#{c.id})</option>)}
              </select>
            </div>
          )}
          {[
            ['seller_commission','Seller Commission (₹)','number'],
            ['buyer_commission','Buyer Commission (₹)','number'],
          ].map(([k,label,type]) => (
            <div key={k}>
              <label className={labelClass}>{label}</label>
              <input type={type} value={form[k]||''} onChange={f(k)} className={inputClass} />
            </div>
          ))}
          {modal==='edit' && (
            <div>
              <label className={labelClass}>Status</label>
              <select value={form.status||'Pending'} onChange={f('status')} className={inputClass}>
                <option>Pending</option><option>Partially Paid</option><option>Completed</option>
              </select>
            </div>
          )}
          <div className="sm:col-span-2">
            <label className={labelClass}>Agreement Notes</label>
            <textarea value={form.agreement_notes||''} onChange={f('agreement_notes')} rows={3}
              placeholder="Commission terms, notes…"
              className={`${inputClass} resize-none`} />
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-4 border-t border-ink-4 mt-4">
          <Button variant="ghost" onClick={() => setModal(null)}>Cancel</Button>
          <Button variant="primary" onClick={save} disabled={saving}>{saving?'Saving…':modal==='create'?'Create':'Save'}</Button>
        </div>
      </Modal>

      {/* Payment Modal */}
      <Modal isOpen={modal==='payment'} onClose={() => setModal(null)} title="Record Payment" size="sm">
        {formError && <div className="bg-crimson/10 border border-crimson/30 rounded-md px-4 py-3 text-crimson text-sm mb-4">{formError}</div>}
        {selected && (
          <div className="mb-4 bg-ink-3 rounded-md p-3 text-sm">
            <p className="text-smoke text-xs font-mono mb-1">Commission #{selected.id}</p>
            <p className="text-white">{selected.car ? `${selected.car.brand_name} ${selected.car.Model}` : `Car #${selected.car_id}`}</p>
            <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
              <div><span className="text-smoke">Seller due:</span> <span className="text-white">{formatINR(selected.seller_commission)}</span></div>
              <div><span className="text-smoke">Buyer due:</span> <span className="text-white">{formatINR(selected.buyer_commission)}</span></div>
              <div><span className="text-smoke">Seller paid:</span> <span className="text-gold">{formatINR(selected.seller_paid)}</span></div>
              <div><span className="text-smoke">Buyer paid:</span> <span className="text-gold">{formatINR(selected.buyer_paid)}</span></div>
            </div>
          </div>
        )}
        <div className="flex flex-col gap-4">
          <div>
            <label className={labelClass}>Payment Party</label>
            <select value={form.type||'seller'} onChange={f('type')} className={inputClass}>
              <option value="seller">Seller</option>
              <option value="buyer">Buyer</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Amount Paid (₹)</label>
            <input type="number" value={form.amount||''} onChange={f('amount')} placeholder="0" className={inputClass} />
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-4 border-t border-ink-4 mt-4">
          <Button variant="ghost" onClick={() => setModal(null)}>Cancel</Button>
          <Button variant="primary" onClick={save} disabled={saving}>{saving?'Recording…':'Record Payment'}</Button>
        </div>
      </Modal>
    </div>
  );
}
