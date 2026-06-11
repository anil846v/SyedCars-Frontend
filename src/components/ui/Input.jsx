import { cx } from '../../utils/helpers';

export default function Input({
  label,
  error,
  hint,
  prefix,
  suffix,
  className = '',
  ...props
}) {
  return (
    <div className={cx("flex flex-col gap-[0.35rem]", className)}>
      {label && <label className="text-[0.82rem] font-medium text-mist tracking-wide">{label}</label>}
      <div className={cx(
        "flex items-center bg-ink-3 border border-ink-5 rounded-md transition-all duration-150 focus-within:border-gold-dark focus-within:shadow-[0_0_0_3px_var(--gold-glow)]",
        error ? "border-crimson focus-within:border-crimson focus-within:shadow-[0_0_0_3px_rgba(214,69,69,0.15)]" : ""
      )}>
        {prefix && <span className="px-3 text-smoke text-[0.85rem] shrink-0">{prefix}</span>}
        <input className="flex-1 px-[0.85rem] py-[0.65rem] bg-transparent border-none outline-none text-white text-[0.9rem] leading-relaxed placeholder:text-smoke" {...props} />
        {suffix && <span className="px-3 text-smoke text-[0.85rem] shrink-0">{suffix}</span>}
      </div>
      {error && <p className="text-[0.78rem] text-crimson">{error}</p>}
      {hint && !error && <p className="text-[0.78rem] text-smoke">{hint}</p>}
    </div>
  );
}
