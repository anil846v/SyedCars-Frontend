export default function AdminPageHeader({ title, sub, action }) {
  return (
    <div className="flex items-start justify-between gap-6 mb-8 flex-wrap">
      <div>
        <h1 className="font-display text-[1.75rem] font-normal text-white leading-tight">{title}</h1>
        {sub && <p className="text-[0.875rem] text-smoke mt-1">{sub}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
