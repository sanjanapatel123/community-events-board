import { Sparkles } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { FadeIn } from "@/components/ui/fade-in";
import { EventsBoard } from "@/components/events/events-board";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main>
        <section className="bg-linear-to-b from-blush to-white">
          <FadeIn className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
            <span
              className="inline-flex items-center gap-2 rounded-full
              border border-brand/20 bg-white px-4 py-2
              text-xs font-semibold text-brand-ink"
            >
              <Sparkles aria-hidden="true" className="size-4" />
              Your city. Your people.
            </span>

            <h1
              className="mt-6 max-w-3xl text-4xl font-extrabold
              leading-[1.08] tracking-tight sm:text-6xl"
            >
              Discover <span className="text-brand">events</span>
              <br />
              near you.
            </h1>

            <p className="mt-5 max-w-md text-base leading-7 text-muted">
              Live music, fresh flavours and something new. Find your reason to
              step out.
            </p>
          </FadeIn>
        </section>

        <EventsBoard />
      </main>
    </div>
  );
}
