// اسکلتونِ گرید حینِ ناوبری/فیلتر — تا هیچ‌وقت صفحه خالی/سفید دیده نشود.
export default function Loading() {
  return (
    <div>
      <div className="border-b border-navy/10 bg-navy py-14">
        <div className="container-luna">
          <div className="h-6 w-40 animate-pulse rounded-full bg-white/10" />
          <div className="mt-4 h-8 w-2/3 max-w-lg animate-pulse rounded-lg bg-white/10" />
        </div>
      </div>
      <div className="container-luna py-10">
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-2xl border border-navy/8 bg-white">
              <div className="aspect-[3/4] animate-pulse bg-cream" />
              <div className="space-y-2 p-4">
                <div className="h-2.5 w-1/3 animate-pulse rounded bg-navy/10" />
                <div className="h-3.5 w-full animate-pulse rounded bg-navy/10" />
                <div className="h-3.5 w-2/3 animate-pulse rounded bg-navy/10" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
