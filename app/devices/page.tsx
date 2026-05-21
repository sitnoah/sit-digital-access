import type { Metadata } from "next";
import { Suspense } from "react";
import { AnimatedSection } from "@/components/animated-section";
import { ButtonLink } from "@/components/button-link";
import { DeviceCatalogueSection } from "@/components/devices/device-catalogue-section";
import { DeviceMarketplaceTrust } from "@/components/devices/device-marketplace-trust";
import { DeviceRequestForm } from "@/components/device-request-form";
import { Icon, type IconKey } from "@/components/icons";
import { PartnerCTA } from "@/components/partner-cta";
import { SectionHeading } from "@/components/section-heading";
import { impactStats, qualityProcess } from "@/lib/content";

export const metadata: Metadata = {
  title: "Refurbished Technology Marketplace",
  description:
    "Browse deployment-ready refurbished laptops, desktops, mini PCs and lab bundles for schools, NGOs, businesses and Africa deployment pathways."
};

const metricFallbacks = [
  { label: "Devices deployed", value: "500+", detail: "Target for refurbished devices" },
  { label: "Schools supported", value: "10+", detail: "Labs and learner access" },
  { label: "Estimated CO2 avoided", value: "25t", detail: "Estimated circular impact" },
  { label: "Labs enabled", value: "10+", detail: "Classroom and hub pathways" },
  { label: "Countries reached", value: "5+", detail: "UK and Africa partnerships" }
];

const heroMetrics = metricFallbacks.map((fallback) => {
  if (fallback.label === "Estimated CO2 avoided") {
    const metric = impactStats.find((stat) => stat.label === "CO2 saved through reuse");
    return metric ? { ...metric, label: fallback.label } : fallback;
  }

  if (fallback.label === "Countries reached") {
    const metric = impactStats.find((stat) => stat.label === "Countries served");
    return metric ? { ...metric, label: fallback.label } : fallback;
  }

  return impactStats.find((stat) => stat.label === fallback.label) ?? fallback;
});

const heroFlow = ["Source", "Refurbish", "Deploy", "Support", "Reuse"];

const deploymentTopics: { title: string; description: string; icon: IconKey }[] = [
  {
    title: "Low-power operation",
    description: "Mini PCs, SSD upgrades and shared-access bundles support classrooms where power planning matters.",
    icon: "sun"
  },
  {
    title: "Offline-first readiness",
    description: "Devices can be configured for browser-first, local content and practical classroom continuity.",
    icon: "offline"
  },
  {
    title: "Repairability and replacement planning",
    description: "Bundles are selected with support routes, spare planning and repair workflows in mind.",
    icon: "wrench"
  },
  {
    title: "Community hub compatibility",
    description: "Catalogue options connect to hub, training, repair and sustainability workflows across the SIT ecosystem.",
    icon: "network"
  }
];

const lifecycleSteps = ["Source", "Test", "Wipe", "Upgrade", "Configure", "Deploy", "Support", "Recover", "Recycle"];

const sustainabilityCards = [
  {
    title: "CO2 avoided estimates",
    detail: "Public-safe reuse estimates help schools, donors and CSR teams understand circular value before purchase.",
    icon: "leaf" as IconKey
  },
  {
    title: "Secure wipe evidence",
    detail: "Refurbishment workflows include data sanitisation, grading and deployment documentation where required.",
    icon: "shield" as IconKey
  },
  {
    title: "Repairability and lifecycle",
    detail: "Devices are positioned for useful life extension, maintenance planning and responsible recovery later.",
    icon: "recycle" as IconKey
  }
];

const deploymentPackages = [
  {
    title: "School starter lab",
    devices: "10-24 laptops or desktops",
    capacity: "Up to one class group",
    connectivity: "Wi-Fi or wired classroom",
    support: "Setup, asset tagging and remote support",
    href: "/contact?type=SCHOOL#contact-form"
  },
  {
    title: "Community hub package",
    devices: "Mini PCs, laptops and accessories",
    capacity: "Shared access for learners and job seekers",
    connectivity: "Offline-first and low-power options",
    support: "Training handover and maintenance planning",
    href: "/community-hubs"
  },
  {
    title: "NGO field office setup",
    devices: "Business laptops and compact desktops",
    capacity: "5-30 staff or volunteers",
    connectivity: "Cloud collaboration with fallback planning",
    support: "Productivity setup and lifecycle guidance",
    href: "/businesses-ngos"
  },
  {
    title: "SME workforce refresh",
    devices: "Staff laptops, monitors and peripherals",
    capacity: "Hybrid teams and office users",
    connectivity: "Microsoft 365 or Google Workspace",
    support: "Remote support and replacement planning",
    href: "/businesses-ngos"
  },
  {
    title: "AI learning lab",
    devices: "Higher-spec laptops or desktops",
    capacity: "AI literacy and coding cohorts",
    connectivity: "Guided online learning environment",
    support: "SIT Learning pathway alignment",
    href: "/programmes"
  },
  {
    title: "Low-power rural deployment",
    devices: "Mini PCs and efficient laptops",
    capacity: "Schools, hubs and training rooms",
    connectivity: "Offline-first and shared access",
    support: "Africa deployment readiness planning",
    href: "/deployment-map"
  }
];

export default function DevicesPage() {
  return (
    <main>
      <MarketplaceHero />

      <Suspense fallback={null}>
        <DeviceCatalogueSection />
      </Suspense>

      <DeploymentIntelligenceSection />

      <SustainabilitySection />

      <DeploymentPackagesSection />

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
              title="Quality assurance from sourcing to deployment support."
              description="A premium marketplace only works when readiness, wipe status, grading and support are visible before devices reach learners, staff teams or community hubs."
            />
          </AnimatedSection>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {qualityProcess.map((step, index) => (
              <AnimatedSection key={step.title} delay={index * 0.04}>
                <article className="h-full rounded-lg border border-line bg-paper p-5 shadow-card transition hover:-translate-y-1 hover:shadow-soft">
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-ink text-white">
                      <Icon name={step.icon} className="h-5 w-5" />
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                      Step {index + 1}
                    </span>
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-ink">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted">{step.description}</p>
                </article>
              </AnimatedSection>
            ))}
          </div>
          <div className="mt-6 grid gap-3 rounded-lg border border-flame-100 bg-flame-50 p-5 sm:grid-cols-3">
            {["Secure wipe certificate references", "Warranty transparency", "Device grading visuals"].map((badge) => (
              <p key={badge} className="flex items-center gap-2 text-sm font-semibold text-flame-800">
                <Icon name="badge" className="h-4 w-4" />
                {badge}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section id="device-request" className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <AnimatedSection>
            <SectionHeading
              eyebrow="Request devices"
              title="Send a deployment-ready device request to the SIT Digital Access team."
              description="Capture device needs, power and connectivity realities, training needs, asset tagging and sustainability reporting requirements in one operational intake."
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

function MarketplaceHero() {
  return (
    <section className="overflow-hidden bg-ink px-4 py-20 text-white sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <AnimatedSection>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-flame-300">
            Refurbished technology marketplace
          </p>
          <h1 className="mt-5 max-w-5xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Refurbished technology prepared for learning, work and deployment
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-white/72 sm:text-lg">
            Browse professionally prepared laptops, desktops, mini PCs and lab bundles designed for
            classrooms, community hubs, NGOs, businesses and Africa deployment pathways.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="#device-catalogue">Browse catalogue</ButtonLink>
            <ButtonLink href="#device-request" variant="secondary">
              Request devices
            </ButtonLink>
          </div>
          <div className="mt-8 flex flex-wrap gap-2">
            {["Africa-ready", "Secure wipe certified", "Bulk available", "Warranty included", "Low-power options"].map((badge) => (
              <span key={badge} className="rounded-full border border-white/15 bg-white/8 px-3 py-1 text-xs font-semibold text-white/80">
                {badge}
              </span>
            ))}
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <div className="rounded-[2rem] border border-white/10 bg-white/8 p-5 shadow-soft backdrop-blur">
            <div className="rounded-[1.5rem] bg-white p-5 text-ink shadow-card">
              <div className="grid gap-3 sm:grid-cols-2">
                {heroMetrics.map((metric) => (
                  <div key={metric.label} className="rounded-lg border border-line bg-paper p-4">
                    <p className="text-2xl font-semibold text-ink">{metric.value}</p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-muted">{metric.label}</p>
                    <p className="mt-2 text-xs leading-5 text-muted">{metric.detail}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-lg bg-ink p-4 text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-flame-300">Circular readiness flow</p>
                <div className="mt-4 grid gap-2">
                  {heroFlow.map((step, index) => (
                    <div key={step} className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-flame-500 text-xs font-semibold">
                        {index + 1}
                      </span>
                      <span className="text-sm font-semibold text-white/90">{step}</span>
                      {index < heroFlow.length - 1 ? <span className="h-px flex-1 bg-white/14" /> : null}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

function DeploymentIntelligenceSection() {
  return (
    <section className="bg-paper px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Deployment intelligence"
            title="Built for real-world deployment conditions."
            description="Catalogue choices are framed around power, connectivity, repairability, shared-access use and Africa deployment readiness rather than simple product listings."
          />
        </AnimatedSection>
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {deploymentTopics.map((topic, index) => (
            <AnimatedSection key={topic.title} delay={index * 0.05}>
              <article className="h-full rounded-lg border border-line bg-white p-5 shadow-card transition hover:-translate-y-1 hover:shadow-soft">
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-flame-500 text-white">
                  <Icon name={topic.icon} className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-lg font-semibold text-ink">{topic.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted">{topic.description}</p>
              </article>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

function SustainabilitySection() {
  return (
    <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <AnimatedSection>
            <SectionHeading
              eyebrow="Sustainability layer"
              title="Reuse confidence, circular scoring and ESG-ready evidence."
              description="SIT Digital Access positions refurbished devices as part of a longer lifecycle: useful technology first, repair when possible, recycling only when responsible recovery is the right outcome."
            />
            <div className="mt-6 rounded-lg border border-line bg-paper p-5">
              <p className="text-sm font-semibold text-ink">Suitable for CSR and ESG deployment reporting.</p>
              <p className="mt-2 text-sm leading-6 text-muted">
                Device requests can connect to sustainability reports, recycling evidence, secure wipe records and deployment impact updates.
              </p>
            </div>
          </AnimatedSection>
          <div className="grid gap-5">
            <AnimatedSection delay={0.1}>
              <div className="rounded-lg border border-line bg-paper p-5 shadow-card">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-flame-600">Lifecycle visualisation</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {lifecycleSteps.map((step, index) => (
                    <span key={step} className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-2 text-xs font-semibold text-ink">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-flame-500 text-[10px] text-white">
                        {index + 1}
                      </span>
                      {step}
                    </span>
                  ))}
                </div>
              </div>
            </AnimatedSection>
            <div className="grid gap-4 md:grid-cols-3">
              {sustainabilityCards.map((card, index) => (
                <AnimatedSection key={card.title} delay={0.14 + index * 0.04}>
                  <article className="h-full rounded-lg border border-line bg-white p-5 shadow-card">
                    <Icon name={card.icon} className="h-5 w-5 text-flame-600" />
                    <h3 className="mt-4 text-base font-semibold text-ink">{card.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted">{card.detail}</p>
                  </article>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function DeploymentPackagesSection() {
  return (
    <section className="bg-paper px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Deployment-ready technology packages"
            title="Move from catalogue browsing to practical deployment planning."
            description="These package pathways connect refurbished devices to learner capacity, support models, connectivity assumptions and future lifecycle workflows."
          />
        </AnimatedSection>
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {deploymentPackages.map((item, index) => (
            <AnimatedSection key={item.title} delay={index * 0.04}>
              <article className="flex h-full flex-col rounded-lg border border-line bg-white p-5 shadow-card transition hover:-translate-y-1 hover:shadow-soft">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-lg font-semibold text-ink">{item.title}</h3>
                  <Icon name="package" className="h-5 w-5 shrink-0 text-flame-600" />
                </div>
                <div className="mt-5 grid gap-3 text-sm">
                  <p><strong className="text-ink">Typical devices:</strong> <span className="text-muted">{item.devices}</span></p>
                  <p><strong className="text-ink">Learner/staff capacity:</strong> <span className="text-muted">{item.capacity}</span></p>
                  <p><strong className="text-ink">Connectivity assumptions:</strong> <span className="text-muted">{item.connectivity}</span></p>
                  <p><strong className="text-ink">Support model:</strong> <span className="text-muted">{item.support}</span></p>
                </div>
                <ButtonLink href={item.href} variant="secondary" className="mt-6 self-start">
                  Explore pathway
                </ButtonLink>
              </article>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
