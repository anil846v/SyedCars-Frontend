import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { adminCarsApi, enquiriesApi, commissionsApi, getMediaUrl } from '../../utils/api';
import { formatINR, formatCompact } from '../../utils/helpers';
import StatCard from '../../components/admin/StatCard';
import Badge from '../../components/ui/Badge';
import Loader from '../../components/ui/Loader';
import { Car, MessageSquare, DollarSign, TrendingUp, Handshake, ArrowRight } from 'lucide-react';

const statusVariant = (s) => {
  const m = { AVAILABLE: 'green', SOLD: 'gray', RESERVED: 'blue', BOOKED: 'blue', ON_HOLD: 'gray' };
  return m[s] || 'gray';
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [cars,        setCars]        = useState([]);
  const [enquiries,   setEnquiries]   = useState([]);
  const [topCars,     setTopCars]     = useState([]);
  const [commSummary, setCommSummary] = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [isMobile,    setIsMobile]    = useState(() => window.innerWidth < 768);
  const [stats, setStats] = useState({
    totalCars: 0, activeCars: 0,
    totalEnquiries: 0,
    pendingComm: 0, totalRevenue: 0, totalDeals: 0,
  });

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [carsRes, activeCarsRes, enqRes, commRes, topCarsRes] = await Promise.allSettled([
          adminCarsApi.list({ limit: 6 }),
          adminCarsApi.list({ limit: 1, is_active: 1 }),
          enquiriesApi.list({ limit: 5 }),
          commissionsApi.summary(),
          enquiriesApi.topCars({ limit: 5 }),
        ]);

        if (carsRes.status === 'fulfilled') {
          // API wraps result: { success, data: { cars, pagination } }
          const d = carsRes.value?.data;
          const carList = d?.cars ?? [];
          setCars(carList);
          setStats(s => ({
            ...s,
            totalCars: d?.pagination?.total ?? carList.length,
          }));
        }
        if (activeCarsRes.status === 'fulfilled') {
          const d = activeCarsRes.value?.data;
          setStats(s => ({ ...s, activeCars: d?.pagination?.total ?? 0 }));
        }

        if (enqRes.status === 'fulfilled') {
          const d = enqRes.value?.data;
          const enqList = d?.enquiries ?? [];
          setEnquiries(enqList);
          setStats(s => ({
            ...s,
            totalEnquiries: d?.pagination?.total ?? enqList.length,
          }));
        }

        if (topCarsRes.status === 'fulfilled') {
          setTopCars(topCarsRes.value?.data ?? []);
        }

        if (commRes.status === 'fulfilled') {
          // API: { success, data: { total_commission_due, total_commission_paid,
          //   total_commission_pending, total_deals, seller:{due,paid,pending}, buyer:{due,paid,pending} } }
          const d = commRes.value?.data ?? commRes.value;
          setCommSummary(d);
          setStats(s => ({
            ...s,
            pendingComm:  d?.total_commission_pending ?? 0,
            totalRevenue: d?.total_commission_paid    ?? 0,
            totalDeals:   d?.total_deals              ?? 0,
          }));
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const STAT_CARDS = [
    { icon: Car,          label: 'Total Cars',          value: loading ? '…' : stats.totalCars,                    sub: `${stats.activeCars} active`,     color: 'orange'  },
    { icon: MessageSquare, label: 'Enquiries',          value: loading ? '…' : stats.totalEnquiries,               sub: 'All time',                       color: 'blue'    },
    { icon: DollarSign,   label: 'Pending Commission',  value: loading ? '…' : formatINR(stats.pendingComm),       sub: 'Awaiting payment',               color: 'gold'    },
    { icon: TrendingUp,   label: 'Revenue Collected',   value: loading ? '…' : formatCompact(stats.totalRevenue),  sub: 'Commissions paid',               color: 'emerald' },
    { icon: Handshake,    label: 'Total Deals',         value: loading ? '…' : (stats.totalDeals || '—'),          sub: 'Commission records',             color: 'purple'  },
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div style={{ padding: isMobile ? '16px 14px 56px' : '28px 28px 56px', maxWidth: 1400, margin: '0 auto' }}>
    

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(180px, 1fr))', gap: isMobile ? 10 : 14, marginBottom: isMobile ? 16 : 28 }}>
        {STAT_CARDS.map(sc => (
          <StatCard key={sc.label} icon={sc.icon} label={sc.label} value={sc.value} sub={sc.sub} color={sc.color} />
        ))}
      </div>

      {/* Two columns — stack on mobile */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 12 : 16, marginBottom: isMobile ? 12 : 16 }}>
        {/* Recent Listings */}
        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid #F3F4F6' }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.1rem', color: '#111', fontWeight: 500 }}>Recent Listings</h2>
            <Link to="/admin/cars" style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.78rem', color: '#FF5A09', fontFamily: "'Space Mono',monospace" }}>
              View all <ArrowRight size={12} />
            </Link>
          </div>
          {cars.length === 0 ? (
            <div style={{ padding: 20, color: '#9CA3AF', fontSize: '0.875rem' }}>No cars yet.</div>
          ) : (
            <div>
              {cars.map(car => {
                const photoUrl = getMediaUrl(car.media?.[0]?.image_url);
                return (
                  <div key={car.id} onClick={() => navigate(`/admin/cars?view=${car.id}`)} style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 10 : 12, padding: isMobile ? '10px 14px' : '12px 20px', borderBottom: '1px solid #F3F4F6', transition: 'background 0.15s', cursor: 'pointer' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,90,9,0.03)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    {photoUrl ? (
                      <img
                        src={photoUrl}
                        alt={car.brand_name}
                        style={{ width: isMobile ? 52 : 64, height: isMobile ? 38 : 46, objectFit: 'cover', borderRadius: 8, flexShrink: 0, background: '#F3F4F6' }}
                        onError={e => { e.currentTarget.style.display = 'none'; e.currentTarget.nextSibling.style.display = 'flex'; }}
                      />
                    ) : null}
                    <div style={{
                      width: isMobile ? 52 : 64, height: isMobile ? 38 : 46, background: '#F3F4F6', borderRadius: 8, flexShrink: 0,
                      display: photoUrl ? 'none' : 'flex',
                      alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', color: '#9CA3AF',
                    }}>
                      No photo
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: isMobile ? '0.8rem' : '0.875rem', color: '#111', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {car.brand_name} {car.Model}
                      </p>
                      <p style={{ fontSize: '0.68rem', color: '#6B7280', fontFamily: "'Space Mono',monospace", marginTop: 2 }}>
                        {car.manufacturing_year}{car.fuel_type ? ` · ${car.fuel_type}` : ''}
                      </p>
                      {isMobile && (
                        <p style={{ fontSize: '0.78rem', color: '#FF5A09', fontWeight: 600, marginTop: 2 }}>{formatINR(car.asking_price)}</p>
                      )}
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      {!isMobile && <p style={{ fontSize: '0.875rem', color: '#FF5A09', fontWeight: 600, marginBottom: 4 }}>{formatINR(car.asking_price)}</p>}
                      <Badge variant={statusVariant(car.status)}>{car.status || (car.is_active ? 'Active' : 'Hidden')}</Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Enquiries */}
        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid #F3F4F6' }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.1rem', color: '#111', fontWeight: 500 }}>Recent Enquiries</h2>
            <Link to="/admin/enquiries" style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.78rem', color: '#3B82F6', fontFamily: "'Space Mono',monospace" }}>
              View all <ArrowRight size={12} />
            </Link>
          </div>
          {enquiries.length === 0 ? (
            <div style={{ padding: 20, color: '#9CA3AF', fontSize: '0.875rem' }}>No enquiries yet.</div>
          ) : (
            <div>
              {enquiries.map(enq => (
                <div key={enq.id} onClick={() => navigate(`/admin/enquiries?view=${enq.id}`)} style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 10 : 12, padding: isMobile ? '10px 14px' : '12px 20px', borderBottom: '1px solid #F3F4F6', transition: 'background 0.15s', cursor: 'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(59,130,246,0.03)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{
                    width: isMobile ? 32 : 36, height: isMobile ? 32 : 36, borderRadius: '50%',
                    background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)',
                    color: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: isMobile ? '0.78rem' : '0.84rem', fontWeight: 700, flexShrink: 0,
                  }}>
                    {enq.name?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: isMobile ? '0.8rem' : '0.875rem', color: '#111', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{enq.name || 'Anonymous'}</p>
                    <p style={{ fontSize: '0.68rem', color: '#6B7280', fontFamily: "'Space Mono',monospace", marginTop: 2 }}>{enq.phone}</p>
                  </div>
                  <span style={{ fontSize: '0.65rem', color: '#9CA3AF', fontFamily: "'Space Mono',monospace", flexShrink: 0 }}>
                    {enq.created_at ? new Date(enq.created_at).toLocaleDateString('en-IN', isMobile ? { day:'numeric', month:'short' } : undefined) : '—'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom row: Most Enquired Cars + Commission Summary — stack on mobile */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 12 : 16 }}>
        {/* Most Enquired Cars */}
        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid #F3F4F6' }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.1rem', color: '#111', fontWeight: 500 }}>Most Enquired Cars</h2>
            <Link to="/admin/enquiries" style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.78rem', color: '#FF5A09', fontFamily: "'Space Mono',monospace" }}>
              All enquiries <ArrowRight size={12} />
            </Link>
          </div>
          {topCars.length === 0 ? (
            <div style={{ padding: 20, color: '#9CA3AF', fontSize: '0.875rem' }}>No enquiry data yet.</div>
          ) : (
            <div>
              {topCars.map((item, idx) => (
                <div key={item.car_id} onClick={() => navigate(`/admin/enquiries?car_id=${item.car_id}`)} style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 10 : 12, padding: isMobile ? '10px 14px' : '11px 20px', borderBottom: '1px solid #F9FAFB', transition: 'background 0.15s', cursor: 'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,90,9,0.03)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  {/* Rank badge */}
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                    background: idx === 0 ? '#FEF3C7' : idx === 1 ? '#F3F4F6' : '#F9FAFB',
                    border: `1px solid ${idx === 0 ? '#FDE68A' : '#E5E7EB'}`,
                    color: idx === 0 ? '#D97706' : '#6B7280',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.7rem', fontFamily: "'Space Mono',monospace", fontWeight: 700,
                  }}>
                    #{idx + 1}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '0.875rem', color: '#111', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.car ? `${item.car.brand_name} ${item.car.Model}` : `Car #${item.car_id}`}
                    </p>
                    {item.car?.asking_price && (
                      <p style={{ fontSize: '0.72rem', color: '#9CA3AF', fontFamily: "'Space Mono',monospace" }}>
                        {formatINR(item.car.asking_price)}
                      </p>
                    )}
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <span style={{ display: 'inline-block', background: 'rgba(255,90,9,0.08)', color: '#FF5A09', borderRadius: 20, padding: '2px 10px', fontSize: '0.78rem', fontWeight: 700, fontFamily: "'Space Mono',monospace" }}>
                      {item.enquiry_count} {item.enquiry_count === 1 ? 'enq' : 'enqs'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Commission Summary */}
        {commSummary ? (
          <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 14, padding: isMobile ? 14 : 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.1rem', color: '#111', fontWeight: 500 }}>Commission Summary</h2>
              <Link to="/admin/commissions" style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.78rem', color: '#10B981', fontFamily: "'Space Mono',monospace" }}>
                Manage <ArrowRight size={12} />
              </Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: isMobile ? 8 : 10 }}>
              {[
                { label: 'Due (Seller)',  value: formatINR(commSummary.seller?.due   ?? 0), color: '#D97706', bg: '#FFFBEB', border: '#FDE68A' },
                { label: 'Due (Buyer)',   value: formatINR(commSummary.buyer?.due    ?? 0), color: '#7C3AED', bg: '#F5F3FF', border: '#DDD6FE' },
                { label: 'Collected',     value: formatINR(commSummary.total_commission_paid   ?? 0), color: '#059669', bg: '#ECFDF5', border: '#A7F3D0' },
                { label: 'Outstanding',   value: formatINR(commSummary.total_commission_pending ?? 0), color: '#DC2626', bg: '#FEF2F2', border: '#FEE2E2' },
              ].map(item => (
                <div key={item.label} style={{ background: item.bg, border: `1px solid ${item.border}`, borderRadius: 10, padding: '14px 16px' }}>
                  <p style={{ fontSize: '0.68rem', fontFamily: "'Space Mono',monospace", textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6B7280', marginBottom: 6 }}>{item.label}</p>
                  <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.35rem', fontWeight: 600, color: item.color }}>{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        ) : <div />}
      </div>
    </div>
  );
}
