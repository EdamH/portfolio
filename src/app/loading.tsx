export default function Loading() {
  return (
    <main className="min-h-screen max-w-6xl mx-auto px-6 pt-32">
      <div className="animate-pulse space-y-12">
        {/* Hero skeleton */}
        <div className="space-y-4">
          <div className="h-4 w-24 bg-card rounded" />
          <div className="h-12 w-80 bg-card rounded" />
          <div className="h-6 w-96 bg-card rounded" />
        </div>

        {/* Content blocks */}
        <div className="space-y-6">
          <div className="h-4 w-32 bg-card rounded" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-48 bg-card rounded" />
            <div className="h-48 bg-card rounded" />
          </div>
        </div>
      </div>
    </main>
  );
}
