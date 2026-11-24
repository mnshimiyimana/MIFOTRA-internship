import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Quote, Star } from "lucide-react";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useInView,
  useTransform,
  type MotionValue,
} from "motion/react";
import { cn } from "@/lib/utils";
import { SectionHeader } from "@/components/ui/SectionHeader";

/*
 * "Our impact" as a pinned, scroll-scrubbed data story in three acts.
 * Figures are the ones the site already publishes.
 */

const PLACED = 22000;
const EMPLOYED_PERCENT = 63;
const COMPANIES = 1200;
const PER_DOT = 100; // each dot = 100 graduates
const DOTS = Math.round(PLACED / PER_DOT); // 220
const EMPLOYED_DOTS = Math.round((DOTS * EMPLOYED_PERCENT) / 100); // 139
const COLUMNS = 20;

/** Scroll progress windows (0–1 across the pinned track) for each act. */
const ACTS = [
  { from: 0.0, to: 0.33 },
  { from: 0.33, to: 0.64 },
  { from: 0.64, to: 1.0 },
];

const acts = [
  {
    step: "01",
    label: "Placed",
    value: PLACED,
    suffix: "+",
    title: "Graduates Placed for Internships",
    desc: "Over 22,000 graduates have successfully secured internships through our program, gaining invaluable experience and industry exposure.",
  },
  {
    step: "02",
    label: "Employed",
    value: EMPLOYED_PERCENT,
    suffix: "%",
    title: "Post-Internship Employment",
    desc: "A vast majority of our interns go on to secure full-time positions.",
  },
  {
    step: "03",
    label: "Partners",
    value: COMPANIES,
    suffix: "+",
    title: "Trusted Companies",
    desc: "Companies that host interns through the program.",
  },
];

const publicService = {
  title: "Improved Public Service Delivery",
  desc: "Interns placed in public institutions have contributed to significant efficiency gains.",
};

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/**
 * Piecewise-linear map. Used through `useTransform(progress, fn)` on purpose:
 * Motion offloads array-form scroll transforms to the browser's native
 * ScrollTimeline, which mis-mapped these ranges; function transforms stay
 * on the JS path and are exact.
 */
function interp(p: number, input: number[], output: number[]) {
  if (p <= input[0]) return output[0];
  for (let i = 1; i < input.length; i++) {
    if (p <= input[i]) {
      const t = (p - input[i - 1]) / (input[i] - input[i - 1] || 1);
      return output[i - 1] + (output[i] - output[i - 1]) * t;
    }
  }
  return output[output.length - 1];
}
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

function useStoryMode() {
  const reduceMotion = useReducedMotion();
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const q = window.matchMedia("(min-width: 1024px) and (min-height: 680px)");
    const update = () => setWide(q.matches);
    update();
    q.addEventListener("change", update);
    return () => q.removeEventListener("change", update);
  }, []);
  return wide && !reduceMotion;
}

/* ── Waffle field: 220 dots, outlined → white (placed) → gold (employed) ── */

function DotField({
  placed,
  employed,
}: {
  /** How many dots are shown (0–DOTS). */
  placed: number;
  /** How many of them are gold (0–EMPLOYED_DOTS). */
  employed: number;
}) {
  return (
    <div
      aria-hidden="true"
      className="grid gap-[clamp(4px,0.5vw,8px)]"
      style={{ gridTemplateColumns: `repeat(${COLUMNS}, minmax(0, 1fr))` }}
    >
      {Array.from({ length: DOTS }, (_, i) => (
        <span
          key={i}
          data-dot
          data-state={
            i < employed ? "employed" : i < placed ? "placed" : "empty"
          }
          className="impact-dot aspect-square rounded-full"
        />
      ))}
    </div>
  );
}

/** Keeps dot states in sync with scroll without re-rendering React. */
function useDrivenDots(
  field: React.RefObject<HTMLDivElement | null>,
  progress: MotionValue<number>,
  enabled: boolean,
) {
  const last = useRef({ placed: -1, employed: -1 });

  useMotionValueEvent(progress, "change", (p) => {
    if (!enabled || !field.current) return;
    const placed = Math.round(
      DOTS * easeOut(clamp01((p - ACTS[0].from - 0.02) / 0.26)),
    );
    const employed = Math.round(
      EMPLOYED_DOTS * easeOut(clamp01((p - ACTS[1].from - 0.03) / 0.22)),
    );
    if (placed === last.current.placed && employed === last.current.employed)
      return;
    const dots = field.current.querySelectorAll<HTMLElement>("[data-dot]");
    dots.forEach((dot, i) => {
      const state = i < employed ? "employed" : i < placed ? "placed" : "empty";
      if (dot.dataset.state !== state) dot.dataset.state = state;
    });
    last.current = { placed, employed };
  });
}

/** Scroll-linked number, written straight to the DOM. */
function ScrubNumber({
  progress,
  act,
  value,
  suffix,
}: {
  progress: MotionValue<number>;
  act: number;
  value: number;
  suffix: string;
}) {
  const el = useRef<HTMLSpanElement>(null);
  useMotionValueEvent(progress, "change", (p) => {
    if (!el.current) return;
    const t = easeOut(clamp01((p - ACTS[act].from - 0.02) / 0.22));
    el.current.textContent = `${Math.round(value * t).toLocaleString()}${suffix}`;
  });
  return (
    <span ref={el} className="tabular-nums">
      {`${value.toLocaleString()}${suffix}`}
    </span>
  );
}

/** The current act's text. Only one is ever mounted, so acts cannot overlap. */
function ActText({
  progress,
  index,
}: {
  progress: MotionValue<number>;
  index: number;
}) {
  const reduceMotion = useReducedMotion();
  const act = acts[index];
  const last = index === acts.length - 1;

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduceMotion ? undefined : { opacity: 0, y: -16 }}
      transition={{ duration: 0.32, ease: [0.2, 0.7, 0.3, 1] }}
    >
      <p className="font-heading text-[clamp(4rem,8vw,7.5rem)] leading-[0.9] font-black tracking-[-0.045em] text-portal-navy">
        <ScrubNumber
          progress={progress}
          act={index}
          value={act.value}
          suffix={act.suffix}
        />
      </p>
      <h3
        className={cn(
          "mt-6 font-heading text-2xl font-bold",
          index === 1 ? "text-primary" : "text-portal-navy",
        )}
      >
        {act.title}
      </h3>
      <p className="mt-3 max-w-md text-base leading-relaxed text-[#3d5170]">
        {act.desc}
      </p>
      {last && (
        <div className="mt-8 max-w-md border-l-2 border-[#e0ad1c] pl-5">
          <p className="font-heading text-lg font-bold text-portal-navy">
            {publicService.title}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-[#3d5170]">
            {publicService.desc}
          </p>
        </div>
      )}
    </motion.div>
  );
}

function ActRail({ progress }: { progress: MotionValue<number> }) {
  return (
    <ol className="flex gap-6 text-sm font-bold">
      {acts.map(({ step, label }, i) => (
        <RailItem
          key={step}
          progress={progress}
          index={i}
          step={step}
          label={label}
        />
      ))}
    </ol>
  );
}

function RailItem({
  progress,
  index,
  step,
  label,
}: {
  progress: MotionValue<number>;
  index: number;
  step: string;
  label: string;
}) {
  const { from, to } = ACTS[index];
  const fill = useTransform(progress, (p) => interp(p, [from, to], [0, 1]));
  const color = useTransform(progress, (p) =>
    p >= from - 0.005 ? "#122970" : "#7a8aa6",
  );
  return (
    <li className="w-28">
      <motion.span style={{ color }} className="flex gap-2">
        <span className="tabular-nums opacity-60">{step}</span> {label}
      </motion.span>
      <span className="mt-2 block h-0.5 overflow-hidden rounded-full bg-[#122970]/10">
        <motion.span
          style={{ scaleX: fill }}
          className="block h-full origin-left bg-primary"
        />
      </span>
    </li>
  );
}

function Legend({ showEmployed }: { showEmployed: boolean }) {
  return (
    <ul className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold text-[#3d5170]">
      <li className="flex items-center gap-2">
        <span
          className="impact-dot size-2.5 rounded-full"
          data-state="placed"
        />
        1 dot = {PER_DOT} graduates placed
      </li>
      <li
        className={cn(
          "flex items-center gap-2 transition-opacity duration-500",
          showEmployed ? "opacity-100" : "opacity-0",
        )}
      >
        <span
          className="impact-dot size-2.5 rounded-full"
          data-state="employed"
        />
        Employed after the internship
      </li>
    </ul>
  );
}

/* ── Desktop: pinned scroll story ────────────────────────────────────── */

function ScrollStory() {
  const track = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLDivElement>(null);
  const [act, setAct] = useState(0);
  // Matches when the story is actually pinned (it is centred, not at the
  // top), so there is no dead scrolling before or after it.
  const { scrollYProgress } = useScroll({
    target: track,
    offset: ["start 25%", "end 80%"],
  });
  useDrivenDots(field, scrollYProgress, true);
  useMotionValueEvent(scrollYProgress, "change", (p) =>
    setAct(p < ACTS[1].from ? 0 : p < ACTS[2].from ? 1 : 2),
  );
  const fieldScale = useTransform(scrollYProgress, (p) =>
    interp(p, [0.64, 1], [1, 0.94]),
  );

  return (
    <div ref={track} className="relative h-[250vh]">
      {/* Pinned at its own height, centred in the space under the navbar:
          enters right below the header, and while pinned the leftover space
          splits evenly above and below instead of piling up underneath. */}
      <div className="sticky top-[max(5.5rem,calc(50svh-12rem))] overflow-hidden pt-4 pb-10">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-[1fr_minmax(0,32rem)] items-center gap-20 px-6">
          <div className="flex flex-col gap-10">
            <ActRail progress={scrollYProgress} />
            <div className="min-h-[22rem]">
              <AnimatePresence mode="wait" initial={false}>
                <ActText key={act} progress={scrollYProgress} index={act} />
              </AnimatePresence>
            </div>
          </div>
          <motion.div
            style={{ scale: fieldScale }}
            className="flex flex-col gap-5"
          >
            <div ref={field}>
              <DotField placed={0} employed={0} />
            </div>
            <Legend showEmployed={act >= 1} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

/* ── Mobile / tablet: compact story that plays as each part scrolls in ── */

const EASE_OUT = [0.2, 0.7, 0.3, 1] as [number, number, number, number];

/** Counts up from 0 the first time it is seen; static under reduced motion. */
function CountUp({ value, suffix }: { value: number; suffix: string }) {
  const el = useRef<HTMLSpanElement>(null);
  const seen = useInView(el, { once: true, amount: 0.8 });
  const reduceMotion = useReducedMotion();
  const final = `${value.toLocaleString()}${suffix}`;

  useEffect(() => {
    if (!seen || reduceMotion || !el.current) return;
    const node = el.current;
    const controls = animate(0, value, {
      duration: 1.4,
      ease: EASE_OUT,
      onUpdate: (v) => {
        node.textContent = `${Math.round(v).toLocaleString()}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [seen, reduceMotion, value, suffix]);

  return (
    <span ref={el} className="tabular-nums">
      {reduceMotion || seen ? final : `0${suffix}`}
    </span>
  );
}

/** 10×10 waffle: 63 of every 100 dots turn gold when it scrolls into view. */
function EmployedWaffle() {
  const grid = useRef<HTMLDivElement>(null);
  const seen = useInView(grid, { once: true, amount: 0.6 });
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!grid.current) return;
    const dots = grid.current.querySelectorAll<HTMLElement>("[data-dot]");
    const paint = (count: number) =>
      dots.forEach((dot, i) => {
        const state = i < count ? "employed" : "placed";
        if (dot.dataset.state !== state) dot.dataset.state = state;
      });
    if (reduceMotion) return paint(EMPLOYED_PERCENT);
    if (!seen) return paint(0);
    const controls = animate(0, EMPLOYED_PERCENT, {
      duration: 1.6,
      delay: 0.2,
      ease: EASE_OUT,
      onUpdate: (v) => paint(Math.round(v)),
    });
    return () => controls.stop();
  }, [seen, reduceMotion]);

  return (
    <div className="flex flex-col gap-3">
      <div
        ref={grid}
        className="grid w-full max-w-[15rem] grid-cols-10 gap-1.5"
      >
        {Array.from({ length: 100 }, (_, i) => (
          <span
            key={i}
            data-dot
            data-state="placed"
            className="impact-dot aspect-square rounded-full"
          />
        ))}
      </div>
      <p className="flex items-center gap-2 text-xs font-semibold text-[#3d5170]">
        <span
          className="impact-dot size-2.5 rounded-full"
          data-state="employed"
        />
        {EMPLOYED_PERCENT} of every 100 interns employed
      </p>
    </div>
  );
}

function CompactStory() {
  const reduceMotion = useReducedMotion();
  return (
    <div className="mx-auto grid max-w-3xl gap-8 px-6 pb-10">
      {acts.map((a, i) => (
        <motion.div
          key={a.step}
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, ease: EASE_OUT }}
          className={cn(
            "border-t border-[#122970]/12 pt-6",
            i === 1 && "grid gap-6 sm:grid-cols-[1fr_auto] sm:items-center",
          )}
        >
          <div>
            <p className="text-xs font-bold tracking-[0.16em] text-primary uppercase">
              {a.step} · {a.label}
            </p>
            <p className="mt-3 font-heading text-6xl leading-none font-black tracking-tight text-portal-navy">
              <CountUp value={a.value} suffix={a.suffix} />
            </p>
            <h3
              className={cn(
                "mt-4 font-heading text-xl font-bold",
                i === 1 ? "text-primary" : "text-portal-navy",
              )}
            >
              {a.title}
            </h3>
            <p className="mt-2 max-w-[65ch] leading-relaxed text-[#3d5170]">
              {a.desc}
            </p>
          </div>
          {i === 1 && (
            <div className="hidden md:block">
              <EmployedWaffle />
            </div>
          )}
        </motion.div>
      ))}
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.5, ease: EASE_OUT }}
        className="border-l-2 border-[#e0ad1c] pl-5"
      >
        <p className="font-heading text-lg font-bold text-portal-navy">
          {publicService.title}
        </p>
        <p className="mt-1 text-sm leading-relaxed text-[#3d5170]">
          {publicService.desc}
        </p>
      </motion.div>
    </div>
  );
}

export function Impact() {
  const story = useStoryMode();

  return (
    <section id="impact" className="impact-story relative isolate">
      <div className="mx-auto max-w-7xl px-6 pt-[clamp(4rem,3rem+4vw,7rem)]">
        <SectionHeader
          title="Results that speak for the program"
          lede="We are proud of the tangible results our program has delivered for graduates and the nation."
          className="mb-6 md:mb-8"
        />
      </div>

      {/* Full figures for assistive tech, independent of the animation */}
      <ul className="sr-only">
        {acts.map((a) => (
          <li key={a.step}>
            {a.value.toLocaleString()}
            {a.suffix} {a.title}. {a.desc}
          </li>
        ))}
        <li>
          {publicService.title}. {publicService.desc}
        </li>
      </ul>

      <div aria-hidden="true">
        {story ? (
          <ScrollStory />
        ) : (
          <CompactStory />
        )}
      </div>
    </section>
  );
}

const testimonials = [
  {
    name: "xxx xxx",
    role: "Software Developer at xxxx",
    quote:
      "This program was a game-changer! The hands-on experience I gained was invaluable and led directly to a full-time job offer.",
    avatar: "AK",
  },
  {
    name: "xxx xxxxx",
    role: "UX/UI Designer at xxxx",
    quote:
      "I went from a fresh graduate with theoretical knowledge to a confident professional. The mentorship and real-world projects were incredible.",
    avatar: "JL",
  },
  {
    name: "xxx xxxxx",
    role: "Data Analyst at xxxxx",
    quote:
      "The internship didn't just teach me technical skills; it taught me how to collaborate, communicate, and thrive in a professional environment.",
    avatar: "MC",
  },
];

export function Testimonials() {
  return (
    <section
      id="testimonials"
      className="py-24 bg-background overflow-hidden relative"
    >
      <div className="absolute top-1/2 left-0 w-full h-1/2 bg-blue-50/30 -skew-y-3 -z-10" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col items-center text-center gap-4 mb-20">
          <h2 className="text-4xl font-heading font-bold tracking-tight text-foreground">
            What Our Interns Say
          </h2>
          <p className="text-muted-foreground max-w-2xl px-6">
            Real stories from graduates who have launched their careers with us.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.15 }}
              viewport={{ once: true }}
            >
              <Card className="h-full bg-white border-none shadow-2xl shadow-blue-900/5 relative p-4 group">
                <Quote className="absolute top-8 right-8 w-12 h-12 text-blue-50 -z-0" />
                <CardContent className="pt-10 flex flex-col gap-8 relative z-10">
                  <div className="flex items-center gap-1 text-yellow-500">
                    {[1, 2, 3, 4, 5].map((j) => (
                      <Star key={j} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-lg text-foreground italic leading-relaxed">
                    "{t.quote}"
                  </p>
                  <div className="mt-auto flex items-center gap-4 pt-6 border-t border-muted">
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold group-hover:scale-110 transition-transform">
                      {t.avatar}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-foreground">
                        {t.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {t.role}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
