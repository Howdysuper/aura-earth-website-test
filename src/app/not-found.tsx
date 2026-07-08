import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-cream px-5">
      <div className="text-center">
        <span className="font-display text-7xl font-semibold text-gradient">
          404
        </span>
        <h1 className="mt-4 font-display text-3xl font-semibold text-ink">
          This page burned out
        </h1>
        <p className="mt-3 max-w-sm text-ink-soft">
          The page you&apos;re looking for doesn&apos;t exist—but our candles
          definitely do.
        </p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full bg-moss px-7 py-3.5 text-sm font-semibold text-cream-soft transition hover:bg-sage-deep"
          >
            Back home
          </Link>
          <Link
            href="/shop"
            className="inline-flex items-center justify-center rounded-full bg-white/70 px-7 py-3.5 text-sm font-semibold text-ink ring-1 ring-black/10 transition hover:bg-white"
          >
            Shop candles
          </Link>
        </div>
      </div>
    </main>
  );
}
