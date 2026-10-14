"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  Music2,
  Paintbrush,
  Utensils,
  Trophy,
  Smile,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSavePreferences } from "@/hooks/use-preferences";
import { categories, categoryLabels, type Category } from "@/types/event";

const icons = {
  MUSIC: Music2,
  WORKSHOP: Paintbrush,
  FOOD: Utensils,
  SPORTS: Trophy,
  KIDS: Smile,
};

export function CategoryPicker({
  userId,
  initialCategories,
}: {
  userId: string;
  initialCategories: Category[];
}) {
  const [selected, setSelected] = useState<Category[]>(initialCategories);
  const save = useSavePreferences(userId);
  const router = useRouter();

  function toggle(category: Category) {
    setSelected((previous) =>
      previous.includes(category)
        ? previous.filter((value) => value !== category)
        : [...previous, category],
    );
  }

  function handleSave() {
    save.mutate(selected, {
      onSuccess: () => {
        toast.success("Your interests are saved.");
        router.push("/feed");
      },
    });
  }

  return (
    <div>
      <div
        role="group"
        aria-label="Favourite categories"
        className="grid gap-3 sm:grid-cols-2"
      >
        {categories.map((category) => {
          const Icon = icons[category];
          const active = selected.includes(category);

          return (
            <button
              key={category}
              type="button"
              aria-pressed={active}
              disabled={save.isPending}
              onClick={() => toggle(category)}
              className={cn(
                "flex min-h-24 items-center gap-4 rounded-2xl border p-5",
                "text-left transition duration-200",
                "disabled:cursor-not-allowed disabled:opacity-60",
                active
                  ? "border-brand bg-blush"
                  : "border-line bg-white hover:border-brand/50",
              )}
            >
              <span
                className="flex size-11 shrink-0 items-center
                justify-center rounded-xl bg-elevated text-brand-ink"
              >
                <Icon aria-hidden="true" className="size-5" />
              </span>

              <span className="flex-1 text-sm font-semibold">
                {categoryLabels[category]}
              </span>

              <span
                aria-hidden="true"
                className={cn(
                  "flex size-6 items-center justify-center rounded-full border",
                  active
                    ? "border-brand-ink bg-brand-ink text-white"
                    : "border-line bg-white",
                )}
              >
                {active && <Check className="size-3.5" />}
              </span>
            </button>
          );
        })}
      </div>

      <p aria-live="polite" className="mt-5 text-sm text-muted">
        {selected.length} selected · Change your choices anytime.
      </p>

      {save.isError && (
        <p role="alert" className="mt-4 text-sm text-danger">
          {save.error.message}
        </p>
      )}

      <Button
        loading={save.isPending}
        onClick={handleSave}
        className="mt-6 w-full sm:w-auto"
      >
        Save and view my feed
      </Button>
    </div>
  );
}
