import { useState } from "react";
import { ArrowUpRight, Bell, ChevronDown } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

export function NotificationBanner() {
  const [isOpen, setIsOpen] = useState(true);
  const reduceMotion = useReducedMotion();

  return (
    <section
      aria-label="System notification"
      className="relative z-50 border-b bg-[#f2f2f2]"
    >
      <div className="mx-auto flex max-w-7xl items-center px-6">
        <button
          type="button"
          aria-label={isOpen ? "Collapse notification" : "Expand notification"}
          aria-expanded={isOpen}
          aria-controls={isOpen ? "system-update" : undefined}
          onClick={() => setIsOpen(!isOpen)}
          className="group flex min-h-10 items-center gap-2 text-sm font-bold hover:text-primary"
        >
          <Bell className="size-4 text-primary" aria-hidden="true" />
          {isOpen ? "Important update" : "System update"}
          <ChevronDown
            className={`size-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
            aria-hidden="true"
          />
        </button>
        <span className="ml-3 border-l border-[#cbd2dc] pl-3 text-xs font-medium text-muted-foreground">
          Internship System
        </span>
      </div>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id="system-update"
            initial={{ height: reduceMotion ? "auto" : 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: reduceMotion ? "auto" : 0, opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.2 }}
            className="overflow-hidden"
          >
            <div className="mx-auto flex max-w-7xl flex-wrap items-baseline gap-x-4 gap-y-1 px-6 pb-3 text-sm text-muted-foreground">
              <p>
                MIFOTRA has upgraded the Internship System. During this
                transition period, employers can still use the old system to
                track pending requests.
              </p>
              <a
                href="https://old.internship.ippis.rw"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-bold text-primary hover:underline"
              >
                Visit the old system
                <ArrowUpRight className="size-3.5" aria-hidden="true" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
