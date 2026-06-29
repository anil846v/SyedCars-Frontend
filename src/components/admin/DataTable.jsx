const ORANGE = '#FF5A09';

export default function DataTable({ columns, data, emptyMessage = 'No records found.' }) {
  return (
    <div style={{
      overflowX: 'auto',
      borderRadius: 12,
      border: '1px solid rgba(255,90,9,0.14)',
      background: '#FFFFFF',
      boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
      borderTop: `3px solid ${ORANGE}`,
    }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col.key} style={{
                padding: '12px 18px',
                textAlign: 'left',
                fontFamily: "'Space Mono',monospace",
                fontSize: '0.62rem',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: ORANGE,
                background: 'rgba(255,90,9,0.04)',
                borderBottom: '1px solid rgba(255,90,9,0.12)',
                whiteSpace: 'nowrap',
                fontWeight: 600,
                width: col.width,
                position: 'sticky',
                top: 0,
                zIndex: 1,
              }}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} style={{
                padding: '48px 24px', textAlign: 'center',
                color: '#9CA3AF', fontSize: '0.875rem',
              }}>
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr key={row.id ?? i} style={{
                borderBottom: i < data.length - 1 ? '1px solid #F3F4F6' : 'none',
                transition: 'background 0.15s ease',
                background: i % 2 === 0 ? '#FFFFFF' : '#FAFAFA',
              }}
                onMouseEnter={e => e.currentTarget.style.background = '#FFF4EE'}
                onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? '#FFFFFF' : '#FAFAFA'}
              >
                {columns.map(col => (
                  <td key={col.key} style={{
                    padding: '12px 18px',
                    color: '#374151',
                    verticalAlign: 'middle',
                    fontSize: '0.84rem',
                    lineHeight: 1.5,
                  }}>
                    {col.render ? col.render(row[col.key], row) : row[col.key] ?? '—'}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
