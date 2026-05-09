import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <p className="font-mono text-accent text-sm tracking-wider uppercase mb-4">
          // 404
        </p>
        <h1 className="font-serif italic text-4xl text-foreground mb-4">
          Page not found
        </h1>
        <p className="text-muted mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          href="/"
          className="font-mono text-sm text-accent hover:text-foreground transition-colors duration-300"
        >
          &larr; Back to home
        </Link>
      </div>
    </main>
  );
}
