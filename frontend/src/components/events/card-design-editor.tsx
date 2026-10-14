"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, Save, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { cardDesignService } from "@/services/card-design.service";
import {
  themes,
  stickers,
  type CardDesign,
  type CardTheme,
  type StickerId,
} from "@/types/card-design";
import type { CommunityEvent } from "@/types/event";
import { CardPreview } from "./card-preview";

export function CardDesignEditor({
  userId,
  event,
  initialDesign,
}: {
  userId: string;
  event: CommunityEvent;
  initialDesign: CardDesign;
}) {
  const [design, setDesign] = useState(initialDesign);
  const [savedDesign, setSavedDesign] = useState(initialDesign);
  const queryClient = useQueryClient();

  const dirty = JSON.stringify(design) !== JSON.stringify(savedDesign);

  const save = useMutation({
    mutationFn: (value: CardDesign) => cardDesignService.save(event.id, value),

    onSuccess: (data) => {
      setSavedDesign(data.design);
      queryClient.setQueryData(["card-design", userId, event.id], data);
      toast.success("Your card design is saved.");
    },
  });

  function addSticker(id: StickerId) {
    setDesign((previous) =>
      previous.stickers.length < 3
        ? { ...previous, stickers: [...previous.stickers, id] }
        : previous,
    );
  }

  function removeSticker(index: number) {
    setDesign((previous) => ({
      ...previous,
      stickers: previous.stickers.filter((_, position) => position !== index),
    }));
  }

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[1.1fr_1fr] lg:gap-8">
      <CardPreview event={event} design={design} />

      <div className="min-w-0 py-2">
        <fieldset disabled={save.isPending} className="min-w-0 space-y-8">
          <div role="group" aria-labelledby="card-theme-label">
            <div className="mb-4 flex items-center gap-3">
              <span
                className="flex size-7 items-center justify-center
                rounded-full bg-[#f8edf4] text-xs font-bold text-[#88476f]"
              >
                01
              </span>

              <div>
                <h3 id="card-theme-label" className="text-sm font-bold">
                  Set the mood
                </h3>
                <p className="mt-1 text-xs text-[#6e6573]">
                  Choose your card’s colour palette.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {(Object.keys(themes) as CardTheme[]).map((theme) => {
                const active = design.theme === theme;

                return (
                  <button
                    key={theme}
                    type="button"
                    aria-pressed={active}
                    onClick={() =>
                      setDesign((previous) => ({ ...previous, theme }))
                    }
                    className={cn(
                      "rounded-2xl border p-2 text-left transition duration-200",
                      "disabled:opacity-60",
                      active
                        ? "border-[#88476f] bg-[#fffafd] ring-1 ring-[#88476f]"
                        : "border-[#ece6ed] bg-white hover:border-[#bb76a2]",
                    )}
                  >
                    <span
                      className="flex h-16 items-center justify-center rounded-xl"
                      style={{ backgroundColor: themes[theme].background }}
                    >
                      {active && (
                        <span
                          className="flex size-6 items-center justify-center
                          rounded-full bg-white shadow-sm"
                        >
                          <Check
                            aria-hidden="true"
                            className="size-3.5 text-[#17151b]"
                          />
                        </span>
                      )}
                    </span>

                    <span className="block px-1 pb-1 pt-3 text-xs font-semibold">
                      {themes[theme].label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div role="group" aria-labelledby="card-sticker-label">
            <div className="mb-4 flex items-center gap-3">
              <span
                className="flex size-7 items-center justify-center
                rounded-full bg-[#f8edf4] text-xs font-bold text-[#88476f]"
              >
                02
              </span>

              <div className="flex-1">
                <h3 id="card-sticker-label" className="text-sm font-bold">
                  Make it yours
                </h3>
                <p className="mt-1 text-xs text-[#6e6573]">
                  Add up to three stickers.
                </p>
              </div>

              <span
                aria-live="polite"
                className="text-xs font-bold text-[#88476f]"
              >
                {design.stickers.length}/3
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {(Object.keys(stickers) as StickerId[]).map((id) => (
                <button
                  key={id}
                  type="button"
                  aria-label={`Add ${stickers[id].label} sticker`}
                  title={stickers[id].label}
                  disabled={design.stickers.length >= 3}
                  onClick={() => addSticker(id)}
                  className="flex size-12 items-center justify-center rounded-2xl
                    border border-[#ece6ed] bg-white text-2xl
                    transition duration-200 hover:border-[#bb76a2]
                    hover:bg-[#f8edf4] motion-safe:hover:-translate-y-1
                    disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <span aria-hidden="true">{stickers[id].emoji}</span>
                </button>
              ))}
            </div>

            <div
              className="mt-4 rounded-2xl border border-dashed
              border-[#e3d7e0] bg-[#faf8fb] p-3"
            >
              {design.stickers.length === 0 ? (
                <p className="py-3 text-center text-xs text-[#6e6573]">
                  Your selected stickers will appear here.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {design.stickers.map((id, index) => (
                    <button
                      key={`${index}-${id}`}
                      type="button"
                      aria-label={`Remove ${stickers[id].label} sticker ${index + 1}`}
                      onClick={() => removeSticker(index)}
                      className="inline-flex min-h-11 items-center gap-2
                        rounded-xl border border-[#ece6ed] bg-white px-3
                        transition-colors hover:bg-[#f8edf4]"
                    >
                      <span aria-hidden="true" className="text-xl">
                        {stickers[id].emoji}
                      </span>
                      <X
                        aria-hidden="true"
                        className="size-3.5 text-[#6e6573]"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </fieldset>

        {save.isError && (
          <p
            role="alert"
            className="mt-5 rounded-xl bg-danger/5
            p-3 text-sm text-danger"
          >
            {save.error.message} Your draft is still here—try again.
          </p>
        )}

        <div className="mt-8 border-t border-[#ece6ed] pt-6">
          <Button
            loading={save.isPending}
            disabled={!dirty}
            onClick={() => save.mutate(design)}
            className="min-h-12 w-full"
          >
            {!save.isPending && <Save aria-hidden="true" className="size-4" />}
            {save.isPending ? "Saving your design…" : "Save my design"}
          </Button>

          <p role="status" className="mt-3 text-center text-xs text-[#6e6573]">
            {save.isPending
              ? "Saving changes…"
              : dirty
                ? "Preview updated. Save to keep your changes."
                : "Your design is up to date."}
          </p>
        </div>
      </div>
    </div>
  );
}
