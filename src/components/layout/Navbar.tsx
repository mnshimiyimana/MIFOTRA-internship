import { useEffect, useState } from "react";
import { ArrowRight, Building2, LogIn, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { CompanyRegistrationPopover } from "@/components/sections/CompanyRegistrationPopover";
import coatOfArms from "@/assets/coat-of-arms-white.png";
import { cn } from "@/lib/utils";

const navLinks = [
  { name: "Home", href: "#home" },
  { name: "About Us", href: "#about" },
  { name: "Workflow", href: "#how-it-works" },
  { name: "FAQ", href: "#faq" },
  { name: "Our Impact", href: "#impact" },
  {
    name: "Guidelines",
    href: "/internship-guidelines.pdf",
    target: "_blank",
  },
];

const sectionLinks = navLinks.filter(({ href }) => href.startsWith("#"));

export function Navbar() {
  const [activeSection, setActiveSection] = useState("#home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [atTop, setAtTop] = useState(true);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const headerHeight =
        document.getElementById("site-header")?.offsetHeight ?? 80;
      setAtTop(window.scrollY < 8);
      const current = [...sectionLinks].reverse().find(({ href }) => {
        const section = document.getElementById(href.slice(1));
        return (
          section && section.getBoundingClientRect().top <= headerHeight + 24
        );
      });
      setActiveSection(current?.href ?? "#home");
    };
    // At most one layout read per frame, however fast the user scrolls.
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const closeOnDesktop = () => {
      if (desktop.matches) setIsMenuOpen(false);
    };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);

  // The hero's blue all the way down (clear at the very top, where the hero
  // itself shows through).
  const surface = atTop && !isMenuOpen ? "clear" : "hero";

  return (
    <header
      id="site-header"
      className="site-header sticky top-0 z-40"
      data-surface={surface}
      onKeyDown={(event) => {
        if (event.key === "Escape" && isMenuOpen) {
          setIsMenuOpen(false);
          document.getElementById("menu-toggle")?.focus();
        }
      }}
    >
      <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center gap-2 px-4 sm:gap-4 sm:px-6 lg:h-20">
        <a
          href="#home"
          className="mr-auto flex min-w-0 items-center gap-2.5 sm:gap-3"
          onClick={() => setIsMenuOpen(false)}
        >
          <img
            src={coatOfArms}
            alt=""
            className="h-9 w-auto shrink-0 sm:h-11"
          />
          <span className="logo-text text-base sm:text-xl">
            <span className="block text-white">National Professional</span>
            <span className="block text-book-yellow">Internship</span>
          </span>
        </a>

        <nav
          aria-label="Main menu"
          className="hidden items-center gap-0.5 lg:flex xl:gap-1.5"
        >
          {navLinks.map(({ name, href, target }) => (
            <a
              key={name}
              href={href}
              target={target}
              rel={target ? "noopener noreferrer" : undefined}
              aria-current={activeSection === href ? "location" : undefined}
              className={cn(
                "relative whitespace-nowrap px-3 py-3 text-sm font-bold transition-colors after:absolute after:inset-x-3 after:bottom-1 after:h-0.5 after:origin-center after:scale-x-0 after:rounded-full after:transition-transform hover:after:scale-x-100 focus-visible:after:scale-x-100 aria-[current=location]:after:scale-x-100 xl:px-4",
                "text-white/80 after:bg-book-yellow hover:text-white aria-[current=location]:text-white",
              )}
            >
              {name}
            </a>
          ))}
        </nav>

        <a
          href="https://internship.ippis.rw"
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "inline-flex min-h-11 shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-3.5 text-sm font-bold transition-colors sm:px-5",
            "bg-white text-book-blue hover:bg-[#eaf2ff]",
          )}
        >
          <LogIn className="hidden size-4 sm:block" aria-hidden="true" />
          Sign in
        </a>

        <button
          id="menu-toggle"
          type="button"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
          aria-controls={isMenuOpen ? "mobile-navigation" : undefined}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={cn(
            "grid size-11 shrink-0 place-items-center rounded-full lg:hidden",
            "text-white hover:bg-white/10",
          )}
        >
          {isMenuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.nav
            id="mobile-navigation"
            aria-label="Main menu"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className={cn(
              "absolute inset-x-0 top-full grid gap-1 px-4 py-3 shadow-lg sm:px-6 lg:hidden",
              "border-t border-white/10 bg-book-blue",
            )}
          >
            {navLinks.map(({ name, href, target }) => (
              <a
                key={name}
                href={href}
                target={target}
                rel={target ? "noopener noreferrer" : undefined}
                aria-current={activeSection === href ? "location" : undefined}
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  "rounded-xl px-4 py-3 font-bold",
                  "text-white/85 hover:bg-white/10 hover:text-white aria-[current=location]:bg-white/10 aria-[current=location]:text-white",
                )}
              >
                {name}
              </a>
            ))}
            <div
              className={cn(
                "mt-2 grid gap-2 border-t pt-4 pb-1 sm:grid-cols-2",
                "border-white/10",
              )}
            >
              <a
                href="https://recruitment.mifotra.gov.rw"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  "inline-flex h-12 items-center justify-center gap-2 rounded-full px-5 text-sm font-bold",
                  "bg-white text-book-blue hover:bg-[#eaf2ff]",
                )}
              >
                Apply for Internship
                <ArrowRight className="size-4" aria-hidden="true" />
              </a>
              <CompanyRegistrationPopover
                className={cn(
                  "inline-flex h-12 items-center justify-center gap-2 rounded-full border px-5 text-sm font-bold",
                  "border-white/40 bg-white/10 text-white hover:bg-white/20",
                )}
              >
                <Building2 className="size-4" aria-hidden="true" />
                Company Registration
              </CompanyRegistrationPopover>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
