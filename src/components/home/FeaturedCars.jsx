import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { carsApi } from '../../utils/api';
import CarCard from '../cars/CarCard';
import Loader from '../ui/Loader';
import { ArrowRight } from 'lucide-react';

const ORANGE = '#FF5A09';
const LIME   = '#C8D900';

export default function FeaturedCars() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carsApi.list({ limit: 8, status: 'AVAILABLE' })
      .then(res => setCars(res?.data?.cars ?? res?.cars ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section style={{
      position: 'relative',
      padding: '80px 0',
      fontFamily: "'DM Sans', sans-serif",
      overflow: 'hidden',
      background: '#FDFCF9',
    }}>

      {/* ── Corner Triangles Background ── */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>

        {/* Top-right lime triangle */}
        <div style={{
          position: 'absolute', top: 0, right: 0,
          width: 0, height: 0,
          borderLeft: '320px solid transparent',
          borderTop: `320px solid ${LIME}`,
          opacity: 0.18,
        }} />

        {/* Top-right inner triangle — slightly smaller, creates layered look */}
        <div style={{
          position: 'absolute', top: 0, right: 0,
          width: 0, height: 0,
          borderLeft: '180px solid transparent',
          borderTop: `180px solid ${LIME}`,
          opacity: 0.14,
        }} />

        {/* Bottom-left orange triangle */}
        {/* <div style={{
          position: 'absolute', bottom: 0, left: 0,
          width: 0, height: 0,
          borderRight: '220px solid transparent',
          borderBottom: `220px solid ${ORANGE}`,
          opacity: 0.08,
        }} /> */}

        {/* Bottom-left inner triangle */}
        {/* <div style={{
          position: 'absolute', bottom: 0, left: 0,
          width: 0, height: 0,
          borderRight: '110px solid transparent',
          borderBottom: `110px solid ${ORANGE}`,
          opacity: 0.07,
        }} /> */}

        {/* Right edge accent line */}
        <div style={{
          position: 'absolute', top: 0, right: 0,
          width: 4, height: '100%',
          background: ORANGE,
          opacity: 0.12,
        }} />

      </div>

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>

        {/* ── Header ── */}
        <div style={{
          display: 'flex', alignItems: 'flex-end',
          justifyContent: 'space-between', gap: 16,
          marginBottom: 40, flexWrap: 'wrap',
        }}>
          <div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: '#fff', border: '1px solid #EDE0D8',
              borderRadius: 30, padding: '5px 14px',
              fontSize: '0.72rem', fontWeight: 700,
              fontFamily: "'DM Sans', 'Inter', sans-serif",
              textTransform: 'uppercase', letterSpacing: '0.1em',
              color: '#666',
              marginBottom: 12, boxShadow: '0 1px 6px rgba(0,0,0,0.05)',
            }}>
              ✦ Featured Listings
            </div>

            <h2 style={{
              fontSize: 'clamp(28px, 3.5vw, 42px)',
              fontWeight: 600,
              fontFamily: "'Poppins', sans-serif",
              color: '#0D0D0D',
              margin: 0, lineHeight: 1.12,
              letterSpacing: '-0.01em',
            }}>
              Latest <span style={{ color: ORANGE }}>Car</span> Listings
            </h2>
          </div>

          <Link to="/cars" style={{
            display: 'flex', alignItems: 'center', gap: 6,
            fontSize: '0.84rem', color: ORANGE, fontWeight: 600,
            fontFamily: "'DM Sans', sans-serif",
            border: `1.5px solid ${ORANGE}`, borderRadius: 10,
            padding: '10px 20px', textDecoration: 'none',
            transition: 'background 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#FFF2EC'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
          >
            Browse all <ArrowRight size={14} />
          </Link>
        </div>

        {/* ── Grid ── */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
            <Loader size="lg" />
          </div>
        ) : cars.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#9CA3AF', padding: '60px 0' }}>
            No listings available yet.
          </p>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: 16,
          }}>
            {cars.map(car => <CarCard key={car.id} car={car} />)}
          </div>
        )}
      </div>
    </section>
  );
}