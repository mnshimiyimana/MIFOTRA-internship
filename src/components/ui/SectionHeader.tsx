import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * One header pattern for every section: title → lede.
 * Keeps the type scale and line length (≤ 65ch) consistent across the page.
 */
export function SectionHeader({
  title,
  lede,
  className,
  children,
}: {
  title: ReactNode;
  lede?: ReactNode;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <header className={cn("flex flex-col gap-4", className)}>
      <h2 className="section-title font-heading text-portal-navy">{title}</h2>
      {lede && <p className="section-lede text-muted-foreground">{lede}</p>}
      {children}
    </header>
  );
}
