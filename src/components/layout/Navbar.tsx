import { lazy, useEffect, useState } from "react";
import { LogIn, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import logo from "@/assets/logo-removebg-preview.png";
import { WebGLDecoration } from "@/components/ui/WebGLDecoration";
import { cn } from "@/lib/utils";

const LiquidBrand = lazy(() => import("./LiquidBrand"));

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
  const [overHero, setOverHero] = useState(true);
  const [atTop, setAtTop] = useState(true);
  const [isBrandHovered, setIsBrandHovered] = useState(false);
  const [isBrandFocused, setIsBrandFocused] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const headerHeight =
        document.getElementById("site-header")?.offsetHeight ?? 80;
      const hero = document.getElementById("home");
      setAtTop(window.scrollY < 8);
      setOverHero(!!hero && hero.getBoundingClientRect().bottom > headerHeight);
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

  // Top of page: fully clear. Scrolling within the hero: hero-tinted so the
  // hero's content doesn't show through. Past the hero: white.
  const surface = isMenuOpen || !overHero ? "solid" : atTop ? "clear" : "hero";

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
          className="relative mr-auto min-w-0"
          onPointerEnter={(event) => {
            if (event.pointerType === "mouse") setIsBrandHovered(true);
          }}
          onPointerLeave={() => setIsBrandHovered(false)}
          onFocus={() => setIsBrandFocused(true)}
          onBlur={() => setIsBrandFocused(false)}
          onClick={() => setIsMenuOpen(false)}
        >
          <img
            src={logo}
            alt="National Professional Internship"
            className="h-auto max-h-11 w-full max-w-[14.5rem] object-contain sm:max-h-13 lg:max-w-[15.5rem]"
          />
          {(isBrandHovered || isBrandFocused) && (
            <WebGLDecoration>
              <LiquidBrand />
            </WebGLDecoration>
          )}
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
              className="relative whitespace-nowrap px-3 py-3 text-sm font-bold text-[#22324a] transition-colors after:absolute after:inset-x-3 after:bottom-1 after:h-0.5 after:origin-center after:scale-x-0 after:rounded-full after:bg-primary after:transition-transform hover:text-primary hover:after:scale-x-100 focus-visible:after:scale-x-100 aria-[current=location]:text-primary aria-[current=location]:after:scale-x-100 xl:px-4"
            >
              {name}
            </a>
          ))}
        </nav>

        <a
          href="https://internship.ippis.rw"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 shrink-0 items-center gap-2 whitespace-nowrap rounded-full bg-primary px-3.5 text-sm font-bold text-white transition-colors hover:bg-[#2350aa] sm:px-5"
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
          className="grid size-11 shrink-0 place-items-center rounded-full hover:bg-primary/10 lg:hidden"
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
            className="absolute inset-x-0 top-full grid gap-1 border-b bg-white px-4 py-3 shadow-lg sm:px-6 lg:hidden"
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
                  "rounded-xl px-4 py-3 font-bold text-portal-navy hover:bg-primary/5",
                  "aria-[current=location]:bg-primary/10 aria-[current=location]:text-primary",
                )}
              >
                {name}
              </a>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
