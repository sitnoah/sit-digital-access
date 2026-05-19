import type { Metadata } from "next";
import { AnimatedSection } from "@/components/animated-section";
import {
  EcosystemCtaBand,
  EcosystemFeatureGrid,
  EcosystemMetricGrid,
  ReuseJourneySection
} from "@/components/ecosystem/ecosystem-sections";
import { LiveImpactStats } from "@/components/live-impact-stats";
import { LiveSustainabilitySummary } from "@/components/ecosystem/live-ecosystem-data";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import {
  marketplaceTrustFeatures,
  reuseJourney,
  sustainabilityMetrics
} from "@/lib/ecosystem-content";
import { impactStats } from "@/lib/content";

export const metadata: Metadata = {
  title: "Sustainability",
  description:
    "Circular technology, reuse impact, CO2 savings and responsible refurbished device deployment from SIT Digital Access."
};

export default function SustainabilityPage() {
  return (
    <main>
      <PageHero
        eyebrow="Sustainability"
        title="Circular technology that keeps useful devices in education, work and community life."
        description="SIT Digital Access connects refurbished hardware, repair operations, secure reuse workflows and impact reporting so partners can reduce waste while expanding practical digital access."
        primary={{ label: "See reuse journey", href: "#reuse-journey" }}
        secondary={{ label: "Discuss CSR", href: "/csr-partnerships" }}
      />

      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <AnimatedSection>
            <SectionHeading
              eyebrow="Circular indicators"
              title="Sustainability is built into the access model."
              description="The platform surfaces reuse, repair, recycling and deployment signals from operational records with static trust indicators as fallback."
            />
          </AnimatedSection>
          <div className="mt-10">
            <AnimatedSection delay={0.1}>
              <EcosystemMetricGrid metrics={sustainabilityMetrics} />
            </AnimatedSection>
          </div>
          <div className="mt-6">
            <AnimatedSection delay={0.15}>
              <LiveSustainabilitySummary />
            </AnimatedSection>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <AnimatedSection>
            <SectionHeading
              eyebrow="Live impact"
              title="Reuse metrics ready for transparent reporting."
              description="Public impact figures can be pulled from the existing impact endpoint, with static fallback values when the API is unavailable."
            />
          </AnimatedSection>
          <div className="mt-10">
            <AnimatedSection delay={0.1}>
              <LiveImpactStats fallback={impactStats} />
            </AnimatedSection>
          </div>
        </div>
      </section>

      <div id="reuse-journey">
        <ReuseJourneySection steps={reuseJourney} />
      </div>

      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <AnimatedSection>
            <SectionHeading
              eyebrow="Marketplace trust"
              title="Refurbished technology needs clear proof points."
              description="Condition, repair history, lifecycle, warranty and sustainability signals help schools, NGOs and businesses choose second-life technology with confidence."
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
        title="Turn retired technology into access, skills and measurable impact."
        description="Use existing donation and CSR workflows to discuss collections, sponsorship, reuse reporting and deployment opportunities."
        primary={{ label: "Start a recycling route", href: "/device-recycling" }}
        secondary={{ label: "View impact", href: "/impact" }}
      />
    </main>
  );
}
