import type { Metadata } from "next";
import { Suspense } from "react";
import { AfricaDeploymentReadiness } from "@/components/programmes/africa-deployment-readiness";
import { ProgrammeAudienceGrid } from "@/components/programmes/programme-audience-grid";
import { ProgrammeCatalogue } from "@/components/programmes/programme-catalogue";
import { ProgrammeCTA } from "@/components/programmes/programme-cta";
import { ProgrammeDeliveryPipeline } from "@/components/programmes/programme-delivery-pipeline";
import { ProgrammeEcosystemSection } from "@/components/programmes/programme-ecosystem-section";
import { ProgrammeEnquiryForm } from "@/components/programmes/programme-enquiry-form";
import { ProgrammeImpactSection } from "@/components/programmes/programme-impact-section";
import { ProgrammesHero } from "@/components/programmes/programmes-hero";

export const metadata: Metadata = {
  title: "Digital Access Programmes",
  description:
    "Premium SIT Digital Access programme pathways for learner devices, school labs, community hubs, SME upgrades, sponsored cohorts and Africa deployment."
};

export default function ProgrammesPage() {
  return (
    <main>
      <ProgrammesHero />
      <Suspense fallback={null}>
        <ProgrammeCatalogue />
      </Suspense>
      <ProgrammeAudienceGrid />
      <ProgrammeEcosystemSection />
      <ProgrammeDeliveryPipeline />
      <ProgrammeImpactSection />
      <AfricaDeploymentReadiness />
      <ProgrammeEnquiryForm />
      <ProgrammeCTA />
    </main>
  );
}
