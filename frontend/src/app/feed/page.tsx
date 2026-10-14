import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from "next";
import { SlidersHorizontal } from "lucide-react";
import { requireUser } from "@/lib/server-auth";
import { UserShell } from "@/components/layout/user-shell";
import { FeedBoard } from "@/components/events/feed-board";

export const metadata: Metadata = {
  title: "My Feed",
};

async function ProtectedFeed() {
  await requireUser();

  return (
    <UserShell>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-8 sm:py-8">
        <header
          className="mb-8 rounded-[28px] border border-[#efdee9]
          bg-gradient-to-br from-[#efdae7] to-[#fffafc] p-6 sm:p-9"
        >
          <p
            className="text-[10px] font-bold uppercase
            tracking-[0.22em] text-[#88476f]"
          >
            Made for your interests
          </p>

          <div className="mt-4 flex flex-wrap items-end justify-between gap-5">
            <div>
              <h1
                className="text-4xl font-extrabold leading-tight
                tracking-tight sm:text-5xl"
              >
                Your kind of <span className="text-[#88476f]">plans.</span>
              </h1>

              <p className="mt-3 text-sm leading-6 text-[#6e6573]">
                Upcoming experiences from the categories you love.
              </p>
            </div>

            <Link
              href="/preferences"
              className="inline-flex min-h-11 items-center gap-2
                rounded-full bg-white px-5 text-sm font-semibold
                shadow-sm transition-colors hover:bg-[#f8edf4]"
            >
              <SlidersHorizontal aria-hidden="true" className="size-4" />
              Edit interests
            </Link>
          </div>
        </header>

        <FeedBoard />
      </div>
    </UserShell>
  );
}

export default function FeedPage() {
  return (
    <Suspense
      fallback={
        <p role="status" className="py-20 text-center text-sm text-muted">
          Loading your feed…
        </p>
      }
    >
      <ProtectedFeed />
    </Suspense>
  );
}
