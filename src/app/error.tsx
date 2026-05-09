"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <p className="font-mono text-accent text-sm tracking-wider uppercase mb-4">
          // Error
        </p>
        <h1 className="font-serif italic text-4xl text-foreground mb-4">
          Something went wrong
        </h1>
        <p className="text-muted mb-8">
          An unexpected error occurred. Try refreshing the page.
        </p>
        <button
          onClick={reset}
          className="font-mono text-sm text-accent hover:text-foreground transition-colors duration-300"
        >
          &larr; Try again
        </button>
      </div>
    </main>
  );
}
