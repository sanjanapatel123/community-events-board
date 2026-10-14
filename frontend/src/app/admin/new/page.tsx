import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { requireAdmin } from "@/lib/server-auth";
import { EventForm } from "@/components/admin/event-form";

export const metadata: Metadata = {
  title: "Create event",
};

async function ProtectedEventForm() {
  await requireAdmin();

  return <EventForm />;
}

export default function NewEventPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/admin"
        className="inline-flex min-h-11 items-center gap-2
          text-sm text-muted transition-colors hover:text-foreground"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        Back to events
      </Link>

      <header className="mb-8 mt-5">
        <p
          className="text-xs font-semibold uppercase
          tracking-[0.18em] text-brand-ink"
        >
          Bring people together
        </p>

        <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
          Create an event.
        </h1>

        <p className="mt-3 text-sm leading-6 text-muted">
          Add the details. Give your community something to look forward to.
        </p>
      </header>

      <section
        className="rounded-3xl border border-line bg-white
        p-5 shadow-card sm:p-8"
      >
        <div className="mb-7 border-b border-line pb-5">
          <h2 className="text-lg font-bold">Event details</h2>
          <p className="mt-2 text-xs text-muted">
            Dates and times are entered in India Standard Time.
          </p>
        </div>

        <Suspense
          fallback={
            <p role="status" className="py-10 text-sm text-muted">
              Loading form…
            </p>
          }
        >
          <ProtectedEventForm />
        </Suspense>
      </section>
    </div>
  );
}
