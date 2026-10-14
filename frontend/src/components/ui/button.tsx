import type { ButtonHTMLAttributes } from "react";
import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  loading?: boolean;
};

const variants = {
  primary: "bg-brand text-foreground shadow-sm hover:bg-brand-hover",
  secondary: "border border-line bg-white text-foreground hover:bg-elevated",
  ghost: "bg-transparent text-muted hover:bg-blush hover:text-foreground",
};

export function Button({
  children,
  className,
  variant = "primary",
  loading = false,
  disabled,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading}
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2",
        "rounded-full px-5 py-2.5 text-sm font-semibold",
        "transition duration-200",
        "motion-safe:active:scale-[0.98]",
        "disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        className,
      )}
    >
      {loading && (
        <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
      )}
      {children}
    </button>
  );
}
