"use client";

import { useMemo, useState } from "react";
import { AnimatedSection } from "@/components/animated-section";
import { ButtonLink } from "@/components/button-link";
import { Icon, type IconKey } from "@/components/icons";
import { SectionHeading } from "@/components/section-heading";
import { businessCapabilities, impactStats } from "@/lib/data";

type OrganisationType =
  | "SME"
  | "NGO / charity"
  | "School administration"
  | "Community organisation"
  | "Field office"
  | "Coworking / innovation hub"
  | "CSR / impact partner";

type WorkModel = "Office-based" | "Remote" | "Hybrid" | "Field-based" | "Multi-site";
type DevicePreference = "Laptops" | "Desktops" | "Mini PCs" | "Mixed bundle" | "Low-power field kit";
type CloudPlatform = "Microsoft 365" | "Google Workspace" | "Hybrid";
type ToggleChoice = "Yes" | "No" | "Not sure";
type DeploymentUrgency = "Exploring" | "This quarter" | "This month" | "Urgent";
type BudgetRange = "Under £2,500" | "£2,500-£7,500" | "£7,500-£20,000" | "£20,000+" | "Not sure";

type PackageTitle =
  | "SME starter kit"
  | "NGO field office kit"
  | "School administration setup"
  | "Community organisation package"
  | "Remote workforce package"
  | "Coworking & innovation hub setup"
  | "Deployment-ready Africa office kit"
  | "CSR and impact partnership";

type BuilderState = {
  organisationType: OrganisationType;
  teamSize: number;
  countryRegion: string;
  workModel: WorkModel;
  devicePreference: DevicePreference;
  cloudPlatform: CloudPlatform;
  cybersecurity: ToggleChoice;
  assetTracking: ToggleChoice;
  remoteSupport: ToggleChoice;
  training: ToggleChoice;
  urgency: DeploymentUrgency;
  budget: BudgetRange;
};

const initialBuilder: BuilderState = {
  organisationType: "NGO / charity",
  teamSize: 12,
  countryRegion: "United Kingdom",
  workModel: "Hybrid",
  devicePreference: "Laptops",
  cloudPlatform: "Microsoft 365",
  cybersecurity: "Yes",
  assetTracking: "Yes",
  remoteSupport: "Yes",
  training: "Not sure",
  urgency: "This quarter",
  budget: "£2,500-£7,500"
};

const trustBadges = [
  "UK-based operations",
  "NGO and SME support",
  "Secure device lifecycle",
  "Africa deployment partnerships",
  "Reuse-first sustainability"
];

const operationalFlow = ["Devices", "Setup", "Productivity", "Support", "Lifecycle", "Impact"];

const organisationsMetric = impactStats.find((metric) => metric.label === "Businesses supported");
const devicesMetric = impactStats.find((metric) => metric.label === "Devices deployed");
const countriesMetric = impactStats.find((metric) => metric.label === "Countries served");

const heroMetrics: Array<{ value: string; label: string; detail: string }> = [
  {
    value: organisationsMetric?.value ?? "50+",
    label: "Organisations supported",
    detail: organisationsMetric?.detail ?? "SMEs, NGOs and mission-led teams"
  },
  {
    value: devicesMetric?.value ?? "500+",
    label: "Devices deployed",
    detail: devicesMetric?.detail ?? "Refurbished device access"
  },
  {
    value: "Field-ready",
    label: "Field offices equipped",
    detail: "Portable kits, cloud setup and support routes"
  },
  {
    value: countriesMetric?.value ?? "5+",
    label: "Countries reached",
    detail: countriesMetric?.detail ?? "UK and Africa partnerships"
  }
];

const solutionCards: Array<{
  title: PackageTitle;
  bestFor: string;
  teamSize: string;
  devices: string;
  services: string[];
  cta: string;
  icon: IconKey;
}> = [
  {
    title: "SME starter kit",
    bestFor: "Small teams standardising laptops, accounts and everyday IT support.",
    teamSize: "3-15 staff",
    devices: "Business laptops, desktops, mini PCs and monitors",
    services: ["Device setup", "Microsoft 365 / Google Workspace", "Remote support"],
    cta: "Build SME kit",
    icon: "business"
  },
  {
    title: "NGO field office kit",
    bestFor: "Charities, field teams, volunteers and programme offices.",
    teamSize: "5-40 staff and volunteers",
    devices: "Portable laptops, accessories and field-ready bundles",
    services: ["Cloud collaboration", "Asset register", "Low-power guidance"],
    cta: "Plan field office",
    icon: "heart"
  },
  {
    title: "School administration setup",
    bestFor: "School offices, reception teams, teachers and leadership teams.",
    teamSize: "Admin teams and staff rooms",
    devices: "Staff laptops, desktops, monitors and shared workstations",
    services: ["Account setup", "Secure onboarding", "Replacement planning"],
    cta: "Request school setup",
    icon: "school"
  },
  {
    title: "Community organisation package",
    bestFor: "Churches, charities, youth groups and local community teams.",
    teamSize: "3-25 staff or volunteers",
    devices: "Shared laptops, staff devices and access workstations",
    services: ["Digital readiness", "Remote support", "Training pathway"],
    cta: "Support community team",
    icon: "users"
  },
  {
    title: "Remote workforce package",
    bestFor: "Distributed teams that need consistent devices and support.",
    teamSize: "5-100 remote users",
    devices: "Configured laptops, headsets and productivity setup",
    services: ["Remote support", "Cybersecurity basics", "Asset accountability"],
    cta: "Equip remote team",
    icon: "cloud"
  },
  {
    title: "Coworking & innovation hub setup",
    bestFor: "Enterprise centres, incubators and shared workspace operators.",
    teamSize: "Shared desks and cohort events",
    devices: "Mixed workstations, presentation kit and monitors",
    services: ["Shared workstation planning", "Booking model", "Support workflow"],
    cta: "Plan workspace kit",
    icon: "building"
  },
  {
    title: "Deployment-ready Africa office kit",
    bestFor: "Africa partners, field offices and low-power operating sites.",
    teamSize: "5-60 users",
    devices: "Mini PCs, rugged laptops, spares and accessories",
    services: ["Offline-first planning", "Partner handover", "Local support route"],
    cta: "Plan Africa kit",
    icon: "globe"
  },
  {
    title: "CSR and impact partnership",
    bestFor: "Companies turning IT refreshes into measurable social impact.",
    teamSize: "Department, estate or multi-site refresh",
    devices: "Donation, recovery and sponsorship pathways",
    services: ["Circular reporting", "Secure wipe route", "Community deployment"],
    cta: "Explore partnership",
    icon: "handshake"
  }
];

const serviceCards: Array<{
  title: string;
  description: string;
  benefits: string[];
  href: string;
  icon: IconKey;
}> = [
  ...businessCapabilities.map((capability) => ({
    title: capability.title,
    description: capability.description,
    benefits:
      capability.title === "Affordable staff devices"
        ? ["Lower acquisition cost", "Professional-grade options", "Reuse-first route"]
        : capability.title === "Office setup"
          ? ["Ready workstations", "Configured accounts", "Reduced setup friction"]
          : capability.title === "Microsoft 365 / Google Workspace"
            ? ["User access", "Cloud storage", "Collaboration basics"]
            : capability.title === "Cybersecurity basics"
              ? ["Updates and endpoint hygiene", "Password guidance", "Safe-use training"]
              : capability.title === "Asset register"
                ? ["Serial tracking", "Assigned owner", "Refresh planning"]
                : capability.title === "Device lifecycle planning"
                  ? ["Procure", "Repair", "Reuse or recycle"]
                  : capability.title === "Remote support"
                    ? ["Troubleshooting", "Setup help", "Support escalation"]
                    : ["Portable kits", "Accessories", "Field support"],
    href: capability.title === "Remote support" ? "/contact" : "/services",
    icon: capability.icon as IconKey
  })),
  {
    title: "Connectivity support",
    description: "Practical guidance for offices, shared workspaces and field teams with uneven connectivity.",
    benefits: ["Network basics", "Mobile data assumptions", "Offline-first planning"],
    href: "/contact?type=PARTNERSHIP#contact-form",
    icon: "network"
  },
  {
    title: "Shared workstation planning",
    description: "Plan access stations, hot desks and mixed-use device pools for teams and community spaces.",
    benefits: ["Capacity model", "Usage rules", "Support ownership"],
    href: "/community-hubs",
    icon: "monitor"
  },
  {
    title: "Device repair and maintenance",
    description: "Keep useful devices working through diagnostics, repair routing and replacement planning.",
    benefits: ["Repair workflow", "Spare planning", "Less downtime"],
    href: "/repairs",
    icon: "wrench"
  },
  {
    title: "Secure wipe and replacement planning",
    description: "Route retired or reassigned devices through wipe, recovery, reuse and responsible recycling decisions.",
    benefits: ["Data protection", "Circular recovery", "ESG evidence"],
    href: "/trade-in",
    icon: "shield"
  }
];

const fieldOperations = [
  { title: "Portable office kits", description: "Laptops, accessories and setup notes for mobile or temporary sites.", icon: "package" as IconKey },
  { title: "Low-power setups", description: "Mini PCs and efficient devices for constrained environments.", icon: "sun" as IconKey },
  { title: "Offline-first planning", description: "Workflows that do not depend on perfect connectivity.", icon: "offline" as IconKey },
  { title: "Shared access devices", description: "Device pools for volunteers, learners and community programmes.", icon: "users" as IconKey },
  { title: "Secure staff onboarding", description: "Baseline device, account and safe-use setup for new people.", icon: "shield" as IconKey },
  { title: "Cloud collaboration", description: "Microsoft 365, Google Workspace or hybrid collaboration setup.", icon: "cloud" as IconKey },
  { title: "Deployment tracking", description: "Track where devices are, who uses them and what support they need.", icon: "map" as IconKey },
  { title: "Asset accountability", description: "Serials, assignments, refresh dates and replacement planning.", icon: "database" as IconKey },
  { title: "Local support pathways", description: "Escalation routes that fit field teams and partner locations.", icon: "headset" as IconKey }
];

const lifecycleStages = ["Procurement", "Deployment", "Support", "Repair", "Refresh", "Reuse", "Recycling"];

const sustainabilityCards = [
  { title: "Secure wipe process", description: "Retired or reassigned devices can be routed through secure wipe and reuse decisions.", icon: "shield" as IconKey },
  { title: "ESG reporting", description: "Organisation refreshes can produce useful sustainability and reuse evidence.", icon: "chart" as IconKey },
  { title: "Circular technology strategy", description: "Plan procurement, repair, recovery and responsible retirement together.", icon: "recycle" as IconKey },
  { title: "Donation conversion pathway", description: "Turn usable surplus hardware into learner, school or community access.", icon: "heart" as IconKey },
  { title: "Social-impact reuse", description: "Recovered devices can support training, hubs and Africa deployment pathways.", icon: "leaf" as IconKey }
];

const trainingPathways = [
  "Digital literacy",
  "Remote work readiness",
  "Cybersecurity awareness",
  "AI literacy",
  "Microsoft 365 productivity",
  "Google Workspace onboarding",
  "Device maintenance basics"
];

const scenarioCards = [
  { title: "NGO field office refresh", devices: "18 laptops and accessories", team: "25 staff and volunteers", services: "Cloud setup, asset register, remote support", region: "Field operations", href: "/contact?type=SME_NGO#contact-form" },
  { title: "Small business digital upgrade", devices: "10 business laptops", team: "12-person SME", services: "Microsoft 365, cybersecurity basics, support", region: "UK SME", href: "/devices#device-request" },
  { title: "School administration rollout", devices: "Staff laptops and reception desktops", team: "Admin and leadership team", services: "Account setup, secure onboarding, replacement planning", region: "School operations", href: "/schools" },
  { title: "Community workforce hub", devices: "Shared workstations and laptops", team: "Community job seekers", services: "Training pathway, hub support, device lifecycle", region: "Community access", href: "/community-hubs" },
  { title: "Startup/coworking setup", devices: "Mixed workstations and monitors", team: "Hot desks and cohort events", services: "Shared workstation planning, support workflow", region: "Innovation hub", href: "/contact?type=PARTNERSHIP#contact-form" },
  { title: "Rural operations support", devices: "Low-power mini PCs and laptops", team: "Partner office and local users", services: "Offline-first planning, local support pathway", region: "Africa deployment", href: "/africa-deployment" }
];

const partnershipCards = [
  { title: "CSR partnerships", description: "Connect company refreshes with reuse, sponsorship and measurable community impact.", href: "/csr-partnerships", icon: "business" as IconKey },
  { title: "Device sponsorship", description: "Sponsor devices for learners, field teams, hubs or mission-led organisations.", href: "/donate", icon: "heart" as IconKey },
  { title: "NGO deployment partnerships", description: "Coordinate devices, training and support for programme delivery.", href: "/contact?type=PARTNERSHIP#contact-form", icon: "handshake" as IconKey },
  { title: "Technology donation programmes", description: "Recover surplus hardware through secure wipe, reuse and reporting pathways.", href: "/donate#donation-form", icon: "package" as IconKey },
  { title: "Circular IT partnerships", description: "Plan repair, recovery, trade-in, recycling and sustainability reporting together.", href: "/trade-in", icon: "recycle" as IconKey },
  { title: "Community hub partnerships", description: "Support local shared-access spaces with devices, training and ongoing support.", href: "/community-hubs", icon: "building" as IconKey }
];

const aftercareItems = [
  { title: "Remote support", href: "/contact", icon: "headset" as IconKey },
  { title: "Repair workflows", href: "/repairs", icon: "wrench" as IconKey },
  { title: "Asset lifecycle tracking", href: "/device-lifecycle", icon: "database" as IconKey },
  { title: "Refresh planning", href: "/trade-in", icon: "settings" as IconKey },
  { title: "Replacement guidance", href: "/devices#device-catalogue", icon: "laptop" as IconKey },
  { title: "Trade-in pathways", href: "/trade-in", icon: "cost" as IconKey },
  { title: "Sustainability reporting", href: "/sustainability", icon: "leaf" as IconKey }
];

const inputClass = "mt-2 w-full rounded-lg border border-line bg-white px-4 py-3 text-sm text-ink outline-none transition placeholder:text-muted/70 focus:border-flame-400 focus:ring-4 focus:ring-flame-100";

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function evaluatePackage(state: BuilderState) {
  const teamSize = clamp(Number(state.teamSize) || 1, 1, 5000);
  const country = state.countryRegion.toLowerCase();
  const isAfrica =
    !["united kingdom", "uk", "england", "scotland", "wales", "northern ireland"].includes(country) ||
    state.devicePreference === "Low-power field kit";

  let recommended: PackageTitle = "SME starter kit";

  if (state.organisationType === "School administration") recommended = "School administration setup";
  if (state.organisationType === "NGO / charity" || state.organisationType === "Field office") recommended = "NGO field office kit";
  if (state.organisationType === "Community organisation") recommended = "Community organisation package";
  if (state.organisationType === "Coworking / innovation hub") recommended = "Coworking & innovation hub setup";
  if (state.organisationType === "CSR / impact partner") recommended = "CSR and impact partnership";
  if (state.workModel === "Remote" || state.workModel === "Multi-site") recommended = "Remote workforce package";
  if (isAfrica) recommended = "Deployment-ready Africa office kit";
  if (teamSize > 80 && !isAfrica && state.organisationType !== "CSR / impact partner") recommended = "Remote workforce package";

  const deviceSuggestion =
    state.devicePreference === "Low-power field kit"
      ? "Low-power mini PCs, rugged laptops, spare devices and field accessories."
      : state.devicePreference === "Mixed bundle"
        ? "Mixed laptops, desktops, mini PCs, monitors, headsets and shared workstations."
        : `${state.devicePreference} matched to staff roles, volunteers and operating locations.`;

  const supportScore =
    [state.cybersecurity, state.assetTracking, state.remoteSupport, state.training].filter((choice) => choice === "Yes").length +
    (state.workModel === "Field-based" || state.workModel === "Multi-site" ? 1 : 0) +
    (teamSize > 25 ? 1 : 0);

  const supportLevel =
    supportScore >= 5
      ? "Managed support with asset accountability, security basics, training and lifecycle review."
      : supportScore >= 3
        ? "Structured support with onboarding, remote help, asset records and repair routes."
        : "Starter support with setup guidance, remote escalation and practical handover notes.";

  const route = isAfrica
    ? "Deployment readiness review covering power, connectivity, logistics, local ownership and support handover."
    : teamSize > 25
      ? "Batch IT package request with device matching, account setup, asset register and support planning."
      : "Starter package request with device bundle, productivity setup and remote support route.";

  const timeline =
    state.urgency === "Urgent"
      ? "Priority scoping and staged fulfilment route."
      : state.urgency === "This month"
        ? "Two-to-four week package planning window."
        : state.urgency === "This quarter"
          ? "Quarterly rollout plan with training and lifecycle alignment."
          : "Discovery route for budget, device and partnership fit.";

  const sustainability =
    teamSize >= 20
      ? "High reuse and reporting potential through refurbished devices, asset tracking and refresh planning."
      : "Practical reuse impact through refurbished procurement, repair routing and secure retirement planning.";

  return { recommended, deviceSuggestion, supportLevel, route, timeline, sustainability, teamSize, isAfrica };
}

export function BusinessesNgosExperience() {
  const [builder, setBuilder] = useState<BuilderState>(initialBuilder);
  const recommendation = useMemo(() => evaluatePackage(builder), [builder]);

  function update<Key extends keyof BuilderState>(key: Key, value: BuilderState[Key]) {
    setBuilder((current) => ({ ...current, [key]: value }));
  }

  function selectPackage(title: PackageTitle) {
    setBuilder((current) => ({
      ...current,
      organisationType:
        title === "School administration setup"
          ? "School administration"
          : title === "Community organisation package"
            ? "Community organisation"
            : title === "Coworking & innovation hub setup"
              ? "Coworking / innovation hub"
              : title === "CSR and impact partnership"
                ? "CSR / impact partner"
                : title === "Deployment-ready Africa office kit"
                  ? "Field office"
                  : title === "NGO field office kit"
                    ? "NGO / charity"
                    : "SME",
      workModel:
        title === "Remote workforce package"
          ? "Remote"
          : title === "Deployment-ready Africa office kit"
            ? "Field-based"
            : current.workModel,
      devicePreference: title === "Deployment-ready Africa office kit" ? "Low-power field kit" : current.devicePreference,
      teamSize:
        title === "SME starter kit"
          ? 10
          : title === "School administration setup"
            ? 18
            : title === "CSR and impact partnership"
              ? 80
              : title === "Deployment-ready Africa office kit"
                ? 24
                : title === "Coworking & innovation hub setup"
                  ? 35
                  : 16
    }));
    document.getElementById("it-package-builder")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <main className="bg-paper">
      <HeroSection />
      <SolutionsNavigator onSelect={selectPackage} />
      <PackageBuilderSection state={builder} recommendation={recommendation} update={update} />
      <ServicesSection />
      <FieldOperationsSection />
      <LifecycleSustainabilitySection />
      <TrainingEnablementSection />
      <ScenarioSection />
      <PartnershipSection />
      <AftercareSection />
      <FinalCtaSection />
    </main>
  );
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-ink px-4 pb-16 pt-32 text-white sm:px-6 lg:px-8 lg:pb-24">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#090909_0%,#151515_54%,#301706_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-paper to-transparent" />
      <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <AnimatedSection>
          <p className="inline-flex rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-xs font-semibold uppercase text-flame-100">
            Businesses, NGOs and mission operations
          </p>
          <h1 className="mt-6 max-w-5xl text-4xl font-semibold leading-tight tracking-normal sm:text-6xl">
            Professional technology access for businesses, NGOs and mission-led organisations
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-7 text-white/72 sm:text-lg">
            Equip staff, volunteers, field teams and community operations with affordable refurbished devices, productivity tools, cybersecurity basics, support services and deployment-ready IT packages.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="#it-package-builder">Request an IT package</ButtonLink>
            <ButtonLink href="/contact?type=PARTNERSHIP#contact-form" variant="secondary">Discuss partnership</ButtonLink>
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
              <p className="text-xs font-semibold uppercase text-flame-100">Operational technology flow</p>
              <h2 className="mt-2 text-2xl font-semibold">From device access to measurable impact.</h2>
            </div>
            <div className="grid gap-3 py-5 sm:grid-cols-2">
              {heroMetrics.map((metric) => (
                <div key={metric.label} className="border border-white/10 bg-black/18 p-4">
                  <p className="text-2xl font-semibold text-white">{metric.value}</p>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-flame-100">{metric.label}</p>
                  <p className="mt-2 text-xs leading-5 text-white/55">{metric.detail}</p>
                </div>
              ))}
            </div>
            <div className="grid gap-2 border-t border-white/10 pt-5 sm:grid-cols-2">
              {operationalFlow.map((stage, index) => (
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

function SolutionsNavigator({ onSelect }: { onSelect: (title: PackageTitle) => void }) {
  return (
    <section id="solutions-navigator" className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Solutions navigator"
            title="Choose an IT package around the way your organisation actually works."
            description="These routes combine devices, setup, productivity tooling, lifecycle support and mission-ready deployment planning."
          />
        </AnimatedSection>
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {solutionCards.map((solution, index) => (
            <AnimatedSection key={solution.title} delay={index * 0.025}>
              <article className="flex h-full flex-col border border-line bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-flame-300 hover:shadow-card">
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-flame-50 text-flame-600">
                  <Icon name={solution.icon} className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-lg font-semibold text-ink">{solution.title}</h3>
                <dl className="mt-5 grid gap-3 text-sm">
                  <Spec label="Best for" value={solution.bestFor} />
                  <Spec label="Team size" value={solution.teamSize} />
                  <Spec label="Typical devices" value={solution.devices} />
                </dl>
                <div className="mt-5 flex flex-wrap gap-2">
                  {solution.services.map((service) => (
                    <span key={`${solution.title}-${service}`} className="rounded-full bg-paper px-3 py-1 text-xs font-semibold text-muted">
                      {service}
                    </span>
                  ))}
                </div>
                <button
                  type="button"
                  className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white transition hover:bg-graphite"
                  onClick={() => onSelect(solution.title)}
                >
                  {solution.cta}
                  <Icon name="arrow" className="h-4 w-4" />
                </button>
              </article>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

function PackageBuilderSection({
  state,
  recommendation,
  update
}: {
  state: BuilderState;
  recommendation: ReturnType<typeof evaluatePackage>;
  update: <Key extends keyof BuilderState>(key: Key, value: BuilderState[Key]) => void;
}) {
  return (
    <section id="it-package-builder" className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.04fr_0.96fr] lg:items-start">
        <AnimatedSection>
          <SectionHeading
            eyebrow="IT package configurator"
            title="Build a practical operations technology package."
            description="Shape team size, work model, cloud platform, security, support and budget into a recommended SIT Digital Access route."
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <SelectField label="Organisation type" value={state.organisationType} options={["SME", "NGO / charity", "School administration", "Community organisation", "Field office", "Coworking / innovation hub", "CSR / impact partner"]} onChange={(value) => update("organisationType", value as OrganisationType)} />
            <InputField label="Team size" value={String(state.teamSize)} type="number" min={1} onChange={(value) => update("teamSize", clamp(Number(value) || 1, 1, 5000))} />
            <InputField label="Country/region" value={state.countryRegion} onChange={(value) => update("countryRegion", value)} />
            <SelectField label="Remote or office-based?" value={state.workModel} options={["Office-based", "Remote", "Hybrid", "Field-based", "Multi-site"]} onChange={(value) => update("workModel", value as WorkModel)} />
            <SelectField label="Device preference" value={state.devicePreference} options={["Laptops", "Desktops", "Mini PCs", "Mixed bundle", "Low-power field kit"]} onChange={(value) => update("devicePreference", value as DevicePreference)} />
            <SelectField label="Cloud platform" value={state.cloudPlatform} options={["Microsoft 365", "Google Workspace", "Hybrid"]} onChange={(value) => update("cloudPlatform", value as CloudPlatform)} />
            <SelectField label="Cybersecurity support required?" value={state.cybersecurity} options={["Yes", "No", "Not sure"]} onChange={(value) => update("cybersecurity", value as ToggleChoice)} />
            <SelectField label="Asset tracking required?" value={state.assetTracking} options={["Yes", "No", "Not sure"]} onChange={(value) => update("assetTracking", value as ToggleChoice)} />
            <SelectField label="Remote support required?" value={state.remoteSupport} options={["Yes", "No", "Not sure"]} onChange={(value) => update("remoteSupport", value as ToggleChoice)} />
            <SelectField label="Training required?" value={state.training} options={["Yes", "No", "Not sure"]} onChange={(value) => update("training", value as ToggleChoice)} />
            <SelectField label="Deployment urgency" value={state.urgency} options={["Exploring", "This quarter", "This month", "Urgent"]} onChange={(value) => update("urgency", value as DeploymentUrgency)} />
            <SelectField label="Budget range" value={state.budget} options={["Under £2,500", "£2,500-£7,500", "£7,500-£20,000", "£20,000+", "Not sure"]} onChange={(value) => update("budget", value as BudgetRange)} />
          </div>
        </AnimatedSection>
        <AnimatedSection delay={0.08}>
          <aside className="sticky top-28 border border-line bg-paper p-5 shadow-card">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-flame-700">Recommended package</p>
            <h3 className="mt-3 text-3xl font-semibold text-ink">{recommendation.recommended}</h3>
            <p className="mt-3 text-sm leading-6 text-muted">
              Based on {recommendation.teamSize} users, {state.workModel.toLowerCase()} operations, {state.cloudPlatform} and lifecycle support needs.
            </p>
            <div className="mt-6 grid gap-3">
              <ResultCard label="Suggested devices" value={recommendation.deviceSuggestion} icon="laptop" />
              <ResultCard label="Suggested support level" value={recommendation.supportLevel} icon="headset" />
              <ResultCard label="Estimated deployment route" value={recommendation.route} icon="map" />
              <ResultCard label="Timeline" value={recommendation.timeline} icon="chart" />
              <ResultCard label="Sustainability impact estimate" value={recommendation.sustainability} icon="leaf" />
            </div>
            {recommendation.isAfrica ? (
              <div className="mt-5 border border-flame-200 bg-flame-50 p-4 text-sm leading-6 text-flame-900">
                This package should include Africa deployment planning for power, logistics, handover, local support and spare device assumptions.
              </div>
            ) : null}
            <div className="mt-5 flex flex-wrap gap-3">
              <ButtonLink href="/contact?type=SME_NGO#contact-form" variant="dark">Request an IT package</ButtonLink>
              <ButtonLink href="/contact?type=PARTNERSHIP#contact-form" variant="secondary">Discuss partnership</ButtonLink>
            </div>
          </aside>
        </AnimatedSection>
      </div>
    </section>
  );
}

function ServicesSection() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Operational technology services"
            title="Practical IT services for teams that need reliability without enterprise overhead."
            description="Device access works best when setup, accounts, cybersecurity, asset records, support and lifecycle planning are considered together."
          />
        </AnimatedSection>
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {serviceCards.map((service, index) => (
            <AnimatedSection key={service.title} delay={index * 0.02}>
              <article className="flex h-full flex-col border border-line bg-white p-5 shadow-sm">
                <Icon name={service.icon} className="h-5 w-5 text-flame-600" />
                <h3 className="mt-5 text-lg font-semibold text-ink">{service.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted">{service.description}</p>
                <div className="mt-5 space-y-2">
                  {service.benefits.map((benefit) => (
                    <div key={`${service.title}-${benefit}`} className="flex items-center gap-2 text-sm font-semibold text-ink">
                      <Icon name="check" className="h-4 w-4 text-green-600" />
                      {benefit}
                    </div>
                  ))}
                </div>
                <ButtonLink href={service.href} variant="secondary" className="mt-auto self-start">Explore service</ButtonLink>
              </article>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

function FieldOperationsSection() {
  return (
    <section className="bg-ink px-4 py-20 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <div className="grid gap-10 lg:grid-cols-[0.86fr_1.14fr] lg:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-flame-200">NGO and field operations</p>
              <h2 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl">
                Technology support for distributed and field-based operations
              </h2>
              <p className="mt-4 text-sm leading-6 text-white/70">
                Field operations need devices, accounts, support, accountability and low-friction workflows that keep programmes moving across offices, partners and communities.
              </p>
              <div className="mt-8 grid gap-2 sm:grid-cols-3">
                {["Site need", "Device route", "Support handover"].map((step, index) => (
                  <div key={step} className="border border-white/10 bg-white/[0.06] p-4">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-flame-500 text-xs font-bold">{index + 1}</span>
                    <p className="mt-3 text-sm font-semibold">{step}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {fieldOperations.map((feature) => (
                <article key={feature.title} className="border border-white/10 bg-white/[0.06] p-5">
                  <Icon name={feature.icon} className="h-5 w-5 text-flame-200" />
                  <h3 className="mt-4 text-base font-semibold text-white">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/62">{feature.description}</p>
                </article>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

function LifecycleSustainabilitySection() {
  return (
    <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Device lifecycle and sustainability"
            title="Procurement is only one part of responsible technology operations."
            description="SIT Digital Access connects device access with support, repair, refresh, reuse, recycling and reporting so hardware stays useful for longer."
          />
        </AnimatedSection>
        <div className="mt-10 grid gap-2 md:grid-cols-7">
          {lifecycleStages.map((stage, index) => (
            <AnimatedSection key={stage} delay={index * 0.025}>
              <div className="h-full border border-line bg-paper p-4">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-flame-500 text-xs font-bold text-white">{index + 1}</span>
                <p className="mt-4 text-sm font-semibold text-ink">{stage}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {sustainabilityCards.map((card, index) => (
            <AnimatedSection key={card.title} delay={index * 0.025}>
              <article className="h-full border border-line bg-white p-5 shadow-sm">
                <Icon name={card.icon} className="h-5 w-5 text-flame-600" />
                <h3 className="mt-4 text-base font-semibold text-ink">{card.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{card.description}</p>
              </article>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

function TrainingEnablementSection() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.86fr_1.14fr] lg:items-start">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Powered by SIT Learning"
            title="Technology works best when teams are supported with practical digital skills."
            description="Training can help staff, volunteers and field teams use devices safely, consistently and productively."
          />
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/programmes" variant="dark">Explore training pathways</ButtonLink>
            <ButtonLink href="/contact?type=TRAINING#contact-form" variant="secondary">Discuss team training</ButtonLink>
          </div>
        </AnimatedSection>
        <AnimatedSection delay={0.08}>
          <div className="grid gap-3 sm:grid-cols-2">
            {trainingPathways.map((pathway, index) => (
              <article key={pathway} className="border border-line bg-white p-5 shadow-sm">
                <Icon name={index === 2 ? "shield" : index === 3 ? "sparkles" : index >= 4 ? "settings" : "graduation"} className="h-5 w-5 text-flame-600" />
                <h3 className="mt-4 text-base font-semibold text-ink">{pathway}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">A practical enablement route for staff, volunteers and operational teams.</p>
              </article>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

function ScenarioSection() {
  return (
    <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Operational scenarios"
            title="Real-world routes for businesses, NGOs and mission-led teams."
            description="These examples show how device access, setup, training, support and sustainability can combine into practical delivery models."
          />
        </AnimatedSection>
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {scenarioCards.map((scenario, index) => (
            <AnimatedSection key={scenario.title} delay={index * 0.035}>
              <article className="flex h-full flex-col border border-line bg-paper p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-flame-700">{scenario.region}</p>
                <h3 className="mt-3 text-xl font-semibold text-ink">{scenario.title}</h3>
                <div className="mt-5 space-y-2 text-sm leading-6 text-muted">
                  <p><strong className="text-ink">Devices deployed:</strong> {scenario.devices}</p>
                  <p><strong className="text-ink">Team size:</strong> {scenario.team}</p>
                  <p><strong className="text-ink">Services included:</strong> {scenario.services}</p>
                </div>
                <ButtonLink href={scenario.href} variant="secondary" className="mt-auto self-start">Explore route</ButtonLink>
              </article>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

function PartnershipSection() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Partnership and CSR"
            title="Partner with SIT Digital Access"
            description="Partnerships can connect device sponsorship, technology donations, NGO deployment, circular IT and community hub support."
          />
        </AnimatedSection>
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {partnershipCards.map((card, index) => (
            <AnimatedSection key={card.title} delay={index * 0.035}>
              <article className="h-full border border-line bg-white p-5 shadow-sm">
                <Icon name={card.icon} className="h-5 w-5 text-flame-600" />
                <h3 className="mt-5 text-xl font-semibold text-ink">{card.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted">{card.description}</p>
                <ButtonLink href={card.href} variant="secondary" className="mt-5">Become a partner</ButtonLink>
              </article>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

function AftercareSection() {
  return (
    <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Support and aftercare"
            title="Keep organisation technology useful after the first deployment."
            description="Aftercare connects remote support, repair workflows, lifecycle tracking, refresh planning, replacement guidance, trade-in pathways and sustainability reporting."
          />
        </AnimatedSection>
        <div className="mt-10 grid gap-3 md:grid-cols-2 xl:grid-cols-7">
          {aftercareItems.map((item, index) => (
            <AnimatedSection key={item.title} delay={index * 0.025}>
              <a href={item.href} className="block h-full border border-line bg-paper p-4 transition hover:border-flame-300 hover:bg-white hover:shadow-card">
                <Icon name={item.icon} className="h-5 w-5 text-flame-600" />
                <p className="mt-4 text-sm font-semibold text-ink">{item.title}</p>
              </a>
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
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-flame-200">Business and NGO technology access</p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight">
              Make professional technology access affordable, practical and scalable.
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-white/70">
              Request an IT package, plan a deployment, explore partnership routes or talk through a practical operations technology need.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/contact?type=SME_NGO#contact-form">Request an IT package</ButtonLink>
            <ButtonLink href="/contact" variant="secondary">Talk to SIT Digital Access</ButtonLink>
            <ButtonLink href="/africa-deployment#africa-enquiry" variant="secondary">Plan deployment</ButtonLink>
            <ButtonLink href="/contact?type=PARTNERSHIP#contact-form" variant="ghost" className="text-white hover:bg-white/10">Become a partner</ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-flame-700">{label}</dt>
      <dd className="mt-1 text-sm leading-6 text-muted">{value}</dd>
    </div>
  );
}

function ResultCard({ label, value, icon }: { label: string; value: string; icon: IconKey }) {
  return (
    <div className="border border-line bg-white p-4">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-flame-50 text-flame-700">
          <Icon name={icon} className="h-5 w-5" />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">{label}</p>
          <p className="mt-1 text-sm font-semibold leading-6 text-ink">{value}</p>
        </div>
      </div>
    </div>
  );
}

function InputField({
  label,
  value,
  type = "text",
  min,
  onChange
}: {
  label: string;
  value: string;
  type?: string;
  min?: number;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block text-sm font-semibold text-ink">
      {label}
      <input className={inputClass} min={min} type={type} value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="block text-sm font-semibold text-ink">
      {label}
      <select className={inputClass} value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}
