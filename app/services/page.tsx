import type { Metadata } from "next";
import { Suspense } from "react";
import { AfricaDeploymentServices } from "@/components/services/africa-deployment-services";
import { ManagedSupportSection } from "@/components/services/managed-support-section";
import { ServiceEcosystem } from "@/components/services/service-ecosystem";
import { ServiceEnquiryForm } from "@/components/services/service-enquiry-form";
import { ServiceImpactTrust } from "@/components/services/service-impact-trust";
import { ServiceWorkflow } from "@/components/services/service-workflow";
import { ServicesCatalogue } from "@/components/services/services-catalogue";
import { ServicesCTA } from "@/components/services/services-cta";
import { ServicesHero } from "@/components/services/services-hero";
import { TrainingEnablementSection } from "@/components/services/training-enablement-section";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Premium SIT Digital Access services for refurbished device procurement, secure setup, cloud tools, computer lab deployment, training, support and Africa-ready digital access operations."
};

export default function ServicesPage() {
  return (
    <main>
      <ServicesHero />
      <Suspense fallback={null}>
        <ServicesCatalogue />
      </Suspense>
      <ServiceEcosystem />
      <AfricaDeploymentServices />
      <TrainingEnablementSection />
      <ManagedSupportSection />
      <ServiceWorkflow />
      <ServiceImpactTrust />
      <ServiceEnquiryForm />
      <ServicesCTA />
    </main>
  );
}
