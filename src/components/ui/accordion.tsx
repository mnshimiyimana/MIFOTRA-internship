import * as React from "react";
import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion";
import { Plus } from "lucide-react";

import { cn } from "@/lib/utils";

function Accordion({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Root>) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      className={cn("space-y-4", className)}
      {...props}
    />
  );
}

function AccordionItem({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn(
        "overflow-hidden rounded-3xl border border-muted/20 bg-muted/10",
        className,
      )}
      {...props}
    />
  );
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Trigger
      data-slot="accordion-trigger"
      className={cn(
        "group flex w-full items-center justify-between gap-3 px-6 py-5 text-left text-lg font-bold tracking-tight text-foreground transition-colors hover:text-primary",
        className,
      )}
      {...props}
    >
      {children}
      <span
        aria-hidden
        className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors group-hover:border-primary/30 group-hover:text-primary group-data-[panel-open]:bg-primary group-data-[panel-open]:text-white group-data-[panel-open]:border-primary"
      >
        <Plus className="size-4 transition-transform duration-300 group-data-[panel-open]:rotate-45" />
      </span>
    </AccordionPrimitive.Trigger>
  );
}

function AccordionContent({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Panel>) {
  return (
    <AccordionPrimitive.Panel
      data-slot="accordion-content"
      className={cn(
        "overflow-hidden px-6 pb-8 text-muted-foreground text-base leading-relaxed",
        className,
      )}
      {...props}
    />
  );
}

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };
