import type { Metadata } from "next";
import { AnimatedSection } from "@/components/animated-section";
import { EcosystemCtaBand } from "@/components/ecosystem/ecosystem-sections";
import { LiveSuccessStories } from "@/components/ecosystem/live-ecosystem-data";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";

export const metadata: Metadata = {
  title: "Success Stories",
  description:
    "Learner, school, NGO, community hub and CSR success story formats for SIT Digital Access."
};

export default function SuccessStoriesPage() {
  return (
    <main>
      <PageHero
        eyebrow="Success stories"
        title="Impact stories across learners, schools, NGOs, communities and CSR partnerships."
        description="Reusable story formats attach real-world context to devices reused, labs enabled, learners supported and organisations upgraded."
        primary={{ label: "Read story formats", href: "#stories" }}
        secondary={{ label: "View impact", href: "/impact" }}
      />

      <section id="stories" className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <AnimatedSection>
            <SectionHeading
              eyebrow="Story library"
              title="A premium storytelling layer for public proof."
              description="These cards are designed to be replaced with real case studies as deployments mature, while still giving partners a clear view of the impact model now."
            />
          </AnimatedSection>
          <div className="mt-10">
            <AnimatedSection delay={0.1}>
              <LiveSuccessStories />
            </AnimatedSection>
          </div>
        </div>
      </section>

      <EcosystemCtaBand
        title="Connect the next story to a device request, sponsorship or deployment plan."
        description="Every story should map back to practical operations: prepared devices, configured support, deployment location and measurable outcomes."
        primary={{ label: "Sponsor impact", href: "/donate" }}
        secondary={{ label: "Request devices", href: "/devices#device-request" }}
      />
    </main>
  );
}
