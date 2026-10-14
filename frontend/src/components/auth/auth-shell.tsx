import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft, Sparkles } from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";
import { Card } from "@/components/ui/card";

type AuthShellProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export function AuthShell({
  title,
  description,
  children,
}: AuthShellProps) {
  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0
          -z-10 h-[520px] bg-linear-to-b from-blush to-white"
      />

      <div className="mx-auto max-w-6xl px-5 py-7 sm:px-8">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center gap-2
            text-sm text-muted transition-colors hover:text-foreground"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          Back to events
        </Link>

        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <FadeIn className="hidden lg:block">
            <span className="mb-6 inline-flex items-center gap-2
              rounded-full border border-brand/20 bg-white px-4
              py-2 text-xs font-semibold text-brand-ink">
              <Sparkles aria-hidden="true" className="size-4" />
              A little closer to your community
            </span>

            <h2 className="text-6xl font-extrabold leading-[1.08]
              tracking-tight">
              Good moments.
              <br />
              <span className="text-brand">Great company.</span>
            </h2>

            <p className="mt-6 max-w-sm text-base leading-7 text-muted">
              Music, food and new experiences.
              Find what brings you out.
            </p>

            <div className="mt-8 flex flex-wrap gap-2">
              {["Music", "Workshops", "Food", "Sports", "Kids"].map(
                (category) => (
                  <span
                    key={category}
                    className="rounded-full border border-line
                      bg-white px-4 py-2 text-xs font-medium"
                  >
                    {category}
                  </span>
                ),
              )}
            </div>
          </FadeIn>

          <FadeIn className="mx-auto w-full max-w-md" delay={0.08}>
            <Card className="p-6 sm:p-9">
              <div className="mb-6 flex size-12 items-center
                justify-center rounded-2xl bg-blush text-brand-ink">
                <Sparkles aria-hidden="true" className="size-6" />
              </div>

              <h1 className="text-3xl font-extrabold tracking-tight">
                {title}
              </h1>

              <p className="mb-8 mt-3 text-sm leading-6 text-muted">
                {description}
              </p>

              {children}
            </Card>
          </FadeIn>
        </div>
      </div>
    </main>
  );
}