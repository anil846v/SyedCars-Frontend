import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminCarsApi, enquiriesApi, commissionsApi } from '../../utils/api';
import { formatINR, formatCompact } from '../../utils/helpers';
import StatCard from '../../components/admin/StatCard';
import Badge from '../../components/ui/Badge';

const statusVariant = (s) => {
  const m = { AVAILABLE:'green', SOLD:'smoke', RESERVED:'blue', BOOKED:'blue', ON_HOLD:'smoke', UNDER_INSPECTION:'smoke', REMOVED:'red' };
  return m[s] || 'smoke';
};

export default function AdminDashboard() {
  const [cars,       setCars]       = useState([]);
  const [enquiries,  setEnquiries]  = useState([]);
  const [commSummary,setCommSummary]= useState(null);
  const [loading,    setLoading]    = useState(true);
  const [stats,      setStats]      = useState({ totalCars:0, activeCars:0, totalEnquiries:0, pendingComm:0, totalRevenue:0 });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [carsRes, enqRes, commRes] = await Promise.allSettled([
          adminCarsApi.list({ limit: 6 }),
          enquiriesApi.list({ limit: 5 }),
          commissionsApi.summary(),
        ]);

        if (carsRes.status === 'fulfilled') {
          const d = carsRes.value?.data;
          setCars(d?.cars ?? []);
          setStats(s => ({
            ...s,
            totalCars: d?.pagination?.total ?? d?.cars?.length ?? 0,
            activeCars: (d?.cars ?? []).filter(c => c.is_active).length,
          }));
        }
        if (enqRes.status === 'fulfilled') {
          const d = enqRes.value?.data;
          setEnquiries(d?.enquiries ?? []);
          setStats(s => ({ ...s, totalEnquiries: d?.pagination?.total ?? d?.enquiries?.length ?? 0 }));
        }
        if (commRes.status === 'fulfilled') {
          const d = commRes.value?.data ?? commRes.value;
          setCommSummary(d);
          setStats(s => ({
            ...s,
            pendingComm: d?.pending_count ?? 0,
            totalRevenue: (d?.total_seller_paid ?? 0) + (d?.total_buyer_paid ?? 0),
          }));
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="p-8 pb-12 flex flex-col gap-8 max-[480px]:p-5">
      {/* Top Bar */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-[1.75rem] font-normal text-white">Dashboard</h1>
          <p className="text-[0.875rem] text-smoke mt-[0.2rem]">Here's your business overview.</p>
        </div>
        <div className="text-right">
          <span className="font-mono text-[0.65rem] uppercase tracking-widest text-smoke block">Today</span>
          <span className="text-[0.875rem] text-mist">{new Date().toLocaleDateString('en-IN', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
        <StatCard icon="⊞" label="Total Cars"          value={loading ? '…' : stats.totalCars}        sub={`${stats.activeCars} active`} accent />
        <StatCard icon="◎" label="Enquiries"            value={loading ? '…' : stats.totalEnquiries}   sub="All time" />
        <StatCard icon="◇" label="Pending Commissions"  value={loading ? '…' : stats.pendingComm}      sub="Awaiting payment" />
        <StatCard icon="₹" label="Revenue Collected"    value={loading ? '…' : formatCompact(stats.totalRevenue)} sub="Commissions" />
        <StatCard icon="◉" label="Total Sellers"        value={loading ? '…' : (commSummary?.owner_count ?? '—')} sub="Registered owners" />
      </div>

      {/* Two column */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Cars as cards */}
        <div className="bg-ink-2 border border-ink-4 rounded-lg overflow-hidden">
          <div className="flex items-center justify-between px-5 py-[1.1rem] border-b border-ink-4">
            <h2 className="font-display text-[1.1rem] font-medium text-white">Recent Listings</h2>
            <Link to="/admin/cars" className="text-[0.78rem] text-gold font-mono hover:opacity-75 transition-opacity">View all →</Link>
          </div>
          {loading ? (
            <div className="p-6 text-smoke text-sm">Loading…</div>
          ) : cars.length === 0 ? (
            <div className="p-6 text-smoke text-sm">No cars yet.</div>
          ) : (
            <div className="divide-y divide-ink-4">
              {cars.map(car => (
                <div key={car.id} className="flex items-center gap-4 px-5 py-3 hover:bg-ink-3 transition-colors">
                  {car.media?.[0]?.image_url ? (
                    <img src={car.media[0].image_url} alt={car.brand_name} className="w-14 h-10 object-cover rounded-sm shrink-0 bg-ink-3" />
                  ) : (
                    <div className="w-14 h-10 bg-ink-3 rounded-sm shrink-0 flex items-center justify-center text-smoke text-xs">No img</div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{car.brand_name} {car.Model}</p>
                    <p className="text-smoke text-xs font-mono">{car.manufacturing_year} · {car.fuel_type}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-gold text-sm">{formatINR(car.asking_price)}</p>
                    <Badge variant={statusVariant(car.status)} className="text-[0.65rem] mt-[2px]">{car.status || (car.is_active ? 'Active' : 'Hidden')}</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Enquiries */}
        <div className="bg-ink-2 border border-ink-4 rounded-lg overflow-hidden">
          <div className="flex items-center justify-between px-5 py-[1.1rem] border-b border-ink-4">
            <h2 className="font-display text-[1.1rem] font-medium text-white">Recent Enquiries</h2>
            <Link to="/admin/enquiries" className="text-[0.78rem] text-gold font-mono hover:opacity-75 transition-opacity">View all →</Link>
          </div>
          {loading ? (
            <div className="p-6 text-smoke text-sm">Loading…</div>
          ) : enquiries.length === 0 ? (
            <div className="p-6 text-smoke text-sm">No enquiries yet.</div>
          ) : (
            <div className="divide-y divide-ink-4">
              {enquiries.map(enq => (
                <div key={enq.id} className="flex items-center gap-4 px-5 py-3 hover:bg-ink-3 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-ink-4 flex items-center justify-center text-gold text-sm shrink-0">
                    {enq.name?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium">{enq.name || 'Anonymous'}</p>
                    <p className="text-smoke text-xs font-mono">{enq.phone}</p>
                  </div>
                  <span className="text-smoke text-xs font-mono shrink-0">
                    {enq.created_at ? new Date(enq.created_at).toLocaleDateString('en-IN') : '—'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Commission Summary */}
      {commSummary && (
        <div className="bg-ink-2 border border-ink-4 rounded-lg p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-[1.1rem] font-medium text-white">Commission Summary</h2>
            <Link to="/admin/commissions" className="text-[0.78rem] text-gold font-mono hover:opacity-75 transition-opacity">Manage →</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Total Due (Seller)', value: formatINR(commSummary.total_seller_commission) },
              { label: 'Total Due (Buyer)',  value: formatINR(commSummary.total_buyer_commission) },
              { label: 'Collected',          value: formatINR((commSummary.total_seller_paid||0) + (commSummary.total_buyer_paid||0)), gold: true },
              { label: 'Outstanding',        value: formatINR((commSummary.total_seller_commission||0) + (commSummary.total_buyer_commission||0) - (commSummary.total_seller_paid||0) - (commSummary.total_buyer_paid||0)), crimson: true },
            ].map(item => (
              <div key={item.label} className="bg-ink-3 rounded-md p-4">
                <p className="text-smoke text-xs font-mono uppercase tracking-wide mb-1">{item.label}</p>
                <p className={`text-lg font-display font-medium ${item.gold ? 'text-gold' : item.crimson ? 'text-crimson' : 'text-white'}`}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
