const VARIANT_MAP = {
  green:  'sc-badge-green',
  orange: 'sc-badge-orange',
  blue:   'sc-badge-blue',
  red:    'sc-badge-red',
  gray:   'sc-badge-gray',
  smoke:  'sc-badge-gray',   // alias
  purple: 'sc-badge-purple',
  gold:   'sc-badge-gold',
};

export default function Badge({ variant = 'gray', children, style }) {
  const cls = VARIANT_MAP[variant] || 'sc-badge-gray';
  return (
    <span className={`sc-badge ${cls}`} style={style}>
      {children}
    </span>
  );
}
