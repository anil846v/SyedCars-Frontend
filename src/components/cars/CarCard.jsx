import { Link } from 'react-router-dom';
import { Fuel, Gauge, Settings2, MapPin, ArrowRight, TrendingDown } from 'lucide-react';
import { formatINR, savingsPercent } from '../../utils/helpers';
import Badge from '../ui/Badge';
import { getMediaUrl } from '../../utils/api';

const statusVariant = { AVAILABLE: 'green', SOLD: 'gray', RESERVED: 'orange', BOOKED: 'orange', ON_HOLD: 'blue' };

export default function CarCard({ car }) {
  const savings = savingsPercent(car.asking_price, car.market_price);
  const imgUrl  = getMediaUrl(car.media?.[0]?.image_url || car.thumbnail || car.images?.[0]);

  return (
    /* ── Entire card is a link → tap anywhere to open car detail ── */
    <Link
      to={`/cars/${car.id}`}
      style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column' }}
    >
      <div
        style={{
          background: '#fff',
          border: '1px solid #E5E7EB',
          borderRadius: 14,
          overflow: 'hidden',
          transition: 'all 0.28s cubic-bezier(0.25,0.46,0.45,0.94)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          display: 'flex',
          flexDirection: 'column',
          cursor: 'pointer',
          height: '100%',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-5px)';
          e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.12)';
          e.currentTarget.style.borderColor = '#FF5A09';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = '';
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
          e.currentTarget.style.borderColor = '#E5E7EB';
        }}
      >
        {/* ── Image ── */}
        <div style={{
          position: 'relative',
          aspectRatio: '16/10',
          background: '#F8F9FA',
          overflow: 'hidden',
          borderRadius: '12px 12px 0 0',
          flexShrink: 0,
        }}>
          {imgUrl ? (
            <img
              src={imgUrl}
              alt={`${car.brand_name} ${car.Model}`}
              loading="lazy"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
                transition: 'transform 0.45s ease',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.06)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            />
          ) : (
            <div style={{
              width: '100%', height: '100%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: '#F1F3F5',
            }}>
              <span style={{ fontSize: '4rem', opacity: 0.15 }}>🚗</span>
            </div>
          )}

          {/* Savings badge — bottom-left */}
          {savings > 0 && (
            <div style={{
              position: 'absolute', top: 10, left: 10,
              background: '#FF5A09', color: '#fff',
              fontSize: '0.67rem', fontFamily: "'DM Sans', sans-serif",
              fontWeight: 700, padding: '4px 10px', borderRadius: 999,
              display: 'flex', alignItems: 'center', gap: 4,
              boxShadow: '0 2px 10px rgba(255,90,9,0.4)',
              letterSpacing: '0.02em',
            }}>
              <TrendingDown size={11} /> {savings}% OFF
            </div>
          )}

          {/* Status badge — flush top-right corner */}
          <div style={{ position: 'absolute', top: 0, right: 0 }}>
            <Badge
              variant={statusVariant[car.status] || (car.is_active ? 'green' : 'gray')}
              style={{ borderRadius: '0 12px 0 8px' }}
            >
              {car.status || (car.is_active ? 'Available' : 'Unlisted')}
            </Badge>
          </div>
        </div>

        {/* ── Content ── */}
        <div style={{ padding: '14px 16px', flex: 1, display: 'flex', flexDirection: 'column' }}>

          {/* Title row */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 8 }}>
            <div style={{ minWidth: 0 }}>
              <h3 style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '1.05rem', color: '#575555',
                fontWeight: 700, lineHeight: 1.25, margin: 0,
              }}>
                {car.brand_name} {car.Model}
              </h3>
              <p style={{ fontSize: '0.73rem', color: '#161616', marginTop: 3 }}>
                {car.manufacturing_year}{car.color ? ` · ${car.color}` : ''}
              </p>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <p style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '1.18rem', fontWeight: 800, color: '#111', margin: 0,
              }}>
                {formatINR(car.asking_price)}
              </p>
              {car.market_price && savings > 0 && (
                <p style={{ fontSize: '0.7rem', color: '#1c1c1c', textDecoration: 'line-through', margin: 0 }}>
                  {formatINR(car.market_price)}
                </p>
              )}
            </div>
          </div>

          {/* Specs row */}
          <div style={{
            display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap',
            paddingTop: 10, borderTop: '1px solid #F3F4F6', marginTop: 'auto',
          }}>
            {car.kms_driven && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.73rem', color: '#181819' }}>
                <Gauge size={12} color="#111112" /> {car.kms_driven}
              </span>
            )}
            {car.fuel_type && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.73rem', color: '#0f0f0f' }}>
                <Fuel size={12} color="#111112" /> {car.fuel_type}
              </span>
            )}
            {car.Transmission && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.73rem', color: '#151515' }}>
                <Settings2 size={12} color="#111112" /> {car.Transmission}
              </span>
            )}
            {car.location && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.73rem', color: '#FF5A09', fontWeight: 600, marginLeft: 'auto' }}>
                <MapPin size={12} /> {car.location.split(',')[0]}
              </span>
            )}
          </div>

          {/* View Details CTA */}
          <div style={{
            marginTop: 12, padding: '9px',
            background: 'rgba(255,90,9,0.06)',
            border: '1px solid rgba(255,90,9,0.2)',
            borderRadius: 8,
            color: '#FF5A09',
            fontSize: '0.83rem',
            fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            transition: 'all 0.2s',
            fontFamily: "'DM Sans', sans-serif",
          }}
            onMouseEnter={e => { e.currentTarget.style.background = '#FF5A09'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,90,9,0.06)'; e.currentTarget.style.color = '#FF5A09'; }}
          >
            View Details <ArrowRight size={14} />
          </div>
        </div>
      </div>
    </Link>
  );
}
