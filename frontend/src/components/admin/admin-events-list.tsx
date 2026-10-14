"use client";

import { useState } from "react";
import { useAdminEvents } from "@/hooks/use-admin-events";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { EventsTable } from "./events-table";

export function AdminEventsList({ userId }: { userId: string }) {
  const [page, setPage] = useState(1);
  const query = useAdminEvents(userId, page);

  if (query.isPending) {
    return (
      <p role="status" className="py-12 text-center text-sm text-muted">
        Loading events…
      </p>
    );
  }

  if (query.isError) {
    return (
      <div role="alert" className="py-8 text-center">
        <p className="mb-4 text-sm text-danger">{query.error.message}</p>
        <Button loading={query.isFetching} onClick={() => void query.refetch()}>
          Try again
        </Button>
      </div>
    );
  }

  if (query.data.events.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-line p-10 text-center">
        <p className="text-sm text-muted">
          {page === 1
            ? "No events yet. Create your first event above."
            : "No events on this page."}
        </p>

        {page > 1 && (
          <Button className="mt-4" onClick={() => setPage(1)}>
            Back to first page
          </Button>
        )}
      </div>
    );
  }

  return (
    <>
      <p className="mb-4 text-sm text-muted">
        {query.data.pagination.total} events · All dates and visibility states
      </p>

      <EventsTable events={query.data.events} />

      <Pagination
        page={page}
        totalPages={query.data.pagination.totalPages}
        onPageChange={setPage}
      />
    </>
  );
}
