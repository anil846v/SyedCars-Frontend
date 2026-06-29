import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import imageCompression from 'browser-image-compression';
import { carSaleRequestsApi, getMediaUrl } from '../utils/api';
import { ClipboardList, ScanSearch, IndianRupee } from 'lucide-react';
import SEO from '../components/SEO'


const ORANGE = '#FF5A09';
const FUEL_TYPES  = ['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid'];
const TRANS_TYPES = ['Manual', 'Automatic', 'AMT', 'CVT', 'DCT'];

/* ── Shared input styles ── */
const inp = {
  base: {
    width: '100%', boxSizing: 'border-box',
    padding: '10px 13px', borderRadius: 8,
    border: '1.5px solid #E5E7EB',
    fontSize: '0.875rem', color: '#111',
    outline: 'none', background: '#fff',
    fontFamily: "'DM Sans', sans-serif",
    transition: 'border-color 0.15s',
  },
  label: {
    display: 'block', fontSize: '0.78rem', fontWeight: 600,
    color: '#374151', marginBottom: 5,
    fontFamily: "'DM Sans', sans-serif",
  },
};

const focus  = (e) => (e.target.style.borderColor = ORANGE);
const unfocus = (e) => (e.target.style.borderColor = '#E5E7EB');

function SectionTitle({ children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
      <span style={{ width: 4, height: 18, background: ORANGE, borderRadius: 2, flexShrink: 0 }} />
      <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#111', fontFamily: "'Poppins', sans-serif" }}>
        {children}
      </h3>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label style={inp.label}>{label}</label>
      {children}
    </div>
  );
}

const EMPTY = {
  owner_name: '', owner_phone: '', owner_email: '', owner_address: '', owner_location: '',
  brand_name: '', Model: '', manufacturing_year: '', color: '', registration_no: '',
  kms_driven: '', location: '', fuel_type: '', Transmission: '', asking_price: '', market_price: '',
  insurance_no: '', insurance_company: '',
  insurance_expiry_date: '', insurance_active: '',
  video_url: '', insta_url: '',
};

export default function SellYourCar() {
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [photos, setPhotos]         = useState([]);
  const [uploading, setUploading]   = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]           = useState('');
  const [success, setSuccess]       = useState(false);
  const fileRef = useRef();

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const MAX_PHOTOS = 4;

  /* ── Photo upload ── */
  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    e.target.value = '';
    if (!files.length) return;

    const available = MAX_PHOTOS - photos.length;
    if (available <= 0) {
      setError(`You can upload a maximum of ${MAX_PHOTOS} photos.`);
      return;
    }
    const allowed = files.slice(0, available);
    if (allowed.length < files.length) {
      setError(`Only ${available} more photo${available > 1 ? 's' : ''} allowed. Uploading first ${allowed.length}.`);
    }
    const oversized = allowed.filter(f => f.size > 5 * 1024 * 1024);
    if (oversized.length) { setError(`Photo too large (max 5 MB per photo): ${oversized.map(f => f.name).join(', ')}`); return; }

    setUploading(true);
    try {
      const compressed = await Promise.all(
        allowed.map(f => imageCompression(f, { maxSizeMB: 2, maxWidthOrHeight: 1920, useWebWorker: false }))
      );
      const fd = new FormData();
      compressed.forEach(f => fd.append('photos', f));
      const res = await carSaleRequestsApi.upload(fd);
      setPhotos(p => [...p, ...res.data]);
    } catch (err) {
      setError(err.message || 'Photo upload failed');
    } finally {
      setUploading(false);
    }
  };

  const removePhoto = (url) => setPhotos(p => p.filter(u => u !== url));

  /* ── Submit ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.owner_name.trim()) { setError('Please enter your name.'); return; }
    if (!form.owner_phone.trim()) { setError('Please enter your phone number.'); return; }
    if (!form.brand_name.trim()) { setError('Please enter the car brand.'); return; }
    if (!form.Model.trim()) { setError('Please enter the car model.'); return; }

    setSubmitting(true);
    try {
      await carSaleRequestsApi.submit({ ...form, photos });
      setSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err.message || 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Success screen ── */
  if (success) {
    return (
      <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ maxWidth: 480, textAlign: 'center' }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#ECFDF5', border: '2px solid #10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#111', fontFamily: "'Poppins', sans-serif", marginBottom: 12 }}>
            Request Submitted!
          </h2>
          <p style={{ color: '#6B7280', lineHeight: 1.7, marginBottom: 28 }}>
            Thank you! Our team will review your car details and contact you shortly to discuss the next steps.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => { setSuccess(false); setForm(EMPTY); setPhotos([]); }}
              style={{ padding: '11px 24px', borderRadius: 9, background: ORANGE, color: '#fff', border: 'none', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }}>
              Submit Another
            </button>
            <button onClick={() => navigate('/cars')}
              style={{ padding: '11px 24px', borderRadius: 9, background: 'transparent', color: ORANGE, border: `1.5px solid ${ORANGE}`, fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }}>
              Browse Cars
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: '#F8F9F2', minHeight: '100vh' }}>
      <SEO
  title="Sell Your Car"
  description="Sell your pre-owned car quickly and at the best price with Syed Cars. Free evaluation, hassle-free paperwork, and instant payment. List your car today."
  keywords="sell my car India, sell used car fast, car selling service India, get best price for used car, Syed Cars sell your car, free car evaluation India"
  url="https://syedcars.com/sell-your-car"
/>

      {/* ── Page Hero ── */}
      <div style={{ position: 'relative', borderBottom: '1px solid #E8E0D4' }}>
        {/* Diagonal stripe background (matches About hero) */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 0, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(155deg, #F2F4EE 0%, #EEF0EA 60%, #F5F3EE 100%)' }} />
          <div style={{ position: 'absolute', width: '170%', height: 270, background: `linear-gradient(120deg, ${ORANGE} 0%, #FF8A4D 100%)`, transform: 'rotate(-28deg)', top: '-4%', right: '-38%', opacity: 0.22 }} />
          <div style={{ position: 'absolute', width: '170%', height: 88, background: `linear-gradient(120deg, ${ORANGE} 0%, #FF8A4D 100%)`, transform: 'rotate(-28deg)', top: '50%', right: '-38%', opacity: 0.38 }} />
          <div style={{ position: 'absolute', width: '80%', height: 220, background: 'linear-gradient(120deg, #C8D900 0%, #D8EB00 100%)', transform: 'rotate(-28deg)', bottom: '-18%', left: '-22%', opacity: 0.09 }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(160,195,240,0.10) 0%, transparent 50%)' }} />
        </div>

     <div
  className="container sell-hero-pad"
  style={{
    padding: '0 60px', // remove top-bottom padding
    position: 'relative',
    zIndex: 1
  }}
>
  <div
    className="sell-hero-grid"
    style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 0, // remove center gap
      alignItems: 'stretch',
      minHeight: '12px' // adjust hero height
    }}
  >
    {/* LEFT */}
    <div
      style={{
        padding: '34px 40px 48px 0',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}
    >
      <p
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          color: ORANGE,
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '2.5px',
          textTransform: 'uppercase',
          margin: '0 0 16px'
        }}
      >
        SELL YOUR CAR
        <span
          style={{
            display: 'inline-block',
            height: 1.5,
            width: 40,
            background: ORANGE
          }}
        />
      </p>

      <h1
        style={{
          fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
          fontWeight: 600,
          color: '#1a1a1a',
          margin: '0 0 8px',
          lineHeight: 1.08
        }}
      >
        Get the Best Price <span style={{ color: ORANGE }}>for Your Car</span>
      </h1>

      <p
        style={{
          fontSize: '1rem',
          color: '#121111',
          lineHeight: 1.8,
          maxWidth: 520
        }}
      >
        Fill in your car details below. Our team will evaluate your car and get back to you with the best offer.
      </p>
    </div>

    {/* RIGHT IMAGE */}
    <div className="sell-hero-img-col" style={{ height: '100%', overflow: 'hidden' }}>
      <img
        src="/sellcar.png"
        alt="Sell your car"
        style={{
          width: '190%',
          height: '100%',
          maxHeight: '360px',
          objectFit: 'cover',
          display: 'block',
          marginRight: '-60px',
        }}
      />
    </div>
  </div>
</div>

        {/* ── How it works ── */}
        <div style={{ borderTop: '1px solid #E8E0D4', background: '#fff', position: 'relative', zIndex: 1 }}>
          <div className="container sell-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
            {[
              { Icon: ClipboardList, title: 'Fill the Form', desc: 'Enter your car & contact details', color: '#3B82F6' },
              { Icon: ScanSearch,    title: 'We Evaluate',   desc: 'Our team reviews & contacts you',  color: ORANGE    },
              { Icon: IndianRupee,   title: 'Get Paid',      desc: 'Fast, transparent payment',        color: '#10B981' },
            ].map(({ Icon, title, desc, color }, i) => (
              <div key={i} style={{
                padding: '28px 24px', textAlign: 'center',
                borderRight: i < 2 ? '1px solid rgba(240,230,220,0.7)' : 'none',
              }}>
                <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(232,99,26,0.09)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
                  <Icon size={24} color={color} strokeWidth={1.6} />
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 600, color, lineHeight: 1, marginTop: 12 }}>{title}</div>
                <div style={{ fontSize: '0.72rem', color: '#282727', fontFamily: 'inherit', letterSpacing: '0.10em', textTransform: 'uppercase', marginTop: 6 }}>{desc}</div>
                <div style={{ width: 28, height: 2, background: color, borderRadius: 2, margin: '10px auto 0' }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Form ── */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '36px 20px 60px' }}>
        <form onSubmit={handleSubmit}>

          {/* Section 1 — Your Details */}
          <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E5E7EB', padding: '26px 28px', marginBottom: 20 }}>
            <SectionTitle>Your Details</SectionTitle>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
              <Field label="Full Name *">
                <input value={form.owner_name} onChange={set('owner_name')} placeholder="Mohammed Rafi" style={inp.base} onFocus={focus} onBlur={unfocus} />
              </Field>
              <Field label="Phone Number *">
                <input value={form.owner_phone} onChange={set('owner_phone')} placeholder="9177565639" style={inp.base} onFocus={focus} onBlur={unfocus} />
              </Field>
              <Field label="Email Address">
                <input value={form.owner_email} onChange={set('owner_email')} placeholder="you@email.com" style={inp.base} onFocus={focus} onBlur={unfocus} />
              </Field>
              <Field label="Address">
                <input value={form.owner_address} onChange={set('owner_address')} placeholder="Street, Area" style={inp.base} onFocus={focus} onBlur={unfocus} />
              </Field>
              <Field label="City / State">
                <input value={form.owner_location} onChange={set('owner_location')} placeholder="Madanapalle, Andhra Pradesh" style={inp.base} onFocus={focus} onBlur={unfocus} />
              </Field>
            </div>
          </div>

          {/* Section 2 — Car Details */}
          <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E5E7EB', padding: '26px 28px', marginBottom: 20 }}>
            <SectionTitle>Car Details</SectionTitle>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
              <Field label="Brand *">
                <input value={form.brand_name} onChange={set('brand_name')} placeholder="Mercedes-Benz" style={inp.base} onFocus={focus} onBlur={unfocus} />
              </Field>
              <Field label="Model *">
                <input value={form.Model} onChange={set('Model')} placeholder="E-Class" style={inp.base} onFocus={focus} onBlur={unfocus} />
              </Field>
              <Field label="Year of Manufacture">
                <input type="number" value={form.manufacturing_year} onChange={set('manufacturing_year')} placeholder="2021" min="1980" max={new Date().getFullYear()} style={inp.base} onFocus={focus} onBlur={unfocus} />
              </Field>
              <Field label="Colour">
                <input value={form.color} onChange={set('color')} placeholder="Obsidian Black" style={inp.base} onFocus={focus} onBlur={unfocus} />
              </Field>
              <Field label="Registration Number">
                <input value={form.registration_no} onChange={set('registration_no')} placeholder="TS09AB1234" style={inp.base} onFocus={focus} onBlur={unfocus} />
              </Field>
              <Field label="KMs Driven">
                <input value={form.kms_driven} onChange={set('kms_driven')} placeholder="28,400" style={inp.base} onFocus={focus} onBlur={unfocus} />
              </Field>
              <Field label="Car Location">
                <input value={form.location} onChange={set('location')} placeholder="Madanapalle" style={inp.base} onFocus={focus} onBlur={unfocus} />
              </Field>
              <Field label="Fuel Type">
                <select value={form.fuel_type} onChange={set('fuel_type')} style={{ ...inp.base, cursor: 'pointer', appearance: 'none' }} onFocus={focus} onBlur={unfocus}>
                  <option value="">Select…</option>
                  {FUEL_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </Field>
              <Field label="Transmission">
                <select value={form.Transmission} onChange={set('Transmission')} style={{ ...inp.base, cursor: 'pointer', appearance: 'none' }} onFocus={focus} onBlur={unfocus}>
                  <option value="">Select…</option>
                  {TRANS_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </Field>
              <Field label="Asking Price (₹)">
                <input type="number" value={form.asking_price} onChange={set('asking_price')} placeholder="5200000" style={inp.base} onFocus={focus} onBlur={unfocus} />
              </Field>
            </div>
          </div>

          {/* Section 3 — Documents (optional) */}
          <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E5E7EB', padding: '26px 28px', marginBottom: 20 }}>
            <SectionTitle>Documents &amp; Insurance <span style={{ fontSize: '0.75rem', fontWeight: 400, color: '#9CA3AF' }}>(optional)</span></SectionTitle>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
              <Field label="Insurance Number">
                <input value={form.insurance_no} onChange={set('insurance_no')} placeholder="INS2021" style={inp.base} onFocus={focus} onBlur={unfocus} />
              </Field>
              <Field label="Insurance Company">
                <input value={form.insurance_company} onChange={set('insurance_company')} placeholder="New India Assurance" style={inp.base} onFocus={focus} onBlur={unfocus} />
              </Field>
              <Field label="Insurance Expiry Date">
                <input type="date" value={form.insurance_expiry_date} onChange={set('insurance_expiry_date')} style={inp.base} onFocus={focus} onBlur={unfocus} />
              </Field>
              <Field label="Insurance Status">
                <select value={form.insurance_active} onChange={set('insurance_active')} style={{ ...inp.base, cursor: 'pointer', appearance: 'none' }} onFocus={focus} onBlur={unfocus}>
                  <option value="">Unknown</option>
                  <option value="1">Active</option>
                  <option value="0">Expired / None</option>
                </select>
              </Field>
            </div>
          </div>

          {/* Section 4 — Photos */}
          <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E5E7EB', padding: '26px 28px', marginBottom: 20 }}>
            <SectionTitle>Car Photos <span style={{ fontSize: '0.75rem', fontWeight: 400, color: '#9CA3AF' }}>(optional)</span></SectionTitle>

            {/* Photo grid */}
            {photos.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 14 }}>
                {photos.map((url, i) => (
                  <div key={i} style={{ position: 'relative', width: 90, height: 72, borderRadius: 8, overflow: 'hidden', border: '1px solid #E5E7EB' }}>
                    <img src={getMediaUrl(url)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button type="button" onClick={() => removePhoto(url)} style={{
                      position: 'absolute', top: 3, right: 3, width: 20, height: 20, borderRadius: '50%',
                      background: 'rgba(0,0,0,0.55)', border: 'none', color: '#fff', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', lineHeight: 1,
                    }}>✕</button>
                  </div>
                ))}
              </div>
            )}

            {photos.length < MAX_PHOTOS && (
            <div
              onClick={() => !uploading && fileRef.current.click()}
              style={{
                border: `2px dashed ${ORANGE}40`, borderRadius: 10, padding: '28px 20px',
                textAlign: 'center', cursor: uploading ? 'wait' : 'pointer',
                background: '#FFF8F5', transition: 'border-color 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = ORANGE}
              onMouseLeave={e => e.currentTarget.style.borderColor = `${ORANGE}40`}
            >
              <div style={{ fontSize: '1.8rem', marginBottom: 8 }}>📷</div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>
                {uploading ? 'Uploading…' : `Click to upload photos (${photos.length}/${MAX_PHOTOS})`}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#9CA3AF', marginTop: 4 }}>JPG, PNG, WEBP — max 5 MB each · up to {MAX_PHOTOS} photos</div>
            </div>
            )}
            {photos.length >= MAX_PHOTOS && (
              <div style={{ borderRadius: 10, padding: '14px 20px', textAlign: 'center', background: '#F3F4F6', border: '1.5px solid #E5E7EB', color: '#6B7280', fontSize: '0.85rem' }}>
                Maximum of {MAX_PHOTOS} photos uploaded. Remove a photo to upload another.
              </div>
            )}
            <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleFileChange} style={{ display: 'none' }} />
          </div>

          {/* Section 5 — Media Links */}
          <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E5E7EB', padding: '26px 28px', marginBottom: 28 }}>
            <SectionTitle>Media Links <span style={{ fontSize: '0.75rem', fontWeight: 400, color: '#9CA3AF' }}>(optional)</span></SectionTitle>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
              <Field label="YouTube Video URL">
                <input value={form.video_url} onChange={set('video_url')} placeholder="https://youtube.com/watch?v=..." style={inp.base} onFocus={focus} onBlur={unfocus} />
              </Field>
              <Field label="Instagram URL">
                <input value={form.insta_url} onChange={set('insta_url')} placeholder="https://instagram.com/p/..." style={inp.base} onFocus={focus} onBlur={unfocus} />
              </Field>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 9, padding: '12px 16px', marginBottom: 20, color: '#DC2626', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}

          {/* Submit */}
          <button type="submit" disabled={submitting || uploading} style={{
            width: '100%', padding: '15px', borderRadius: 11,
            background: submitting ? '#f0a070' : ORANGE, color: '#fff',
            border: 'none', fontWeight: 700, fontSize: '1rem', cursor: submitting ? 'not-allowed' : 'pointer',
            fontFamily: "'Poppins', sans-serif",
            boxShadow: '0 4px 18px rgba(255,90,9,0.35)',
            transition: 'background 0.2s',
          }}>
            {submitting ? 'Submitting…' : 'Submit Sale Request'}
          </button>

          <p style={{ textAlign: 'center', fontSize: '0.78rem', color: '#393a3c', marginTop: 14 }}>
            By submitting, you agree that our team may contact you about your car listing.
          </p>
        </form>
      </div>

      <style>{`
       @media (max-width: 768px) {
  .sell-hero-grid {
    grid-template-columns: 1fr !important;
    gap: 0 !important;
  }
  .sell-hero-pad {
    padding: 16px 20px 0 !important;
  }
  .sell-hero-img-col {
    height: 220px !important;
    overflow: hidden !important;
    margin: 16px -20px 0 !important;
  }
  .sell-hero-img-col img {
    display: block !important;
    width: 100% !important;
    height: 100% !important;
    max-height: none !important;
    object-fit: cover !important;
    object-position: center center !important;
    margin-right: 0 !important;
  }
}
        @media (max-width: 640px) {
          form > div { padding: 20px 16px !important; }
          .sell-hero-pad { padding: 24px 16px 0 !important; }
          .sell-hero-img-col { height: 200px !important; margin: 16px -16px 0 !important; }
          .sell-stats-grid { grid-template-columns: 1fr !important; }
          .sell-stats-grid > div { border-right: none !important; border-bottom: 1px solid rgba(240,230,220,0.7); }
          .sell-stats-grid > div:last-child { border-bottom: none !important; }
        }
      `}</style>
    </div>
  );
}
