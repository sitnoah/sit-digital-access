"use client";

import { useMemo, useState } from "react";
import { AnimatedSection } from "@/components/animated-section";
import { ButtonLink } from "@/components/button-link";
import { Icon, type IconKey } from "@/components/icons";
import { SectionHeading } from "@/components/section-heading";
import { africaMapOverlayMetrics, impactStats } from "@/lib/data";

type OrganisationType =
  | "School"
  | "NGO"
  | "Church or faith organisation"
  | "Library"
  | "Youth group"
  | "Community centre"
  | "Training provider"
  | "Coworking space";

type InternetAvailability = "Reliable broadband" | "Mobile data only" | "Intermittent" | "Offline-first needed";
type PowerReliability = "Reliable mains" | "Occasional outages" | "Frequent outages" | "Solar or battery required";
type TrainingRequired = "Digital literacy" | "AI literacy" | "Cybersecurity awareness" | "Coding and software skills" | "Remote work readiness" | "Not sure yet";
type DevicePreference = "Laptops" | "Desktops" | "Mini PCs" | "Mixed device bundle" | "Low-power lab";
type SupportLevel = "Remote support" | "On-site setup" | "Train local champion" | "Managed support";
type DeploymentUrgency = "Exploring" | "This quarter" | "This month" | "Urgent";

type BuilderState = {
  organisationType: OrganisationType;
  country: string;
  communitySize: "Under 25" | "25-75" | "75-200" | "200+";
  deviceCount: number;
  internet: InternetAvailability;
  power: PowerReliability;
  training: TrainingRequired;
  devicePreference: DevicePreference;
  supportLevel: SupportLevel;
  urgency: DeploymentUrgency;
};

type PackageTitle =
  | "Starter access hub"
  | "Training room hub"
  | "Africa-ready community lab"
  | "School digital access hub"
  | "NGO field office hub"
  | "Coworking & innovation hub";

const initialBuilder: BuilderState = {
  organisationType: "Community centre",
  country: "United Kingdom",
  communitySize: "25-75",
  deviceCount: 12,
  internet: "Reliable broadband",
  power: "Reliable mains",
  training: "Digital literacy",
  devicePreference: "Laptops",
  supportLevel: "Remote support",
  urgency: "This quarter"
};

const trustBadges = [
  "UK-based operations",
  "Africa deployment support",
  "Refurbished technology",
  "Community-first access",
  "Skills and training pathways"
];

const lifecycleStages = ["Devices", "Connectivity", "Training", "Access", "Support", "Impact"];

const devicesMetric = impactStats.find((metric) => metric.label === "Devices deployed");
const learnerMetric = impactStats.find((metric) => metric.label === "Learners reached");
const countriesMetric = impactStats.find((metric) => metric.label === "Countries served");
const communityHubMetric = africaMapOverlayMetrics.find((metric) => metric.label === "Community hubs");

const heroMetrics: Array<{ value: string; label: string; detail: string }> = [
  {
    value: devicesMetric?.value ?? "500+",
    label: "Devices deployed",
    detail: devicesMetric?.detail ?? "Target for refurbished devices"
  },
  {
    value: communityHubMetric?.value ?? "6+",
    label: "Community hubs supported",
    detail: "Community access and hub planning signal"
  },
  {
    value: learnerMetric?.value ?? "1,500+",
    label: "Learners enabled",
    detail: learnerMetric?.detail ?? "Through access and training"
  },
  {
    value: countriesMetric?.value ?? "5+",
    label: "Countries reached",
    detail: countriesMetric?.detail ?? "UK and Africa partnerships"
  }
];

const hubPackages: Array<{
  title: PackageTitle;
  audience: string;
  devices: string;
  connectivity: string;
  support: string;
  capacity: string;
  accessories: string[];
  cta: string;
  icon: IconKey;
}> = [
  {
    title: "Starter access hub",
    audience: "Libraries, churches, charities and small community spaces",
    devices: "5-10 laptops or desktops",
    connectivity: "Shared Wi-Fi or mobile router guidance",
    support: "Remote support and setup checklist",
    capacity: "10-30 regular users",
    accessories: ["Keyboards", "Mice", "Headsets", "Asset list"],
    cta: "Request starter hub",
    icon: "building"
  },
  {
    title: "Training room hub",
    audience: "Training centres, youth groups and digital skills providers",
    devices: "10-24 learner devices plus instructor device",
    connectivity: "Reliable broadband recommended",
    support: "Setup, imaging and cohort readiness",
    capacity: "20-80 learners per month",
    accessories: ["Instructor device", "Displays", "Classroom peripherals", "Usage guide"],
    cta: "Build training hub",
    icon: "users"
  },
  {
    title: "Africa-ready community lab",
    audience: "Africa partners, rural hubs and low-power learning spaces",
    devices: "Mini PCs, low-power desktops or rugged laptops",
    connectivity: "Offline-first and solar-aware planning",
    support: "Partner handover and local champion model",
    capacity: "30-150 learners per month",
    accessories: ["Low-power screens", "Spare pool", "Offline content plan", "Maintenance guide"],
    cta: "Plan Africa-ready lab",
    icon: "globe"
  },
  {
    title: "School digital access hub",
    audience: "Schools, after-school clubs and shared ICT rooms",
    devices: "12-30 lab, trolley or classroom devices",
    connectivity: "School network and safeguarding checks",
    support: "Asset tagging, setup and replacement planning",
    capacity: "One class or rotation model",
    accessories: ["Teacher device", "Charging plan", "Asset tags", "Support route"],
    cta: "Request school hub",
    icon: "school"
  },
  {
    title: "NGO field office hub",
    audience: "NGOs, charities, field teams and local programme offices",
    devices: "5-40 staff, volunteer and training devices",
    connectivity: "Cloud tools, mobile data and shared access planning",
    support: "Secure setup and field support workflow",
    capacity: "Team operations plus community sessions",
    accessories: ["Business laptops", "Cloud setup", "Secure wipe notes", "Inventory list"],
    cta: "Plan NGO hub",
    icon: "heart"
  },
  {
    title: "Coworking & innovation hub",
    audience: "Enterprise centres, incubators and local innovation spaces",
    devices: "Mixed device bundle for desk, training and event use",
    connectivity: "Reliable broadband and shared workspace setup",
    support: "Managed support and device refresh planning",
    capacity: "Daily shared access and cohort events",
    accessories: ["Monitors", "Docking", "Presentation kit", "Booking model"],
    cta: "Design innovation hub",
    icon: "business"
  }
];

const useCases: Array<{
  title: string;
  devices: string;
  outcomes: string;
  skills: string;
  support: string;
  icon: IconKey;
}> = [
  { title: "Libraries and learning centres", devices: "Shared laptops, desktops and headphones", outcomes: "Job search, study access and public digital confidence", skills: "Digital literacy and remote work readiness", support: "Remote support and local champion", icon: "book" },
  { title: "Churches and faith organisations", devices: "Starter access hub and community devices", outcomes: "Community drop-ins, youth sessions and family support", skills: "Basic digital skills and online safety", support: "Volunteer setup and maintenance route", icon: "heart" },
  { title: "Youth empowerment spaces", devices: "Laptops, mini PCs and training room bundles", outcomes: "Portfolio building, coding clubs and employability", skills: "Coding, AI literacy and entrepreneurship", support: "Cohort support and device rotation", icon: "sparkles" },
  { title: "Refugee and community support centres", devices: "Shared access laptops and private admin devices", outcomes: "Forms, translation, learning and family access", skills: "Digital confidence and cybersecurity basics", support: "Safeguarded shared-use model", icon: "users" },
  { title: "NGO training hubs", devices: "Instructor device plus learner workstations", outcomes: "Programme delivery and team operations", skills: "Digital literacy, reporting and cloud tools", support: "Setup, repair route and inventory records", icon: "building" },
  { title: "Women entrepreneurship centres", devices: "Laptops, desktops and presentation kit", outcomes: "Business planning, online sales and skills sessions", skills: "Remote work and entrepreneurship", support: "Mentor-led digital hub model", icon: "handshake" },
  { title: "Rural digital access labs", devices: "Low-power mini PCs and offline-first resources", outcomes: "Shared access where power/connectivity is constrained", skills: "Offline learning and practical digital literacy", support: "Local ownership and maintenance plan", icon: "sun" },
  { title: "Coworking and innovation hubs", devices: "Mixed device bundle, monitors and event kit", outcomes: "Startup access, community workstations and innovation events", skills: "AI literacy, productivity and software skills", support: "Managed support and refresh planning", icon: "business" }
];

const outcomeCards = [
  { title: "Learner access pathway", metric: "40+ study hours", progress: 78, story: "A learner moves from phone-only access to reliable coursework, practice and portfolio work.", cta: "Explore learner access" },
  { title: "Community hub launch", metric: "10-24 devices", progress: 68, story: "A local venue becomes a recurring place for job search, guided learning and digital support.", cta: "Plan hub launch" },
  { title: "NGO operations refresh", metric: "Cloud-ready team", progress: 72, story: "An NGO standardises staff laptops, cloud tools and field coordination workflows.", cta: "Support NGO team" },
  { title: "School lab deployment", metric: "24-seat model", progress: 84, story: "A school moves toward timetable-ready digital learning with asset records and support ownership.", cta: "Build school lab" },
  { title: "Youth digital skills pathway", metric: "Cohort-ready", progress: 74, story: "A youth group pairs shared devices with coding, employability and portfolio sessions.", cta: "Add skills pathway" },
  { title: "AI literacy access", metric: "Practical AI sessions", progress: 64, story: "Community members learn safe, useful AI workflows for learning, work and local enterprise.", cta: "Explore AI literacy" }
];

const trainingPathways = [
  "Digital literacy",
  "AI literacy",
  "Cybersecurity awareness",
  "Coding and software skills",
  "Teacher enablement",
  "Remote work readiness",
  "Entrepreneurship and employability"
];

const africaPlanningTopics: Array<{ title: string; description: string; icon: IconKey }> = [
  { title: "Low-power planning", description: "Choose devices and usage models that fit local power conditions.", icon: "sun" },
  { title: "Mini PC deployments", description: "Use efficient devices for labs, hubs and shared-access rooms.", icon: "cpu" },
  { title: "Solar-aware setups", description: "Plan practical load, charging and uptime assumptions.", icon: "leaf" },
  { title: "Offline-first learning", description: "Support learning continuity where connectivity is limited.", icon: "offline" },
  { title: "Shared access models", description: "Design fair schedules, local ownership and repeatable sessions.", icon: "users" },
  { title: "Local support ownership", description: "Identify champions and escalation routes before launch.", icon: "handshake" },
  { title: "Maintenance planning", description: "Prepare spare pools, repair routes and lifecycle checks.", icon: "wrench" },
  { title: "Partner handover", description: "Make deployment, training and support responsibilities clear.", icon: "package" }
];

const lifecycleOperations = [
  { title: "Repairs", href: "/repairs", icon: "wrench" as IconKey },
  { title: "Device replacement", href: "/devices#device-catalogue", icon: "laptop" as IconKey },
  { title: "Trade-in", href: "/trade-in", icon: "cost" as IconKey },
  { title: "Recycling", href: "/device-recycling", icon: "recycle" as IconKey },
  { title: "Refurbishment", href: "/device-lifecycle", icon: "settings" as IconKey },
  { title: "Sustainability reporting", href: "/sustainability", icon: "leaf" as IconKey },
  { title: "Ongoing support", href: "/contact", icon: "headset" as IconKey }
];

const sponsorCards = [
  { title: "Sponsor a learner", detail: "Fund devices and learning access for an individual pathway.", href: "/donate", icon: "graduation" as IconKey },
  { title: "Sponsor a hub", detail: "Support a shared access space with devices and training.", href: "/donate", icon: "building" as IconKey },
  { title: "Donate devices", detail: "Turn retired hardware into community-ready access.", href: "/donate#donation-form", icon: "heart" as IconKey },
  { title: "Corporate CSR partnership", detail: "Connect reuse, sponsorship and ESG-ready reporting.", href: "/csr-partnerships", icon: "business" as IconKey },
  { title: "NGO partnership", detail: "Plan practical device and training support for programmes.", href: "/contact?type=PARTNERSHIP#contact-form", icon: "handshake" as IconKey },
  { title: "Community deployment support", detail: "Design a hub around location, power, training and support.", href: "/africa-deployment", icon: "globe" as IconKey }
];

const storyPreviews = [
  { title: "Liberia community lab", region: "Liberia", devices: "20 mini PCs", learners: "120 learners", quote: "A shared lab can turn limited access into a weekly learning rhythm.", href: "/success-stories" },
  { title: "NGO digital access rollout", region: "West Africa", devices: "35 laptops", learners: "Field teams and community groups", quote: "Reliable devices help programme teams deliver training and reporting.", href: "/success-stories" },
  { title: "Teacher enablement programme", region: "School deployment", devices: "Instructor devices", learners: "12 teachers", quote: "Teacher confidence changes how every shared device is used.", href: "/programmes" },
  { title: "Youth coding access initiative", region: "Community access", devices: "15 lab devices", learners: "60 youth participants", quote: "A small hub can create space for coding, portfolios and employability.", href: "/programmes" },
  { title: "Community coworking launch", region: "Local innovation hub", devices: "Mixed workspace bundle", learners: "Entrepreneurs and job seekers", quote: "Shared workstations can support learning, work and local enterprise.", href: "/success-stories" }
];

const inputClass = "mt-2 w-full rounded-lg border border-line bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-flame-400 focus:ring-4 focus:ring-flame-100";

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function evaluateHub(state: BuilderState) {
  const devices = clamp(Number(state.deviceCount) || 1, 1, 500);
  const country = state.country.toLowerCase();
  const isAfrica = !["united kingdom", "uk", "england", "scotland", "wales", "northern ireland"].includes(country);
  const constrained = state.power !== "Reliable mains" || state.internet === "Offline-first needed" || state.internet === "Intermittent";
  let recommended: PackageTitle = "Starter access hub";

  if (state.organisationType === "School") recommended = "School digital access hub";
  if (state.organisationType === "NGO") recommended = "NGO field office hub";
  if (state.organisationType === "Coworking space") recommended = "Coworking & innovation hub";
  if (devices >= 18 || state.communitySize === "75-200" || state.communitySize === "200+") recommended = "Training room hub";
  if (isAfrica || constrained || state.devicePreference === "Low-power lab") recommended = "Africa-ready community lab";
  if (devices <= 8 && !isAfrica && !constrained && state.organisationType !== "School") recommended = "Starter access hub";

  const route = isAfrica || constrained
    ? "Deployment readiness review with power, connectivity and local support planning."
    : devices > 20
      ? "Batch device request with asset list, setup plan and support handover."
      : "Starter hub request with device bundle, accessories and remote setup guidance.";
  const pathway = state.training === "Not sure yet"
    ? "Begin with digital literacy, then add AI literacy or remote work readiness as the hub matures."
    : `${state.training} pathway powered by SIT Learning.`;
  const support = state.supportLevel === "Managed support"
    ? "Managed support with repair, replacement and maintenance reporting."
    : state.supportLevel === "Train local champion"
      ? "Local champion model with escalation to SIT Digital Access."
      : `${state.supportLevel} with lifecycle and repair routes.`;
  const timeline = state.urgency === "Urgent"
    ? "Priority discovery and staged deployment planning."
    : state.urgency === "This month"
      ? "Two-to-four week readiness and device matching route."
      : state.urgency === "This quarter"
        ? "Quarterly planning window with training and support alignment."
        : "Discovery route for early scoping and partner fit.";

  return { recommended, route, pathway, support, timeline, devices, isAfrica, constrained };
}

export function CommunityHubsExperience() {
  const [builder, setBuilder] = useState<BuilderState>(initialBuilder);
  const recommendation = useMemo(() => evaluateHub(builder), [builder]);

  function update<Key extends keyof BuilderState>(key: Key, value: BuilderState[Key]) {
    setBuilder((current) => ({ ...current, [key]: value }));
  }

  function selectPackage(pkg: PackageTitle) {
    const devices = pkg === "Starter access hub" ? 8 : pkg === "Training room hub" ? 18 : pkg === "Africa-ready community lab" ? 16 : pkg === "School digital access hub" ? 24 : pkg === "NGO field office hub" ? 12 : 20;
    setBuilder((current) => ({
      ...current,
      deviceCount: devices,
      organisationType: pkg === "School digital access hub" ? "School" : pkg === "NGO field office hub" ? "NGO" : pkg === "Coworking & innovation hub" ? "Coworking space" : current.organisationType,
      devicePreference: pkg === "Africa-ready community lab" ? "Low-power lab" : current.devicePreference,
      power: pkg === "Africa-ready community lab" ? "Solar or battery required" : current.power,
      internet: pkg === "Africa-ready community lab" ? "Offline-first needed" : current.internet
    }));
    document.getElementById("hub-builder")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <main className="bg-paper">
      <HeroSection />
      <HubPackageSelector onSelect={selectPackage} />
      <HubBuilderSection state={builder} recommendation={recommendation} update={update} />
      <UseCasesSection />
      <CommunityOutcomesSection />
      <TrainingPathwaysSection />
      <AfricaReadySection />
      <LifecycleOperationsSection />
      <PartnerSponsorSection />
      <SuccessStoriesPreview />
      <FinalCtaSection />
    </main>
  );
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-ink px-4 pb-16 pt-32 text-white sm:px-6 lg:px-8 lg:pb-24">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#080808_0%,#151515_58%,#2b1505_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-paper to-transparent" />
      <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.04fr_0.96fr] lg:items-center">
        <AnimatedSection>
          <p className="inline-flex rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-xs font-semibold uppercase text-flame-100">
            Community digital hubs
          </p>
          <h1 className="mt-6 max-w-5xl text-4xl font-semibold leading-tight tracking-normal sm:text-6xl">
            Community digital hubs for learning, work and digital inclusion
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-7 text-white/72 sm:text-lg">
            Build practical digital hubs with refurbished devices, training pathways, support services and deployment-ready technology bundles for schools, communities and local organisations.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="#hub-packages">Explore hub packages</ButtonLink>
            <ButtonLink href="/devices#device-request" variant="secondary">Request devices</ButtonLink>
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
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-5">
              <div>
                <p className="text-xs font-semibold uppercase text-flame-100">Hub lifecycle</p>
                <h2 className="mt-2 text-2xl font-semibold">Access becomes infrastructure</h2>
              </div>
              <span className="rounded-full bg-flame-500/20 px-3 py-1.5 text-xs font-semibold text-flame-50">SIT Learning ready</span>
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
              {lifecycleStages.map((stage, index) => (
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

function HubPackageSelector({ onSelect }: { onSelect: (pkg: PackageTitle) => void }) {
  return (
    <section id="hub-packages" className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Hub package selector"
            title="Choose a package around your people, space and operating reality."
            description="Each hub package connects device supply, connectivity planning, training pathways, accessories and ongoing support."
          />
        </AnimatedSection>
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {hubPackages.map((pkg, index) => (
            <AnimatedSection key={pkg.title} delay={index * 0.035}>
              <article className="flex h-full flex-col border border-line bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-flame-300 hover:shadow-card">
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-flame-50 text-flame-600">
                  <Icon name={pkg.icon} className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-xl font-semibold text-ink">{pkg.title}</h3>
                <dl className="mt-5 grid gap-3 text-sm">
                  <Spec label="Recommended audience" value={pkg.audience} />
                  <Spec label="Device range" value={pkg.devices} />
                  <Spec label="Connectivity guidance" value={pkg.connectivity} />
                  <Spec label="Support level" value={pkg.support} />
                  <Spec label="Suggested learner capacity" value={pkg.capacity} />
                </dl>
                <div className="mt-5 flex flex-wrap gap-2">
                  {pkg.accessories.map((item) => (
                    <span key={item} className="rounded-full bg-paper px-3 py-1 text-xs font-semibold text-muted">{item}</span>
                  ))}
                </div>
                <button
                  className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white transition hover:bg-graphite"
                  onClick={() => onSelect(pkg.title)}
                >
                  {pkg.cta}
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

function HubBuilderSection({
  state,
  recommendation,
  update
}: {
  state: BuilderState;
  recommendation: ReturnType<typeof evaluateHub>;
  update: <Key extends keyof BuilderState>(key: Key, value: BuilderState[Key]) => void;
}) {
  return (
    <section id="hub-builder" className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.04fr_0.96fr] lg:items-start">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Build your hub"
            title="Configure a practical deployment route."
            description="Use the builder to shape device count, training need, power, connectivity and support into a recommended hub package."
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <SelectField label="Organisation type" value={state.organisationType} options={["School", "NGO", "Church or faith organisation", "Library", "Youth group", "Community centre", "Training provider", "Coworking space"]} onChange={(value) => update("organisationType", value as OrganisationType)} />
            <InputField label="Country" value={state.country} onChange={(value) => update("country", value)} />
            <SelectField label="Learner/community size" value={state.communitySize} options={["Under 25", "25-75", "75-200", "200+"]} onChange={(value) => update("communitySize", value as BuilderState["communitySize"])} />
            <InputField label="Number of devices" value={String(state.deviceCount)} type="number" min={1} onChange={(value) => update("deviceCount", clamp(Number(value) || 1, 1, 500))} />
            <SelectField label="Internet availability" value={state.internet} options={["Reliable broadband", "Mobile data only", "Intermittent", "Offline-first needed"]} onChange={(value) => update("internet", value as InternetAvailability)} />
            <SelectField label="Power reliability" value={state.power} options={["Reliable mains", "Occasional outages", "Frequent outages", "Solar or battery required"]} onChange={(value) => update("power", value as PowerReliability)} />
            <SelectField label="Training required" value={state.training} options={["Digital literacy", "AI literacy", "Cybersecurity awareness", "Coding and software skills", "Remote work readiness", "Not sure yet"]} onChange={(value) => update("training", value as TrainingRequired)} />
            <SelectField label="Device type preference" value={state.devicePreference} options={["Laptops", "Desktops", "Mini PCs", "Mixed device bundle", "Low-power lab"]} onChange={(value) => update("devicePreference", value as DevicePreference)} />
            <SelectField label="Support level needed" value={state.supportLevel} options={["Remote support", "On-site setup", "Train local champion", "Managed support"]} onChange={(value) => update("supportLevel", value as SupportLevel)} />
            <SelectField label="Deployment urgency" value={state.urgency} options={["Exploring", "This quarter", "This month", "Urgent"]} onChange={(value) => update("urgency", value as DeploymentUrgency)} />
          </div>
        </AnimatedSection>
        <AnimatedSection delay={0.08}>
          <aside className="sticky top-28 border border-line bg-paper p-5 shadow-card">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-flame-700">Recommended plan</p>
            <h3 className="mt-3 text-3xl font-semibold text-ink">{recommendation.recommended}</h3>
            <p className="mt-3 text-sm leading-6 text-muted">
              Based on {recommendation.devices} devices, {state.organisationType.toLowerCase()} context, power, connectivity and support needs.
            </p>
            <div className="mt-6 grid gap-3">
              <ResultCard label="Estimated setup route" value={recommendation.route} icon="map" />
              <ResultCard label="Suggested training pathway" value={recommendation.pathway} icon="graduation" />
              <ResultCard label="Suggested support model" value={recommendation.support} icon="headset" />
              <ResultCard label="Indicative deployment timeline" value={recommendation.timeline} icon="chart" />
            </div>
            {recommendation.isAfrica || recommendation.constrained ? (
              <div className="mt-5 border border-flame-200 bg-flame-50 p-4 text-sm leading-6 text-flame-900">
                This hub needs deployment planning for power, connectivity, local ownership and maintenance before device matching.
              </div>
            ) : null}
            <div className="mt-5 flex flex-wrap gap-3">
              <ButtonLink href="/devices#device-request" variant="dark">Request devices</ButtonLink>
              <ButtonLink href="/contact?type=PARTNERSHIP#contact-form" variant="secondary">Discuss partnership</ButtonLink>
            </div>
          </aside>
        </AnimatedSection>
      </div>
    </section>
  );
}

function UseCasesSection() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Hub use cases"
            title="Community access looks different in every space."
            description="A hub can support learning, administration, enterprise, training, inclusion, coworking or deployment depending on the people it serves."
          />
        </AnimatedSection>
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {useCases.map((useCase, index) => (
            <AnimatedSection key={useCase.title} delay={index * 0.025}>
              <article className="h-full border border-line bg-white p-5 shadow-sm">
                <Icon name={useCase.icon} className="h-5 w-5 text-flame-600" />
                <h3 className="mt-5 text-lg font-semibold text-ink">{useCase.title}</h3>
                <Spec label="Devices used" value={useCase.devices} />
                <Spec label="Example outcomes" value={useCase.outcomes} />
                <Spec label="Skills pathways" value={useCase.skills} />
                <Spec label="Support model" value={useCase.support} />
              </article>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

function CommunityOutcomesSection() {
  return (
    <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Community outcomes"
            title="Digital inclusion works when access is recurring, supported and local."
            description="Each outcome card shows a practical community result that can connect device access, skills, support and local ownership."
          />
        </AnimatedSection>
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {outcomeCards.map((outcome, index) => (
            <AnimatedSection key={outcome.title} delay={index * 0.035}>
              <article className="h-full border border-line bg-paper p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-flame-700">{outcome.metric}</p>
                <h3 className="mt-3 text-xl font-semibold text-ink">{outcome.title}</h3>
                <div className="mt-4 h-2 bg-white">
                  <div className="h-full bg-flame-500" style={{ width: `${outcome.progress}%` }} />
                </div>
                <p className="mt-4 text-sm leading-6 text-muted">{outcome.story}</p>
                <ButtonLink href="/success-stories" variant="secondary" className="mt-5">{outcome.cta}</ButtonLink>
              </article>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

function TrainingPathwaysSection() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Powered by SIT Learning"
            title="Technology access works best with learning pathways"
            description="Devices become more valuable when communities can learn confidently, safely and practically."
          />
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/programmes" variant="dark">Explore training pathways</ButtonLink>
            <ButtonLink href="/contact?type=TRAINING#contact-form" variant="secondary">Discuss training support</ButtonLink>
          </div>
        </AnimatedSection>
        <AnimatedSection delay={0.08}>
          <div className="grid gap-3 sm:grid-cols-2">
            {trainingPathways.map((pathway, index) => (
              <article key={pathway} className="border border-line bg-white p-5 shadow-sm">
                <Icon name={index === 1 ? "sparkles" : index === 2 ? "shield" : index === 3 ? "cpu" : index === 4 ? "school" : "graduation"} className="h-5 w-5 text-flame-600" />
                <h3 className="mt-4 text-base font-semibold text-ink">{pathway}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">A practical learning pathway that can be paired with hub devices, shared access and local support.</p>
              </article>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

function AfricaReadySection() {
  return (
    <section className="bg-ink px-4 py-20 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <div className="grid gap-10 lg:grid-cols-[0.86fr_1.14fr] lg:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-flame-200">Africa-ready deployment planning</p>
              <h2 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl">Design hubs around real power, connectivity and support conditions.</h2>
              <p className="mt-4 text-sm leading-6 text-white/70">
                Africa deployment planning connects low-power devices, offline-first learning, shared access and local maintenance ownership before hardware moves.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink href="/africa-deployment" variant="secondary">Plan deployment</ButtonLink>
                <ButtonLink href="/deployment-map" variant="ghost" className="text-white hover:bg-white/10">View deployment map</ButtonLink>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {africaPlanningTopics.map((topic) => (
                <article key={topic.title} className="border border-white/10 bg-white/[0.06] p-5">
                  <Icon name={topic.icon} className="h-5 w-5 text-flame-200" />
                  <h3 className="mt-4 text-base font-semibold text-white">{topic.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/62">{topic.description}</p>
                </article>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

function LifecycleOperationsSection() {
  return (
    <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Support and lifecycle operations"
            title="A hub is strongest when support, repair and sustainability are designed in."
            description="Community access connects into device replacement, trade-in, recycling, refurbishment, sustainability reporting and ongoing support."
          />
        </AnimatedSection>
        <div className="mt-10 grid gap-3 md:grid-cols-2 xl:grid-cols-7">
          {lifecycleOperations.map((item, index) => (
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

function PartnerSponsorSection() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Partners and sponsors"
            title="Support digital access in underserved communities"
            description="Sponsors and partners can support learners, hubs, device donations, CSR reporting and community deployment support."
          />
        </AnimatedSection>
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {sponsorCards.map((card, index) => (
            <AnimatedSection key={card.title} delay={index * 0.035}>
              <article className="h-full border border-line bg-white p-5 shadow-sm">
                <Icon name={card.icon} className="h-5 w-5 text-flame-600" />
                <h3 className="mt-5 text-xl font-semibold text-ink">{card.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted">{card.detail}</p>
                <ButtonLink href={card.href} variant="secondary" className="mt-5">Discuss partnership</ButtonLink>
              </article>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

function SuccessStoriesPreview() {
  return (
    <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Success stories"
            title="Stories from access, training and community deployment."
            description="These preview cards show the types of community stories a hub can create when devices, training and support work together."
          />
        </AnimatedSection>
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {storyPreviews.map((story, index) => (
            <AnimatedSection key={story.title} delay={index * 0.035}>
              <article className="flex h-full flex-col border border-line bg-paper p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-flame-700">{story.region}</p>
                <h3 className="mt-3 text-lg font-semibold text-ink">{story.title}</h3>
                <div className="mt-4 space-y-2 text-sm text-muted">
                  <p><strong className="text-ink">Devices:</strong> {story.devices}</p>
                  <p><strong className="text-ink">Impact:</strong> {story.learners}</p>
                </div>
                <blockquote className="mt-4 border-l-2 border-flame-500 pl-3 text-sm leading-6 text-muted">{story.quote}</blockquote>
                <ButtonLink href={story.href} variant="secondary" className="mt-auto self-start">Learn more</ButtonLink>
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
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-flame-200">Community digital access</p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight">
              Plan a community hub with devices, training and support in one conversation.
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-white/70">
              Share the community, device count, training need, power conditions and support model so SIT Digital Access can shape a practical route.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/devices#device-request">Request hub devices</ButtonLink>
            <ButtonLink href="/contact?type=PARTNERSHIP#contact-form" variant="secondary">Discuss partnership</ButtonLink>
            <ButtonLink href="/africa-deployment#africa-enquiry" variant="secondary">Plan deployment</ButtonLink>
            <ButtonLink href="/contact" variant="ghost" className="text-white hover:bg-white/10">Talk to SIT Digital Access</ButtonLink>
          </div>
        </div>
      </div>
    </section>
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
