interface InfoRowProps {
  label: string;
  value: string;
}

export function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-200/80 bg-slate-50/50 px-4 py-2.5">
      <span className="text-xs font-medium text-slate-500">{label}</span>
      <span className="text-xs font-bold text-slate-900">{value}</span>
    </div>
  );
}
