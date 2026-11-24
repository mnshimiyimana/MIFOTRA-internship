import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * One header pattern for every section: title → lede.
 * Keeps the type scale and line length (≤ 65ch) consistent across the page.
 */
export function SectionHeader({
  title,
  lede,
  tone = "light",
  className,
  children,
}: {
  title: ReactNode;
  lede?: ReactNode;
  /** "dark" for sections on a navy background. */
  tone?: "light" | "dark";
  className?: string;
  children?: ReactNode;
}) {
  const dark = tone === "dark";
  return (
    <header className={cn("flex flex-col gap-4", className)}>
      <h2
        className={cn(
          "section-title font-heading",
          dark ? "text-white" : "text-portal-navy",
        )}
      >
        {title}
      </h2>
      {lede && (
        <p
          className={cn(
            "section-lede",
            dark ? "text-[#c3d3f1]" : "text-muted-foreground",
          )}
        >
          {lede}
        </p>
      )}
      {children}
    </header>
  );
}
