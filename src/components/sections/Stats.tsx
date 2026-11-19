import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

const stats = [
  { label: "Graduates Placed", value: "22,000+" },
  { label: "Trusted Companies", value: "1,200+" },
  { label: "Employment Rate", value: "63%" },
];

function parseTargetValue(value: string) {
  const numericPart = value.replace(/[+,\%]/g, "");
  return {
    target: Number(numericPart.replace(/,/g, "")),
    suffix: value.replace(/\d|,/g, ""),
  };
}

export function Stats() {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [counts, setCounts] = useState<number[]>(stats.map(() => 0));

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible || reduceMotion) return;

    const duration = 1200;
    const startTime = performance.now();
    const targets = stats.map((stat) => parseTargetValue(stat.value).target);

    let frame: number;
    const step = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      setCounts(targets.map((target) => Math.round(target * progress)));

      if (progress < 1) {
        frame = requestAnimationFrame(step);
      }
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [isVisible, reduceMotion]);

  return (
    <section
      ref={sectionRef}
      className="relative mx-auto max-w-7xl px-6 pb-8 md:pb-10"
    >
      <div className="grid grid-cols-3 divide-x divide-[#c8d9ed] rounded-2xl border border-white/80 bg-white/75 py-5 shadow-[0_18px_40px_-28px_rgb(18_41_112/45%)] md:py-7">
        {stats.map((stat, i) => {
          const { target, suffix } = parseTargetValue(stat.value);
          const value = reduceMotion ? target : counts[i];
          const formattedValue = value.toLocaleString();

          return (
            <motion.div
              key={stat.label}
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="flex flex-col items-center justify-center gap-1 px-2 text-center sm:px-4"
            >
              <span
                aria-hidden="true"
                className="font-heading text-[clamp(1.25rem,3.8vw,2.6rem)] font-bold leading-none tracking-tight text-portal-navy tabular-nums"
              >
                {formattedValue}
                {suffix}
              </span>
              <span className="sr-only">{stat.value}</span>
              <span className="text-xs font-medium leading-tight text-muted-foreground sm:text-sm">
                {stat.label}
              </span>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
