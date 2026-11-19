import { ArrowUpRight, LifeBuoy } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionHeader } from "@/components/ui/SectionHeader";

const faqs = [
  {
    id: "eligibility",
    q: "Who is eligible for the program?",
    a: "The program is open to Rwandan graduates who completed their studies within the last two years. Applicants must hold a Diploma (A1), Bachelor's Degree (A0), or higher.",
  },
  {
    id: "duration",
    q: "What is the internship duration?",
    a: "Most internships last for six (6) months. However, for specialized technical fields the duration may be extended to twelve (12) months based on specific project requirements and performance evaluations.",
  },
  {
    id: "payment",
    q: "Are interns paid a stipend?",
    a: "Yes, interns receive a monthly subsistence allowance to cover transport and basic needs. The amount is determined based on prevailing government guidelines for the internship program and scales with the level of responsibilities.",
  },
  {
    id: "certificates",
    q: "Will I receive a certificate upon completion?",
    a: "Upon successful completion of the internship and submission of a final report validated by the supervisor, interns are awarded an official Professional Internship Certificate by MIFOTRA. This is a highly recognized credential for the Rwandan labor market.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="section-pad bg-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeader
            eyebrow="Frequently asked"
            title="Program Deep Dive"
            lede="Transparency and clarity are our priorities. Find detailed answers to common questions about the National Internship Program (NIP)."
          />
          <a
            href="https://support.ippis.rw"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 flex max-w-sm items-center gap-4 rounded-2xl border border-[#d9e3ef] bg-[#f6f9ff] p-4 transition-colors hover:border-[#b9cce8] hover:bg-[#eef4ff]"
          >
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary text-white">
              <LifeBuoy className="size-5" aria-hidden="true" />
            </span>
            <span className="flex-1">
              <span className="block font-bold text-portal-navy">
                Still have questions?
              </span>
              <span className="text-sm text-muted-foreground">
                Visit the support portal
              </span>
            </span>
            <ArrowUpRight className="size-5 text-primary" aria-hidden="true" />
          </a>
        </div>

        <Accordion defaultValue={["eligibility"]} className="grid w-full gap-3">
          {faqs.map((item) => (
            <AccordionItem
              key={item.id}
              value={item.id}
              className="rounded-2xl border border-[#d9e3ef] bg-white px-5 transition-colors hover:border-[#b9cce8] data-[open]:border-[#bcd0ee] data-[open]:bg-[#f6f9ff] sm:px-6"
            >
              <AccordionTrigger className="min-h-14 px-0 py-5 text-left text-base font-bold tracking-tight text-portal-navy transition-colors hover:text-primary hover:no-underline sm:text-lg">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="max-w-[65ch] px-0 pb-6 text-base leading-relaxed text-muted-foreground">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
