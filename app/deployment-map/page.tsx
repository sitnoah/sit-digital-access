import type { Metadata } from "next";
import { AfricaDeploymentMap } from "@/components/africa/africa-deployment-map";
import { AnimatedSection } from "@/components/animated-section";
import {
  DeploymentReadinessGrid,
  EcosystemCtaBand
} from "@/components/ecosystem/ecosystem-sections";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { deploymentMapRegions } from "@/lib/ecosystem-content";

export const metadata: Metadata = {
  title: "Deployment Map",
  description:
    "Africa deployment map, readiness scoring, regional planning and power-aware deployment signals for SIT Digital Access."
};

export default function DeploymentMapPage() {
  return (
    <main>
      <PageHero
        eyebrow="Deployment map"
        title="Africa deployment planning with country readiness, partner context and power-aware assumptions."
        description="A public planning layer for where refurbished devices, school labs, community hubs and support models can be deployed across priority regions."
        primary={{ label: "View readiness", href: "#readiness" }}
        secondary={{ label: "Explore Africa deployment", href: "/africa-deployment" }}
      />

      <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <AnimatedSection>
            <SectionHeading
              eyebrow="Map view"
              title="Deployment is planned around power, connectivity, logistics and local support."
              description="The existing Africa map component now has a dedicated route for partners who need a quick operational view."
            />
          </AnimatedSection>
          <div className="mt-10">
            <AnimatedSection delay={0.1}>
              <AfricaDeploymentMap />
            </AnimatedSection>
          </div>
        </div>
      </section>

      <section id="readiness" className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <AnimatedSection>
            <SectionHeading
              eyebrow="Country readiness"
              title="Regional signals for practical deployment decisions."
              description="Readiness scores are content-led indicators for planning conversations, not a replacement for local due diligence."
            />
          </AnimatedSection>
          <div className="mt-10">
            <AnimatedSection delay={0.1}>
              <DeploymentReadinessGrid regions={deploymentMapRegions} />
            </AnimatedSection>
          </div>
        </div>
      </section>

      <EcosystemCtaBand
        title="Plan an Africa deployment with realistic infrastructure and support assumptions."
        description="Use the existing Africa enquiry route to share country, learner count, power profile, connectivity and support requirements."
        primary={{ label: "Submit deployment enquiry", href: "/africa-deployment#africa-enquiry" }}
        secondary={{ label: "View devices", href: "/devices?deploymentTypes=Africa%20shipment#device-catalogue" }}
      />
    </main>
  );
}
