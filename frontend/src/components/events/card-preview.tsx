"use client";

import { useState } from "react";
import { CalendarDays, MapPin, Sparkles } from "lucide-react";
import { formatEventDate, formatPrice } from "@/lib/format";
import { categoryLabels, type CommunityEvent } from "@/types/event";
import { themes, stickers, type CardDesign } from "@/types/card-design";

export function CardPreview({
  event,
  design,
}: {
  event: CommunityEvent;
  design: CardDesign;
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const theme = themes[design.theme];

  return (
    <div
      className="rounded-[28px] border border-[#ece6ed] bg-[#faf8fb]
        p-4 sm:p-7"
    >
      <div className="mb-5 flex items-center justify-between">
        <span
          className="text-[10px] font-bold uppercase
          tracking-[0.2em] text-[#6e6573]"
        >
          Live preview
        </span>

        <span className="flex items-center gap-1.5 text-[10px] text-[#6e6573]">
          <span className="size-1.5 rounded-full bg-[#88476f]" />
          {theme.label}
        </span>
      </div>

      <article
        aria-label="Your customised event card"
        className="mx-auto max-w-sm overflow-hidden rounded-[24px]
          shadow-[0_20px_50px_-20px_rgba(40,20,35,0.35)]
          transition-colors duration-500"
        style={{
          backgroundColor: theme.background,
          color: theme.foreground,
        }}
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-[#17151b]">
          {!imageFailed && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={event.imageUrl}
              alt=""
              referrerPolicy="no-referrer"
              onError={() => setImageFailed(true)}
              className="h-full w-full object-cover"
            />
          )}

          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t
              from-black/90 via-black/15 to-black/10"
          />

          <span
            className="absolute left-4 top-4 rounded-full
            border border-white/30 bg-black/20 px-3 py-1.5
            text-[10px] font-bold uppercase tracking-widest text-white
            backdrop-blur-md"
          >
            {categoryLabels[event.category]}
          </span>

          <span
            className="absolute right-4 top-4 flex size-8
            items-center justify-center rounded-full bg-white/20 text-white"
          >
            <Sparkles aria-hidden="true" className="size-4" />
          </span>

          <h3
            className="absolute inset-x-0 bottom-0 break-words
            px-5 pb-5 font-heading text-3xl font-extrabold
            leading-[1.08] tracking-tight text-white"
          >
            {event.title}
          </h3>
        </div>

        <div className="p-5">
          <div className="space-y-2.5 text-xs font-medium">
            <p className="flex items-start gap-2">
              <CalendarDays aria-hidden="true" className="size-4 shrink-0" />
              {formatEventDate(event.startsAt)}
            </p>

            <p className="flex items-center gap-2">
              <MapPin aria-hidden="true" className="size-4 shrink-0" />
              {event.city}
            </p>
          </div>

          <div className="my-5 flex min-h-14 items-center gap-3">
            {design.stickers.length === 0 ? (
              <p className="text-xs opacity-70">Add a little personality ✨</p>
            ) : (
              design.stickers.map((id, index) => (
                <span
                  key={`${index}-${id}`}
                  role="img"
                  aria-label={stickers[id].label}
                  className="flex size-14 animate-enter items-center
                    justify-center rounded-2xl border border-white/40
                    bg-white/45 text-3xl shadow-sm
                    motion-reduce:animate-none"
                  style={{
                    rotate: `${index % 2 === 0 ? -6 : 6}deg`,
                  }}
                >
                  {stickers[id].emoji}
                </span>
              ))
            )}
          </div>

          <div
            className="flex items-center justify-between gap-3
            border-t border-dashed border-current/25 pt-4"
          >
            <span className="font-heading text-sm font-extrabold">
              community.
            </span>

            <span
              className="rounded-full bg-white/60 px-3 py-1.5
              text-sm font-extrabold"
            >
              {formatPrice(event.price)}
            </span>
          </div>
        </div>
      </article>

      <p className="mt-5 text-center text-[11px] text-[#6e6573]">
        Your event. Your style.
      </p>
    </div>
  );
}
