export default function GlobalLoading() {
  return (
    <div className="flex min-h-[60vh] w-full items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-line border-t-brand" />
        <p className="text-sm font-medium text-ink-soft animate-pulse">Loading platform assets...</p>
      </div>
    </div>
  );
}