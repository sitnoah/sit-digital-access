import type { Metadata } from "next";
import { AnimatedSection } from "@/components/animated-section";
import {
  EcosystemCtaBand,
  EcosystemFeatureGrid,
  ReuseJourneySection
} from "@/components/ecosystem/ecosystem-sections";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { marketplaceTrustFeatures, reuseJourney } from "@/lib/ecosystem-content";

export const metadata: Metadata = {
  title: "Device Recycling",
  description:
    "Secure corporate device recycling, refurbishment, reuse and responsible circular technology workflows."
};

export default function DeviceRecyclingPage() {
  return (
    <main>
      <PageHero
        eyebrow="Device recycling"
        title="A reuse-first route for retired laptops, desktops, mini PCs and accessories."
        description="Plan secure collection, wipe guidance, repair triage, grading, refurbishment and social-impact deployment through the existing donation workflow."
        primary={{ label: "Schedule collection enquiry", href: "/donate#donation-form" }}
        secondary={{ label: "See reuse journey", href: "#reuse-journey" }}
      />

      <div id="reuse-journey">
        <ReuseJourneySection steps={reuseJourney} />
      </div>

      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <AnimatedSection>
            <SectionHeading
              eyebrow="Processing standards"
              title="Recycling is only the final route when reuse is no longer practical."
              description="The operational model prioritises diagnostics, repair, useful redeployment and parts recovery before responsible recycling."
            />
          </AnimatedSection>
          <div className="mt-10">
            <AnimatedSection delay={0.1}>
              <EcosystemFeatureGrid features={marketplaceTrustFeatures} />
            </AnimatedSection>
          </div>
        </div>
      </section>

      <EcosystemCtaBand
        title="Start a corporate recycling conversation with device count, location and timeline."
        description="The donation form captures corporate recycling fields, while repair operations can separate reusable, repairable and end-of-life assets."
        primary={{ label: "Submit recycling enquiry", href: "/donate#donation-form" }}
        secondary={{ label: "Explore CSR options", href: "/csr-partnerships" }}
      />
    </main>
  );
}
