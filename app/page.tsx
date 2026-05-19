import { Suspense } from "react";
import { AnimatedSection } from "@/components/animated-section";
import { AfricaDeploymentSection } from "@/components/africa-deployment-section";
import { WhatWeDeliverSection } from "@/components/delivery/what-we-deliver-section";
import { DeviceCatalogueSection } from "@/components/devices/device-catalogue-section";
import { DonationCTA } from "@/components/donation-cta";
import { FAQAccordion } from "@/components/faq-accordion";
import { HeroSection } from "@/components/hero-section";
import { ImpactDashboard } from "@/components/impact-dashboard";
import { MetricsBar } from "@/components/metrics-bar";
import { PartnerCTA } from "@/components/partner-cta";
import { QualityTimeline } from "@/components/quality-timeline";
import { SectionHeading } from "@/components/section-heading";
import {
  faqs,
  homeMetrics,
  qualityProcess,
  qualityTrustBadges
} from "@/lib/data";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <section className="-mt-8 px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <MetricsBar metrics={homeMetrics} />
        </AnimatedSection>
      </section>

      <WhatWeDeliverSection />

      <Suspense fallback={null}>
        <DeviceCatalogueSection />
      </Suspense>

      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <AnimatedSection>
            <SectionHeading
              eyebrow="Quality process"
              title="Every device is prepared for real classrooms, teams and communities."
              description="Our refurbishment workflow is designed around responsible sourcing, secure preparation, performance checks and deployment support."
              className="max-w-4xl"
            />
          </AnimatedSection>
          <AnimatedSection className="mt-10" delay={0.1}>
            <QualityTimeline steps={qualityProcess} badges={qualityTrustBadges} />
          </AnimatedSection>
        </div>
      </section>

      <AfricaDeploymentSection />

      <ImpactDashboard />

      <DonationCTA />

      <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <AnimatedSection>
            <SectionHeading
              eyebrow="FAQ"
              title="Clear answers before you request devices."
              description="For schools, SMEs, NGOs, donors and partners, these are the practical questions that come up first."
            />
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <FAQAccordion items={faqs} />
          </AnimatedSection>
        </div>
      </section>

      <PartnerCTA />
    </main>
  );
}
