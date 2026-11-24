import type { ReactNode } from "react";
import { ChevronRight, Building2, FilePlus2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const options = [
  {
    icon: Building2,
    title: "Do you want to view your companies?",
    description: "View all companies you registered.",
    href: "https://auth.ippis.rw/signin/?service=Employer%20Portal&continue=https://employer.ippis.rw/",
    styles: {
      row: "bg-[#eef3fb] hover:bg-[#e1e9f7]",
      icon: "bg-[#dbe5f6] text-book-blue group-hover:bg-book-blue group-hover:text-white",
      title: "group-hover:text-book-blue",
      arrow: "text-[#7f97c8] group-hover:text-book-blue",
    },
  },
  {
    icon: FilePlus2,
    title: "Do you want to register a new company?",
    description:
      "To register your company you need to have a TIN number and an ID number.",
    href: "https://auth.ippis.rw/signup?continue/?service=Employer%20Portal&continue=https://employer.ippis.rw/new-registration",
    styles: {
      row: "bg-emerald-50/70 hover:bg-emerald-100/70",
      icon: "bg-emerald-100 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white",
      title: "group-hover:text-emerald-700",
      arrow: "text-emerald-400 group-hover:text-emerald-600",
    },
  },
];

export function CompanyRegistrationPopover({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <Popover>
      <PopoverTrigger className={className}>{children}</PopoverTrigger>
      <PopoverContent
        sideOffset={10}
        className="gap-0 p-0 rounded-2xl w-[min(24rem,calc(100vw-2rem))] overflow-hidden shadow-2xl shadow-primary/15"
      >
        <div className="bg-primary/5 px-5 py-3.5 border-b">
          <p className="font-bold text-foreground text-sm">
            Company Registration
          </p>
          <p className="text-muted-foreground text-xs">
            Choose what you would like to do
          </p>
        </div>
        <div className="flex flex-col divide-y">
          {options.map(({ icon: Icon, title, description, href, styles }) => (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "group flex items-center gap-4 px-5 py-4 text-left transition-colors",
                styles.row,
              )}
            >
              <div
                className={cn(
                  "flex justify-center items-center rounded-xl w-10 h-10 transition-colors shrink-0",
                  styles.icon,
                )}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex flex-col flex-1 gap-0.5 min-w-0">
                <span
                  className={cn(
                    "font-semibold text-foreground text-sm leading-snug transition-colors",
                    styles.title,
                  )}
                >
                  {title}
                </span>
                <span className="text-muted-foreground text-xs leading-relaxed">
                  {description}
                </span>
              </div>
              <ChevronRight
                className={cn(
                  "w-5 h-5 transition-all group-hover:translate-x-1 shrink-0",
                  styles.arrow,
                )}
              />
            </a>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
