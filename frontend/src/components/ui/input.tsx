import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
  error?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { id, label, error, className, ...props },
  ref,
) {
  const describedBy =
    [props["aria-describedby"], error ? `${id}-error` : undefined]
      .filter(Boolean)
      .join(" ") || undefined;

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>

      <input
        {...props}
        ref={ref}
        id={id}
        aria-invalid={error ? true : props["aria-invalid"]}
        aria-describedby={describedBy}
        className={cn(
          "min-h-12 w-full rounded-xl border border-line",
          "bg-background px-4 text-base placeholder:text-muted",
          "transition-colors focus:border-brand",
          "disabled:opacity-50",
          error && "border-danger",
          className,
        )}
      />

      {error && (
        <p id={`${id}-error`} role="alert" className="text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
});
