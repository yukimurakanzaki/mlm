// Skeleton in the shape of the catalog: title, filter pills, one category of cards
const PILLS = 6;
const CARDS = 8;

export default function CatalogLoading() {
  return (
    <div className="px-4 pt-14 pb-24" aria-busy="true">
      <div className="
        mx-auto max-w-7xl
        motion-safe:animate-pulse
      "
      >
        <div className="h-12 w-72 bg-secondary" />
        <div className="mt-5 h-5 w-full max-w-xl bg-secondary" />
        <div className="mt-10 flex gap-2 overflow-hidden">
          {Array.from({ length: PILLS }, (_, i) => (
            <div
              key={i}
              className="h-9 w-28 shrink-0 bg-secondary"
            />
          ))}
        </div>
        <div className="mt-12 h-8 w-56 bg-secondary" />
        <div className="
          mt-5 grid gap-4
          sm:grid-cols-2
          lg:grid-cols-3
          xl:grid-cols-4
        "
        >
          {Array.from({ length: CARDS }, (_, i) => (
            <div key={i} className="border bg-card">
              <div className="aspect-4/3 bg-secondary" />
              <div className="space-y-2 p-4">
                <div className="h-5 w-3/4 bg-secondary" />
                <div className="h-4 w-1/2 bg-secondary" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
