"use client";

import Link from "next/link";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, CalendarDays, MapPin, ImageOff } from "lucide-react";
import { eventService } from "@/services/event.service";
import { ApiError } from "@/lib/api-client";
import { formatEventDate, formatPrice } from "@/lib/format";
import { categoryLabels } from "@/types/event";
import { Button } from "@/components/ui/button";
import { ReminderButton } from "./reminder-button";
import { CardDesigner } from "./card-designer";

export function EventDetail({ eventId }: { eventId: string }) {
  const [imageFailed, setImageFailed] = useState(false);

  const query = useQuery({
    queryKey: ["event", eventId],
    queryFn: ({ signal }) => eventService.get(eventId, signal),
  });

  if (query.isPending) {
    return (
      <p role="status" className="py-20 text-center text-sm text-muted">
        Loading event…
      </p>
    );
  }

  if (query.isError) {
    const unavailable =
      query.error instanceof ApiError &&
      [400, 404].includes(query.error.status);

    return (
      <div role="alert" className="py-20 text-center">
        <h1 className="text-2xl font-bold">
          {unavailable
            ? "This event isn’t available."
            : "Unable to load event."}
        </h1>

        <p className="mt-3 text-sm text-muted">{query.error.message}</p>

        {!unavailable && (
          <Button
            className="mt-5"
            loading={query.isFetching}
            onClick={() => void query.refetch()}
          >
            Try again
          </Button>
        )}

        <Link
          href="/"
          className="mt-5 block text-sm font-semibold text-brand-ink"
        >
          Back to events
        </Link>
      </div>
    );
  }

  const event = query.data.event;

  return (
    <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-12">
      <Link
        href="/dashboard"
        className="mb-7 inline-flex min-h-11 items-center gap-2
          text-sm text-muted hover:text-foreground"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        Back to events
      </Link>

      <div className="grid items-start gap-8 lg:grid-cols-2">
        <div className="aspect-[4/3] overflow-hidden rounded-3xl bg-blush">
          {imageFailed ? (
            <div className="flex h-full items-center justify-center text-brand-ink">
              <ImageOff aria-label="Image unavailable" className="size-10" />
            </div>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={event.imageUrl}
              alt={event.title}
              referrerPolicy="no-referrer"
              onError={() => setImageFailed(true)}
              className="h-full w-full object-cover"
            />
          )}
        </div>

        <div className="py-2">
          <span
            className="rounded-full bg-blush px-4 py-2
            text-xs font-semibold text-brand-ink"
          >
            {categoryLabels[event.category]}
          </span>

          <h1
            className="mt-6 break-words text-3xl font-extrabold
            leading-tight tracking-tight sm:text-4xl"
          >
            {event.title}
          </h1>

          <div className="mt-6 space-y-3 text-sm text-muted">
            <p className="flex items-center gap-2">
              <MapPin aria-hidden="true" className="size-4 shrink-0" />
              {event.city}
            </p>

            <p className="flex items-start gap-2">
              <CalendarDays aria-hidden="true" className="size-4 shrink-0" />
              <time dateTime={event.startsAt}>
                {formatEventDate(event.startsAt)} IST
              </time>
            </p>
          </div>

          <p
            className="mt-6 whitespace-pre-wrap break-words text-sm
            leading-7 text-muted"
          >
            {event.description}
          </p>

          <div className="mt-7 border-t border-line pt-6">
            <p className="mb-4 text-2xl font-extrabold">
              {formatPrice(event.price)}
            </p>
            <ReminderButton eventId={event.id} />
          </div>
        </div>
      </div>

      <CardDesigner event={event} />
    </div>
  );
}
