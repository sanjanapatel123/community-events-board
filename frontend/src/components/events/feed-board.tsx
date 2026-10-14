"use client";

import Link from "next/link";
import { useState } from "react";
import { AccountBoundary } from "@/components/auth/account-boundary";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { useFeed } from "@/hooks/use-preferences";
import { EventCard } from "./event-card";

function FeedContent({ userId }: { userId: string }) {
  const [page, setPage] = useState(1);
  const query = useFeed(userId, page);

  if (query.isPending) {
    return (
      <p role="status" className="py-16 text-center text-sm text-muted">
        Finding your next experience…
      </p>
    );
  }

  if (query.isError) {
    return (
      <div role="alert" className="py-12 text-center">
        <p className="mb-4 text-sm text-danger">{query.error.message}</p>

        <Button loading={query.isFetching} onClick={() => void query.refetch()}>
          Try again
        </Button>
      </div>
    );
  }

  if (query.data.events.length === 0) {
    return (
      <div
        className="rounded-3xl border border-dashed border-line
        bg-blush/30 px-6 py-14 text-center"
      >
        <h2 className="text-xl font-bold">
          {query.data.categories.length === 0
            ? "Start with what you love."
            : "More good moments are on the way."}
        </h2>

        <p className="mt-3 text-sm text-muted">{query.data.message}</p>

        {page > 1 ? (
          <Button className="mt-6" onClick={() => setPage(1)}>
            Back to first page
          </Button>
        ) : (
          <Link
            href="/preferences"
            className="mt-6 inline-flex min-h-11 items-center rounded-full
              bg-brand px-5 text-sm font-semibold text-foreground"
          >
            Choose interests
          </Link>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {query.data.events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>

      <Pagination
        page={page}
        totalPages={query.data.pagination.totalPages}
        onPageChange={setPage}
      />
    </>
  );
}

export function FeedBoard() {
  return (
    <AccountBoundary>
      {(user) => <FeedContent key={user.id} userId={user.id} />}
    </AccountBoundary>
  );
}
