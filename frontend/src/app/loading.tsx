export default function GlobalLoading() {
  return (
    <div className="flex min-h-[60vh] w-full items-center justify-center antialiased">
      <div className="flex flex-col items-center gap-3">
        <div className="h-9 w-9 animate-spin rounded-full border-3 border-slate-200 border-t-emerald-600" />
        <p className="text-xs font-semibold text-slate-500 animate-pulse">Loading platform assets...</p>
      </div>
    </div>
  );
}