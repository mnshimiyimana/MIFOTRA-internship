import { lazy, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { WebGLDecoration } from "@/components/ui/WebGLDecoration";
import {
  Building2,
  Check,
  FileText,
  GraduationCap,
  UserRound,
} from "lucide-react";

const InternshipGradient = lazy(() => import("./InternshipGradient"));

export function InternshipIllustration() {
  const artwork = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const artworkSeen = useInView(artwork, { amount: 0.3, once: true });
  const { scrollYProgress } = useScroll({
    target: artwork,
    offset: ["start 30%", "end start"],
  });
  const travel = useTransform(scrollYProgress, [0, 1], [0, 28]);
  const angle = useTransform(scrollYProgress, [0, 1], [0, -8]);

  useLayoutEffect(() => {
    if (!artworkSeen) return;

    const media = gsap.matchMedia(artwork);

    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .set("[data-hero-profile], [data-approved]", { autoAlpha: 0 })
        .set("[data-hero-line]", { scaleX: 0.16 })
        .set("[data-hero-graduate]", { autoAlpha: 1 })
        .from("[data-application]", { opacity: 0, y: 25, duration: 0.7 })
        .from(
          "[data-pathway]",
          { opacity: 0, y: 20, scale: 0.88, duration: 0.65, stagger: 0.18 },
          "-=0.4",
        )
        .to(
          "[data-hero-graduate]",
          { autoAlpha: 0, scale: 0.55, y: -7, duration: 0.32 },
          "+=0.3",
        )
        .fromTo(
          "[data-hero-profile]",
          { autoAlpha: 0, scale: 0.55, y: 7 },
          { autoAlpha: 1, scale: 1, y: 0, duration: 0.42 },
          "-=0.12",
        )
        .to(
          "[data-hero-line]",
          { scaleX: 1, duration: 0.55, stagger: 0.09 },
          "-=0.25",
        )
        .fromTo(
          "[data-approved]",
          { autoAlpha: 0, scale: 0.5 },
          { autoAlpha: 1, scale: 1, duration: 0.5, ease: "back.out(1.8)" },
          "-=0.12",
        )
        .to(
          "[data-hero-employer]",
          {
            keyframes: [
              { y: -10, duration: 0.26 },
              { y: 0, duration: 0.48, ease: "back.out(1.3)" },
            ],
          },
          "-=0.18",
        )
        .fromTo(
          "[data-hero-sheen]",
          { xPercent: -240 },
          { xPercent: 430, duration: 0.8, ease: "sine.inOut" },
          "-=0.6",
        );
    });

    return () => media.revert();
  }, [artworkSeen]);

  return (
    <div
      ref={artwork}
      aria-hidden="true"
      className="internship-illustration pointer-events-none relative isolate mx-auto aspect-[1.5] w-full max-w-[34rem]"
    >
      <div className="absolute inset-[4%_6%] -z-20 overflow-hidden rounded-[44%] bg-[#ccdef8]">
        <WebGLDecoration>
          <InternshipGradient progress={scrollYProgress} />
        </WebGLDecoration>
      </div>
      <div className="internship-illustration-grid absolute inset-[9%_3%] -z-10" />
      <div className="absolute inset-[24%_4%] -z-10 -rotate-[23deg] rounded-[50%] border-2 border-dashed border-[#88a9d9]" />

      <motion.div
        className="absolute inset-0"
        style={
          reduceMotion
            ? undefined
            : { y: travel, rotateY: angle, transformPerspective: 800 }
        }
      >
        <div data-pathway className="absolute left-[4%] top-[18%] z-10">
          <div className="internship-pathway-icon -rotate-12 bg-[#fff3c8] text-[#725416]">
            <GraduationCap strokeWidth={1.6} />
          </div>
        </div>

        <div data-application className="absolute inset-[8%_28%_9%_27%]">
          <div className="absolute inset-0 -rotate-[12deg] rounded-2xl border border-[#b6cdef] bg-[#e8f1ff]" />
          <div className="relative flex h-full rotate-[5deg] flex-col overflow-hidden rounded-2xl border border-[#b7c9e3] bg-white shadow-[0_20px_45px_-20px_#244d85aa]">
            <div className="internship-document-header flex items-center justify-between bg-[#193873] text-white">
              <FileText strokeWidth={1.7} />
              <div className="flex gap-1">
                <span className="size-1 rounded-full bg-white/60" />
                <span className="size-1 rounded-full bg-white/60" />
                <span className="size-1 rounded-full bg-white/60" />
              </div>
            </div>
            <div className="internship-document-body flex flex-1 flex-col justify-center">
              <div className="flex items-center gap-[9%]">
                <span className="internship-document-avatar relative grid shrink-0 place-items-center rounded-full bg-[#dceaff] text-[#2757a6]">
                  <GraduationCap
                    data-hero-graduate
                    className="invisible absolute inset-0 m-auto"
                    strokeWidth={1.6}
                  />
                  <UserRound data-hero-profile strokeWidth={1.6} />
                </span>
                <span className="grid w-full gap-1.5">
                  <span
                    data-hero-line
                    className="origin-left h-2 w-full rounded-full bg-[#315585]"
                  />
                  <span
                    data-hero-line
                    className="origin-left h-1.5 w-2/3 rounded-full bg-[#aec6ea]"
                  />
                </span>
              </div>
              <div className="h-px bg-[#e3eaf4]" />
              <div className="grid gap-2">
                <span
                  data-hero-line
                  className="origin-left h-1.5 rounded-full bg-[#c6d7ef]"
                />
                <span
                  data-hero-line
                  className="origin-left h-1.5 w-4/5 rounded-full bg-[#dce7f6]"
                />
                <span
                  data-hero-line
                  className="origin-left h-1.5 w-2/3 rounded-full bg-[#dce7f6]"
                />
              </div>
            </div>
            <div
              data-hero-sheen
              className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 skew-x-[-16deg] bg-linear-to-r from-transparent via-[#d5e8ff]/55 to-transparent"
            />
          </div>
          <div
            data-approved
            className="internship-approval absolute bottom-[5%] right-[-12%] grid place-items-center rounded-full border-[3px] border-white bg-[#2b6450] text-white shadow-md"
          >
            <Check strokeWidth={2.3} />
          </div>
        </div>

        <div data-pathway className="absolute bottom-[20%] right-[5%]">
          <div data-hero-employer>
            <div className="internship-pathway-icon rotate-12 bg-[#f7fbff] text-[#2454a4]">
              <Building2 strokeWidth={1.6} />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
