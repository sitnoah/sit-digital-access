"use client";

import { useMemo, useState } from "react";
import { AfricaDeploymentMap } from "@/components/africa/africa-deployment-map";
import { AnimatedSection } from "@/components/animated-section";
import { ButtonLink } from "@/components/button-link";
import { Icon, type IconKey } from "@/components/icons";
import { SectionHeading } from "@/components/section-heading";
import {
  africaCountryProfiles,
  africaMapOverlayMetrics
} from "@/lib/data";
import { deploymentMapRegions } from "@/lib/ecosystem-content";
import { cn } from "@/lib/utils";

type DeploymentPhase = "Planning" | "Active" | "Scaling" | "Expansion" | "Partner onboarding";

const trustBadges = [
  "Offline-first deployment planning",
  "Low-power deployment routes",
  "UK logistics and intake",
  "Africa-focused partnerships",
  "Community support pathways"
];

const rolloutFlow = ["UK Intake", "Refurbish", "Deploy", "Train", "Support", "Impact"];

const filterOptions = [
  "School labs",
  "Community hubs",
  "NGO deployments",
  "Workforce enablement",
  "Sponsor-backed deployments",
  "Repair and support coverage",
  "Offline-first deployments"
];

const countryPhases: Record<string, DeploymentPhase> = {
  Liberia: "Planning",
  Ghana: "Active",
  "Sierra Leone": "Partner onboarding",
  Nigeria: "Scaling",
  "Wider Africa": "Expansion"
};

const countryIntelligence = africaCountryProfiles.map((profile) => {
  const region = deploymentMapRegions.find((item) => item.name === profile.country);
  return {
    ...profile,
    phase: countryPhases[profile.country] ?? region?.status ?? "Planning",
    focus: region?.focus ?? profile.summary,
    partnerCoverage: region?.partners ?? "Partner discovery and local ownership model required.",
    gridReliability: Math.max(34, Math.min(92, 100 - profile.logisticsComplexity + 18)),
    connectivityMaturity: profile.country === "Ghana" ? 78 : profile.country === "Nigeria" ? 74 : profile.country === "Liberia" ? 62 : profile.country === "Sierra Leone" ? 48 : 55,
    ruralSuitability: Math.min(96, Math.round((profile.offlineSupport + (100 - profile.logisticsComplexity)) / 2)),
    urbanSuitability: Math.min(96, Math.round((profile.readiness + profile.connectivityProfile.length / 3) / 1.25)),
    schoolReadiness: Math.min(95, profile.readiness + (profile.country === "Ghana" ? 4 : 0)),
    communityPartnerAvailability: profile.country === "Ghana" ? 82 : profile.country === "Nigeria" ? 78 : profile.country === "Liberia" ? 70 : profile.country === "Sierra Leone" ? 61 : 66,
    technicianSupport: profile.country === "Nigeria" ? 76 : profile.country === "Ghana" ? 74 : profile.country === "Liberia" ? 66 : profile.country === "Sierra Leone" ? 58 : 62
  };
});

const heroMetrics = [
  { label: "Devices deployed", value: africaMapOverlayMetrics.find((metric) => metric.label === "Devices deployed")?.value ?? "500+", icon: "laptop" as IconKey },
  { label: "Labs planned", value: africaMapOverlayMetrics.find((metric) => metric.label === "Labs planned")?.value ?? "10+", icon: "school" as IconKey },
  { label: "Community hubs", value: africaMapOverlayMetrics.find((metric) => metric.label === "Community hubs")?.value ?? "6+", icon: "building" as IconKey },
  { label: "Partners onboarded", value: africaMapOverlayMetrics.find((metric) => metric.label === "Partners onboarded")?.value ?? "8+", icon: "handshake" as IconKey },
  { label: "Technicians enabled", value: africaMapOverlayMetrics.find((metric) => metric.label === "Technician enablement")?.value ?? "20+", icon: "wrench" as IconKey },
  { label: "Countries active", value: "5", icon: "globe" as IconKey }
];

const infrastructureTopics = [
  { title: "Power reliability", description: "Assess grid uptime, charging routines and classroom operating hours before specifying devices.", icon: "sun" as IconKey },
  { title: "Solar-aware setups", description: "Plan low-power bundles and charging assumptions for solar or battery-backed sites.", icon: "leaf" as IconKey },
  { title: "Generator assumptions", description: "Size device bundles around realistic backup power availability and maintenance cost.", icon: "settings" as IconKey },
  { title: "Low-power computing", description: "Use mini PCs, efficient monitors and shared access models where energy load matters.", icon: "cpu" as IconKey },
  { title: "Offline-first learning", description: "Prepare content, file sharing and learning workflows that survive connectivity gaps.", icon: "offline" as IconKey },
  { title: "Shared access models", description: "Design timetables, rotations and community access around limited device pools.", icon: "users" as IconKey },
  { title: "Device maintenance", description: "Plan spares, repair routes, cleaning routines and local support ownership.", icon: "wrench" as IconKey },
  { title: "Connectivity constraints", description: "Treat bandwidth, data cost and coverage as design inputs, not afterthoughts.", icon: "network" as IconKey },
  { title: "Remote support assumptions", description: "Decide what can be handled remotely and where local escalation is required.", icon: "headset" as IconKey }
];

const deploymentModels = [
  { title: "School computer lab", bestFor: "Primary, secondary and vocational learning spaces.", count: "12-40 devices", connectivity: "Cloud-ready in urban sites, offline mirror for rural sites.", power: "Stable grid or generator-aware classroom plan.", training: "Teacher enablement and digital literacy.", support: "School champion plus remote escalation.", href: "/schools", icon: "school" as IconKey },
  { title: "Community digital hub", bestFor: "Libraries, churches, youth centres and shared access spaces.", count: "8-24 devices", connectivity: "Shared Wi-Fi, mobile data or offline-first sessions.", power: "Charging rotation and low-power option.", training: "Digital literacy, AI literacy and job-search support.", support: "Local hub owner with support route.", href: "/community-hubs", icon: "building" as IconKey },
  { title: "NGO workforce deployment", bestFor: "Programme offices, field teams and community delivery partners.", count: "5-60 devices", connectivity: "Hybrid cloud and offline reporting assumptions.", power: "Laptop-first with field charging plan.", training: "Cloud collaboration and cybersecurity basics.", support: "Asset accountability and remote support.", href: "/businesses-ngos", icon: "heart" as IconKey },
  { title: "Teacher enablement programme", bestFor: "Schools preparing teachers for digital delivery.", count: "1-10 instructor devices", connectivity: "Browser-ready with offline resources where needed.", power: "Teacher device charging and classroom projection.", training: "Teacher enablement and productivity skills.", support: "Trainer notes and escalation path.", href: "/programmes", icon: "graduation" as IconKey },
  { title: "Sponsor-backed learner access", bestFor: "Donor and CSR programmes funding individual access.", count: "1-100 laptops", connectivity: "Home, school or hub-based access assumptions.", power: "Battery health and charger availability.", training: "Digital literacy and employability.", support: "Warranty, repair and replacement planning.", href: "/csr-partnerships", icon: "handshake" as IconKey },
  { title: "Coworking & innovation hub", bestFor: "Enterprise centres, innovation spaces and youth entrepreneurship.", count: "10-35 mixed devices", connectivity: "Reliable broadband recommended.", power: "Workspace power and backup assumptions.", training: "AI literacy, software skills and entrepreneurship.", support: "Managed support and refresh planning.", href: "/community-hubs", icon: "business" as IconKey },
  { title: "Mobile/offline learning hub", bestFor: "Rural outreach, temporary sites and low-connectivity environments.", count: "5-20 low-power devices", connectivity: "Offline-first by default.", power: "Solar, battery or generator-aware.", training: "Facilitator-led offline learning model.", support: "Local maintenance checklist and spares.", href: "/africa-deployment", icon: "truck" as IconKey },
  { title: "Regional training centre", bestFor: "Multi-cohort digital skills, repair or workforce readiness programmes.", count: "20-80 devices", connectivity: "Hybrid cloud, local storage and shared accounts.", power: "Planned lab power and uptime target.", training: "Digital skills, repair and workforce pathways.", support: "Regional support and reporting model.", href: "/programmes", icon: "network" as IconKey }
];

const lifecycleTimeline = [
  "Country assessment",
  "Partner onboarding",
  "Device preparation",
  "Secure logistics",
  "Deployment setup",
  "Training and onboarding",
  "Support and maintenance",
  "Impact reporting",
  "Sustainability and refresh planning"
];

const readinessMetrics = [
  { title: "Device readiness", value: "86%", detail: "Wiped, tested and deployment matched.", progress: 86, icon: "badge" as IconKey },
  { title: "Deployment backlog", value: "10+", detail: "Labs and hubs in planning signal.", progress: 58, icon: "list" as IconKey },
  { title: "Active partnerships", value: "8+", detail: "Partner onboarding and delivery routes.", progress: 72, icon: "handshake" as IconKey },
  { title: "School readiness", value: "74%", detail: "Education deployment fit across priority regions.", progress: 74, icon: "school" as IconKey },
  { title: "Support coverage", value: "62%", detail: "Technician, repair and escalation planning.", progress: 62, icon: "headset" as IconKey },
  { title: "Sustainability impact", value: "25t", detail: "Estimated reuse impact target.", progress: 68, icon: "leaf" as IconKey },
  { title: "Reuse rate", value: "Reuse first", detail: "Repair and refurbishment before recycling.", progress: 82, icon: "recycle" as IconKey },
  { title: "Community reach", value: "1,500+", detail: "Learners reached through access and training.", progress: 78, icon: "users" as IconKey }
];

const outcomeStories = [
  { title: "Liberia vocational lab", devices: "24 devices", learners: "120 learners", connectivity: "Offline-first with browser-ready tools", support: "Local technician plus remote escalation", summary: "A vocational lab model can support practical learning where power and connectivity require careful planning.", href: "/africa-deployment" },
  { title: "Ghana community access hub", devices: "16 mini PCs", learners: "Community cohorts", connectivity: "Connected urban hub with low-bandwidth fallback", support: "Partner-led hub ownership", summary: "A community hub can connect shared devices with digital literacy, employability and local support.", href: "/community-hubs" },
  { title: "Sierra Leone offline learning rollout", devices: "10-20 low-power devices", learners: "Pilot school cohorts", connectivity: "Offline content and reporting templates", support: "Maintenance checklist and spare planning", summary: "Offline-first design helps learning continue where broadband and grid power are inconsistent.", href: "/csr-partnerships" },
  { title: "Nigeria workforce enablement", devices: "40-device regional model", learners: "Youth and workforce cohorts", connectivity: "Hybrid cloud and offline support", support: "Regional partner escalation", summary: "Workforce programmes can pair devices, training, repair planning and impact reporting.", href: "/programmes" },
  { title: "Community coworking and innovation spaces", devices: "Mixed workspace bundle", learners: "Entrepreneurs and job seekers", connectivity: "Broadband-first with device booking model", support: "Managed refresh and repair route", summary: "Coworking-style spaces can support enterprise, skills and community access in one model.", href: "/community-hubs" }
];

const trainingPathways = [
  "Digital literacy",
  "AI literacy",
  "Teacher enablement",
  "Cybersecurity awareness",
  "Device maintenance",
  "Repair technician training",
  "Workforce readiness"
];

const partnershipCards = [
  { title: "Sponsor a school lab", description: "Fund a practical classroom or vocational lab with devices, training and reporting.", href: "/csr-partnerships", icon: "school" as IconKey },
  { title: "Sponsor a community hub", description: "Support shared digital access through a local partner, hub or community organisation.", href: "/community-hubs", icon: "building" as IconKey },
  { title: "CSR deployment partnership", description: "Turn corporate technology recovery or sponsorship into measurable Africa impact.", href: "/csr-partnerships", icon: "business" as IconKey },
  { title: "NGO implementation partnership", description: "Coordinate field devices, training, asset records and local support pathways.", href: "/businesses-ngos", icon: "heart" as IconKey },
  { title: "Government collaboration", description: "Shape repeatable school, workforce and community access deployment models.", href: "/contact?type=PARTNERSHIP#contact-form", icon: "building" as IconKey },
  { title: "Connectivity partnership", description: "Support broadband, mobile data, offline-first and infrastructure-aware rollouts.", href: "/contact?type=PARTNERSHIP#contact-form", icon: "network" as IconKey },
  { title: "Device donation partnership", description: "Route retired technology into secure refurbishment and deployment-ready bundles.", href: "/donate#donation-form", icon: "package" as IconKey }
];

export function DeploymentMapExperience() {
  const [activeCountry, setActiveCountry] = useState("Ghana");
  const [activeFilters, setActiveFilters] = useState<string[]>([
    "School labs",
    "Community hubs",
    "Offline-first deployments"
  ]);

  const activeProfile = useMemo(
    () => countryIntelligence.find((country) => country.country === activeCountry) ?? countryIntelligence[0],
    [activeCountry]
  );

  function toggleFilter(filter: string) {
    setActiveFilters((current) =>
      current.includes(filter)
        ? current.filter((item) => item !== filter)
        : [...current, filter]
    );
  }

  return (
    <main className="bg-paper">
      <HeroSection />
      <InteractiveMapSection
        activeCountry={activeCountry}
        activeProfile={activeProfile}
        activeFilters={activeFilters}
        onCountryChange={setActiveCountry}
        onToggleFilter={toggleFilter}
      />
      <CountryReadinessSection activeCountry={activeCountry} onCountryChange={setActiveCountry} />
      <InfrastructurePlanningSection />
      <DeploymentModelsSection />
      <DeploymentLifecycleSection />
      <OperationalMetricsSection />
      <OutcomesSection />
      <TrainingEcosystemSection />
      <PartnershipLayerSection />
      <FinalCtaSection />
    </main>
  );
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-ink px-4 pb-16 pt-32 text-white sm:px-6 lg:px-8 lg:pb-24">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#080808_0%,#151515_56%,#301706_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-paper to-transparent" />
      <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <AnimatedSection>
          <p className="inline-flex rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-xs font-semibold uppercase text-flame-100">
            Deployment intelligence
          </p>
          <h1 className="mt-6 max-w-5xl text-4xl font-semibold leading-tight tracking-normal sm:text-6xl">
            Africa deployment planning with realistic infrastructure and support assumptions
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-7 text-white/72 sm:text-lg">
            Explore country readiness, community deployment pathways, power-aware planning and local support models for refurbished devices, digital hubs, school labs and workforce enablement.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/africa-deployment">Explore Africa deployment</ButtonLink>
            <ButtonLink href="/africa-deployment#africa-enquiry" variant="secondary">Submit deployment enquiry</ButtonLink>
          </div>
          <div className="mt-8 flex flex-wrap gap-2">
            {trustBadges.map((badge) => (
              <span key={badge} className="rounded-full border border-white/12 bg-white/[0.06] px-3 py-1.5 text-xs font-semibold text-white/78">
                {badge}
              </span>
            ))}
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.08}>
          <div className="border border-white/10 bg-white/[0.07] p-5 shadow-2xl backdrop-blur">
            <div className="border-b border-white/10 pb-5">
              <p className="text-xs font-semibold uppercase text-flame-100">Deployment pathway</p>
              <h2 className="mt-2 text-2xl font-semibold">Every shipment needs a support model.</h2>
            </div>
            <div className="grid gap-3 py-5 sm:grid-cols-2 lg:grid-cols-3">
              {heroMetrics.map((metric) => (
                <div key={metric.label} className="border border-white/10 bg-black/18 p-4">
                  <Icon name={metric.icon} className="h-4 w-4 text-flame-200" />
                  <p className="mt-3 text-2xl font-semibold text-white">{metric.value}</p>
                  <p className="mt-1 text-xs leading-5 text-white/56">{metric.label}</p>
                </div>
              ))}
            </div>
            <div className="grid gap-2 border-t border-white/10 pt-5 sm:grid-cols-2">
              {rolloutFlow.map((stage, index) => (
                <div key={stage} className="flex items-center gap-3 border border-white/10 bg-white/[0.06] px-3 py-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-flame-500 text-xs font-bold text-white">{index + 1}</span>
                  <span className="text-sm font-semibold text-white/82">{stage}</span>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

function InteractiveMapSection({
  activeCountry,
  activeProfile,
  activeFilters,
  onCountryChange,
  onToggleFilter
}: {
  activeCountry: string;
  activeProfile: (typeof countryIntelligence)[number];
  activeFilters: string[];
  onCountryChange: (country: string) => void;
  onToggleFilter: (filter: string) => void;
}) {
  return (
    <section id="interactive-map" className="bg-ink px-4 py-20 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <div className="grid gap-10 lg:grid-cols-[1.06fr_0.94fr] lg:items-start">
            <div>
              <SectionHeading
                eyebrow="Interactive deployment map"
                title="Operational dashboard for country readiness and deployment coverage."
                description="Use the map, country selector and filters to explore readiness, partner coverage, infrastructure indicators and active deployment signals."
                className="text-white [&_h2]:text-white [&_p]:text-white/70"
              />
              <div className="mt-8">
                <AfricaDeploymentMap activeCountry={activeCountry} variant="network" />
              </div>
            </div>

            <aside className="border border-white/10 bg-white/[0.06] p-5 shadow-2xl backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-flame-200">Active country</p>
              <h3 className="mt-3 text-3xl font-semibold">{activeProfile.country}</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {countryIntelligence.map((country) => (
                  <button
                    key={country.country}
                    type="button"
                    onClick={() => onCountryChange(country.country)}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-xs font-semibold transition",
                      country.country === activeCountry
                        ? "border-flame-300 bg-flame-500 text-white"
                        : "border-white/12 bg-white/[0.06] text-white/72 hover:border-flame-300/50 hover:text-white"
                    )}
                  >
                    {country.country}
                  </button>
                ))}
              </div>
              <div className="mt-6 grid gap-3">
                <MapSignal label="Deployment readiness score" value={`${activeProfile.readiness}%`} progress={activeProfile.readiness} icon="chart" />
                <MapSignal label="Partner coverage" value={activeProfile.phase} progress={activeProfile.communityPartnerAvailability} icon="handshake" />
                <MapSignal label="Infrastructure indicators" value="Power, connectivity, logistics" progress={Math.round((activeProfile.gridReliability + activeProfile.connectivityMaturity) / 2)} icon="network" />
                <MapSignal label="Technician support indicators" value="Support pathway" progress={activeProfile.technicianSupport} icon="wrench" />
              </div>
              <div className="mt-6">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/60">Map filters</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {filterOptions.map((filter) => (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => onToggleFilter(filter)}
                      className={cn(
                        "rounded-full border px-3 py-1.5 text-xs font-semibold transition",
                        activeFilters.includes(filter)
                          ? "border-flame-300 bg-flame-500/18 text-flame-100"
                          : "border-white/12 bg-black/18 text-white/58 hover:text-white"
                      )}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>
              <p className="mt-6 text-sm leading-6 text-white/64">{activeProfile.summary}</p>
            </aside>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

function CountryReadinessSection({
  activeCountry,
  onCountryChange
}: {
  activeCountry: string;
  onCountryChange: (country: string) => void;
}) {
  return (
    <section id="country-readiness" className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Country readiness intelligence"
            title="Operational intelligence panels for priority deployment regions."
            description="Each country panel shows planning assumptions for power, connectivity, support, logistics and suggested deployment models."
          />
        </AnimatedSection>
        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          {countryIntelligence.map((country, index) => (
            <AnimatedSection key={country.country} delay={index * 0.035}>
              <button
                type="button"
                onClick={() => onCountryChange(country.country)}
                className={cn(
                  "h-full w-full border p-5 text-left transition hover:-translate-y-1 hover:border-flame-300 hover:shadow-card",
                  activeCountry === country.country ? "border-flame-300 bg-flame-50" : "border-line bg-white"
                )}
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-flame-700">{country.phase}</p>
                    <h3 className="mt-2 text-2xl font-semibold text-ink">{country.country}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted">{country.focus ?? country.summary}</p>
                  </div>
                  <span className="rounded-full bg-ink px-3 py-1.5 text-sm font-semibold text-white">{country.readiness}% ready</span>
                </div>
                <div className="mt-5 grid gap-3 md:grid-cols-2">
                  <Spec label="Power reliability assumptions" value={country.powerRealities} />
                  <Spec label="Connectivity profile" value={country.connectivityProfile} />
                  <Spec label="Local support maturity" value={country.recommendedSupportModel} />
                  <Spec label="Logistics considerations" value={country.exampleLabConfiguration} />
                  <Spec label="Suggested deployment models" value={country.typicalDeploymentType} />
                  <Spec label="Community partner availability" value={country.partnerCoverage} />
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                  <Indicator label="Grid reliability" value={country.gridReliability} />
                  <Indicator label="Offline-readiness" value={country.offlineSupport} />
                  <Indicator label="Connectivity maturity" value={country.connectivityMaturity} />
                  <Indicator label="Rural suitability" value={country.ruralSuitability} />
                  <Indicator label="Urban suitability" value={country.urbanSuitability} />
                </div>
              </button>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

function InfrastructurePlanningSection() {
  return (
    <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Infrastructure planning engine"
            title="Infrastructure-aware deployment planning"
            description="Deployment planning starts with real constraints: power, connectivity, device maintenance, local ownership and support assumptions."
          />
        </AnimatedSection>
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {infrastructureTopics.map((topic, index) => (
            <AnimatedSection key={topic.title} delay={index * 0.025}>
              <article className="h-full border border-line bg-paper p-5">
                <Icon name={topic.icon} className="h-5 w-5 text-flame-600" />
                <h3 className="mt-4 text-base font-semibold text-ink">{topic.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{topic.description}</p>
              </article>
            </AnimatedSection>
          ))}
        </div>
        <AnimatedSection delay={0.08}>
          <div className="mt-8 border border-line bg-white p-5 shadow-card">
            <div className="grid gap-2 md:grid-cols-5">
              {["Site assessment", "Bundle design", "Power model", "Training route", "Support handover"].map((step, index) => (
                <div key={step} className="border border-line bg-paper p-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-flame-500 text-xs font-bold text-white">{index + 1}</span>
                  <p className="mt-4 text-sm font-semibold text-ink">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

function DeploymentModelsSection() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Deployment models"
            title="Choose a model for the site, users and infrastructure reality."
            description="Each model connects device count, connectivity, power, training and support into a deployment-ready operating route."
          />
        </AnimatedSection>
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {deploymentModels.map((model, index) => (
            <AnimatedSection key={model.title} delay={index * 0.025}>
              <article className="flex h-full flex-col border border-line bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-flame-300 hover:shadow-card">
                <Icon name={model.icon} className="h-5 w-5 text-flame-600" />
                <h3 className="mt-5 text-lg font-semibold text-ink">{model.title}</h3>
                <Spec label="Best for" value={model.bestFor} />
                <Spec label="Typical device count" value={model.count} />
                <Spec label="Connectivity assumptions" value={model.connectivity} />
                <Spec label="Power assumptions" value={model.power} />
                <Spec label="Training requirements" value={model.training} />
                <Spec label="Support model" value={model.support} />
                <ButtonLink href={model.href} variant="secondary" className="mt-auto self-start">Explore model</ButtonLink>
              </article>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

function DeploymentLifecycleSection() {
  return (
    <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Deployment lifecycle"
            title="Deployments are operating systems, not one-off shipments."
            description="The lifecycle connects country assessment, partner onboarding, secure logistics, training, support, impact reporting and sustainability planning."
          />
        </AnimatedSection>
        <div className="mt-10 grid gap-3 md:grid-cols-3 xl:grid-cols-9">
          {lifecycleTimeline.map((step, index) => (
            <AnimatedSection key={step} delay={index * 0.02}>
              <article className="h-full border border-line bg-paper p-4">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-flame-500 text-xs font-bold text-white">{index + 1}</span>
                <h3 className="mt-4 text-sm font-semibold text-ink">{step}</h3>
              </article>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

function OperationalMetricsSection() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Operational readiness metrics"
            title="Track the signals that make deployments support-ready."
            description="Operational KPIs show whether devices, partners, schools, support routes and sustainability planning are aligned."
          />
        </AnimatedSection>
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {readinessMetrics.map((metric, index) => (
            <AnimatedSection key={metric.title} delay={index * 0.025}>
              <article className="h-full border border-line bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <Icon name={metric.icon} className="h-5 w-5 text-flame-600" />
                  <span className="rounded-full bg-paper px-3 py-1 text-xs font-semibold text-muted">{metric.progress}%</span>
                </div>
                <p className="mt-5 text-2xl font-semibold text-ink">{metric.value}</p>
                <h3 className="mt-2 text-base font-semibold text-ink">{metric.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{metric.detail}</p>
                <div className="mt-5 h-2 bg-paper">
                  <div className="h-full bg-flame-500" style={{ width: `${metric.progress}%` }} />
                </div>
              </article>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

function OutcomesSection() {
  return (
    <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Community and education outcomes"
            title="Deployment stories connect infrastructure assumptions to real access."
            description="The strongest deployment stories show devices, learners, connectivity model, support route and local ownership together."
          />
        </AnimatedSection>
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {outcomeStories.map((story, index) => (
            <AnimatedSection key={story.title} delay={index * 0.035}>
              <article className="flex h-full flex-col border border-line bg-paper p-5">
                <h3 className="text-lg font-semibold text-ink">{story.title}</h3>
                <div className="mt-4 space-y-2 text-sm text-muted">
                  <p><strong className="text-ink">Devices deployed:</strong> {story.devices}</p>
                  <p><strong className="text-ink">Learners reached:</strong> {story.learners}</p>
                  <p><strong className="text-ink">Connectivity model:</strong> {story.connectivity}</p>
                  <p><strong className="text-ink">Support route:</strong> {story.support}</p>
                </div>
                <p className="mt-4 text-sm leading-6 text-muted">{story.summary}</p>
                <ButtonLink href={story.href} variant="secondary" className="mt-auto self-start">Explore pathway</ButtonLink>
              </article>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

function TrainingEcosystemSection() {
  return (
    <section className="bg-ink px-4 py-20 text-white sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.86fr_1.14fr] lg:items-start">
        <AnimatedSection>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-flame-200">Powered by SIT Learning</p>
          <h2 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl">
            Technology deployment succeeds when local people can use, maintain and scale it.
          </h2>
          <p className="mt-4 text-sm leading-6 text-white/70">
            Deployment planning should connect devices to local skills, teacher confidence, cyber safety, maintenance routines and workforce readiness.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/programmes" variant="secondary">Explore training pathways</ButtonLink>
            <ButtonLink href="/contact?type=PARTNERSHIP#contact-form" variant="ghost" className="text-white hover:bg-white/10">Sponsor training</ButtonLink>
          </div>
        </AnimatedSection>
        <AnimatedSection delay={0.08}>
          <div className="grid gap-3 sm:grid-cols-2">
            {trainingPathways.map((pathway, index) => (
              <article key={pathway} className="border border-white/10 bg-white/[0.06] p-5">
                <Icon name={index === 1 ? "sparkles" : index === 3 ? "shield" : index === 5 ? "wrench" : "graduation"} className="h-5 w-5 text-flame-200" />
                <h3 className="mt-4 text-base font-semibold text-white">{pathway}</h3>
                <p className="mt-2 text-sm leading-6 text-white/62">A deployment-linked enablement pathway for schools, hubs, partners and local support owners.</p>
              </article>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

function PartnershipLayerSection() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Sponsorship and partnership layer"
            title="Scale deployment through sponsors, partners and implementation owners."
            description="Deployment needs people and institutions around the devices: sponsors, NGOs, governments, connectivity partners, donors and local support owners."
          />
        </AnimatedSection>
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-7">
          {partnershipCards.map((card, index) => (
            <AnimatedSection key={card.title} delay={index * 0.025}>
              <article className="flex h-full flex-col border border-line bg-white p-5 shadow-sm">
                <Icon name={card.icon} className="h-5 w-5 text-flame-600" />
                <h3 className="mt-5 text-base font-semibold text-ink">{card.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted">{card.description}</p>
                <ButtonLink href={card.href} variant="secondary" className="mt-auto self-start">Discuss partnership</ButtonLink>
              </article>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCtaSection() {
  return (
    <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl border border-line bg-ink p-6 text-white shadow-2xl md:p-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-flame-200">Africa rollout planning</p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight">
              Plan realistic digital access deployments with operational visibility and local support assumptions.
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-white/70">
              Share the country, partner, site, learner count, power profile, connectivity reality and training needs so SIT Digital Access can shape a practical route.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/africa-deployment#africa-enquiry">Submit deployment enquiry</ButtonLink>
            <ButtonLink href="/devices#device-request" variant="secondary">Request devices</ButtonLink>
            <ButtonLink href="/contact?type=PARTNERSHIP#contact-form" variant="secondary">Discuss partnership</ButtonLink>
            <ButtonLink href="/community-hubs" variant="ghost" className="text-white hover:bg-white/10">Explore community hubs</ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}

function MapSignal({ label, value, progress, icon }: { label: string; value: string; progress: number; icon: IconKey }) {
  return (
    <div className="border border-white/10 bg-black/18 p-4">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-flame-500/18 text-flame-200">
          <Icon name={icon} className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/50">{label}</p>
          <p className="mt-1 text-sm font-semibold leading-6 text-white">{value}</p>
          <div className="mt-3 h-1.5 bg-white/10">
            <div className="h-full bg-flame-400" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="mt-4">
      <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-flame-700">{label}</dt>
      <dd className="mt-1 text-sm leading-6 text-muted">{value}</dd>
    </div>
  );
}

function Indicator({ label, value }: { label: string; value: number }) {
  return (
    <div className="border border-line bg-white p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold text-ink">{label}</p>
        <span className="text-xs font-bold text-flame-700">{value}%</span>
      </div>
      <div className="mt-3 h-1.5 bg-paper">
        <div className="h-full bg-flame-500" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
