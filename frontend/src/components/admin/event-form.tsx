"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreateEvent } from "@/hooks/use-admin-events";
import { categories, categoryLabels } from "@/types/event";
import { eventFormSchema, type EventFormValues } from "@/lib/validations/event";
import { useRouter } from "next/navigation";

const defaults: EventFormValues = {
  title: "",
  category: "MUSIC",
  city: "",
  startsAt: "",
  price: "0",
  description: "",
  imageUrl: "",
  isActive: true,
};

export function EventForm() {
  const create = useCreateEvent();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: defaults,
  });

  function onSubmit(values: EventFormValues) {
    create.mutate(
      {
        ...values,
        startsAt: `${values.startsAt}:00+05:30`,
      },
      {
        onSuccess: () => {
          reset(defaults);
          toast.success("Event created.");
          router.push("/admin");
        },
      },
    );
  }

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)}>
      <fieldset
        disabled={create.isPending}
        className="grid min-w-0 gap-5 disabled:opacity-70 sm:grid-cols-2"
      >
        <div className="sm:col-span-2">
          <Input
            id="event-title"
            label="Event title"
            placeholder="A night to remember"
            error={errors.title?.message}
            {...register("title")}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="event-category" className="text-sm font-medium">
            Category
          </label>

          <select
            id="event-category"
            aria-invalid={Boolean(errors.category)}
            aria-describedby={
              errors.category ? "event-category-error" : undefined
            }
            className="min-h-12 w-full rounded-xl border border-line
              bg-white px-4 text-base"
            {...register("category")}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {categoryLabels[category]}
              </option>
            ))}
          </select>

          {errors.category && (
            <p id="event-category-error" className="text-sm text-danger">
              {errors.category.message}
            </p>
          )}
        </div>

        <Input
          id="event-city"
          label="City"
          placeholder="Coimbatore"
          error={errors.city?.message}
          {...register("city")}
        />

        <Input
          id="event-date"
          label="Date & time (IST)"
          type="datetime-local"
          step={60}
          error={errors.startsAt?.message}
          {...register("startsAt")}
        />

        <Input
          id="event-price"
          label="Price (₹)"
          inputMode="decimal"
          placeholder="0 for free entry"
          error={errors.price?.message}
          {...register("price")}
        />

        <div className="sm:col-span-2">
          <Input
            id="event-image"
            label="Image URL"
            type="url"
            placeholder="https://..."
            error={errors.imageUrl?.message}
            {...register("imageUrl")}
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <label htmlFor="event-description" className="text-sm font-medium">
            Description
          </label>

          <textarea
            id="event-description"
            rows={4}
            placeholder="What can visitors look forward to?"
            aria-invalid={Boolean(errors.description)}
            aria-describedby={
              errors.description ? "event-description-error" : undefined
            }
            className="w-full resize-y rounded-xl border border-line
              bg-white px-4 py-3 text-base"
            {...register("description")}
          />

          {errors.description && (
            <p
              id="event-description-error"
              role="alert"
              className="text-sm text-danger"
            >
              {errors.description.message}
            </p>
          )}
        </div>

        <label className="flex min-h-11 items-center gap-3 text-sm sm:col-span-2">
          <input
            type="checkbox"
            className="size-4 accent-brand-ink"
            {...register("isActive")}
          />
          Make this event active
        </label>
      </fieldset>

      {create.isError && (
        <p
          role="alert"
          className="mt-4 rounded-xl bg-danger/5 p-3 text-sm text-danger"
        >
          {create.error.message}
        </p>
      )}

      <Button type="submit" loading={create.isPending} className="mt-5">
        {create.isPending ? "Creating event…" : "Create event"}
      </Button>
    </form>
  );
}
