import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { carsApi } from '../../utils/api';
import CarCard from '../cars/CarCard';
import Loader from '../ui/Loader';

export default function FeaturedCars() {
  const [cars,    setCars]    = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carsApi.list({ limit: 6 })
      .then(res => setCars(res?.data?.cars ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="section bg-ink">
      <div className="container">
        <div className="flex items-end justify-between gap-4 mb-10 flex-wrap">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-gold mb-2">Featured</p>
            <h2 className="font-display text-4xl md:text-5xl text-white font-normal">Latest Listings</h2>
          </div>
          <Link to="/cars" className="text-sm text-smoke font-mono hover:text-gold transition-colors">Browse all ➔</Link>
        </div>
        {loading ? (
          <div className="flex justify-center py-16"><Loader size="lg" /></div>
        ) : cars.length === 0 ? (
          <p className="text-center text-smoke py-16">No listings available yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {cars.map(car => <CarCard key={car.id} car={car} />)}
          </div>
        )}
      </div>
    </section>
  );
}
