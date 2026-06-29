import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { carsApi, enquiriesApi, getMediaUrl } from '../utils/api';
import { formatINR, savingsPercent } from '../utils/helpers';
import Badge from '../components/ui/Badge';
import Loader from '../components/ui/Loader';
import { Home, ChevronRight, MapPin, Play, CheckCircle2 } from 'lucide-react';
// Extract YouTube video ID from a URL
function getYouTubeId(url) {
  if (!url) return null;
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?.*v=|embed\/|v\/))([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : null;
}

export default function CarDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeImg, setActiveImg] = useState(0);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [formError, setFormError] = useState('');

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

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400, paddingTop: 80 }}>
      <Loader size="lg" />
    </div>
  );
  if (error || !car) return (
    <div style={{ textAlign: 'center', padding: '100px 24px', paddingTop: 120 }}>
      <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '1.75rem', color: '#111', marginBottom: 8 }}>Car not found</h2>
      <p style={{ color: '#9CA3AF', marginBottom: 20 }}>{error}</p>
      <button onClick={() => navigate('/cars')} style={{ padding: '10px 20px', background: '#FF5A09', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>Back to Cars</button>
    </div>
  );

  const savings = savingsPercent(car.asking_price, car.market_price);
  const images = car.media?.map(m => getMediaUrl(m.image_url)).filter(Boolean) || [];
  const ytId = getYouTubeId(car.video_url);
  const statusVariant = car.status === 'SOLD' ? 'gray' : car.status === 'AVAILABLE' ? 'green' : 'blue';

  const SPECS = [
    { label: 'Brand', value: car.brand_name },
    { label: 'Model', value: car.Model },
    { label: 'Year', value: car.manufacturing_year },
    { label: 'Colour', value: car.color },
    { label: 'Fuel Type', value: car.fuel_type },
    { label: 'Transmission', value: car.Transmission },
    { label: 'KMs Driven', value: car.kms_driven ? `${car.kms_driven} km` : null },
    { label: 'Registration', value: car.registration_no },
    { label: 'Location', value: car.location },
    { label: 'Insurance', value: car.insurance_active === 1 ? 'Active' : car.insurance_active === 0 ? 'Expired / None' : null },
    { label: 'Insurance Co.', value: car.insurance_company },
    { label: 'Expiry Date', value: car.insurance_expiry_date },
  ].filter(s => s.value);

  const inputStyle = {
    width: '100%',
    border: '1px solid #E5E7EB',
    borderRadius: 8,
    padding: '11px 14px',
    fontSize: '0.875rem',
    color: '#111',
    outline: 'none',
    background: '#FAFAFA',
    fontFamily: 'inherit',
  };

  return (
    <div className="page-enter" style={{ paddingBottom: 80, paddingTop: 1 }}>
      {/* Breadcrumb */}
      <div className="container" style={{ display: 'flex', alignItems: 'center', gap: 6, paddingTop: 18, paddingBottom: 18, fontSize: '0.8rem', color: '#9CA3AF' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#9CA3AF' }}><Home size={13} /> Home</Link>
        <ChevronRight size={13} />
        <Link to="/cars" style={{ color: '#9CA3AF' }}>Cars</Link>
        <ChevronRight size={13} />
        <span style={{ color: '#374151' }}>{car.brand_name} {car.Model}</span>
      </div>

      <div className="container">
        <div className="cardetail-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 400px', gap: 36, alignItems: 'start' }}>
          {/* ── Left Column ── */}
          <div>
            {/* Main Image */}
            <div style={{ aspectRatio: '16/10', borderRadius: 14, background: '#F3F4F6', overflow: 'hidden', marginBottom: 10 }}>
              {images.length > 0 ? (
                <img src={images[activeImg]} alt={`${car.brand_name} ${car.Model}`} loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '5rem', color: '#D1D5DB' }}>{car.brand_name?.[0]}</span>
                </div>
              )}
            </div>
            {/* Thumbnails */}
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4, marginBottom: 16 }}>
                {images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)} style={{
                    flexShrink: 0, width: 80, height: 56, borderRadius: 6, overflow: 'hidden',
                    border: `2px solid ${activeImg === i ? '#FF5A09' : 'transparent'}`,
                    padding: 0, cursor: 'pointer', transition: 'border-color 0.15s',
                  }}>
                    <img src={img} alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}

            {/* ── YouTube Video Player (inline, no redirect) ── */}
            {ytId && (
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '1.25rem', color: '#111', fontWeight: 600, marginBottom: 12 }}>
                  Video Walkthrough
                </h3>
                <div style={{
                  position: 'relative', borderRadius: 12, overflow: 'hidden',
                  aspectRatio: '16/9', background: '#000',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
                }}>
                  {!videoPlaying ? (
                    <>
                      {/* Thumbnail */}
                      <img
                        src={`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`}
                        alt="Video thumbnail"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                      {/* Play overlay */}
                      <button
                        onClick={() => setVideoPlaying(true)}
                        style={{
                          position: 'absolute', inset: 0,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          background: 'rgba(0,0,0,0.35)',
                          border: 'none', cursor: 'pointer',
                        }}
                      >
                        <div style={{
                          width: 64, height: 64, borderRadius: '50%',
                          background: '#FF5A09',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          boxShadow: '0 4px 24px rgba(255,90,9,0.5)',
                          transition: 'transform 0.2s',
                        }}>
                          <Play size={26} color="#fff" fill="#fff" style={{ marginLeft: 3 }} />
                        </div>
                      </button>
                    </>
                  ) : (
                    <iframe
                      src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1`}
                      title="Car Walkthrough Video"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
                    />
                  )}
                </div>
              </div>
            )}

            {/* Instagram link */}
          {/* Instagram link */}
{car.insta_url && (
  <div style={{ marginBottom: 24 }}>
    <a 
      href={car.insta_url} 
      target="_blank" 
      rel="noreferrer" 
      style={{
        display: 'inline-flex', 
        alignItems: 'center', 
        gap: 8,
        padding: '10px 18px', 
        borderRadius: 8,
        background: 'linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',
        color: '#fff', 
        fontSize: '0.875rem', 
        fontWeight: 600,
        textDecoration: 'none',
      }}
    >
      📷 View on Instagram
    </a>
  </div>
)}

            {/* Specifications */}
            <div>
              <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '1.6rem', color: '#111', fontWeight: 600, marginBottom: 16 }}>
                Specifications
              </h2>
              <div className="cardetail-specs" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: '#f3eded', border: '1px solid #3e3c3c', borderRadius: 10, overflow: 'hidden' }}>
                {SPECS.map(s => (
                  <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '11px 16px', background: '#fff' }}>
                    <span style={{ fontSize: '0.84rem', color: '#0a0b0b' }}>{s.label}</span>
                    <span style={{ fontSize: '0.84rem', color: '#111', fontWeight: 500, textAlign: 'right' }}>{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right Column ── */}
          <div style={{ position: 'sticky', top: 82 }}>
            {/* Price card */}
            <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 14, padding: 22, marginBottom: 14, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 8 }}>
                <div>
                  <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '1.75rem', color: '#111', fontWeight: 600, lineHeight: 1.2 }}>
                    {car.brand_name} {car.Model}
                  </h1>
                  <p style={{ fontSize: '0.8rem', color: '#252627', marginTop: 4, fontFamily: "'Space Mono',monospace" }}>
                    {car.manufacturing_year} · {car.fuel_type} · {car.Transmission}
                  </p>
                </div>
                <Badge variant={statusVariant}>{car.status || 'Available'}</Badge>
              </div>

              <div style={{ paddingBottom: 14, borderBottom: '1px solid #F3F4F6', marginBottom: 14 }}>
                <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '2.2rem', fontWeight: 700, color: '#FF5A09', lineHeight: 1 }}>
                  {formatINR(car.asking_price)}
                </p>
                {car.market_price && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                    <span style={{ fontSize: '0.85rem', color: '#282829', textDecoration: 'line-through' }}>{formatINR(car.market_price)}</span>
                    {savings > 0 && <span style={{ fontSize: '0.8rem', color: '#10B981', fontWeight: 600 }}>{savings}% below market</span>}
                  </div>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, paddingBottom: 14, borderBottom: '1px solid #F3F4F6', marginBottom: 14 }}>
                {[
                  { label: 'KMs', value: car.kms_driven || '—' },
                  { label: 'Fuel', value: car.fuel_type || '—' },
                  { label: 'Gearbox', value: car.Transmission || '—' },
                ].map(s => (
                  <div key={s.label} style={{ textAlign: 'center', padding: '8px 4px', background: '#F9FAFB', borderRadius: 6 }}>
                    <p style={{ fontSize: '0.84rem', fontWeight: 600, color: '#111' }}>{s.value}</p>
                    <p style={{ fontSize: '0.7rem', color: '#2c2d2e', fontFamily: "'Space Mono',monospace" }}>{s.label}</p>
                  </div>
                ))}
              </div>

              {car.location && (
                <p style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.84rem', color: '#6B7280' }}>
                  <MapPin size={14} color="#FF5A09" /> {car.location}
                </p>
              )}
            </div>

            {/* Enquiry Form */}
            <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 14, padding: 22, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '1.25rem', color: '#111', fontWeight: 600, marginBottom: 16 }}>
                Send Enquiry
              </h3>
              {sent ? (
                <div style={{ textAlign: 'center', padding: '24px 0' }}>
                  <CheckCircle2 size={40} color="#10B981" style={{ margin: '0 auto 12px' }} />
                  <p style={{ color: '#10B981', fontWeight: 600, marginBottom: 4 }}>Enquiry Sent!</p>
                  <p style={{ color: '#9CA3AF', fontSize: '0.875rem' }}>We'll contact you shortly.</p>
                </div>
              ) : (
                <form onSubmit={submitEnquiry} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {formError && (
                    <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 6, padding: '8px 12px', color: '#EF4444', fontSize: '0.8rem' }}>
                      {formError}
                    </div>
                  )}
                  <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    placeholder="Your Name *" required style={inputStyle} />
                  <input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                    placeholder="Phone Number *" required style={inputStyle} />
                  <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                    placeholder="Email (optional)" style={inputStyle} />
                  <textarea value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                    placeholder="Message…" rows={3} style={{ ...inputStyle, resize: 'none' }} />
                  <button type="submit" disabled={sending} style={{
                    marginTop: 4, background: '#FF5A09', color: '#fff',
                    border: 'none', borderRadius: 8, padding: '12px', fontWeight: 600,
                    fontSize: '0.875rem', cursor: sending ? 'not-allowed' : 'pointer',
                    opacity: sending ? 0.6 : 1, transition: 'all 0.2s',
                    fontFamily: 'inherit',
                  }}>
                    {sending ? 'Sending…' : 'Send Enquiry'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .car-detail-grid    { grid-template-columns: 1fr !important; }
          .cardetail-grid     { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 600px) {
          .cardetail-specs    { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

