import type { Metadata } from "next";
import { Suspense } from "react";
import { DeviceCatalogueSection } from "@/components/devices/device-catalogue-section";
import { DeviceMarketplaceTrust } from "@/components/devices/device-marketplace-trust";
import { DeviceRequestForm } from "@/components/device-request-form";
import { PageHero } from "@/components/page-hero";
import { PartnerCTA } from "@/components/partner-cta";
import { ProcessTimeline } from "@/components/process-timeline";
import { SectionHeading } from "@/components/section-heading";
import { AnimatedSection } from "@/components/animated-section";
import { qualityProcess } from "@/lib/content";

export const metadata: Metadata = {
  title: "Refurbished Devices",
  description:
    "Affordable refurbished laptops, desktops, mini PCs, monitors, accessories and classroom bundles for schools, SMEs, NGOs and training centres."
};

export default function DevicesPage() {
  return (
    <main>
      <PageHero
        eyebrow="Refurbished devices"
        title="Reliable laptops, desktops and mini PCs prepared for education and work."
        description="Browse deployment-ready refurbished products, compare options and request learner devices, business laptops, compact lab machines, accessories or complete bundles."
        primary={{ label: "Browse Catalogue", href: "#device-catalogue" }}
        secondary={{ label: "Request Devices", href: "#device-request" }}
      />

      <Suspense fallback={null}>
        <DeviceCatalogueSection />
      </Suspense>

      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <AnimatedSection>
            <DeviceMarketplaceTrust />
          </AnimatedSection>
        </div>
      </section>

      <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <AnimatedSection>
            <SectionHeading
              eyebrow="Quality process"
              title="A clear preparation workflow from sourcing to support."
              description="Every device should be useful, secure and documented before it reaches a learner, classroom or staff team."
            />
          </AnimatedSection>
          <div className="mt-10">
            <AnimatedSection delay={0.1}>
              <ProcessTimeline steps={qualityProcess} />
            </AnimatedSection>
          </div>
        </div>
      </section>

      <section id="device-request" className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <AnimatedSection>
            <SectionHeading
              eyebrow="Request devices"
              title="Send a structured device request to the SIT Digital Access team."
              description="This form posts directly to the NestJS API and captures the data needed to quote, plan and prioritise device supply."
            />
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <DeviceRequestForm />
          </AnimatedSection>
        </div>
      </section>

      <PartnerCTA />
    </main>
  );
}
