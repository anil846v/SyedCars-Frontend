import { useState, useEffect, useCallback } from 'react';
import { commissionsApi, adminCarsApi, getMediaUrl } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { formatINR } from '../../utils/helpers';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import StatCard from '../../components/admin/StatCard';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { DollarSign, CreditCard, TrendingUp, AlertTriangle, Car } from 'lucide-react';
import { useToast } from '../../components/ui/Toaster';
import Pagination from '../../components/admin/Pagination';

const statusVariant = (s) => ({ Completed:'green', 'Partially Paid':'blue', Pending:'smoke' }[s] || 'smoke');

export default function AdminCommissions() {
  const { canOp, user } = useAuth();
  const toast = useToast();
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
  const [viewComm,    setViewComm]    = useState(null);

  const load = useCallback(async (p = 1) => {
    setLoading(true);
    try {
      const params = { page: p, limit: 6 };
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

  const openCreate = () => { setSelected(null); setForm({ car_id: '', owner_id: '', seller_commission: 0, buyer_commission: 0, seller_type: 'fixed', buyer_type: 'fixed', seller_pct: '', buyer_pct: '', agreement_notes: '' }); setFormError(''); setModal('create'); };
  const openEdit   = (c) => { setSelected(c); setForm({ ...c, seller_type: 'fixed', buyer_type: 'fixed', seller_pct: '', buyer_pct: '' }); setFormError(''); setModal('edit'); };
  const openPayment= (c) => { setSelected(c); setForm({ parties:['seller'], seller_amount:0, buyer_amount:0, notes:'' }); setFormError(''); setModal('payment'); };

  const f = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  // Helper: resolve % → fixed before submitting
  const resolveCommission = (amount, type, pct, carPrice) => {
    if (type === 'percentage' && pct && carPrice) {
      return ((parseFloat(pct) / 100) * parseFloat(carPrice)).toFixed(2);
    }
    return amount;
  };

  const save = async () => {
    setSaving(true); setFormError('');
    try {
      const carPrice = form.car_id ? cars.find(c => String(c.id) === String(form.car_id))?.asking_price
                     : selected?.car?.asking_price;
      const resolvedSeller = resolveCommission(form.seller_commission, form.seller_type, form.seller_pct, carPrice);
      const resolvedBuyer  = resolveCommission(form.buyer_commission,  form.buyer_type,  form.buyer_pct,  carPrice);

      // When editing a partially/fully paid commission, amounts cannot be set below what's already paid
      if (modal === 'edit' && selected) {
        const sellerPaid = parseFloat(selected.seller_paid) || 0;
        const buyerPaid  = parseFloat(selected.buyer_paid)  || 0;
        if (parseFloat(resolvedSeller) < sellerPaid) {
          setFormError(`Seller commission cannot be less than amount already paid (${formatINR(sellerPaid)}).`);
          setSaving(false); return;
        }
        if (parseFloat(resolvedBuyer) < buyerPaid) {
          setFormError(`Buyer commission cannot be less than amount already paid (${formatINR(buyerPaid)}).`);
          setSaving(false); return;
        }
      }

      const payload = { ...form, seller_commission: resolvedSeller, buyer_commission: resolvedBuyer };
      if (modal === 'create') await commissionsApi.create(payload);
      else if (modal === 'edit') await commissionsApi.update(selected.id, payload);
      else if (modal === 'payment') await commissionsApi.recordPayment(selected.id, form);
      const successMsg = modal === 'create' ? 'Commission record created!'
                       : modal === 'edit'   ? 'Commission updated!'
                       : 'Payment recorded!';
      toast.success(successMsg);
      setModal(null);
      load(page);
    } catch (err) {
      setFormError(err.message || 'Operation failed');
      toast.error(err.message || 'Operation failed');
    } finally {
      setSaving(false);
    }
  };

  const deleteComm = async (id) => {
    if (!confirm('Delete this commission record?')) return;
    try {
      await commissionsApi.delete(id);
      toast.success('Commission record deleted');
      load(page);
    } catch (err) { toast.error(err.message || 'Failed to delete commission'); }
  };

  const inputClass = "w-full bg-ink border border-ink-4 rounded-md px-3 py-2 text-white text-sm placeholder-ink-5 focus:outline-none focus:border-gold transition-colors";
  const labelClass = "block text-xs font-mono uppercase tracking-wider text-smoke mb-1";

  return (
    <div className="p-8 pb-12 flex flex-col gap-6 max-[480px]:p-5">

      {/* Summary - Stat Cards */}
      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard icon={DollarSign} label="Total Seller Due" value={formatINR(summary.seller?.due)} sub="Seller commissions" color="blue" />
          <StatCard icon={CreditCard} label="Total Buyer Due" value={formatINR(summary.buyer?.due)} sub="Buyer commissions" color="emerald" />
          <StatCard icon={TrendingUp} label="Total Collected" value={formatINR(summary.total_commission_paid)} sub="Commissions paid" color="gold" />
          <StatCard icon={AlertTriangle} label="Outstanding" value={formatINR(summary.total_commission_pending)} sub="Awaiting payment" color="pink" />
        </div>
      )}

      <div className="flex gap-3">
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="bg-ink-2 border border-ink-4 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-gold">
          <option value="">All Statuses</option>
          <option>Pending</option><option>Partially Paid</option><option>Completed</option>
        </select>
             {canOp('commissions', 'add') && <Button variant="primary" size="sm" onClick={openCreate}>+ Add Record</Button>}

      </div>

      {error && <div className="bg-crimson/10 border border-crimson/30 rounded-md px-4 py-3 text-crimson text-sm">{error}</div>}

      <div className="bg-ink-2 border border-ink-4 rounded-lg overflow-hidden" style={{ borderTop: '3px solid #FF5A09' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink-4 bg-orange-tint">
                {['#','Car','Owner','Seller Comm.','Buyer Comm.','Seller Paid','Buyer Paid','Status','Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-mono uppercase tracking-widest text-orange-brand font-semibold whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={9} className="px-4 py-8 text-center text-smoke">Loading…</td></tr>
              ) : commissions.length === 0 ? (
                <tr><td colSpan={9} className="px-4 py-8 text-center text-smoke">No commission records found.</td></tr>
              ) : commissions.map(c => (
                <tr key={c.id} onClick={() => setViewComm(c)} className="border-b border-ink-4 hover:bg-orange-row transition-colors cursor-pointer">
                  <td className="px-4 py-3 font-mono text-xs text-smoke">#{c.id}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {c.car?.media?.[0]?.image_url ? (
                        <img src={getMediaUrl(c.car.media[0].image_url)} alt="" loading="lazy"
                          className="w-9 h-7 object-cover rounded-sm shrink-0 border border-ink-4" />
                      ) : (
                        <div className="w-9 h-7 rounded-sm bg-ink-4 border border-ink-5 flex items-center justify-center shrink-0">
                          <Car size={11} className="text-smoke" />
                        </div>
                      )}
                      <div>
                        <p className="text-white text-xs font-medium">
                          {c.car ? `${c.car.brand_name} ${c.car.Model}` : `Car #${c.car_id}`}
                        </p>
                        <p className="text-smoke text-[10px] font-mono">
                          {c.car?.registration_no || (c.car?.manufacturing_year ? `${c.car.manufacturing_year}` : '—')}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-smoke text-xs">{c.owner?.name || `#${c.owner_id}`}</td>
                  <td className="px-4 py-3 text-white">{formatINR(c.seller_commission)}</td>
                  <td className="px-4 py-3 text-white">{formatINR(c.buyer_commission)}</td>
                  <td className="px-4 py-3 text-gold">{formatINR(c.seller_paid)}</td>
                  <td className="px-4 py-3 text-gold">{formatINR(c.buyer_paid)}</td>
                  <td className="px-4 py-3"><Badge variant={statusVariant(c.status)}>{c.status}</Badge></td>
                  <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center gap-1">
                      {canOp('commissions','update') && <button onClick={() => openEdit(c)} className="px-2 py-1 rounded-sm bg-ink-4 hover:bg-ink-5 text-smoke hover:text-white text-xs transition-colors">Edit</button>}
                      {canOp('commissions','update') && <button onClick={() => openPayment(c)} className="px-2 py-1 rounded-sm bg-gold/10 hover:bg-gold/20 text-gold text-xs transition-colors">₹ Pay</button>}
                      {canOp('commissions','delete') && <button onClick={() => deleteComm(c.id)} className="w-6 h-6 rounded-sm flex items-center justify-center bg-ink-4 hover:bg-crimson/10 text-smoke hover:text-crimson text-xs transition-colors">✕</button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination page={page} totalPages={totalPages} onPageChange={load} total={total} limit={6} />

      {/* Create/Edit Modal */}
      <Modal isOpen={modal==='create'||modal==='edit'} onClose={() => setModal(null)}
        title={modal==='create'?'Add Commission Record':'Edit Commission'} size="md">
        {formError && <div className="bg-crimson/10 border border-crimson/30 rounded-md px-4 py-3 text-crimson text-sm mb-4">{formError}</div>}
        <div className="flex flex-col gap-4">
          {modal==='create' && (
            <div>
              <label className={labelClass}>Car *</label>
              <select
                value={form.car_id || ''}
                onChange={(e) => {
                  const carId = e.target.value;
                  const selectedCar = cars.find(c => String(c.id) === String(carId));
                  setForm(p => ({ ...p, car_id: carId ? Number(carId) : '', owner_id: selectedCar ? selectedCar.owner_id : '' }));
                }}
                className={inputClass}
              >
                <option value="">Select car…</option>
                {cars.map(c => <option key={c.id} value={c.id}>{c.brand_name} {c.Model} — {c.asking_price ? `₹${Number(c.asking_price).toLocaleString('en-IN')}` : 'no price'}</option>)}
              </select>
              {form.car_id && (() => {
                const selCar = cars.find(c => String(c.id) === String(form.car_id));
                return selCar?.asking_price ? (
                  <p className="text-xs text-smoke mt-1 font-mono">Car Price: <span className="text-gold">₹{Number(selCar.asking_price).toLocaleString('en-IN')}</span></p>
                ) : null;
              })()}
            </div>
          )}

          {/* Commission fields with % / Fixed toggle */}
          {[
            { amtKey: 'seller_commission', pctKey: 'seller_pct', typeKey: 'seller_type', label: 'Seller Commission', paidKey: 'seller_paid' },
            { amtKey: 'buyer_commission',  pctKey: 'buyer_pct',  typeKey: 'buyer_type',  label: 'Buyer Commission',  paidKey: 'buyer_paid'  },
          ].map(({ amtKey, pctKey, typeKey, label, paidKey }) => {
            const isPercent = form[typeKey] === 'percentage';
            const carPrice  = form.car_id
              ? cars.find(c => String(c.id) === String(form.car_id))?.asking_price
              : selected?.car?.asking_price;
            const pct        = parseFloat(form[pctKey]) || 0;
            const calculated = carPrice ? (pct / 100) * parseFloat(carPrice) : null;
            const alreadyPaid = modal === 'edit' ? (parseFloat(selected?.[paidKey]) || 0) : 0;
            return (
              <div key={amtKey}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <label className={labelClass} style={{ marginBottom: 0 }}>{label}</label>
                    {alreadyPaid > 0 && (
                      <span style={{ fontSize: '0.65rem', fontFamily: "'Space Mono',monospace", color: '#F0A500', background: 'rgba(240,165,0,0.1)', border: '1px solid rgba(240,165,0,0.2)', borderRadius: 4, padding: '2px 6px' }}>
                        Paid: {formatINR(alreadyPaid)} — min
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: 0, borderRadius: 6, overflow: 'hidden', border: '1px solid #374151' }}>
                    {['fixed','percentage'].map(t => (
                      <button key={t} type="button"
                        onClick={() => setForm(p => ({ ...p, [typeKey]: t }))}
                        style={{
                          padding: '3px 10px', fontSize: '0.7rem', fontFamily: "'Space Mono',monospace",
                          background: form[typeKey] === t ? '#FF5A09' : '#1C1C22',
                          color:      form[typeKey] === t ? '#fff'    : '#9CA3AF',
                          border: 'none', cursor: 'pointer', transition: 'all .15s',
                        }}>
                        {t === 'fixed' ? '₹ Fixed' : '% of Price'}
                      </button>
                    ))}
                  </div>
                </div>
                {isPercent ? (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <input type="number" min="0" max="100" step="0.1"
                        value={form[pctKey] || ''} onChange={f(pctKey)}
                        placeholder="e.g. 2.5"
                        className={inputClass} style={{ flex: 1 }} />
                      <span style={{ color: '#9CA3AF', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>%</span>
                    </div>
                    {calculated !== null && (
                      <p className="text-xs font-mono mt-1" style={{ color: '#C8D900' }}>
                        = ₹{calculated.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                        {!carPrice && <span className="text-smoke"> (select a car to calculate)</span>}
                      </p>
                    )}
                    {!carPrice && <p className="text-xs text-smoke mt-1">Select a car above to auto-calculate from its price.</p>}
                  </div>
                ) : (
                  <input type="number" min={alreadyPaid > 0 ? alreadyPaid : 0}
                    value={form[amtKey] || ''} onChange={f(amtKey)}
                    placeholder={alreadyPaid > 0 ? `Min ${formatINR(alreadyPaid)}` : '0'}
                    className={inputClass} />
                )}
              </div>
            );
          })}

          {modal==='edit' && (
            <div>
              <label className={labelClass}>Status</label>
              <select value={form.status||'Pending'} onChange={f('status')} className={inputClass}>
                <option>Pending</option><option>Partially Paid</option><option>Completed</option>
              </select>
            </div>
          )}
          <div>
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

      {/* View Modal */}
      <Modal isOpen={!!viewComm} onClose={() => setViewComm(null)} title="Commission Details" size="md">
        {viewComm && (
          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
            {/* Car banner */}
            <div className="flex items-center gap-3 bg-ink-3 rounded-lg p-3 border border-ink-4">
              {viewComm.car?.media?.[0]?.image_url ? (
                <img src={getMediaUrl(viewComm.car.media[0].image_url)} alt="" loading="lazy"
                  className="w-14 h-10 object-cover rounded shrink-0 border border-ink-4" />
              ) : (
                <div className="w-14 h-10 bg-ink-4 rounded flex items-center justify-center shrink-0">
                  <Car size={16} className="text-smoke" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium">
                  {viewComm.car ? `${viewComm.car.brand_name} ${viewComm.car.Model}` : `Car #${viewComm.car_id}`}
                </p>
                <p className="text-smoke text-[10px] font-mono">
                  {viewComm.car?.registration_no || (viewComm.car?.manufacturing_year ? `${viewComm.car.manufacturing_year}` : '—')}
                </p>
              </div>
              <Badge variant={statusVariant(viewComm.status)}>{viewComm.status}</Badge>
            </div>
            {/* Details grid */}
            <div className="grid grid-cols-2 gap-3 bg-ink-3 rounded-lg p-4 border border-ink-4 text-sm">
              {[
                ['Commission #', `#${viewComm.id}`],
                ['Owner', viewComm.owner?.name || `#${viewComm.owner_id}`],
                ['Seller Commission', formatINR(viewComm.seller_commission)],
                ['Buyer Commission', formatINR(viewComm.buyer_commission)],
                ['Seller Paid', formatINR(viewComm.seller_paid)],
                ['Buyer Paid', formatINR(viewComm.buyer_paid)],
                ['Added On', viewComm.created_at ? new Date(viewComm.created_at).toLocaleString('en-IN',{day:'numeric',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit',hour12:true}) : '—'],
                ['Last Updated', viewComm.updated_at ? new Date(viewComm.updated_at).toLocaleString('en-IN',{day:'numeric',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit',hour12:true}) : '—'],
                ['Added By', viewComm.added_by || '—'],
              ].map(([label, val]) => (
                <div key={label}>
                  <span className="block text-[0.65rem] font-mono uppercase tracking-wider text-smoke mb-0.5">{label}</span>
                  <span className="text-white text-sm font-medium">{val || '—'}</span>
                </div>
              ))}
            </div>
            {viewComm.agreement_notes && (
              <div>
                <p className="text-xs font-mono uppercase tracking-wide text-smoke mb-2">Agreement Notes</p>
                <div className="bg-ink-3 rounded-md p-3 text-mist text-sm leading-relaxed border border-ink-4">
                  {viewComm.agreement_notes}
                </div>
              </div>
            )}
            <div className="flex justify-end gap-2 pt-3 border-t border-ink-4">
              {canOp('commissions','update') && (
                <Button variant="ghost" size="sm" onClick={() => { openEdit(viewComm); setViewComm(null); }}>Edit</Button>
              )}
              {canOp('commissions','update') && (
                <Button variant="ghost" size="sm" onClick={() => { openPayment(viewComm); setViewComm(null); }}>₹ Pay</Button>
              )}
              <Button variant="primary" size="sm" onClick={() => setViewComm(null)}>Close</Button>
            </div>
          </div>
        )}
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
            <label className={labelClass}>Payment Parties</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.parties?.includes('seller')}
                  onChange={(e) => {
                    const parties = e.target.checked
                      ? [...(form.parties || []), 'seller']
                      : (form.parties || []).filter(p => p !== 'seller');
                    setForm(p => ({ ...p, parties }));
                  }}
                  className="w-4 h-4 rounded border-ink-4 bg-ink-2 text-gold focus:ring-gold focus:ring-offset-0"
                />
                <span className="text-white text-sm">Seller</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.parties?.includes('buyer')}
                  onChange={(e) => {
                    const parties = e.target.checked
                      ? [...(form.parties || []), 'buyer']
                      : (form.parties || []).filter(p => p !== 'buyer');
                    setForm(p => ({ ...p, parties }));
                  }}
                  className="w-4 h-4 rounded border-ink-4 bg-ink-2 text-gold focus:ring-gold focus:ring-offset-0"
                />
                <span className="text-white text-sm">Buyer</span>
              </label>
            </div>
          </div>
          {form.parties?.includes('seller') && (
            <div>
              <label className={labelClass}>Seller Amount (₹)</label>
              <input type="number" value={form.seller_amount||''} onChange={f('seller_amount')} placeholder="0" className={inputClass} />
            </div>
          )}
          {form.parties?.includes('buyer') && (
            <div>
              <label className={labelClass}>Buyer Amount (₹)</label>
              <input type="number" value={form.buyer_amount||''} onChange={f('buyer_amount')} placeholder="0" className={inputClass} />
            </div>
          )}
        </div>
        <div className="flex justify-end gap-3 pt-4 border-t border-ink-4 mt-4">
          <Button variant="ghost" onClick={() => setModal(null)}>Cancel</Button>
          <Button variant="primary" onClick={save} disabled={saving}>{saving?'Recording…':'Record Payment'}</Button>
        </div>
      </Modal>
    </div>
  );
}
