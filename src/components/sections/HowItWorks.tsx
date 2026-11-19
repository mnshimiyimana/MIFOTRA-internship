import { lazy, useEffect, useRef, useState } from "react";
import { BriefcaseBusiness, FileUp, UsersRound } from "lucide-react";
import {
  AnimatePresence,
  animate,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import {
  WebGLDecoration,
  useIdleMount,
  useNearViewport,
} from "@/components/ui/WebGLDecoration";

import { SectionHeader } from "@/components/ui/SectionHeader";

const JourneyWorld = lazy(() => import("./JourneyWorld"));

const steps = [
  {
    title: "Apply Online",
    description:
      "Graduates submit their applications through our streamlined online portal.",
    icon: FileUp,
    tilt: -12,
  },
  {
    title: "Get Matched",
    description:
      "Our system intelligently matches applicants with top companies based on skills and interests.",
    icon: UsersRound,
    tilt: 10,
  },
  {
    title: "Start Your Internship",
    description:
      "Begin your professional journey, gain experience, and make a real impact.",
    icon: BriefcaseBusiness,
    tilt: -8,
  },
];

/**
 * Scroll progress → journey position. The flat stretches make each step
 * "hold" for a moment so it can be read before the camera moves on.
 */
const SCROLL_STOPS = [0, 0.14, 0.4, 0.6, 0.86, 1];
const JOURNEY_STOPS = [0, 0, 1, 1, 2, 2];
const STEP_SCROLL_POINT = [0.07, 0.5, 0.93];

function useScrollDriven() {
  const reduceMotion = useReducedMotion();
  const [desktop, setDesktop] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(
      "(min-width: 768px) and (min-height: 640px)",
    );
    const update = () => setDesktop(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return desktop && !reduceMotion;
}

function StepIllustration({ step }: { step: number }) {
  const reduceMotion = useReducedMotion();
  const { icon: SelectedIcon, tilt } = steps[step];

  return (
    <>
      <div className="workflow-illustration-rings absolute aspect-square w-65 rounded-full md:w-96" />
      <div className="absolute bottom-[17%] h-4 w-28 rounded-full bg-[#8facd4]/45 blur-md md:bottom-[22%] md:w-40" />
      <AnimatePresence initial={false} mode="sync">
        <motion.div
          key={step}
          className="[grid-area:1/1] relative grid size-21 place-items-center rounded-[1.6rem] border border-white bg-[#f8fbff] text-portal-navy shadow-[0_18px_36px_-14px_#345d9099,inset_0_0_18px_#d2e5ff] md:size-32 md:rounded-[2rem]"
          initial={
            reduceMotion
              ? false
              : { opacity: 0, scale: 0.74, y: 14, rotate: tilt }
          }
          animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
          exit={
            reduceMotion
              ? undefined
              : { opacity: 0, scale: 0.8, y: -12, rotate: -tilt }
          }
          transition={
            reduceMotion
              ? { duration: 0 }
              : { type: "spring", stiffness: 240, damping: 19 }
          }
        >
          <SelectedIcon className="size-10 md:size-16" strokeWidth={1.5} />
        </motion.div>
      </AnimatePresence>
    </>
  );
}

export function HowItWorks() {
  const [selectedStep, setSelectedStep] = useState(0);
  const reduceMotion = useReducedMotion();
  const scrollDriven = useScrollDriven();
  const track = useRef<HTMLDivElement>(null);
  const illustration = useRef<HTMLDivElement>(null);
  const isInView = useInView(illustration, { amount: 0.5 });
  const sceneNear = useNearViewport(illustration);
  const idle = useIdleMount();

  // 0 → Apply, 1 → Matched, 2 → Start. Fractions mean "travelling between".
  const journey = useMotionValue(0);
  const { scrollYProgress } = useScroll({
    target: track,
    offset: ["start start", "end end"],
  });
  const scrolledJourney = useTransform(
    scrollYProgress,
    SCROLL_STOPS,
    JOURNEY_STOPS,
  );
  const barWidth = useTransform(journey, [0, 2], ["8%", "100%"]);

  useMotionValueEvent(scrolledJourney, "change", (value) => {
    if (!scrollDriven) return;
    journey.set(value);
    setSelectedStep(Math.round(value));
  });

  // Small screens: auto-play through the steps once the section is seen.
  useEffect(() => {
    if (scrollDriven || reduceMotion || !isInView) return;

    setSelectedStep(0);
    const timers = steps
      .slice(1)
      .map((_, index) =>
        window.setTimeout(() => setSelectedStep(index + 1), (index + 1) * 2200),
      );
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [scrollDriven, isInView, reduceMotion]);

  useEffect(() => {
    if (scrollDriven) return;
    const controls = animate(journey, selectedStep, {
      type: "spring",
      stiffness: 60,
      damping: 16,
    });
    return () => controls.stop();
  }, [scrollDriven, selectedStep, journey]);

  const goToStep = (index: number) => {
    const element = track.current;
    if (!scrollDriven || !element) {
      setSelectedStep(index);
      return;
    }
    const top = element.getBoundingClientRect().top + window.scrollY;
    const travel = element.offsetHeight - window.innerHeight;
    window.scrollTo({
      top: top + travel * STEP_SCROLL_POINT[index],
      behavior: "smooth",
    });
  };

  return (
    <section id="how-it-works" className="section-pad bg-[#f1f7ff]">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          eyebrow="Workflow"
          title="How It Works"
          lede={
            <>
              A simple, three-step process to kickstart your professional
              internship.
              {scrollDriven && (
                <span className="hidden md:inline">
                  {" "}
                  Scroll to follow the journey.
                </span>
              )}
            </>
          }
          className="mb-10 md:mb-14"
        />

        <div ref={track} className={scrollDriven ? "h-[230vh]" : undefined}>
          <div
            className={
              scrollDriven
                ? "sticky top-[max(6rem,calc(50svh-15rem))]"
                : undefined
            }
          >
            <div className="grid overflow-hidden rounded-[1.5rem] border border-[#d9e6f4] bg-white md:grid-cols-[1.05fr_1fr]">
              <div
                ref={illustration}
                aria-hidden="true"
                className="workflow-illustration relative isolate grid place-items-center overflow-hidden min-h-80 md:min-h-[28rem]"
              >
                <WebGLDecoration
                  fallback={<StepIllustration step={selectedStep} />}
                >
                  {(idle || sceneNear) && (
                    <JourneyWorld journey={journey} active={sceneNear} />
                  )}
                  <div className="journey-caption absolute bottom-4 left-4 right-4 sm:right-auto sm:min-w-64 rounded-2xl border border-white/90 bg-white/85 shadow-[0_14px_34px_-14px_rgb(22_54_104/45%)]">
                    <div className="flex items-center gap-3 px-4 py-3">
                      <span className="font-heading text-xs font-bold tracking-[0.16em] text-primary tabular-nums">
                        0{selectedStep + 1}/03
                      </span>
                      <span className="text-sm font-bold text-portal-navy">
                        {steps[selectedStep].title}
                      </span>
                    </div>
                    <div className="mx-4 mb-3 h-1 overflow-hidden rounded-full bg-white/60">
                      <motion.div
                        className="h-full rounded-full bg-primary"
                        style={{ width: barWidth }}
                      />
                    </div>
                  </div>
                </WebGLDecoration>
              </div>

              <ol className="flex flex-col justify-center divide-y divide-[#e8eef6] px-4 py-2 sm:px-6 md:px-7 md:py-4">
                {steps.map(({ title, description, icon: Icon }, index) => (
                  <li
                    key={title}
                    data-active={selectedStep === index}
                    className="group"
                  >
                    <button
                      type="button"
                      onClick={() => goToStep(index)}
                      aria-current={selectedStep === index ? "step" : undefined}
                      className="my-1 grid w-full grid-cols-[2.5rem_1fr] items-center gap-3 rounded-xl px-2 py-4 text-left hover:bg-[#f5f9ff] motion-safe:transition-colors group-data-[active=true]:bg-[#edf5ff] sm:gap-4 sm:px-3 md:py-5"
                    >
                      <span className="grid size-10 place-items-center rounded-xl bg-[#edf5ff] text-primary motion-safe:transition-colors group-data-[active=true]:bg-primary group-data-[active=true]:text-white">
                        <Icon
                          className="size-5"
                          aria-hidden="true"
                          strokeWidth={1.75}
                        />
                      </span>
                      <span className="grid gap-1">
                        <span className="text-base font-bold text-portal-navy sm:text-lg">
                          {title}
                        </span>
                        <span className="text-sm leading-relaxed text-muted-foreground">
                          {description}
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
