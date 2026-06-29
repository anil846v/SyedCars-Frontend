import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { carsApi } from '../utils/api';
import CarCard from '../components/cars/CarCard';
import CarFilters from '../components/cars/CarFilters';
import Loader from '../components/ui/Loader';
import hero from '../assets/hero.png';
import { ChevronLeft, ChevronRight, SlidersHorizontal, X ,ShieldCheck,CheckCircle2} from 'lucide-react';
import SEO from '../components/SEO'


const ORANGE = '#E8631A';
const LIME = '#2a9a2c';

const Eyebrow = ({ children }) => (
  <p style={{ display: 'flex', alignItems: 'center', gap: 12, color: ORANGE, fontSize: 11, fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase', margin: '0 0 16px' }}>
    {children}
    <span style={{ display: 'inline-block', height: 1.5, width: 40, background: ORANGE }} />
  </p>
);

const Underline = () => (
  <>
    <div style={{ width: 36, height: 3, background: ORANGE, borderRadius: 2, marginBottom: 4 }} />
    <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: ORANGE, marginBottom: 20 }} />
  </>
);



export default function CarsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState(() => {
    const params = {};
    for (const [k, v] of searchParams.entries()) params[k] = v;
    return params;
  });
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    const params = {};
    for (const [k, v] of searchParams.entries()) params[k] = v;
    setFilters(params);
  }, [searchParams]);

  const fetchCars = useCallback(async (p, f, append = false) => {
    if (append) setLoadingMore(true); else { setLoading(true); setError(''); }
    try {
      const res = await carsApi.list({ page: p, limit: 12, ...f });
      const d = res?.data;
      setCars(prev => append ? [...prev, ...(d?.cars ?? [])] : (d?.cars ?? []));
      setTotal(d?.pagination?.total ?? 0);
      setTotalPages(d?.pagination?.totalPages ?? 1);
      setPage(p);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false); setLoadingMore(false);
    }
  }, []);

  // Reload page 1 whenever filters change
  useEffect(() => { fetchCars(1, filters); }, [filters, fetchCars]);

  const load = (p) => fetchCars(p, filters);
  const loadMore = () => fetchCars(page + 1, filters, true);

  const applyFilters = (f) => {
    const p = {};
    Object.entries(f).forEach(([k, v]) => { if (v) p[k] = v; });
    setSearchParams(p);
  };

  return (
    <section style={{ background: '#F8F9FA', minHeight: '100vh' }}>
      <SEO
  title="Browse Syed Cars"
  description="Explore Syed Cars' collection of premium pre-owned vehicles. Filter by brand, budget, and fuel type to find your perfect car — all inspected and quality assured."
  keywords="Best used cars for sale Madanapalle, pre-owned cars listing, buy second hand car in Madanapalle, affordable used cars, inspected used cars, browse cars Syed Cars"
  url="https://syedcars.com/cars"
/>
    

      {/* ── Rest of the page (Filters + Cars) ── */}
      <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
        {/* Count bar + mobile filter button */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, gap: 12 }}>
          <p style={{ color: '#070808', fontSize: '0.95rem', margin: 0 }}>
            {loading ? 'Loading inventory…' : total > 0 ? `${total} cars available` : 'No cars found'}
          </p>
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="mobile-filter-btn"
            style={{
              display: 'none', alignItems: 'center', gap: 8,
              padding: '8px 16px', background: '#fff', color: '#111',
              border: '1px solid #E5E7EB', borderRadius: 8, fontSize: '0.875rem',
              fontWeight: 500, cursor: 'pointer', position: 'relative',
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            }}
          >
            <SlidersHorizontal size={15} color={ORANGE} />
            Filters
            {Object.keys(filters).length > 0 && (
              <span style={{
                position: 'absolute', top: -6, right: -6,
                background: ORANGE, color: '#fff',
                borderRadius: '50%', width: 18, height: 18,
                fontSize: '0.65rem', fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {Object.keys(filters).length}
              </span>
            )}
          </button>
        </div>

        {/* Mobile filter drawer */}
        {mobileFilterOpen && (
          <>
            <div
              onClick={() => setMobileFilterOpen(false)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 998, backdropFilter: 'blur(2px)' }}
            />
            <div style={{
              position: 'fixed', top: 0, left: 0, bottom: 0, width: 300,
              background: '#fff', zIndex: 999, overflowY: 'auto',
              boxShadow: '4px 0 24px rgba(0,0,0,0.15)',
              padding: '0 0 32px',
            }}>
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '18px 20px', borderBottom: '1px solid #F3F4F6', marginBottom: 4,
              }}>
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: '#111' }}>Filters</h3>
                <button onClick={() => setMobileFilterOpen(false)} style={{
                  width: 32, height: 32, borderRadius: 8, border: '1px solid #E5E7EB',
                  background: '#F9FAFB', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                }}>
                  <X size={15} color="#6B7280" />
                </button>
              </div>
              <div style={{ padding: '0 20px' }}>
                <CarFilters
                  onFilter={(f) => { applyFilters(f); setMobileFilterOpen(false); }}
                  initialFilters={filters}
                />
              </div>
            </div>
          </>
        )}

        <div style={{ display: 'flex', gap: 28, alignItems: 'flex-start' }}>
          {/* Sidebar filters — desktop only */}
          <aside style={{ width: 260, flexShrink: 0, background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, padding: 20, position: 'sticky', top: 88 }} className="cars-sidebar">
            <CarFilters onFilter={applyFilters} initialFilters={filters} />
          </aside>

          {/* Main area */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {error && (
              <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '10px 16px', color: '#EF4444', fontSize: '0.875rem', marginBottom: 20 }}>
                {error}
              </div>
            )}

            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
                <Loader size="lg" />
              </div>
            ) : cars.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 0' }}>
                <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '1.75rem', color: '#374151', marginBottom: 8 }}>No cars found</p>
                <p style={{ color: '#9CA3AF', fontSize: '0.875rem' }}>Try adjusting your filters.</p>
              </div>
            ) : (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
                  {cars.map(car => <CarCard key={car.id} car={car} />)}
                </div>

                {/* Load More */}
                {page < totalPages && (
                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: 40 }}>
                    <button
                      onClick={loadMore}
                      disabled={loadingMore}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 8,
                        padding: '12px 32px',
                        background: loadingMore ? '#fdba74' : '#FF5A09',
                        color: '#fff', border: 'none', borderRadius: 10,
                        fontSize: '0.9rem', fontWeight: 600, cursor: loadingMore ? 'not-allowed' : 'pointer',
                        boxShadow: '0 4px 16px rgba(255,90,9,0.25)', transition: 'all 0.2s',
                      }}
                    >
                      {loadingMore ? 'Loading…' : `Load More  (${cars.length} of ${total})`}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .cars-sidebar { display: none !important; }
          .mobile-filter-btn { display: flex !important; }
          .hero-grid { grid-template-columns: 1fr !important; gap: 12px !important; }
          .hero-grid > div:last-child { min-height: 260px !important; }
        }
        @media (max-width: 600px) {
          .hero-grid > div:last-child { min-height: 200px !important; }
        }
      `}</style>
    </section>
  );
}