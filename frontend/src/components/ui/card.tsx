import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  interactive?: boolean;
};

export function Card({
  interactive = false,
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      {...props}
      className={cn(
        "rounded-3xl border border-line bg-surface shadow-card",
        interactive &&
          "transition duration-300 hover:shadow-card-hover " +
            "motion-safe:hover:-translate-y-1 " +
            "focus-within:shadow-card-hover",
        className,
      )}
    >
      {children}
    </div>
  );
}
