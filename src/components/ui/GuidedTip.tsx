import * as React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";

interface GuidedTipProps {
  content: string;
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
}

export function GuidedTip({ content, children, side = "top" }: GuidedTipProps) {
  return (
    <TooltipProvider delay={300}>
      <Tooltip>
        <TooltipTrigger
          render={
            <div className="relative group cursor-help inline-block">
              {children}
              <div className="absolute -top-1 -right-1">
                <div className="w-2 h-2 bg-primary rounded-full animate-ping opacity-75" />
              </div>
            </div>
          }
        />
        <TooltipContent
          side={side}
          className="max-w-xs bg-primary text-white p-3 rounded-xl border-none shadow-xl"
        >
          <div className="flex gap-2">
            <Info className="w-4 h-4 shrink-0 mt-0.5" />
            <p className="text-xs font-medium leading-relaxed">{content}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
