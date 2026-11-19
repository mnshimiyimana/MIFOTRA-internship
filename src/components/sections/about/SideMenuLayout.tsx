import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { aboutParts } from "./content";

const cardTone = ["bg-[#f1f7ff]", "bg-white", "bg-[#eef5ff]"];

function PartTitle({ index }: { index: number }) {
  const { icon: Icon, title } = aboutParts[index];
  return (
    <h3 className="program-card-title text-portal-navy">
      <Icon aria-hidden="true" className="size-6 shrink-0 text-primary" />
      {title}
    </h3>
  );
}

/** Sticky side menu that tracks the part being read; content scrolls normally. */
export function SideMenuLayout() {
  const [active, setActive] = useState(0);
  const parts = useRef<(HTMLElement | null)[]>([]);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting)
            setActive(parts.current.indexOf(entry.target as HTMLElement));
        });
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    parts.current.forEach((part) => part && observer.observe(part));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="grid gap-6 lg:grid-cols-[14rem_1fr] lg:gap-12">
      <nav aria-label="About the program" className="hidden lg:block">
        <div className="sticky top-28">
          <ol className="relative grid gap-1 pl-5">
            <span
              aria-hidden="true"
              className="absolute top-2 bottom-2 left-0 w-0.5 rounded-full bg-[#dbe6f5]"
            />
            <span
              aria-hidden="true"
              className="absolute top-2 left-0 w-0.5 rounded-full bg-primary transition-[height] duration-500"
              style={{
                height: `calc(${((active + 1) / aboutParts.length) * 100}% - 1rem)`,
              }}
            />
            {aboutParts.map(({ id, title, icon: Icon }, index) => (
              <li key={id}>
                <button
                  type="button"
                  aria-current={active === index ? "true" : undefined}
                  onClick={() =>
                    parts.current[index]?.scrollIntoView({
                      behavior: reduceMotion ? "auto" : "smooth",
                      block: "start",
                    })
                  }
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left font-bold text-[#5b6b80] transition-colors hover:bg-[#f1f7ff] hover:text-portal-navy aria-[current=true]:bg-[#eaf2ff] aria-[current=true]:text-primary"
                >
                  <Icon className="size-4.5 shrink-0" aria-hidden="true" />
                  {title}
                </button>
              </li>
            ))}
          </ol>
        </div>
      </nav>

      <div className="grid gap-6">
        {aboutParts.map(({ id, Body }, index) => (
          <article
            key={id}
            id={`about-${id}`}
            ref={(el) => void (parts.current[index] = el)}
            data-active={active === index}
            className={cn(
              "scroll-mt-28 rounded-[1.75rem] border border-[#d8e6f8] p-5 transition-[border-color,box-shadow] duration-300 sm:p-8 lg:p-10",
              "data-[active=true]:border-[#b9cfee] data-[active=true]:shadow-[0_18px_40px_-30px_rgb(18_41_112/45%)]",
              cardTone[index],
            )}
          >
            <PartTitle index={index} />
            <div className="mt-5">
              <Body />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
