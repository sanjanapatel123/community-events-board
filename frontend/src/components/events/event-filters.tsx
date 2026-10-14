"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { categories, categoryLabels, type Category } from "@/types/event";
import { Search, RotateCw } from "lucide-react";

type Props = {
  category: Category | "";
  onCategoryChange: (value: Category | "") => void;
  onApply: (values: { city: string; search: string }) => void;
  onReset: () => void;
};

export function EventFilters({
  category,
  onCategoryChange,
  onApply,
  onReset,
}: Props) {
  const [city, setCity] = useState("");
  const [search, setSearch] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    onApply({
      city: city.trim(),
      search: search.trim(),
    });

    setCity("");
    setSearch("");
  }

  function resetFilters() {
    setCity("");
    setSearch("");
    onReset();
  }

  const options: { value: Category | ""; label: string }[] = [
    { value: "", label: "All events" },
    ...categories.map((value) => ({
      value,
      label: categoryLabels[value],
    })),
  ];

  return (
    <div className="space-y-5">
      <div
        role="group"
        aria-label="Event categories"
        className="flex flex-wrap gap-2"
      >
        {options.map((option) => (
          <button
            key={option.value || "all"}
            type="button"
            aria-pressed={category === option.value}
            onClick={() => onCategoryChange(option.value)}
            className={cn(
              "min-h-11 rounded-full border px-5 text-sm font-medium",
              "transition-colors duration-200",
              category === option.value
                ? "border-foreground bg-foreground text-white"
                : "border-line bg-white text-muted hover:border-brand",
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      <form
        onSubmit={submit}
        className="grid gap-3 rounded-2xl border border-line
          bg-white p-4 shadow-card sm:grid-cols-[1fr_1fr_auto]"
      >
        <div>
          <label
            htmlFor="event-search"
            className="mb-2 block text-xs font-medium"
          >
            Search events
          </label>

          <div className="relative">
            <Search
              aria-hidden="true"
              className="absolute left-3 top-3.5 size-4 text-muted"
            />

            <input
              id="event-search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Try music night"
              maxLength={200}
              className="min-h-11 w-full rounded-xl border border-line
                bg-background pl-10 pr-3 text-base"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="event-city"
            className="mb-2 block text-xs font-medium"
          >
            City
          </label>

          <input
            id="event-city"
            value={city}
            onChange={(event) => setCity(event.target.value)}
            placeholder="Any city"
            maxLength={100}
            className="min-h-11 w-full rounded-xl border border-line
              bg-background px-3 text-base"
          />
        </div>

        <div className="flex items-end gap-2">
          <Button
            type="submit"
            className="min-h-13 flex-1 rounded-2xl bg-[#17151b]
      text-white hover:bg-[#302a34]"
          >
            Apply filters
          </Button>

          <button
            type="button"
            onClick={resetFilters}
            aria-label="Reset filters and refresh events"
            title="Reset filters and refresh events"
            className="flex size-13 shrink-0 items-center justify-center
      rounded-2xl border border-line bg-white text-brand-ink
      transition-colors hover:bg-blush"
          >
            <RotateCw aria-hidden="true" className="size-5" />
          </button>
        </div>
      </form>
    </div>
  );
}
