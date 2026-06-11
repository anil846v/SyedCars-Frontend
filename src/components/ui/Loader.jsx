import { cx } from '../../utils/helpers';

export default function Loader({ size = 'md' }) {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-9 h-9',
    lg: 'w-14 h-14',
  };

  const ringClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-9 h-9 border-2',
    lg: 'w-14 h-14 border-[3px]',
  };

  return (
    <div className={cx("inline-flex items-center justify-center relative", sizeClasses[size])} role="status" aria-label="Loading">
      <div className={cx("absolute rounded-full border-transparent border-t-gold animate-[spin_0.8s_linear_infinite]", ringClasses[size])} />
      <div className={cx("absolute rounded-full border-transparent border-r-gold-dark opacity-50 animate-[spin_1.2s_linear_infinite_reverse]", ringClasses[size])} />
    </div>
  );
}
