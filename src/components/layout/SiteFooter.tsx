import {
  ArrowRight,
  ArrowUpRight,
  Facebook,
  Instagram,
  LifeBuoy,
  Mail,
  MapPin,
  Phone,
  Twitter,
  Youtube,
} from "lucide-react";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo-removebg-preview.png";

/* ── Shared content ──────────────────────────────────────────────────── */

type FooterLink = { name: string; href: string; external?: boolean };

const linkGroups: { title: string; links: FooterLink[] }[] = [
  {
    title: "Program",
    links: [
      { name: "About Us", href: "#about" },
      { name: "Workflow", href: "#how-it-works" },
      { name: "FAQ", href: "#faq" },
      { name: "Our Impact", href: "#impact" },
    ],
  },
  {
    title: "For Interns",
    links: [
      {
        name: "Apply Now",
        href: "https://recruitment.mifotra.gov.rw",
        external: true,
      },
      {
        name: "Guidelines",
        href: "/internship-guidelines.pdf",
        external: true,
      },
    ],
  },
  {
    title: "For Employers",
    links: [
      {
        name: "Employer portal",
        href: "https://employer.ippis.rw",
        external: true,
      },
      {
        name: "Guidelines",
        href: "/internship-guidelines.pdf",
        external: true,
      },
    ],
  },
];

const socials = [
  { name: "X (Twitter)", href: "https://x.com/RwandaLabour", icon: Twitter },
  {
    name: "Facebook",
    href: "https://www.facebook.com/Mifotra",
    icon: Facebook,
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/channel/UC3RIcl1z0aZqfvI5upXezKg",
    icon: Youtube,
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/rwandalabour",
    icon: Instagram,
  },
];

const phones = [
  { display: "0788 333 752", tel: "+250788333752" },
  { display: "0788 333 739", tel: "+250788333739" },
];
const EMAIL = "info@mifotra.gov.rw";
const SUPPORT = "https://support.ippis.rw";
const WEBSITE = "https://www.mifotra.gov.rw";

const year = new Date().getFullYear();

/* ── Shared pieces ───────────────────────────────────────────────────── */

/** Thin stripe in the national flag's colours. */
function FlagStripe() {
  return (
    <div aria-hidden="true" className="flex h-1">
      <span className="flex-[2] bg-[#00a1de]" />
      <span className="flex-1 bg-[#fad201]" />
      <span className="flex-1 bg-[#20603d]" />
    </div>
  );
}

function ExternalHint({ external }: { external?: boolean }) {
  return external ? (
    <span className="sr-only"> (opens in a new tab)</span>
  ) : null;
}

function LinkColumns({ dark = false }: { dark?: boolean }) {
  return (
    <>
      {linkGroups.map(({ title, links }) => (
        <nav key={title} aria-label={title}>
          <h2
            className={cn(
              "text-xs font-bold tracking-[0.14em] uppercase",
              dark ? "text-[#a9c4f5]" : "text-portal-navy",
            )}
          >
            {title}
          </h2>
          <ul className="mt-4 grid gap-1">
            {links.map((link) => (
              <li key={link.name + link.href}>
                <a
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  className={cn(
                    "inline-flex min-h-11 items-center text-sm transition-colors lg:min-h-9",
                    dark
                      ? "text-[#d5e1f7] hover:text-white"
                      : "text-[#4b5b6e] hover:text-primary",
                  )}
                >
                  {link.name}
                  <ExternalHint external={link.external} />
                </a>
              </li>
            ))}
          </ul>
        </nav>
      ))}
    </>
  );
}

function SocialLinks({ dark = false }: { dark?: boolean }) {
  return (
    <ul className="flex gap-2">
      {socials.map(({ name, href, icon: Icon }) => (
        <li key={name}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`MIFOTRA on ${name}`}
            className={cn(
              "grid size-11 place-items-center rounded-full transition-colors",
              dark
                ? "bg-white/8 text-[#d5e1f7] ring-1 ring-white/15 hover:bg-white/15 hover:text-white"
                : "bg-white text-[#4b5b6e] ring-1 ring-[#dfe7f1] hover:text-primary hover:ring-[#b9cce8]",
            )}
          >
            <Icon className="size-[1.1rem]" aria-hidden="true" />
          </a>
        </li>
      ))}
    </ul>
  );
}

function BottomBar({ dark = false }: { dark?: boolean }) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 border-t py-6 text-xs sm:flex-row sm:items-center sm:justify-between",
        dark
          ? "border-white/12 text-[#a9bbdb]"
          : "border-[#dfe7f1] text-[#5b6b80]",
      )}
    >
      <p>
        © {year} Ministry of Public Service and Labour (MIFOTRA). All rights
        reserved.
      </p>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
        <p className="flex items-center gap-1.5">
          <MapPin className="size-3.5" aria-hidden="true" /> Kigali, Rwanda
        </p>
        <a
          href={WEBSITE}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "inline-flex min-h-11 items-center gap-1 font-semibold hover:underline",
            dark ? "text-white" : "text-primary",
          )}
        >
          Official website
          <ArrowUpRight className="size-3.5" aria-hidden="true" />
          <ExternalHint external />
        </a>
      </div>
    </div>
  );
}

function PhoneLinks({ className }: { className?: string }) {
  return (
    <>
      {phones.map((p, i) => (
        <span key={p.tel}>
          {i > 0 && " · "}
          <a href={`tel:${p.tel}`} className={cn("hover:underline", className)}>
            {p.display}
          </a>
        </span>
      ))}
    </>
  );
}

/* ── Footer: contact first, then navigation ──────────────────────────────────────────────── */

function HelpDeskFooter() {
  const row =
    "group flex min-h-24 items-center gap-4 px-1 py-5 transition-colors sm:px-6 hover:bg-white";
  return (
    <footer id="footer" className="bg-[#f4f7fb]">
      <FlagStripe />
      <div className="mx-auto max-w-7xl px-6">
        <div className="pt-14">
          <h2 className="font-heading text-2xl font-bold tracking-tight text-portal-navy sm:text-3xl">
            Need direct assistance?
          </h2>
          <p className="mt-2 max-w-xl text-[#4b5b6e]">
            Contact the MIFOTRA Internship secretariat or use our support
            channels.
          </p>
        </div>

        <ul className="mt-8 grid divide-y divide-[#dfe7f1] border-y border-[#dfe7f1] md:grid-cols-3 md:divide-x md:divide-y-0">
          <li className={row}>
            <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
              <Phone className="size-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-bold tracking-[0.12em] text-[#5b6b80] uppercase">
                Call us
              </p>
              <p className="mt-1 font-heading text-lg font-bold text-portal-navy">
                <PhoneLinks className="hover:text-primary" />
              </p>
            </div>
          </li>
          <li>
            <a href={`mailto:${EMAIL}`} className={row}>
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
                <Mail className="size-5" aria-hidden="true" />
              </span>
              <div className="flex-1">
                <p className="text-xs font-bold tracking-[0.12em] text-[#5b6b80] uppercase">
                  Email us
                </p>
                <p className="mt-1 font-heading text-lg font-bold text-portal-navy group-hover:text-primary">
                  {EMAIL}
                </p>
              </div>
              <ArrowRight
                className="size-5 text-primary transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </a>
          </li>
          <li>
            <a
              href={SUPPORT}
              target="_blank"
              rel="noopener noreferrer"
              className={row}
            >
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-primary text-white">
                <LifeBuoy className="size-5" aria-hidden="true" />
              </span>
              <div className="flex-1">
                <p className="text-xs font-bold tracking-[0.12em] text-[#5b6b80] uppercase">
                  Get help
                </p>
                <p className="mt-1 font-heading text-lg font-bold text-portal-navy group-hover:text-primary">
                  Support portal
                </p>
              </div>
              <ArrowUpRight
                className="size-5 text-primary transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
              <ExternalHint external />
            </a>
          </li>
        </ul>

        <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div className="flex flex-col gap-5">
            <img
              src={logo}
              alt="National Professional Internship"
              className="h-auto w-52"
            />
            <SocialLinks />
          </div>
          <LinkColumns />
        </div>
        <BottomBar />
      </div>
    </footer>
  );
}

export function Footer() {
  return <HelpDeskFooter />;
}
