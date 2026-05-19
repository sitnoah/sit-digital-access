import type { Metadata } from "next";
import { AnimatedSection } from "@/components/animated-section";
import {
  EcosystemCtaBand,
  EcosystemMetricGrid,
  PathwayGrid
} from "@/components/ecosystem/ecosystem-sections";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { csrPartnerships, sustainabilityMetrics } from "@/lib/ecosystem-content";

export const metadata: Metadata = {
  title: "CSR Partnerships",
  description:
    "CSR and ESG technology partnerships for corporate device recycling, education sponsorship and digital inclusion."
};

export default function CsrPartnershipsPage() {
  return (
    <main>
      <PageHero
        eyebrow="CSR partnerships"
        title="Convert corporate technology refresh cycles into measurable social impact."
        description="SIT Digital Access gives businesses a practical route for device recycling, school and community sponsorship, digital skills cohorts and reuse reporting."
        primary={{ label: "View partnership routes", href: "#partnership-routes" }}
        secondary={{ label: "Start a donation", href: "/donate#donation-form" }}
      />

      <div id="partnership-routes">
        <PathwayGrid
          eyebrow="Partnership routes"
          title="Choose the CSR model that fits your organisation."
          description="Use existing donation, request and enquiry workflows to move from intent to deployment without a new backend process."
          pathways={csrPartnerships}
          surface="white"
        />
      </div>

      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <AnimatedSection>
            <SectionHeading
              eyebrow="Reporting signals"
              title="Show what happened after devices left your business."
              description="Reuse, data handling, deployment, learner reach and circular economy indicators can support ESG and CSR evidence packs."
            />
          </AnimatedSection>
          <div className="mt-10">
            <AnimatedSection delay={0.1}>
              <EcosystemMetricGrid metrics={sustainabilityMetrics} />
            </AnimatedSection>
          </div>
        </div>
      </section>

      <EcosystemCtaBand
        title="Create a CSR route for retired devices, sponsored labs or digital skills cohorts."
        description="The current donation form already captures corporate recycling and sponsorship details so the operations team can qualify the opportunity."
        primary={{ label: "Open donation form", href: "/donate#donation-form" }}
        secondary={{ label: "View recycling workflow", href: "/device-recycling" }}
      />
    </main>
  );
}

