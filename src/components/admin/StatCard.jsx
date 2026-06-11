import { cx } from '../../utils/helpers';

export default function StatCard({ icon, label, value, sub, accent = false }) {
  return (
    <div className={cx(
      "bg-ink-2 border border-ink-4 rounded-lg px-6 py-[1.4rem] transition-colors duration-300 hover:border-ink-5",
      accent ? "border-gold-dark bg-gradient-to-br from-ink-2 to-gold-glow" : ""
    )}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[1rem] text-gold">{icon}</span>
        <span className="font-mono text-[0.7rem] tracking-widest uppercase text-smoke">{label}</span>
      </div>
      <div className="font-display text-[2rem] font-medium text-white leading-none mb-[0.35rem]">{value}</div>
      {sub && <div className="text-[0.75rem] text-smoke">{sub}</div>}
    </div>
  );
}
