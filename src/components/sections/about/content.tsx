import {
  ArrowUpRight,
  Briefcase,
  Check,
  ChevronDown,
  ClipboardList,
  Gem,
  GraduationCap,
  History,
  MapPin,
  Target,
  UserCheck,
  type LucideIcon,
} from "lucide-react";
import type { ComponentType } from "react";

/* Shared content for every About layout. Wording is the official copy. */

export const historyHeading = "Program Evolution and Duration";

export const historyParagraphs = [
  "The internship program was adopted in 2009 with the core aim of equipping interns with practical skills required to facilitate the transition from school to the labour market. More specifically, the program aims at reinforcing the Rwandan graduates' practical capacity by linking theoretical skills to the practice.",
  "The standard duration of internship programme is six months. However, given the nature of fields, the duration can be extended for up to twelve (12) months.",
];

export const placements = [
  {
    icon: Briefcase,
    title: "Private Sector",
    description:
      "Collaborations with private companies providing technical placements.",
  },
  {
    icon: MapPin,
    title: "Public Sector",
    description:
      "Strategic placements in Ministries and District Agencies nationwide.",
  },
  {
    icon: GraduationCap,
    title: "Fresh Graduates",
    description:
      "Specifically designed for HLIs and Polytechnic graduates entering the workforce.",
  },
];

export const objectivesHeading = "Key Program Objectives";
export const objectivesIntro =
  "Our program is designed to build a strong foundation for a successful career, focusing on practical excellence and professional integrity.";

export const objectives = [
  "Equip interns with practical skills that are required to facilitate the transition between schools to the labor market.",
  "Reinforce the Rwandan graduates' practical capacity by linking theoretical skills to the practice.",
  "Develop professionalism, communication, interpersonal and organizational skills.",
  "Create positive work ethics amongst youth- effective work competences and employability skills for workforce development.",
  "Help gain valuable experience, increasing marketability after internship.",
];

export const benefits = [
  "Gain hands-on work experience in professional settings.",
  "Eases transition from school to the labour market.",
  "Provides tangible work experience necessary for employability.",
  "Standard monthly allowance for all active interns.",
  "Access to Government mentor network and support.",
];

export const processHeading = "Internship Application Journey";
export const processIntro =
  "The process is entirely online. Follow these simple steps to begin your journey.";

export const applicationSteps = [
  {
    title: "Registration",
    description:
      "Interested applicants must register through the MIFOTRA recruitment portal.",
    link: "www.recruitment.mifotra.gov.rw",
  },
  {
    title: "Application Submission",
    description:
      "Eligible applicants submit their applications through the MIFOTRA recruitment portal into the internship section.",
  },
  {
    title: "Application Verification",
    description:
      "MIFOTRA internship secretariat verifies the submitted applications and documents for eligibility and compliance with program requirements.",
  },
];

/* ── Reusable blocks ─────────────────────────────────────────────────── */

export function Eligibility({ className = "" }: { className?: string }) {
  return (
    <div
      className={`book-surface rounded-2xl px-5 py-4 text-white ${className}`}
    >
      <h4 className="flex items-center gap-2 font-bold">
        <UserCheck
          aria-hidden="true"
          className="size-4 shrink-0 text-[#bbd7ff]"
        />
        Program Eligibility
      </h4>
      <p className="mt-2 max-w-4xl text-sm leading-relaxed text-[#edf4ff]">
        The program is open to all{" "}
        <strong className="text-white">Rwandan fresh graduates</strong> from
        HLIs, polytechnic institutions in Rwanda or from abroad, in need of
        employability skills and professional experience.
      </p>
    </div>
  );
}

export function BenefitsList({ columns = true }: { columns?: boolean }) {
  return (
    <ul className={`grid gap-x-6 gap-y-3 ${columns ? "sm:grid-cols-2" : ""}`}>
      {benefits.map((benefit) => (
        <li
          key={benefit}
          className="flex items-start gap-2.5 text-sm leading-relaxed text-[#34475e]"
        >
          <Check
            aria-hidden="true"
            className="mt-0.5 size-4 shrink-0 text-primary"
          />
          <span>{benefit}</span>
        </li>
      ))}
    </ul>
  );
}

export function BenefitsDisclosure() {
  return (
    <details className="group rounded-xl border border-[#d8e6f8] bg-[#f6faff]">
      <summary className="flex min-h-12 cursor-pointer list-none items-center gap-2 rounded-xl px-4 py-3 font-bold text-portal-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:px-5 [&::-webkit-details-marker]:hidden">
        <Gem aria-hidden="true" className="size-4 shrink-0 text-primary" />
        Core Benefits
        <ChevronDown
          aria-hidden="true"
          className="ml-auto size-5 shrink-0 text-primary group-open:rotate-180 motion-safe:transition-transform"
        />
      </summary>
      <div className="border-t border-[#d8e6f8] px-4 py-4 sm:px-5">
        <BenefitsList />
      </div>
    </details>
  );
}

export function ObjectivesList() {
  return (
    <ol className="grid gap-3">
      {objectives.map((objective, index) => (
        <li
          key={objective}
          className="flex items-start gap-3 text-[0.95rem] leading-relaxed text-[#34475e]"
        >
          <span
            aria-hidden="true"
            className="grid size-6 shrink-0 place-items-center rounded-full bg-[#deebfd] text-xs font-bold text-primary"
          >
            {index + 1}
          </span>
          <span>{objective}</span>
        </li>
      ))}
    </ol>
  );
}

export function StepLink({ link }: { link: string }) {
  return (
    <a
      href={`https://${link}`}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-3 inline-flex max-w-full items-center gap-1 text-sm font-bold text-primary underline-offset-4 hover:underline"
    >
      <span className="min-w-0 break-words">{link}</span>
      <ArrowUpRight aria-hidden="true" className="size-4 shrink-0" />
    </a>
  );
}

export function StepCards() {
  return (
    <ol className="grid gap-4 md:grid-cols-3">
      {applicationSteps.map(({ title, description, link }, index) => (
        <li
          key={title}
          className="rounded-2xl border border-[#d5e3f4] bg-white p-5"
        >
          <span
            aria-hidden="true"
            className="mb-3 grid size-8 place-items-center rounded-full bg-primary text-sm font-bold text-white"
          >
            {index + 1}
          </span>
          <h5 className="font-bold text-portal-navy">{title}</h5>
          <p className="mt-2 text-sm leading-relaxed text-[#34475e]">
            {description}
          </p>
          {link && <StepLink link={link} />}
        </li>
      ))}
    </ol>
  );
}

export function PlacementList() {
  return (
    <ul className="divide-y divide-[#d6e3f5]">
      {placements.map(({ icon: Icon, title, description }) => (
        <li key={title} className="flex gap-3 py-3 first:pt-0 last:pb-0">
          <Icon
            className="mt-0.5 size-5 shrink-0 text-primary"
            aria-hidden="true"
          />
          <div>
            <h4 className="font-bold text-portal-navy">{title}</h4>
            <p className="mt-1 text-sm leading-relaxed text-[#34475e]">
              {description}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}

/* ── Section bodies (without their outer card / title) ───────────────── */

export function HistoryBody() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr] lg:gap-12">
      <div className="space-y-3 leading-relaxed text-[#34475e]">
        <h4 className="text-lg font-bold text-portal-navy">{historyHeading}</h4>
        {historyParagraphs.map((p) => (
          <p key={p.slice(0, 20)}>{p}</p>
        ))}
      </div>
      <PlacementList />
    </div>
  );
}

export function ObjectivesBody() {
  return (
    <div className="grid gap-5">
      <div>
        <h4 className="text-lg font-bold text-portal-navy">
          {objectivesHeading}
        </h4>
        <p className="mt-2 max-w-3xl leading-relaxed text-[#34475e]">
          {objectivesIntro}
        </p>
      </div>
      <ObjectivesList />
      <Eligibility />
      <BenefitsDisclosure />
    </div>
  );
}

export function ProcessBody() {
  return (
    <div className="grid gap-5">
      <div>
        <h4 className="text-lg font-bold text-portal-navy">{processHeading}</h4>
        <p className="mt-2 leading-relaxed text-[#34475e]">{processIntro}</p>
      </div>
      <StepCards />
    </div>
  );
}

export type AboutPart = {
  id: string;
  title: string;
  icon: LucideIcon;
  Body: ComponentType;
};

export const aboutParts: AboutPart[] = [
  { id: "history", title: "History", icon: History, Body: HistoryBody },
  { id: "objectives", title: "Objectives", icon: Target, Body: ObjectivesBody },
  { id: "process", title: "Process", icon: ClipboardList, Body: ProcessBody },
];
