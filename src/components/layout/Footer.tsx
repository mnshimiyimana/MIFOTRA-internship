import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CompanyRegistrationPopover } from "@/components/sections/CompanyRegistrationPopover";
import { ArrowRight } from "lucide-react";
import { lazy, useRef } from "react";
import { motion } from "motion/react";
import {
  WebGLDecoration,
  useIdleMount,
  useNearViewport,
} from "@/components/ui/WebGLDecoration";
import programMark from "@/assets/program-mark.svg";

const CtaGradient = lazy(() =>
  import("./CtaScene").then((m) => ({ default: m.CtaGradient })),
);
const ProgramMarkMetal = lazy(() =>
  import("./CtaScene").then((m) => ({ default: m.ProgramMarkMetal })),
);

const programFacts = [
  {
    term: "Duration",
    value: "6–12 months",
  },
  {
    term: "Allowance",
    value: "Monthly",
  },
  {
    term: "Certificate",
    value: "By MIFOTRA",
  },
];

/** Program facts as stages along a path, ending in gold at the certificate. */
function FactsPath() {
  return (
    <ol className="relative mx-auto grid w-fit max-w-xl gap-5 text-left sm:w-full sm:grid-cols-3 sm:gap-4 lg:mx-0">
      <span
        aria-hidden="true"
        className="absolute top-2 bottom-2 left-[0.45rem] w-px bg-linear-to-b from-[#7fa6ef] to-[#f2c94c] sm:top-[0.45rem] sm:right-8 sm:bottom-auto sm:left-2 sm:h-px sm:w-auto sm:bg-linear-to-r"
      />
      {programFacts.map(({ term, value }, i) => (
        <li key={term} className="relative pl-8 sm:pt-7 sm:pl-0">
          <span
            aria-hidden="true"
            className={cn(
              "absolute top-1 left-0 size-[0.95rem] rounded-full border-2 sm:top-0",
              i === programFacts.length - 1
                ? "border-[#f2c94c] bg-[#f2c94c]"
                : "border-[#9dbcf5] bg-[#142a76]",
            )}
          />
          <p className="text-[0.7rem] font-bold tracking-[0.14em] text-[#a9c4f5] uppercase">
            {term}
          </p>
          <p className="mt-1 font-heading text-lg font-bold text-white">
            {value}
          </p>
        </li>
      ))}
    </ol>
  );
}

export function CTA() {
  const band = useRef<HTMLDivElement>(null);
  const near = useNearViewport(band);
  const idle = useIdleMount();
  const mounted = idle || near;

  return (
    <section className="section-pad bg-white px-6">
      <motion.div
        ref={band}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative isolate mx-auto max-w-[77rem] overflow-hidden rounded-3xl bg-[#142a76] px-5 py-12 text-white md:px-12 md:py-16"
      >
        {mounted && (
          <div aria-hidden="true" className="absolute inset-0 -z-10">
            <WebGLDecoration>
              <CtaGradient active={near} />
            </WebGLDecoration>
            {/* Keeps text contrast steady whatever the gradient is doing */}
            <div className="absolute inset-0 bg-linear-to-r from-[#0d1f5c]/70 via-[#122970]/35 to-transparent" />
          </div>
        )}

        <div className="grid items-center gap-10 lg:grid-cols-[1.35fr_1fr]">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-8 text-center lg:mx-0 lg:items-start lg:text-left">
            <h2 className="text-3xl md:text-5xl font-heading font-bold tracking-tight leading-tight">
              Ready to Jumpstart Your Internship?
            </h2>
            <p className="text-lg md:text-xl text-primary-foreground/80 leading-relaxed font-medium">
              Whether you're a graduate ready to start your internship or an
              employer looking for fresh graduates, we have a place for you.
            </p>

            <FactsPath />

            <div className="flex flex-wrap items-center justify-center gap-4 lg:justify-start">
              <a
                href="https://recruitment.mifotra.gov.rw"
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants({ size: "lg", variant: "secondary" }),
                  "group h-12 gap-2 rounded-full px-6 text-sm font-bold sm:text-base",
                )}
              >
                Apply for Internship
                <ArrowRight
                  className="size-4 transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </a>
              <CompanyRegistrationPopover
                className={cn(
                  buttonVariants({ size: "lg", variant: "outline" }),
                  "rounded-full px-6 h-12 text-sm sm:text-base font-bold bg-white/5 border-white/30 text-white backdrop-blur-sm hover:bg-white/15 hover:text-white transition-colors cursor-pointer",
                )}
              >
                Company Registration
              </CompanyRegistrationPopover>
            </div>
          </div>

          <div
            aria-hidden="true"
            className="relative mx-auto hidden aspect-square w-full max-w-[22rem] lg:block"
          >
            <div className="absolute inset-[12%] rounded-full bg-[#5d8ee8]/25 blur-3xl" />
            {mounted && (
              <WebGLDecoration
                fallback={
                  <img
                    src={programMark}
                    alt=""
                    className="relative size-full p-[12%] opacity-25 invert"
                  />
                }
              >
                <ProgramMarkMetal active={near} />
              </WebGLDecoration>
            )}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

export { Footer } from "./SiteFooter";
