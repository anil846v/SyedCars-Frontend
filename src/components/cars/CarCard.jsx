import { Link } from 'react-router-dom';
import { formatINR, savingsPercent } from '../../utils/helpers';
import Badge from '../ui/Badge';

const fuelIcon  = { Petrol:'⛽', Diesel:'⛽', Electric:'⚡', CNG:'💨', Hybrid:'🌿' };
const transIcon = { Automatic:'A', Manual:'M', AMT:'A/M', CVT:'CVT', DCT:'DCT' };

export default function CarCard({ car }) {
  const savings  = savingsPercent(car.asking_price, car.market_price);
  // Support both real API structure (media[]) and legacy (images[], thumbnail)
  const imgUrl   = car.media?.[0]?.image_url || car.thumbnail || car.images?.[0];
  const statusVariant = { AVAILABLE:'green', SOLD:'smoke', RESERVED:'orange', BOOKED:'orange', ON_HOLD:'blue' };

  return (
    <Link to={`/cars/${car.id}`} className="group block bg-ink-2 border border-ink-4 rounded-lg overflow-hidden hover:border-ink-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
      {/* Image */}
      <div className="relative aspect-[4/3] bg-ink-3 overflow-hidden">
        {imgUrl ? (
          <img src={imgUrl} alt={`${car.brand_name} ${car.Model}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="font-display text-5xl text-ink-5">{car.brand_name?.[0] || '⊞'}</span>
          </div>
        )}

        {savings > 0 && (
          <div className="absolute top-3 left-3 bg-gold-light text-gold-dark text-[0.65rem] font-mono font-bold px-2 py-1 rounded-sm">
            {savings}% BELOW MRP
          </div>
        )}
        <div className="absolute top-3 right-3">
          <Badge variant={statusVariant[car.status] || (car.is_active ? 'green' : 'smoke')}>
            {car.status || (car.is_active ? 'Available' : 'Unlisted')}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <h3 className="font-display text-lg text-white font-normal leading-tight group-hover:text-gold transition-colors">
              {car.brand_name} {car.Model}
            </h3>
            <p className="text-smoke text-xs font-mono mt-0.5">{car.manufacturing_year} · {car.color}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-white font-display text-xl font-bold">{formatINR(car.asking_price)}</p>
            {car.market_price && savings > 0 && (
              <p className="text-smoke text-xs line-through">{formatINR(car.market_price)}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 pt-3 border-t border-ink-4 flex-wrap">
          {car.kms_driven && (
            <span className="flex items-center gap-1 text-[0.75rem] text-smoke font-mono">
              <span className="text-[10px] opacity-75">◎</span> {car.kms_driven}
            </span>
          )}
          {car.fuel_type && (
            <span className="flex items-center gap-1 text-[0.75rem] text-smoke font-mono">
              <span>{fuelIcon[car.fuel_type] || '⛽'}</span> {car.fuel_type}
            </span>
          )}
          {car.Transmission && (
            <span className="flex items-center gap-1 text-[0.75rem] text-smoke font-mono">
              <span className="text-[10px] opacity-75">⚙</span> {car.Transmission}
            </span>
          )}
          {car.location && (
            <span className="flex items-center gap-1 text-[0.75rem] text-orange-brand font-semibold font-mono ml-auto">
              <span className="text-[10px]">📍</span> {car.location.split(',')[0]}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
