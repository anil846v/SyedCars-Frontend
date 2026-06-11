import { useState, useEffect } from 'react';

const FUEL_TYPES  = ['Petrol','Diesel','CNG','Electric','Hybrid'];
const TRANS_TYPES = ['Manual','Automatic','AMT','CVT','DCT'];
const STATUSES    = ['AVAILABLE','RESERVED','BOOKED'];

export default function CarFilters({ onFilter, initialFilters = {}, layout = 'vertical' }) {
  const [f, setF] = useState({ 
    brand: initialFilters.brand || '', 
    fuel_type: initialFilters.fuel_type || '', 
    transmission: initialFilters.transmission || '', 
    min_price: initialFilters.min_price || '', 
    max_price: initialFilters.max_price || '', 
    year: initialFilters.year || '', 
    status: initialFilters.status || '' 
  });

  useEffect(() => {
    setF({
      brand: initialFilters.brand || '',
      fuel_type: initialFilters.fuel_type || '',
      transmission: initialFilters.transmission || '',
      min_price: initialFilters.min_price || '',
      max_price: initialFilters.max_price || '',
      year: initialFilters.year || '',
      status: initialFilters.status || ''
    });
  }, [initialFilters]);

  const update = (k, v) => setF(p => ({ ...p, [k]: v }));

  const apply = () => {
    const params = {};
    if (f.brand)       params.brand        = f.brand;
    if (f.fuel_type)   params.fuel_type    = f.fuel_type;
    if (f.transmission)params.transmission = f.transmission;
    if (f.min_price)   params.min_price    = f.min_price;
    if (f.max_price)   params.max_price    = f.max_price;
    if (f.year)        params.year         = f.year;
    if (f.status)      params.status       = f.status;
    onFilter(params);
  };

  const reset = () => {
    const cleared = { brand:'', fuel_type:'', transmission:'', min_price:'', max_price:'', year:'', status:'' };
    setF(cleared);
    onFilter({});
  };

  const inputClass = "w-full bg-ink border border-ink-4 rounded-md px-3 py-2 text-white text-sm placeholder-smoke focus:outline-none focus:border-gold transition-colors";
  const labelClass = "block text-xs font-mono uppercase tracking-widest text-smoke mb-1.5";

  if (layout === 'horizontal') {
    return (
      <div className="bg-ink-2 border border-ink-4 rounded-[20px] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.08)] w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 items-end">
          <div>
            <label className={labelClass}>Brand / Model</label>
            <input 
              value={f.brand} 
              onChange={e => update('brand', e.target.value)} 
              placeholder="BMW, Audi, etc." 
              className={inputClass} 
            />
          </div>

          <div>
            <label className={labelClass}>Fuel Type</label>
            <select 
              value={f.fuel_type} 
              onChange={e => update('fuel_type', e.target.value)} 
              className={inputClass}
            >
              <option value="">Any</option>
              {FUEL_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div>
            <label className={labelClass}>Transmission</label>
            <select 
              value={f.transmission} 
              onChange={e => update('transmission', e.target.value)} 
              className={inputClass}
            >
              <option value="">Any</option>
              {TRANS_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div>
            <label className={labelClass}>Year</label>
            <input 
              type="number" 
              value={f.year} 
              onChange={e => update('year', e.target.value)} 
              placeholder="e.g. 2021" 
              min="1990" 
              max="2026" 
              className={inputClass} 
            />
          </div>

          <div>
            <label className={labelClass}>Price Range (₹)</label>
            <div className="flex gap-1.5">
              <input 
                type="number" 
                value={f.min_price} 
                onChange={e => update('min_price', e.target.value)} 
                placeholder="Min" 
                className={inputClass} 
              />
              <input 
                type="number" 
                value={f.max_price} 
                onChange={e => update('max_price', e.target.value)} 
                placeholder="Max" 
                className={inputClass} 
              />
            </div>
          </div>

          <div className="flex gap-2 w-full">
           <button 
  onClick={apply} 
  className="flex-1 py-2 bg-[#FF6B00] text-white font-medium rounded-md text-sm hover:bg-[#E65F00] transition-all duration-300 whitespace-nowrap"
>
  Search
</button>
            <button 
              onClick={reset} 
              className="px-3 py-2 bg-ink-3 text-smoke rounded-md text-sm hover:text-white hover:bg-ink-4 transition-colors" 
              title="Reset Filters"
            >
              ⟲
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-ink-2 border border-ink-4 rounded-lg p-5 flex flex-col gap-5">
      <h3 className="font-display text-lg text-white font-normal">Filters</h3>

      <div>
        <label className={labelClass}>Brand / Model</label>
        <input value={f.brand} onChange={e => update('brand', e.target.value)} placeholder="e.g. BMW, Mercedes" className={inputClass} />
      </div>

      <div>
        <label className={labelClass}>Fuel Type</label>
        <select value={f.fuel_type} onChange={e => update('fuel_type', e.target.value)} className={inputClass}>
          <option value="">Any</option>
          {FUEL_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <div>
        <label className={labelClass}>Transmission</label>
        <select value={f.transmission} onChange={e => update('transmission', e.target.value)} className={inputClass}>
          <option value="">Any</option>
          {TRANS_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <div>
        <label className={labelClass}>Status</label>
        <select value={f.status} onChange={e => update('status', e.target.value)} className={inputClass}>
          <option value="">Any</option>
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div>
        <label className={labelClass}>Year</label>
        <input type="number" value={f.year} onChange={e => update('year', e.target.value)} placeholder="e.g. 2021" min="1990" max="2025" className={inputClass} />
      </div>

      <div>
        <label className={labelClass}>Price Range (₹)</label>
        <div className="flex gap-2">
          <input type="number" value={f.min_price} onChange={e => update('min_price', e.target.value)} placeholder="Min" className={inputClass} />
          <input type="number" value={f.max_price} onChange={e => update('max_price', e.target.value)} placeholder="Max" className={inputClass} />
        </div>
      </div>

      <div className="flex flex-col gap-2 pt-2 border-t border-ink-4">
        <button onClick={apply} className="w-full py-2.5 bg-gold text-ink font-medium rounded-md text-sm hover:bg-gold-light hover:text-gold-dark transition-colors">Apply Filters</button>
        <button onClick={reset} className="w-full py-2.5 bg-ink-3 text-smoke rounded-md text-sm hover:text-white hover:bg-ink-4 transition-colors">Reset</button>
      </div>
    </div>
  );
}

