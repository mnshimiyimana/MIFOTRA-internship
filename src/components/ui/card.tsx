import * as React from "react";

import { cn } from "@/lib/utils";

function Card({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "overflow-hidden rounded-3xl border border-muted/20 bg-background shadow-sm",
        className,
      )}
      {...props}
    />
  );
}

function CardContent({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div data-slot="card-content" className={cn("p-6", className)} {...props} />
  );
}

export { Card, CardContent };
