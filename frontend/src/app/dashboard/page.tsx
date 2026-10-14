import { Suspense } from "react";
import { requireUser } from "@/lib/server-auth";
import { UserShell } from "@/components/layout/user-shell";
import { EventsBoard } from "@/components/events/events-board";

async function ProtectedDashboard() {
  await requireUser();

  return (
    <UserShell>
      <header className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
        <div
          className="rounded-3xl border border-[#efdee9]
          bg-gradient-to-br from-[#efdae7] to-[#fffafc] p-6 sm:p-9"
        >
          <p
            className="text-xs font-semibold uppercase
            tracking-widest text-[#88476f]"
          >
            Your community
          </p>

          <h1
            className="mt-4 text-4xl font-extrabold
            leading-tight tracking-tight sm:text-5xl"
          >
            Discover <span className="text-[#88476f]">events</span>
            <br />
            near you.
          </h1>

          <p className="mt-4 text-sm text-[#6e6573]">
            Find your next local experience.
          </p>
        </div>
      </header>

      <EventsBoard />
    </UserShell>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <p role="status" className="p-8 text-sm text-muted">
          Loading your dashboard…
        </p>
      }
    >
      <ProtectedDashboard />
    </Suspense>
  );
}
