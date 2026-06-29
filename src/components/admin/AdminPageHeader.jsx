export default function AdminPageHeader({ title, sub, action }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20, marginBottom: 24, flexWrap: 'wrap' }}>
      <div>
        <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '1.65rem', color: '#111', fontWeight: 400, lineHeight: 1.2 }}>{title}</h1>
        {sub && <p style={{ fontSize: '0.875rem', color: '#1d1d1e', marginTop: 4 }}>{sub}</p>}
      </div>
      {action && <div style={{ flexShrink: 0 }}>{action}</div>}
    </div>
  );
}

