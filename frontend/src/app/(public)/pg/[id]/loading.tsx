export default function PgDetailLoading() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 md:px-6 lg:px-8">
      <div className="h-8 w-44 animate-pulse rounded-full bg-slate-200" />
      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
        <div className="h-80 animate-pulse rounded-3xl bg-slate-200" />
        <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="h-6 w-32 animate-pulse rounded-full bg-slate-200" />
          <div className="h-10 w-3/4 animate-pulse rounded-full bg-slate-200" />
          <div className="h-4 w-full animate-pulse rounded-full bg-slate-200" />
          <div className="h-4 w-5/6 animate-pulse rounded-full bg-slate-200" />
          <div className="h-12 w-full animate-pulse rounded-2xl bg-slate-200" />
        </div>
      </div>
    </div>
  );
}
