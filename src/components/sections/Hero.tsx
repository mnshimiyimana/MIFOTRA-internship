import { lazy, useRef } from "react";
import { useScroll } from "motion/react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight, Building2, GraduationCap, Landmark } from "lucide-react";
import {
  WebGLDecoration,
  useNearViewport,
} from "@/components/ui/WebGLDecoration";
import { InternshipIllustration } from "./InternshipIllustration";
import { Stats } from "./Stats";
import { CompanyRegistrationPopover } from "./CompanyRegistrationPopover";

const BridgeWorld = lazy(() => import("./BridgeWorld"));

export function Hero() {
  const hero = useRef<HTMLElement>(null);
  const near = useNearViewport(hero, "0px");
  const { scrollYProgress } = useScroll({
    target: hero,
    offset: ["start start", "end start"],
  });

  return (
    <section
      ref={hero}
      id="home"
      className="portal-hero relative isolate -mt-[4.5rem] overflow-hidden pt-[4.5rem] lg:-mt-20 lg:pt-20"
    >
      <div className="relative mx-auto grid max-w-7xl items-center gap-6 px-6 pt-10 pb-8 md:grid-cols-[1.05fr_1fr] md:gap-4 md:py-12 lg:min-h-[min(40rem,calc(100svh-12rem))]">
        <div className="portal-hero-copy relative z-10 flex max-w-xl flex-col items-start gap-6">
          <p className="hero-eyebrow inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/70 px-3 py-1.5 text-xs font-bold tracking-wide text-primary">
            <Landmark className="size-3.5" aria-hidden="true" />
            <span>
              MIFOTRA
              <span className="hidden sm:inline">
                {" "}
                · National Internship Program
              </span>{" "}
              · since 2009
            </span>
          </p>

          <h1 className="font-heading text-[clamp(2.5rem,4.3vw,3.9rem)] leading-[1.01] font-extrabold tracking-[-0.055em] text-portal-navy">
            Embrace Your Future with{" "}
            <span className="hero-highlight">confidence</span>
          </h1>

          <p className="max-w-lg text-base leading-relaxed text-[#263950] md:text-lg">
            A national pathway connecting talented graduates with institutions
            ready to invest in tomorrow’s professionals.
          </p>

          <div className="flex w-full flex-wrap items-center gap-3 pt-2">
            <a
              href="https://recruitment.mifotra.gov.rw"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants(),
                "group h-12 gap-2 rounded-full px-5 text-sm font-bold shadow-[0_10px_24px_-10px_#2b5ec2] hover:bg-[#2350aa] sm:text-base",
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
                buttonVariants({ variant: "outline" }),
                "h-12 gap-2 rounded-full border-[#b9cce8] bg-white/85 px-5 text-sm font-bold text-primary hover:bg-white hover:text-primary sm:text-base",
              )}
            >
              <Building2 className="size-4" aria-hidden="true" />
              Company Registration
            </CompanyRegistrationPopover>
          </div>
        </div>

        <div
          aria-hidden="true"
          className="relative mx-auto aspect-[1.2] w-full max-w-[40rem] md:-mr-6"
        >
          <WebGLDecoration
            fallback={
              <div className="grid size-full place-items-center">
                <InternshipIllustration />
              </div>
            }
          >
            {/* Wider than its box and feathered at every edge, so the scene
                melts into the hero instead of ending on a hard line. */}
            <div className="hero-scene-bleed absolute inset-y-[-6%] -inset-x-[4%] md:-right-[24%] md:-left-[16%]">
              <BridgeWorld progress={scrollYProgress} active={near} />
            </div>
            <span
              className="bridge-label absolute top-[20%] left-[8%] inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold text-portal-navy"
              style={{ animationDelay: "1.3s" }}
            >
              <GraduationCap className="size-3.5 text-primary" />
              Graduates
            </span>
            <span
              className="bridge-label absolute top-[12%] right-[6%] inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold text-portal-navy"
              style={{ animationDelay: "1.5s" }}
            >
              <Building2 className="size-3.5 text-primary" />
              Employers
            </span>
          </WebGLDecoration>
        </div>
      </div>

      <Stats />
    </section>
  );
}
