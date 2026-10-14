import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from "next";
import { Plus, CalendarDays } from "lucide-react";
import { requireAdmin } from "@/lib/server-auth";
import { AdminEventsList } from "@/components/admin/admin-events-list";

export const metadata: Metadata = {
  title: "Manage events",
};

async function ProtectedEventsList() {
  const user = await requireAdmin();

  return <AdminEventsList userId={user.id} />;
}

export default function AdminPage() {
  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p
            className="text-xs font-semibold uppercase
            tracking-[0.18em] text-brand-ink"
          >
            Your community, brought together
          </p>

          <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Events
          </h1>

          <p className="mt-3 text-sm leading-6 text-muted">
            Manage what’s happening and what’s visible.
          </p>
        </div>

        <Link
          href="/admin/new"
          className="inline-flex min-h-12 items-center gap-2
            rounded-full bg-foreground px-6 text-sm font-semibold
            text-white transition-colors hover:bg-foreground/90"
        >
          <Plus aria-hidden="true" className="size-4" />
          Create event
        </Link>
      </header>

      <section
        className="min-w-0 rounded-3xl border border-line
        bg-white p-4 shadow-card sm:p-6"
      >
        <div className="mb-6 flex items-center gap-3 border-b border-line pb-5">
          <span
            className="flex size-10 items-center justify-center
            rounded-xl bg-blush text-brand-ink"
          >
            <CalendarDays aria-hidden="true" className="size-5" />
          </span>

          <div>
            <h2 className="text-base font-bold">All events</h2>
            <p className="mt-1 text-xs text-muted">
              Upcoming, past and inactive
            </p>
          </div>
        </div>

        <Suspense
          fallback={
            <p role="status" className="py-12 text-center text-sm text-muted">
              Loading events…
            </p>
          }
        >
          <ProtectedEventsList />
        </Suspense>
      </section>
    </div>
  );
}
