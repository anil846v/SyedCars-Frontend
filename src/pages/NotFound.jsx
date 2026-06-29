import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="page-enter" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(6rem,15vw,10rem)', fontWeight: 300, color: '#E5E7EB', lineHeight: 1, marginBottom: -8 }}>404</p>
        <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(1.5rem,4vw,2.5rem)', color: '#111', marginBottom: 12 }}>Page Not Found</h1>
        <p style={{ color: '#9CA3AF', marginBottom: 28 }}>The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 24px', background: '#FF5A09', color: '#fff', borderRadius: 8, fontWeight: 600, fontSize: '0.875rem', boxShadow: '0 2px 12px rgba(255,90,9,0.3)' }}>
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}

