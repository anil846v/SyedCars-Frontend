import { cx } from '../../utils/helpers';

export default function Button({
  children,
  variant = 'primary',   // primary | secondary | ghost | danger | gold
  size = 'md',           // sm | md | lg
  fullWidth = false,
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  className = '',
  ...props
}) {
  return (
    <button
      type={type}
      className={cx(
        "inline-flex items-center justify-center gap-2 font-body font-medium tracking-wide rounded-sm transition-all duration-300 relative overflow-hidden whitespace-nowrap border border-transparent disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none before:content-[''] before:absolute before:inset-0 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300 cursor-pointer",
        variant === 'primary' && "bg-gold text-ink font-semibold hover:shadow-gold hover:-translate-y-[1px] before:bg-true-white/10",
        variant === 'secondary' && "bg-ink-4 text-white border-ink-5 hover:border-gold hover:text-gold before:bg-true-white/[0.04]",
        variant === 'ghost' && "bg-transparent text-mist border-ink-5 hover:text-white hover:border-smoke hover:bg-ink-3",
        variant === 'gold' && "bg-transparent text-gold border-gold hover:bg-gold-glow",
        variant === 'danger' && "bg-crimson text-true-white hover:opacity-85",
        size === 'sm' && "px-4 py-[0.4rem] text-[0.8rem]",
        size === 'md' && "px-6 py-[0.65rem] text-[0.9rem]",
        size === 'lg' && "px-8 py-[0.85rem] text-base tracking-[0.05em]",
        fullWidth && "w-full",
        className
      )}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && (
        <span className="absolute w-4 h-4 border-2 border-true-white/30 border-t-current rounded-full animate-spin" aria-hidden="true" />
      )}
      <span className={cx("inline-flex items-center gap-2 transition-opacity", loading ? "opacity-0" : "opacity-100")}>
        {children}
      </span>
    </button>
  );
}
