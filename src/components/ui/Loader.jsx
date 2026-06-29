export default function Loader({ size = 'md' }) {
  const s = size === 'lg' ? 48 : size === 'sm' ? 20 : 32;
  return (
    <div style={{
      width: s, height: s,
      border: `3px solid rgba(255,90,9,0.2)`,
      borderTopColor: '#FF5A09',
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite',
    }} />
  );
}
