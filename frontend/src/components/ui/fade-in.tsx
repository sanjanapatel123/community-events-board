import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type FadeInProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

export function FadeIn({ children, className, delay = 0 }: FadeInProps) {
  return (
    <div
      className={cn("animate-enter motion-reduce:animate-none", className)}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
}
