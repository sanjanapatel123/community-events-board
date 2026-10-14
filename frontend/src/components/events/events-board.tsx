"use client";

import { useState } from "react";
import { CalendarDays } from "lucide-react";
import { useEvents } from "@/hooks/use-events";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { EventCard } from "./event-card";
import { EventFilters } from "./event-filters";
import type { EventFilters as Filters } from "@/types/event";
import { useQueryClient } from "@tanstack/react-query";

export function EventsBoard() {
  const [filters, setFilters] = useState<Filters>({
    category: "",
    city: "",
    search: "",
    page: 1,
    limit: 9,
  });

  const query = useEvents(filters);
  const queryClient = useQueryClient();

  function resetFilters() {
    setFilters({
      category: "",
      city: "",
      search: "",
      page: 1,
      limit: 9,
    });

    void queryClient.invalidateQueries({
      queryKey: ["events"],
    });
  }

  return (
    <section
      id="events"
      aria-labelledby="events-heading"
      className="mx-auto max-w-7xl scroll-mt-6 px-5 pb-16 sm:px-8"
    >
      <EventFilters
        category={filters.category}
        onCategoryChange={(category) =>
          setFilters((previous) => ({ ...previous, category, page: 1 }))
        }
        onApply={(values) =>
          setFilters((previous) => ({ ...previous, ...values, page: 1 }))
        }
        onReset={resetFilters}
      />
      {(filters.search || filters.city) && (
        <p aria-live="polite" className="mt-3 text-xs text-muted">
          Applied:{" "}
          {[
            filters.search ? `Search: “${filters.search}”` : "",
            filters.city ? `City: ${filters.city}` : "",
          ]
            .filter(Boolean)
            .join(" · ")}
        </p>
      )}
      <div className="mb-6 mt-10 flex flex-wrap items-center justify-between gap-3">
        <h2
          id="events-heading"
          className="text-2xl font-extrabold tracking-tight"
        >
          Coming up nearby
        </h2>

        {query.isSuccess && (
          <p aria-live="polite" className="text-sm text-muted">
            {query.data.pagination.total} events found
          </p>
        )}
      </div>

      {query.isPending ? (
        <div role="status" aria-label="Loading events">
          <span className="sr-only">Loading events…</span>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }, (_, index) => (
              <div
                key={index}
                aria-hidden="true"
                className="rounded-3xl border border-line p-3
                  motion-safe:animate-pulse"
              >
                <div className="aspect-[4/3] rounded-2xl bg-elevated" />
                <div className="mx-2 my-5 h-5 w-3/4 rounded bg-elevated" />
                <div className="mx-2 mb-5 h-4 w-1/2 rounded bg-elevated" />
              </div>
            ))}
          </div>
        </div>
      ) : query.isError ? (
        <div
          role="alert"
          className="rounded-3xl border border-line p-8 text-center"
        >
          <p className="mb-4 text-sm text-danger">{query.error.message}</p>
          <Button
            loading={query.isFetching}
            onClick={() => void query.refetch()}
          >
            Try again
          </Button>
        </div>
      ) : query.data.events.length === 0 ? (
        <div
          className="rounded-3xl border border-dashed border-line
          bg-elevated/50 px-6 py-14 text-center"
        >
          <CalendarDays
            aria-hidden="true"
            className="mx-auto mb-4 size-8 text-brand-ink"
          />
          <h3 className="text-lg font-bold">Nothing here just yet.</h3>
          <p className="mt-2 text-sm text-muted">
            Try another category, city or search.
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {query.data.events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>

          <Pagination
            page={query.data.pagination.page}
            totalPages={query.data.pagination.totalPages}
            onPageChange={(page) =>
              setFilters((previous) => ({ ...previous, page }))
            }
          />
        </>
      )}
    </section>
  );
}
