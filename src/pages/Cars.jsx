import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { carsApi } from '../utils/api';
import { cx } from '../utils/helpers';
import CarCard from '../components/cars/CarCard';
import CarFilters from '../components/cars/CarFilters';
import Loader from '../components/ui/Loader';

export default function CarsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [cars,       setCars]       = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState('');
  const [page,       setPage]       = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total,      setTotal]      = useState(0);
  const [filters,    setFilters]    = useState({});

  // Synchronize URL search parameters with filters state
  useEffect(() => {
    const params = {};
    for (const [key, value] of searchParams.entries()) {
      params[key] = value;
    }
    setFilters(params);
  }, [searchParams]);

  const load = useCallback(async (p = 1, f = filters) => {
    setLoading(true);
    setError('');
    try {
      const params = { page: p, limit: 12, ...f };
      const res = await carsApi.list(params);
      const d   = res?.data;
      setCars(d?.cars ?? []);
      setTotal(d?.pagination?.total ?? 0);
      setTotalPages(d?.pagination?.totalPages ?? 1);
      setPage(p);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { load(1, filters); }, [filters]);

  const applyFilters = (f) => {
    const newParams = {};
    Object.entries(f).forEach(([key, value]) => {
      if (value) newParams[key] = value;
    });
    setSearchParams(newParams);
  };


  return (
    <section className="section bg-ink">
      <div className="container">
        <div className="mb-8">
          <h1 className="font-display text-4xl md:text-5xl text-white font-normal mb-2">Browse Inventory</h1>
          <p className="text-smoke">{total > 0 ? `${total} premium cars available` : 'Loading inventory…'}</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-[280px] shrink-0">
            <CarFilters onFilter={applyFilters} initialFilters={filters} />
          </aside>

          <div className="flex-1">
            {error && (
              <div className="bg-crimson/10 border border-crimson/30 rounded-md px-4 py-3 text-crimson text-sm mb-6">{error}</div>
            )}
            {loading ? (
              <div className="flex justify-center py-20"><Loader size="lg" /></div>
            ) : cars.length === 0 ? (
              <div className="text-center py-20">
                <p className="font-display text-2xl text-mist mb-3">No cars found</p>
                <p className="text-smoke text-sm">Try adjusting your filters.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {cars.map(car => <CarCard key={car.id} car={car} />)}
                </div>
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-10">
                    <button 
                      disabled={page === 1} 
                      onClick={() => load(page - 1)}
                      className="w-9 h-9 flex items-center justify-center bg-ink-2 border border-ink-4 rounded-md text-sm text-smoke hover:text-white hover:border-ink-5 disabled:opacity-30 transition-colors cursor-pointer"
                    >
                      ‹
                    </button>
                    {[...Array(totalPages)].map((_, idx) => {
                      const p = idx + 1;
                      return (
                        <button
                          key={p}
                          onClick={() => load(p)}
                          className={cx(
                            "w-9 h-9 flex items-center justify-center rounded-md text-sm font-mono transition-all cursor-pointer border",
                            p === page
                              ? "bg-orange-brand border-orange-brand text-true-white font-bold shadow-[0_2px_8px_rgba(231,94,22,0.25)]"
                              : "bg-ink-2 border-ink-4 text-smoke hover:text-white hover:border-ink-5"
                          )}
                        >
                          {p}
                        </button>
                      );
                    })}
                    <button 
                      disabled={page === totalPages} 
                      onClick={() => load(page + 1)}
                      className="w-9 h-9 flex items-center justify-center bg-ink-2 border border-ink-4 rounded-md text-sm text-smoke hover:text-white hover:border-ink-5 disabled:opacity-30 transition-colors cursor-pointer"
                    >
                      ›
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
