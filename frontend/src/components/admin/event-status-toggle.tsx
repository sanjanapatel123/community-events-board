"use client";

import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { useSetEventStatus } from "@/hooks/use-admin-events";
import { cn } from "@/lib/utils";

export function EventStatusToggle({
  id,
  title,
  isActive,
}: {
  id: string;
  title: string;
  isActive: boolean;
}) {
  const mutation = useSetEventStatus();

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isActive}
      aria-label={`Active status for ${title}`}
      aria-busy={mutation.isPending}
      disabled={mutation.isPending}
      onClick={() =>
        mutation.mutate(
          { id, isActive: !isActive },
          {
            onSuccess: (data) => toast.success(data.message),
            onError: (error) => toast.error(error.message),
          },
        )
      }
      className={cn(
        "inline-flex min-h-11 items-center gap-2 rounded-full",
        "px-3 text-xs font-semibold transition-colors disabled:opacity-60",
        isActive ? "bg-blush text-brand-ink" : "bg-elevated text-muted",
      )}
    >
      {mutation.isPending ? (
        <LoaderCircle aria-hidden="true" className="size-3.5 animate-spin" />
      ) : (
        <span
          aria-hidden="true"
          className={cn(
            "size-2 rounded-full",
            isActive ? "bg-brand-ink" : "bg-muted",
          )}
        />
      )}

      {isActive ? "Active" : "Inactive"}
    </button>
  );
}
