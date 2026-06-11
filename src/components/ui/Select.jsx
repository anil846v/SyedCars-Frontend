import { cx } from '../../utils/helpers';

export default function Select({ label, options = [], error, className = '', ...props }) {
  return (
    <div className={cx("flex flex-col gap-[0.35rem]", className)}>
      {label && <label className="text-[0.82rem] font-medium text-mist tracking-wide">{label}</label>}
      <div className={cx(
        "relative bg-ink-3 border border-ink-5 rounded-md transition-all duration-150 focus-within:border-gold-dark focus-within:shadow-[0_0_0_3px_rgba(200,169,110,0.15)]",
        error ? "border-crimson focus-within:border-crimson focus-within:shadow-[0_0_0_3px_rgba(214,69,69,0.15)]" : ""
      )}>
        <select className="w-full pl-[0.85rem] pr-10 py-[0.65rem] bg-transparent border-none outline-none text-white text-[0.9rem] appearance-none cursor-pointer [&>option]:bg-ink-3 [&>option]:text-white" {...props}>
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-smoke text-[0.85rem]">▾</span>
      </div>
      {error && <p className="text-[0.78rem] text-crimson">{error}</p>}
    </div>
  );
}
