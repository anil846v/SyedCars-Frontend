import { useState, useEffect } from 'react';
import { Search, RotateCcw } from 'lucide-react';

const FUEL_TYPES  = ['Petrol','Diesel','Electric','Hybrid'];
const TRANS_TYPES = ['Manual','Automatic','AMT','CVT','DCT'];

const SELECT_STYLE = {
  width: '100%',
  background: '#fff',
  border: '1px solid #E5E7EB',
  borderRadius: 8,
  padding: '10px 12px',
  color: '#111',
  fontSize: '0.875rem',
  outline: 'none',
  appearance: 'none',
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'calc(100% - 10px) center',
  cursor: 'pointer',
};

const INPUT_STYLE = {
  width: '100%',
  background: '#fff',
  border: '1px solid #E5E7EB',
  borderRadius: 8,
  padding: '10px 12px',
  color: '#111',
  fontSize: '0.875rem',
  outline: 'none',
};

const LABEL_STYLE = {
  display: 'block',
  fontSize: '0.68rem',
  fontFamily: "'DM Sans', 'Inter', sans-serif",
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  color: '#6B7280',
  marginBottom: 6,
};

export default function CarFilters({ onFilter, initialFilters = {}, layout = 'vertical' }) {
  const [f, setF] = useState({
    brand: initialFilters.brand || '',
    fuel_type: initialFilters.fuel_type || '',
    transmission: initialFilters.transmission || '',
    min_price: initialFilters.min_price || '',
    max_price: initialFilters.max_price || '',
    year: initialFilters.year || '',
  });

  const { brand, fuel_type, transmission, min_price, max_price, year } = initialFilters;

  useEffect(() => {
    setF({
      brand:        brand        || '',
      fuel_type:    fuel_type    || '',
      transmission: transmission || '',
      min_price:    min_price    || '',
      max_price:    max_price    || '',
      year:         year         || '',
    });
  }, [brand, fuel_type, transmission, min_price, max_price, year]);

  const update = (k, v) => setF(p => ({ ...p, [k]: v }));

  const apply = () => {
    const params = {};
    if (f.brand)        params.brand        = f.brand;
    if (f.fuel_type)    params.fuel_type    = f.fuel_type;
    if (f.transmission) params.transmission = f.transmission;
    if (f.min_price)    params.min_price    = f.min_price;
    if (f.max_price)    params.max_price    = f.max_price;
    if (f.year)         params.year         = f.year;
    onFilter(params);
  };

  const reset = () => {
    setF({ brand:'', fuel_type:'', transmission:'', min_price:'', max_price:'', year:'' });
    onFilter({});
  };

  if (layout === 'horizontal') {
    return (
      <div style={{
  width: '100vw',
  marginLeft: 'calc(100% - 50vw)',
  padding: '24px 60px',

  background: '#fff',
  border: '1px solid #E5E7EB',
  borderRadius: 0,
  boxShadow: '0 10px 40px rgba(0,0,0,0.06)',
}}>
        {/* Title bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
          <Search size={15} color="#FF5A09" />
          <span style={{ fontSize: '0.72rem', fontFamily: "'Space Mono',monospace", textTransform: 'uppercase', letterSpacing: '0.12em', color: '#6B7280' }}>
            Filter Vehicles
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12, alignItems: 'end' }}>
          <div>
            <label style={LABEL_STYLE}>Make / Model</label>
            <input value={f.brand} onChange={e => update('brand', e.target.value)}
              placeholder="BMW, Audi…" style={INPUT_STYLE} />
          </div>
          <div>
            <label style={LABEL_STYLE}>Fuel Type</label>
            <select value={f.fuel_type} onChange={e => update('fuel_type', e.target.value)} style={SELECT_STYLE}>
              <option value="">Any Fuel</option>
              {FUEL_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label style={LABEL_STYLE}>Transmission</label>
            <select value={f.transmission} onChange={e => update('transmission', e.target.value)} style={SELECT_STYLE}>
              <option value="">Any Gear</option>
              {TRANS_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label style={LABEL_STYLE}>Year</label>
            <input type="number" value={f.year} onChange={e => update('year', e.target.value)}
              placeholder="e.g. 2021" min="1990" max="2026" style={INPUT_STYLE} />
          </div>
          <div>
            <label style={LABEL_STYLE}>Budget (₹)</label>
            <div style={{ display: 'flex', gap: 6 }}>
              <input type="number" value={f.min_price} onChange={e => update('min_price', e.target.value)}
                placeholder="Min" style={{ ...INPUT_STYLE, width: '50%' }} />
              <input type="number" value={f.max_price} onChange={e => update('max_price', e.target.value)}
                placeholder="Max" style={{ ...INPUT_STYLE, width: '50%' }} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={apply} style={{
              flex: 1, padding: '10px 0', background: '#FF5A09', color: '#fff',
              border: 'none', borderRadius: 8, fontWeight: 600, fontSize: '0.875rem',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              boxShadow: '0 4px 16px rgba(255,90,9,0.4)',
            }}>
              <Search size={14} /> Search
            </button>
            <button onClick={reset} title="Reset" style={{
              padding: '10px 12px', background: '#F3F4F6',
              color: '#040404', border: '1px solid #E5E7EB',
              borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <RotateCcw size={14} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Vertical layout (Cars page sidebar)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '1.25rem', color: '#111', fontWeight: 600 }}>Filters</h3>
      {[
        { label: 'Brand / Model', key: 'brand', type: 'text', placeholder: 'e.g. BMW, Hyundai' },
      ].map(({ label, key, type, placeholder }) => (
        <div key={key}>
          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 500, color: '#6B7280', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: "'Space Mono',monospace" }}>{label}</label>
          <input type={type} value={f[key]} onChange={e => update(key, e.target.value)} placeholder={placeholder}
            style={{ width: '100%', border: '1px solid #E5E7EB', borderRadius: 8, padding: '9px 12px', fontSize: '0.875rem', color: '#111', outline: 'none', background: '#fff' }} />
        </div>
      ))}
      {[
        { label: 'Fuel Type', key: 'fuel_type', opts: FUEL_TYPES, placeholder: 'Any Fuel' },
        { label: 'Transmission', key: 'transmission', opts: TRANS_TYPES, placeholder: 'Any Gearbox' },
      ].map(({ label, key, opts, placeholder }) => (
        <div key={key}>
          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 500, color: '#6B7280', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: "'Space Mono',monospace" }}>{label}</label>
          <select value={f[key]} onChange={e => update(key, e.target.value)}
            style={{ width: '100%', border: '1px solid #E5E7EB', borderRadius: 8, padding: '9px 12px', fontSize: '0.875rem', color: '#111', outline: 'none', background: '#fff', cursor: 'pointer', appearance: 'none' }}>
            <option value="">{placeholder}</option>
            {opts.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
      ))}
      <div>
        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 500, color: '#6B7280', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: "'Space Mono',monospace" }}>Year</label>
        <input type="number" value={f.year} onChange={e => update('year', e.target.value)} placeholder="e.g. 2021"
          style={{ width: '100%', border: '1px solid #E5E7EB', borderRadius: 8, padding: '9px 12px', fontSize: '0.875rem', color: '#111', outline: 'none', background: '#fff' }} />
      </div>
      <div>
        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 500, color: '#6B7280', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: "'Space Mono',monospace" }}>Price Range (₹)</label>
        <div style={{ display: 'flex', gap: 8 }}>
          <input type="number" value={f.min_price} onChange={e => update('min_price', e.target.value)} placeholder="Min"
            style={{ width: '50%', border: '1px solid #E5E7EB', borderRadius: 8, padding: '9px 12px', fontSize: '0.875rem', color: '#111', outline: 'none', background: '#fff' }} />
          <input type="number" value={f.max_price} onChange={e => update('max_price', e.target.value)} placeholder="Max"
            style={{ width: '50%', border: '1px solid #E5E7EB', borderRadius: 8, padding: '9px 12px', fontSize: '0.875rem', color: '#111', outline: 'none', background: '#fff' }} />
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 8, borderTop: '1px solid #F3F4F6' }}>
        <button onClick={apply} style={{
          width: '100%', padding: '11px', background: '#FF5A09', color: '#fff',
          border: 'none', borderRadius: 8, fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        }}>
          <Search size={15} /> Apply Filters
        </button>
        <button onClick={reset} style={{
          width: '100%', padding: '11px', background: '#F3F4F6', color: '#6B7280',
          border: 'none', borderRadius: 8, fontWeight: 500, fontSize: '0.875rem', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        }}>
          <RotateCcw size={14} /> Reset
        </button>
      </div>
    </div>
  );
}

