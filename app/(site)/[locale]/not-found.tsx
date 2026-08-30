import Link from "next/link";
import Button from "@/components/Button";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-charcoal px-5 text-center text-sand">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 30%, #E2562B 0%, transparent 45%)",
        }}
      />
      <div className="relative">
        <p className="font-display text-[clamp(6rem,22vw,14rem)] font-semibold leading-none text-accent">
          404
        </p>
        <h1 className="mt-2 text-sand">Page not found</h1>
        <p className="mx-auto mt-4 max-w-md text-mist">
          The page you&apos;re looking for has been moved, removed, or never
          existed. Let&apos;s get you back on track.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button href="/" size="lg">
            Back to home
          </Button>
          <Link
            href="/contact"
            className="sheen-btn inline-flex items-center justify-center gap-2 rounded-btn border border-sand/25 px-7 py-4 font-display text-[0.95rem] font-medium text-sand transition-colors hover:bg-sand hover:text-ink"
          >
            Contact us
          </Link>
        </div>
      </div>
    </main>
  );
}
