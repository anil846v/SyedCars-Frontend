export default function DataTable({ columns, data, emptyMessage = 'No records found.' }) {
  return (
    <div className="overflow-x-auto border border-ink-4 rounded-lg">
      <table className="w-full border-collapse text-[0.875rem]">
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col.key} className="px-4 py-3 text-left font-mono text-[0.68rem] tracking-widest uppercase text-smoke bg-ink-3 border-b border-ink-4 whitespace-nowrap first:rounded-tl-md last:rounded-tr-md" style={{ width: col.width }}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="p-12 text-center text-smoke text-[0.875rem]">{emptyMessage}</td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr key={row.id ?? i} className="border-b border-ink-4 transition-colors duration-150 last:border-b-0 hover:bg-ink-3">
                {columns.map(col => (
                  <td key={col.key} className="px-4 py-[0.85rem] text-mist align-middle">
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
