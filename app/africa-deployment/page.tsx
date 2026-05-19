import type { Metadata } from "next";
import { AfricaCTA } from "@/components/africa/africa-cta";
import { AfricaDeploymentMap } from "@/components/africa/africa-deployment-map";
import { AfricaEnquiryForm } from "@/components/africa/africa-enquiry-form";
import { AfricaHero } from "@/components/africa/africa-hero";
import { CountryDeploymentSelector } from "@/components/africa/country-deployment-selector";
import { DeploymentLifecycle } from "@/components/africa/deployment-lifecycle";
import { DeploymentStrategyGrid } from "@/components/africa/deployment-strategy-grid";
import { ImpactDashboard } from "@/components/africa/impact-dashboard";
import { PartnershipSection } from "@/components/africa/partnership-section";
import { PowerReadinessSection } from "@/components/africa/power-readiness-section";

export const metadata: Metadata = {
  title: "Africa Deployment",
  description:
    "Enterprise-grade refurbished technology deployment support for Liberia, Ghana, Sierra Leone, Nigeria and wider Africa."
};

const sectionLinks = [
  { label: "Readiness", href: "#country-readiness" },
  { label: "Strategy", href: "#strategy" },
  { label: "Network", href: "#deployment-network" },
  { label: "Lifecycle", href: "#deployment-model" },
  { label: "Power", href: "#power-connectivity" },
  { label: "Partners", href: "#partners" },
  { label: "Enquiry", href: "#africa-enquiry" }
];

export default function AfricaDeploymentPage() {
  return (
    <main>
      <AfricaHero />

      <nav className="sticky top-[112px] z-30 border-y border-line bg-white/88 px-4 py-3 backdrop-blur sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto">
          {sectionLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="whitespace-nowrap rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-muted shadow-sm transition hover:border-flame-300 hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </div>
      </nav>

      <CountryDeploymentSelector />
      <DeploymentStrategyGrid />

      <section id="deployment-network" className="relative overflow-hidden bg-[#0A0A0A] px-4 py-20 text-white sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_18%,rgba(249,115,22,0.18),transparent_32%),linear-gradient(180deg,#111111_0%,#090909_58%,#050505_100%)]" />
        <div className="relative mx-auto max-w-7xl">
          <div className="mb-10 max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-flame-300">
              Deployment map
            </p>
            <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              A deployment network for education infrastructure rollout.
            </h2>
            <p className="mt-5 max-w-3xl text-base leading-7 text-white/66">
              The map frames Africa deployment as supply-chain intelligence: connected
              countries, route planning, partner handover, future markers and local support capacity.
            </p>
          </div>
          <AfricaDeploymentMap activeCountry="Nigeria" />
        </div>
      </section>

      <DeploymentLifecycle />
      <PowerReadinessSection />
      <PartnershipSection />
      <ImpactDashboard />
      <AfricaEnquiryForm />
      <AfricaCTA />
    </main>
  );
}
