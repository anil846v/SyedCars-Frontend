import { cx } from '../../utils/helpers';

export default function Badge({ children, variant = 'default' }) {
  return (
    <span className={cx(
      "inline-flex items-center gap-1 px-[0.6rem] py-[0.2rem] rounded-full text-[0.72rem] font-semibold tracking-wider uppercase font-mono",
      variant === 'default' && "bg-ink-4 text-mist",
      variant === 'gold' && "bg-gold-glow text-gold border border-gold-dark",
      variant === 'green' && "bg-emerald/12 text-emerald border border-emerald/30",
      variant === 'red' && "bg-crimson/12 text-crimson border border-crimson/30",
      variant === 'blue' && "bg-sky/12 text-sky border border-sky/30",
      variant === 'orange' && "bg-orange-brand/12 text-orange-brand border border-orange-brand/30",
      variant === 'smoke' && "bg-transparent text-smoke border border-ink-5"
    )}>
      {children}
    </span>
  );
}
