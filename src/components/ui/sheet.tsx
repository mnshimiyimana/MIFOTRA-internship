import * as React from "react";
import { Drawer as SheetPrimitive } from "@base-ui/react/drawer";

import { cn } from "@/lib/utils";

function Sheet({
  // className,
  ...props
}: React.ComponentPropsWithoutRef<typeof SheetPrimitive.Root>) {
  return (
    <SheetPrimitive.Root
      data-slot="sheet"
      // className={cn(className)}
      {...props}
    />
  );
}

function SheetTrigger({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof SheetPrimitive.Trigger>) {
  return (
    <SheetPrimitive.Trigger
      data-slot="sheet-trigger"
      className={cn(className)}
      {...props}
    />
  );
}

interface SheetContentProps extends React.ComponentPropsWithoutRef<
  typeof SheetPrimitive.Content
> {
  side?: "left" | "right";
}

function SheetContent({
  className,
  side = "right",
  ...props
}: SheetContentProps) {
  const sideClass =
    side === "left"
      ? "left-0 border-r border-muted/20"
      : "right-0 border-l border-muted/20";

  return (
    <SheetPrimitive.Portal>
      <SheetPrimitive.Backdrop className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
      <SheetPrimitive.Content
        data-slot="sheet-content"
        className={cn(
          "fixed inset-y-0 z-50 flex w-full max-w-md flex-col gap-4 bg-background p-6 shadow-2xl shadow-black/10",
          sideClass,
          className,
        )}
        {...props}
      />
    </SheetPrimitive.Portal>
  );
}

export { Sheet, SheetContent, SheetTrigger };
