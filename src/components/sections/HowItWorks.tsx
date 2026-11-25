import { BriefcaseBusiness, FileUp, UsersRound } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { SectionHeader } from "@/components/ui/SectionHeader";

const steps = [
  {
    title: "Apply Online",
    description:
      "Graduates submit their applications through our streamlined online portal.",
    icon: FileUp,
    number: "bg-[#8b93c4]",
  },
  {
    title: "Get Matched",
    description:
      "Our system matches applicants with top companies based on skills and interests.",
    icon: UsersRound,
    number: "bg-[#5b8ac9]",
  },
  {
    title: "Start Your Internship",
    description:
      "Begin your professional journey, gain experience, and make a real impact.",
    icon: BriefcaseBusiness,
    number: "bg-[#33478e]",
  },
];

/** The dotted, gently dipping line that links one step to the next. */
function Connector() {
  return (
    <svg
      viewBox="0 0 96 24"
      fill="none"
      aria-hidden="true"
      className="mt-7 hidden h-6 w-16 shrink-0 text-[#9aa8c8] lg:block xl:w-24"
    >
      <path
        d="M2 4C26 4 30 20 50 20S78 6 94 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="0.5 7"
      />
    </svg>
  );
}

export function HowItWorks() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="how-it-works" className="section-pad bg-[#e3eefe]">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          title="How It Works"
          lede="A simple, three-step process to kickstart your professional internship."
          className="mb-10 md:mb-14"
        />

        <ol className="flex flex-col items-stretch gap-8 lg:flex-row lg:items-start lg:justify-between lg:gap-2">
          {steps.map(({ title, description, icon: Icon, number }, index) => (
            <motion.li
              key={title}
              className="flex items-start gap-2"
              initial={reduceMotion ? false : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.4, delay: index * 0.12 }}
            >
              {index > 0 && <Connector />}
              <div className="flex items-start gap-4 lg:max-w-[19rem]">
                <span
                  className={`grid size-10 shrink-0 place-items-center rounded-full font-heading text-lg font-extrabold text-white ${number} mt-4`}
                >
                  {index + 1}
                </span>
                <span
                  aria-hidden="true"
                  className="relative grid size-[4.5rem] shrink-0 place-items-center rounded-2xl bg-white text-[#33478e] shadow-[0_8px_20px_-12px_rgb(51_71_142/35%)]"
                >
                  <Icon className="size-8" strokeWidth={1.6} />
                  <span className="absolute -top-1 -right-1 size-3 rounded-full bg-book-yellow ring-2 ring-[#e3eefe]" />
                </span>
                <div className="min-w-0">
                  <h3 className="mt-1 text-lg font-bold text-portal-navy">
                    {title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {description}
                  </p>
                </div>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
