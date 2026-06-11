import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { carsApi, enquiriesApi } from '../utils/api';
import { formatINR, savingsPercent } from '../utils/helpers';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Loader from '../components/ui/Loader';

export default function CarDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car,         setCar]         = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState('');
  const [activeImg,   setActiveImg]   = useState(0);
  const [form,        setForm]        = useState({ name:'', phone:'', email:'', message:'' });
  const [sending,     setSending]     = useState(false);
  const [sent,        setSent]        = useState(false);
  const [formError,   setFormError]   = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await carsApi.get(id);
        setCar(res?.data ?? res);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const submitEnquiry = async (e) => {
    e.preventDefault();
    setSending(true); setFormError('');
    try {
      await enquiriesApi.submit({ ...form, car_id: Number(id) });
      setSent(true);
    } catch (err) {
      setFormError(err.message || 'Failed to send enquiry');
    } finally {
      setSending(false);
    }
  };

  if (loading) return <div className="flex justify-center py-40"><Loader size="lg" /></div>;
  if (error || !car) return (
    <div className="text-center py-32 px-8 flex flex-col items-center gap-4">
      <h2 className="font-display text-2xl text-mist">Car not found</h2>
      <p className="text-smoke text-sm">{error}</p>
      <Button onClick={() => navigate('/cars')}>Back to Cars</Button>
    </div>
  );

  const savings = savingsPercent(car.asking_price, car.market_price);
  const images  = car.media?.map(m => m.image_url).filter(Boolean) || [];

  const SPECS = [
    { label:'Brand',          value: car.brand_name },
    { label:'Model',          value: car.Model },
    { label:'Year',           value: car.manufacturing_year },
    { label:'Colour',         value: car.color },
    { label:'Fuel Type',      value: car.fuel_type },
    { label:'Transmission',   value: car.Transmission },
    { label:'KMs Driven',     value: car.kms_driven ? `${car.kms_driven} km` : null },
    { label:'Registration',   value: car.registration_no },
    { label:'Location',       value: car.location },
    { label:'Insurance',      value: car.insurance_active === 1 ? 'Active' : car.insurance_active === 0 ? 'Expired / None' : null },
    { label:'Insurance Co.',  value: car.insurance_company },
    { label:'Insurance No.',  value: car.insurance_no },
    { label:'Expiry',         value: car.insurance_expiry_date },
    { label:'Engine No.',     value: car.engine_no },
    { label:'Chassis No.',    value: car.chassis_no },
  ].filter(s => s.value);

  const inputClass = "w-full bg-ink-3 border border-ink-4 rounded-md px-4 py-3 text-white text-sm placeholder-smoke focus:outline-none focus:border-gold transition-colors";

  return (
    <div className="page-enter pb-20">
      {/* Breadcrumb */}
      <div className="container flex items-center gap-2 pt-6 pb-6 text-[0.8rem] text-smoke font-mono">
        <Link to="/" className="hover:text-gold transition-colors">Home</Link>
        <span>›</span>
        <Link to="/cars" className="hover:text-gold transition-colors">Cars</Link>
        <span>›</span>
        <span className="text-mist">{car.brand_name} {car.Model}</span>
      </div>

      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-10 items-start">
          {/* Left */}
          <div>
            {/* Main image */}
            <div className="aspect-[16/10] rounded-lg bg-ink-3 overflow-hidden mb-3">
              {images.length > 0 ? (
                <img src={images[activeImg]} alt={`${car.brand_name} ${car.Model}`} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="font-display text-6xl text-ink-5">{car.brand_name?.[0]}</span>
                </div>
              )}
            </div>
            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)}
                    className={`shrink-0 w-20 h-14 rounded-sm overflow-hidden border-2 transition-colors ${activeImg===i ? 'border-gold' : 'border-transparent'}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Media links */}
            {(car.video_url || car.insta_url) && (
              <div className="flex gap-3 mt-4">
                {car.video_url && (
                  <a href={car.video_url} target="_blank" rel="noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-ink-2 border border-ink-4 rounded-md text-sm text-smoke hover:text-white hover:border-ink-5 transition-colors">
                    ▶ Watch Video
                  </a>
                )}
                {car.insta_url && (
                  <a href={car.insta_url} target="_blank" rel="noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-ink-2 border border-ink-4 rounded-md text-sm text-smoke hover:text-white hover:border-ink-5 transition-colors">
                    ◎ Instagram
                  </a>
                )}
              </div>
            )}

            {/* Specs */}
            <div className="mt-8">
              <h2 className="font-display text-2xl text-white font-normal mb-5">Specifications</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-[1px] bg-ink-4 border border-ink-4 rounded-lg overflow-hidden">
                {SPECS.map(s => (
                  <div key={s.label} className="flex justify-between gap-3 px-4 py-3 bg-ink-2">
                    <span className="text-smoke text-sm">{s.label}</span>
                    <span className="text-white text-sm text-right font-medium">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="lg:sticky lg:top-6">
            <div className="bg-ink-2 border border-ink-4 rounded-lg p-6 mb-4">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <h1 className="font-display text-3xl text-white font-normal leading-tight">
                    {car.brand_name} {car.Model}
                  </h1>
                  <p className="text-smoke text-sm mt-1 font-mono">{car.manufacturing_year} · {car.fuel_type} · {car.Transmission}</p>
                </div>
                <Badge variant={car.status==='SOLD'?'smoke':car.status==='AVAILABLE'?'green':'blue'}>
                  {car.status || 'Available'}
                </Badge>
              </div>

              <div className="mt-4 pb-4 border-b border-ink-4">
                <p className="font-display text-4xl text-gold font-normal">{formatINR(car.asking_price)}</p>
                {car.market_price && (
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-smoke text-sm line-through">{formatINR(car.market_price)}</span>
                    {savings > 0 && <span className="text-emerald text-sm font-mono">{savings}% below market</span>}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-3 gap-3 py-4 border-b border-ink-4">
                {[
                  { label:'KMs', value: car.kms_driven || '—' },
                  { label:'Fuel', value: car.fuel_type || '—' },
                  { label:'Gearbox', value: car.Transmission || '—' },
                ].map(s => (
                  <div key={s.label} className="text-center">
                    <p className="text-white text-sm font-medium">{s.value}</p>
                    <p className="text-smoke text-xs font-mono">{s.label}</p>
                  </div>
                ))}
              </div>

              {car.location && (
                <p className="text-smoke text-sm pt-4">📍 {car.location}</p>
              )}
            </div>

            {/* Enquiry Form */}
            <div className="bg-ink-2 border border-ink-4 rounded-lg p-6">
              <h3 className="font-display text-xl text-white font-normal mb-4">Send Enquiry</h3>
              {sent ? (
                <div className="text-center py-6">
                  <div className="text-4xl mb-3">✓</div>
                  <p className="text-emerald font-medium mb-1">Enquiry Sent!</p>
                  <p className="text-smoke text-sm">We'll contact you shortly.</p>
                </div>
              ) : (
                <form onSubmit={submitEnquiry} className="flex flex-col gap-3">
                  {formError && <div className="bg-crimson/10 border border-crimson/30 rounded-md px-3 py-2 text-crimson text-xs">{formError}</div>}
                  <input value={form.name} onChange={e => setForm(p=>({...p,name:e.target.value}))} placeholder="Your Name *" required className={inputClass} />
                  <input value={form.phone} onChange={e => setForm(p=>({...p,phone:e.target.value}))} placeholder="Phone Number *" required className={inputClass} />
                  <input type="email" value={form.email} onChange={e => setForm(p=>({...p,email:e.target.value}))} placeholder="Email (optional)" className={inputClass} />
                  <textarea value={form.message} onChange={e => setForm(p=>({...p,message:e.target.value}))} placeholder="Message…" rows={3} className={`${inputClass} resize-none`} />
                  <button type="submit" disabled={sending}
                    className="mt-2 bg-gold text-ink font-medium py-3 rounded-md text-sm hover:bg-gold-light transition-colors disabled:opacity-50">
                    {sending ? 'Sending…' : 'Send Enquiry'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
