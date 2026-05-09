export default function ProjectLoading() {
  return (
    <main className="min-h-screen max-w-4xl mx-auto px-6 pt-32">
      <div className="animate-pulse space-y-10">
        {/* Back link */}
        <div className="h-4 w-24 bg-card rounded" />

        {/* Title area */}
        <div className="space-y-3">
          <div className="h-4 w-20 bg-card rounded" />
          <div className="h-10 w-72 bg-card rounded" />
          <div className="h-5 w-96 bg-card rounded" />
        </div>

        {/* Stats row */}
        <div className="flex gap-6">
          <div className="h-16 w-24 bg-card rounded" />
          <div className="h-16 w-24 bg-card rounded" />
          <div className="h-16 w-24 bg-card rounded" />
        </div>

        {/* Screenshot placeholder */}
        <div className="aspect-video bg-card rounded" />

        {/* Narrative */}
        <div className="space-y-3">
          <div className="h-4 w-full bg-card rounded" />
          <div className="h-4 w-5/6 bg-card rounded" />
          <div className="h-4 w-4/6 bg-card rounded" />
        </div>
      </div>
    </main>
  );
}
