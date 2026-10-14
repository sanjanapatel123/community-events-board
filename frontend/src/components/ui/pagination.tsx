import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export function Pagination({ page, totalPages, onPageChange }: Props) {
  if (totalPages <= 1) return null;

  return (
    <nav
      aria-label="Event pagination"
      className="mt-10 flex flex-wrap items-center justify-center gap-4"
    >
      <Button
        variant="secondary"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        aria-label="Previous page"
        className="px-3"
      >
        <ChevronLeft aria-hidden="true" className="size-4" />
      </Button>

      <span aria-live="polite" className="text-sm text-muted">
        Page <span className="font-semibold text-foreground">{page}</span> of{" "}
        {totalPages}
      </span>

      <Button
        variant="secondary"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        aria-label="Next page"
        className="px-3"
      >
        <ChevronRight aria-hidden="true" className="size-4" />
      </Button>
    </nav>
  );
}
