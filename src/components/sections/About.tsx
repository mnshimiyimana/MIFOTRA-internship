import { SectionHeader } from "@/components/ui/SectionHeader";
import { SideMenuLayout } from "./about/SideMenuLayout";

export function About() {
  return (
    <section id="about" className="section-pad bg-white">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          eyebrow="About the program"
          title="Building Skills for Rwanda’s Future Workforce."
          className="mb-10 md:mb-14"
        />

        <SideMenuLayout />
      </div>
    </section>
  );
}
