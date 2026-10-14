"use client";

import { useState } from "react";
import { CalendarDays, ImageOff, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { formatEventDate, formatPrice } from "@/lib/format";
import { categoryLabels, type CommunityEvent } from "@/types/event";
import { ReminderButton } from "./reminder-button";
import Link from "next/link";

export function EventCard({ event }: { event: CommunityEvent }) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <Card interactive className="group h-full overflow-hidden p-3">
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-blush">
        {imageFailed ? (
          <div className="flex h-full items-center justify-center text-brand-ink">
            <ImageOff aria-label="Event image unavailable" className="size-9" />
          </div>
        ) : (
          <img
            src={event.imageUrl}
            alt={event.title}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => setImageFailed(true)}
            className="h-full w-full object-cover transition-transform
              duration-500 motion-safe:group-hover:scale-[1.04]"
          />
        )}

        <span
          className="absolute left-3 top-3 rounded-full bg-white/95
          px-3 py-1.5 text-xs font-semibold text-foreground shadow-sm"
        >
          {categoryLabels[event.category]}
        </span>
      </div>

      <div className="px-2 pb-3 pt-5">
        <div className="mb-3 flex items-center gap-2 text-xs text-muted">
          <MapPin aria-hidden="true" className="size-3.5 shrink-0" />
          <span className="truncate">{event.city}</span>
        </div>

        <h3
          className="min-h-14 line-clamp-2 text-lg font-extrabold
  leading-7 tracking-tight"
        >
          <Link
            href={`/events/${event.id}`}
            className="transition-colors hover:text-brand-ink"
          >
            {event.title}
          </Link>
        </h3>

        <div className="mt-3 flex items-start gap-2 text-xs leading-5 text-muted">
          <CalendarDays aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          <time dateTime={event.startsAt}>
            {formatEventDate(event.startsAt)}
          </time>
        </div>

        <div
          className="mt-5 flex items-center justify-between
          border-t border-line pt-4"
        >
          <span className="text-xs text-muted">Entry</span>

          <span
            className="rounded-full bg-blush px-3 py-1.5
            text-sm font-bold text-brand-ink"
          >
            {formatPrice(event.price)}
          </span>
        </div>
        <div className="mt-4">
          <ReminderButton eventId={event.id} />
        </div>
      </div>
    </Card>
  );
}
