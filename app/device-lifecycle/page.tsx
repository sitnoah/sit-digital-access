import type { Metadata } from "next";
import { AnimatedSection } from "@/components/animated-section";
import { ButtonLink } from "@/components/button-link";
import { Icon, type IconKey } from "@/components/icons";
import { SectionHeading } from "@/components/section-heading";
import { impactStats } from "@/lib/content";

export const metadata: Metadata = {
  title: "Circular Device Lifecycle Intelligence",
  description:
    "A premium circular device lifecycle intelligence platform for procurement, diagnostics, repair, deployment, support, recovery and recycling."
};

type MetricCard = {
  label: string;
  value: string;
  detail: string;
  icon: IconKey;
  progress: number;
};

type LifecycleStage = {
  title: string;
  icon: IconKey;
  summary: string;
  details: string[];
  modules: string[];
  impact: string;
  metric: string;
  next: string;
  href: string;
};

type FeatureCard = {
  title: string;
  description: string;
  icon: IconKey;
  metadata?: string;
  href?: string;
};

const stat = (label: string, fallback: string) => impactStats.find((item) => item.label === label)?.value ?? fallback;

const heroMetrics: MetricCard[] = [
  {
    label: "Devices tracked",
    value: stat("Devices deployed", "500+"),
    detail: "Across reuse, deployment and support routes",
    icon: "database",
    progress: 78
  },
  {
    label: "Lifecycle stages",
    value: "10",
    detail: "From procurement to retirement",
    icon: "network",
    progress: 90
  },
  {
    label: "Repair and reuse rate",
    value: "Repair-first",
    detail: "Repair, refurbish and reuse before recycling",
    icon: "wrench",
    progress: 84
  },
  {
    label: "Community deployments",
    value: "Hub routes",
    detail: "Schools, NGOs, hubs and Africa pathways",
    icon: "building",
    progress: 68
  },
  {
    label: "Sustainability impact",
    value: stat("CO2 saved through reuse", "25t"),
    detail: "Estimated CO2 avoided through reuse",
    icon: "leaf",
    progress: 72
  }
];

const intelligenceMetrics: MetricCard[] = [
  ...heroMetrics,
  {
    label: "Devices repaired",
    value: "Repair-first",
    detail: "Diagnostics, parts and warranty workflows",
    icon: "wrench",
    progress: 80
  },
  {
    label: "Devices recovered",
    value: "Recovery route",
    detail: "Trade-in, recycling and corporate refresh intake",
    icon: "recycle",
    progress: 74
  },
  {
    label: "Reuse rate",
    value: "Reuse-first",
    detail: "Useful life before final recovery",
    icon: "heart",
    progress: 86
  },
  {
    label: "Active support workflows",
    value: "Support layer",
    detail: "Aftercare, repairs, replacements and notes",
    icon: "headset",
    progress: 70
  }
];

const heroFlow = ["Corporate refresh", "Refurbish", "Deploy", "Support", "Recover", "Recycle"];
const visualFlow = ["Source", "Diagnose", "Repair", "Refurbish", "Deploy", "Support", "Recover", "Recycle"];

const lifecycleStages: LifecycleStage[] = [
  {
    title: "Procurement",
    icon: "package",
    summary: "Source donated, sponsored, purchased or recovered technology into a traceable asset route.",
    details: ["Supplier or donor origin", "Condition and quantity intake", "Warranty and reference capture", "Reuse route screening"],
    modules: ["Donations", "Trade-in", "CSR partnerships"],
    impact: "Prevents useful hardware entering disposal routes too early.",
    metric: "Source confidence",
    next: "Diagnostics",
    href: "/donate"
  },
  {
    title: "Diagnostics",
    icon: "search",
    summary: "Assess condition, data handling, hardware health, repairability and deployment suitability.",
    details: ["Condition assessment", "Data handling review", "Hardware checks", "Repairability scoring", "Africa deployment suitability"],
    modules: ["Repair queue", "Inventory", "Secure wipe"],
    impact: "Turns unknown assets into actionable repair, refurbish or recycle decisions.",
    metric: "Triage complete",
    next: "Repair",
    href: "/repairs"
  },
  {
    title: "Repair",
    icon: "wrench",
    summary: "Replace parts, recover software, upgrade performance and document outcomes before replacement.",
    details: ["Parts replacement", "SSD and RAM upgrades", "Warranty workflows", "Quality check", "Repair notes"],
    modules: ["Repair operations", "Parts", "Technicians"],
    impact: "Extends useful life and reduces unnecessary procurement.",
    metric: "Life extended",
    next: "Refurbishment",
    href: "/book-repair"
  },
  {
    title: "Refurbishment",
    icon: "settings",
    summary: "Clean, wipe, configure, grade and prepare devices for reliable second-life use.",
    details: ["Secure wipe", "OS setup", "Performance testing", "Transparent grading", "Deployment packaging"],
    modules: ["Inventory", "Marketplace", "Sustainability"],
    impact: "Creates deployment-ready devices from recovered or repaired technology.",
    metric: "Reuse ready",
    next: "Inventory",
    href: "/devices"
  },
  {
    title: "Inventory",
    icon: "database",
    summary: "Track asset tags, grades, warranty, location, bundle readiness and lifecycle state.",
    details: ["Asset tags", "Grade and specification", "Storage and location", "Readiness scoring", "Bundle planning"],
    modules: ["Inventory", "Device requests", "Marketplace"],
    impact: "Makes circular stock visible, allocatable and reportable.",
    metric: "Stock intelligence",
    next: "Marketplace / deployment",
    href: "/devices"
  },
  {
    title: "Marketplace / deployment",
    icon: "truck",
    summary: "Route devices into requests, bundles, sponsorship, public catalogue or Africa deployment pathways.",
    details: ["School labs", "Community hubs", "NGO field offices", "AI learning labs", "Low-power deployment"],
    modules: ["Devices", "Deployments", "Community hubs"],
    impact: "Connects refurbished technology with practical education and work outcomes.",
    metric: "Access enabled",
    next: "Support",
    href: "/deployment-map"
  },
  {
    title: "Support",
    icon: "headset",
    summary: "Record aftercare, maintenance, customer communication, repair history and replacement planning.",
    details: ["Support history", "Warranty intelligence", "Repair escalation", "Replacement guidance", "Customer communication"],
    modules: ["Support", "Repairs", "Inventory"],
    impact: "Protects useful life after deployment and reduces avoidable churn.",
    metric: "Uptime protected",
    next: "Recovery",
    href: "/repair-status"
  },
  {
    title: "Recovery",
    icon: "recycle",
    summary: "Bring devices back from deployments, donors, trade-ins or corporate refresh cycles for reassessment.",
    details: ["Collection route", "Return condition", "Secure intake", "Reuse screening", "Parts recovery"],
    modules: ["Trade-in", "Recycling", "Donations"],
    impact: "Keeps the loop open when devices finish a first deployment.",
    metric: "Loop reopened",
    next: "Recycling",
    href: "/trade-in"
  },
  {
    title: "Recycling",
    icon: "leaf",
    summary: "Recover parts and process e-waste responsibly when repair or reuse is no longer practical.",
    details: ["Parts harvesting", "Responsible processing", "ESG evidence", "Chain of custody", "Recovery notes"],
    modules: ["Recycling", "Sustainability reports", "CSR"],
    impact: "Closes the loop with environmental evidence and recovery transparency.",
    metric: "Responsible recovery",
    next: "Retirement",
    href: "/device-recycling"
  },
  {
    title: "Retirement",
    icon: "badge",
    summary: "Close lifecycle records with impact, evidence, final route and reporting data documented.",
    details: ["Final state", "Impact summary", "Audit evidence", "Donor or partner report", "Sustainability snapshot"],
    modules: ["Sustainability", "Impact", "Reports"],
    impact: "Turns device history into measurable ESG and social impact evidence.",
    metric: "Lifecycle closed",
    next: "New procurement insight",
    href: "/sustainability"
  }
];

const intelligenceCards: FeatureCard[] = [
  { title: "Inventory intelligence", description: "Asset records, grades, readiness and location make circular stock operationally visible.", icon: "database" },
  { title: "Repair tracking", description: "Diagnostics, parts, technician assignment and repair outcomes stay connected to the device record.", icon: "wrench" },
  { title: "Support history", description: "Aftercare, communication, warranty checks and escalations help protect device uptime.", icon: "headset" },
  { title: "Deployment readiness", description: "Power, connectivity, training and support assumptions influence where devices should go.", icon: "network" },
  { title: "Sustainability metrics", description: "Reuse, recovery, circularity and CO2 estimates become visible at lifecycle level.", icon: "leaf" },
  { title: "Asset recovery", description: "Trade-in, recycling and donations feed recovered assets back into useful routes.", icon: "recycle" },
  { title: "Device lineage", description: "Origins, repairs, deployments and retirement decisions can be shown as one continuous history.", icon: "chart" },
  { title: "Warranty intelligence", description: "Warranty, grade and support records clarify risk before deployment or resale.", icon: "shield" },
  { title: "Support lifecycle visibility", description: "Repair and support signals inform replacement, recovery and future procurement decisions.", icon: "search" }
];

const operatingStates = [
  { state: "Sourced", owner: "Intake", metric: "Origin captured", next: "Diagnostics" },
  { state: "Diagnosed", owner: "Repair desk", metric: "Route scored", next: "Repair pending" },
  { state: "Repair pending", owner: "Technician", metric: "Parts identified", next: "Repair completed" },
  { state: "Repair completed", owner: "QA", metric: "Quality checked", next: "Refurbishment" },
  { state: "Refurbishment in progress", owner: "Inventory", metric: "Grade assigned", next: "Ready for deployment" },
  { state: "Ready for deployment", owner: "Ops", metric: "Bundle ready", next: "Active deployment" },
  { state: "Active deployment", owner: "Partner", metric: "Access enabled", next: "Under support" },
  { state: "Under support", owner: "Support", metric: "Lifecycle protected", next: "Recovery initiated" },
  { state: "Recovery initiated", owner: "Circular ops", metric: "Loop reopened", next: "Recycle or reuse" },
  { state: "Recycled responsibly", owner: "Recovery", metric: "Evidence captured", next: "Lifecycle retired" },
  { state: "Lifecycle retired", owner: "Reporting", metric: "Impact closed", next: "Procurement insight" }
];

const deploymentIntegrations: FeatureCard[] = [
  { title: "School labs", description: "Lifecycle records support lab bundles, asset tagging and replacement planning.", icon: "school", href: "/schools" },
  { title: "Community hubs", description: "Shared-access deployments need support routes and recovery planning from day one.", icon: "building", href: "/community-hubs" },
  { title: "NGO field offices", description: "Staff devices can be tracked through setup, support, refresh and recovery.", icon: "business", href: "/businesses-ngos" },
  { title: "AI learning labs", description: "Higher-spec assets can be routed into digital skills and AI literacy programmes.", icon: "sparkles", href: "/programmes" },
  { title: "Workforce enablement", description: "Reliable devices, support and lifecycle visibility strengthen operational teams.", icon: "users", href: "/businesses-ngos" },
  { title: "Low-power Africa deployments", description: "Mini PCs and efficient laptops can be matched to power-aware deployment sites.", icon: "sun", href: "/deployment-map" },
  { title: "Shared-access models", description: "Lifecycle planning helps devices serve multiple learners or community users.", icon: "network", href: "/community-hubs" }
];

const esgMetrics: MetricCard[] = [
  { label: "CO2 avoided", value: stat("CO2 saved through reuse", "25t"), detail: "Estimated reuse impact", icon: "leaf", progress: 72 },
  { label: "Circularity score", value: "Reuse-first", detail: "Repair and redeploy before recycling", icon: "recycle", progress: 86 },
  { label: "Devices diverted", value: stat("Devices deployed", "500+"), detail: "Recovered into circular routes", icon: "package", progress: 78 },
  { label: "Repair extension value", value: "Life extended", detail: "Repair before replacement", icon: "wrench", progress: 80 },
  { label: "Reuse rate", value: "Assessment-led", detail: "Based on device condition and route", icon: "chart", progress: 70 },
  { label: "Parts recovery", value: "Recovery route", detail: "Useful components before e-waste", icon: "cpu", progress: 62 },
  { label: "Community access enabled", value: stat("Learners reached", "1,500+"), detail: "Access and training outcomes", icon: "heart", progress: 82 }
];

const repairWorkflow = [
  "Diagnostics",
  "Parts replacement",
  "Upgrade paths",
  "Warranty workflows",
  "Maintenance support",
  "Recovery logistics",
  "Redeployment preparation"
];

const trustCards: FeatureCard[] = [
  { title: "Transparent grading", description: "Condition grades clarify reuse, repair, refurbishment and retirement routes.", icon: "badge" },
  { title: "Lifecycle readiness", description: "Devices can be prepared for test, wipe, configure, deploy, support and recover stages.", icon: "database" },
  { title: "Support records", description: "Customer communication, maintenance and incident notes stay linked to device history.", icon: "headset" },
  { title: "Secure wipe verification", description: "Data handling evidence supports donor confidence and redeployment readiness.", icon: "shield" },
  { title: "Repair history", description: "Parts, diagnostics and QA notes explain the condition of refurbished technology.", icon: "wrench" },
  { title: "Deployment documentation", description: "Site, partner, bundle, training and support information can follow each device.", icon: "truck" },
  { title: "Asset tagging", description: "Serials, labels and references make devices trackable across their useful life.", icon: "badge" },
  { title: "Warranty workflows", description: "Warranty and replacement planning reduce uncertainty for second-life devices.", icon: "check" }
];

const africaRegions = [
  {
    country: "Liberia",
    readiness: 72,
    focus: "School lab refurbishment, vocational access and community support ownership.",
    topics: ["Low-power readiness", "School labs", "Local maintenance"]
  },
  {
    country: "Ghana",
    readiness: 78,
    focus: "Community hubs, NGO operations and sponsor-backed device pathways.",
    topics: ["Shared device models", "Community hubs", "Repair ecosystems"]
  },
  {
    country: "Sierra Leone",
    readiness: 66,
    focus: "Offline-first learning, rural deployment and support-aware handover.",
    topics: ["Offline-first learning", "Rural access", "Technician enablement"]
  },
  {
    country: "Nigeria",
    readiness: 74,
    focus: "Workforce enablement, innovation hubs and school deployment scaling.",
    topics: ["Workforce access", "Innovation hubs", "Sustainability planning"]
  },
  {
    country: "Wider Africa",
    readiness: 64,
    focus: "Reusable models for partners, sponsors, training cohorts and local ownership.",
    topics: ["Africa pathways", "Partner onboarding", "Lifecycle reporting"]
  }
];

const stories = [
  {
    title: "School lab refurbishment",
    devices: "24 recovered devices",
    stages: "Diagnostics, repair, refurbishment, deployment",
    impact: "Timetable-ready learner access",
    outcome: "A school lab can move from mixed old devices to a documented, supported deployment.",
    href: "/schools"
  },
  {
    title: "NGO device recovery",
    devices: "Field office refresh",
    stages: "Recovery, secure wipe, inventory, support",
    impact: "Lower procurement pressure",
    outcome: "Recovered devices can standardise operations for staff and volunteers.",
    href: "/businesses-ngos"
  },
  {
    title: "Corporate refresh redeployment",
    devices: "CSR device batch",
    stages: "Procurement, diagnostics, refurbish, ESG reporting",
    impact: "Circular technology evidence",
    outcome: "A corporate refresh can become a secure reuse and digital inclusion pathway.",
    href: "/csr-partnerships"
  },
  {
    title: "Community hub reuse",
    devices: "10-24 shared devices",
    stages: "Inventory, deployment, support, recovery",
    impact: "Community access route",
    outcome: "A hub can connect device access, training and support in one local model.",
    href: "/community-hubs"
  },
  {
    title: "AI literacy lab deployment",
    devices: "Higher-spec refurbished devices",
    stages: "Refurbishment, deployment, training, support",
    impact: "Digital skills pathway",
    outcome: "Reusable devices can support responsible AI literacy and coding cohorts.",
    href: "/programmes"
  }
];

export default function DeviceLifecyclePage() {
  return (
    <main>
      <LifecycleHero />
      <LifecycleMetrics />
      <LifecycleEngine />
      <OperationalIntelligence />
      <PhilosophySection />
      <OperationalStates />
      <DeploymentIntegration />
      <EsgIntelligence />
      <RepairRecoveryWorkflow />
      <TrustArchitecture />
      <AfricaIntelligence />
      <LifecycleStories />
      <FinalCta />
    </main>
  );
}

function LifecycleMetrics() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Live lifecycle intelligence"
            title="Operational signals for every stage of the circular device journey."
            description="These cards frame the lifecycle as an operating system: tracked devices, repaired devices, deployments, recovery routes, circularity, CO2, reuse and support visibility."
          />
        </AnimatedSection>
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {intelligenceMetrics.map((metric, index) => (
            <AnimatedSection key={metric.label} delay={index * 0.03}>
              <MetricTile metric={metric} />
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

function LifecycleHero() {
  return (
    <section className="overflow-hidden bg-ink px-4 py-20 text-white sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <AnimatedSection>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-flame-300">
            Circular device lifecycle intelligence
          </p>
          <h1 className="mt-5 max-w-5xl text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
            One circular operating model for every device
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-white/72 sm:text-lg">
            SIT Digital Access transforms procurement, repair, refurbishment, deployment, support
            and recycling into one measurable and trackable lifecycle intelligence system.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="#lifecycle-engine">Explore lifecycle</ButtonLink>
            <ButtonLink href="/book-repair" variant="secondary">Book repair</ButtonLink>
          </div>
          <div className="mt-8 flex flex-wrap gap-2">
            {["Reuse-first model", "ESG-ready reporting", "Lifecycle traceability", "Secure wipe workflows", "Africa deployment ready"].map((badge) => (
              <span key={badge} className="rounded-full border border-white/15 bg-white/[0.08] px-3 py-1 text-xs font-semibold text-white/82">
                {badge}
              </span>
            ))}
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <div className="rounded-lg border border-white/10 bg-white/[0.07] p-5 shadow-soft">
            <div className="grid gap-3 sm:grid-cols-2">
              {heroMetrics.map((metric) => (
                <DarkMetric key={metric.label} metric={metric} />
              ))}
            </div>
            <div className="mt-5 rounded-lg bg-white p-4 text-ink">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-flame-600">Lifecycle operating flow</p>
              <div className="mt-4 grid gap-2">
                {heroFlow.map((stage, index) => (
                  <div key={stage} className="grid grid-cols-[32px_1fr] items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-flame-500 text-xs font-semibold text-white">
                      {index + 1}
                    </span>
                    <div>
                      <p className="text-sm font-semibold">{stage}</p>
                      {index < heroFlow.length - 1 ? <div className="mt-2 h-px bg-line" /> : null}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

function LifecycleEngine() {
  return (
    <section id="lifecycle-engine" className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Interactive lifecycle engine"
            title="A visual operating system for circular technology."
            description="Each lifecycle stage can expand to show operational details, connected modules, sustainability impact, related workflows, metrics and next-stage routing."
          />
        </AnimatedSection>
        <AnimatedSection delay={0.08}>
          <div className="mt-10 rounded-lg border border-line bg-white p-4 shadow-card">
            <div className="flex flex-wrap gap-2">
              {visualFlow.map((stage, index) => (
                <span key={stage} className="inline-flex items-center gap-2 rounded-full border border-line bg-paper px-3 py-2 text-xs font-semibold text-ink">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-flame-500 text-[10px] text-white">
                    {index + 1}
                  </span>
                  {stage}
                </span>
              ))}
            </div>
          </div>
        </AnimatedSection>
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {lifecycleStages.map((stage, index) => (
            <AnimatedSection key={stage.title} delay={index * 0.025}>
              <details className="group h-full rounded-lg border border-line bg-white p-5 shadow-card transition hover:-translate-y-1 hover:border-flame-200 hover:shadow-soft">
                <summary className="cursor-pointer list-none">
                  <div className="flex items-start justify-between gap-4">
                    <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-flame-50 text-flame-700 ring-1 ring-flame-100">
                      <Icon name={stage.icon} className="h-5 w-5" />
                    </span>
                    <span className="text-xs font-semibold text-muted">{String(index + 1).padStart(2, "0")}</span>
                  </div>
                  <h2 className="mt-5 text-lg font-semibold text-ink">{stage.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-muted">{stage.summary}</p>
                  <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-flame-600">
                    Click for lifecycle intelligence
                  </p>
                </summary>
                <div className="mt-5 border-t border-line pt-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-flame-600">{stage.metric}</p>
                  <div className="mt-3 grid gap-2">
                    {stage.details.map((detail) => (
                      <p key={detail} className="flex gap-2 text-sm leading-6 text-muted">
                        <Icon name="check" className="mt-1 h-4 w-4 shrink-0 text-flame-600" />
                        {detail}
                      </p>
                    ))}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {stage.modules.map((module) => (
                      <span key={module} className="rounded-full bg-paper px-3 py-1 text-xs font-semibold text-muted">
                        {module}
                      </span>
                    ))}
                  </div>
                  <p className="mt-4 text-sm leading-6 text-muted">{stage.impact}</p>
                  <a href={stage.href} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-flame-700">
                    Route to {stage.next}
                    <Icon name="arrow" className="h-4 w-4" />
                  </a>
                </div>
              </details>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

function OperationalIntelligence() {
  return (
    <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Operational intelligence layer"
            title="Lifecycle data turns circular technology into infrastructure."
            description="Inventory, repair tickets, support records, deployment readiness, sustainability metrics and recovery decisions become one operating model."
          />
        </AnimatedSection>
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {intelligenceCards.map((feature, index) => (
            <AnimatedSection key={feature.title} delay={index * 0.03}>
              <FeatureTile feature={feature} />
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

function PhilosophySection() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Circular technology philosophy"
            title="A different operating model from traditional IT disposal."
            description="The lifecycle model makes repair, reuse, traceability and impact visible before retirement decisions are made."
          />
        </AnimatedSection>
        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          <AnimatedSection delay={0.05}>
            <ComparisonCard
              title="Traditional IT disposal"
              tone="muted"
              points={["Short lifecycle", "Limited visibility", "High waste", "Minimal impact tracking", "Little deployment context"]}
            />
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <ComparisonCard
              title="SIT Digital Access lifecycle model"
              tone="active"
              points={["Repair-first", "Reuse-first", "Full lifecycle visibility", "Sustainability intelligence", "Community deployment pathways", "ESG reporting readiness"]}
            />
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}

function OperationalStates() {
  return (
    <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Device operational states"
            title="Track the state, owner and next action of every device."
            description="Operational states make lifecycle progression visible, from sourcing to support, recovery and retirement."
          />
        </AnimatedSection>
        <div className="mt-10 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {operatingStates.map((item, index) => (
            <AnimatedSection key={item.state} delay={index * 0.025}>
              <article className="rounded-lg border border-line bg-paper p-4 transition hover:-translate-y-1 hover:bg-white hover:shadow-card">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-flame-600">{item.owner}</p>
                    <h3 className="mt-2 text-lg font-semibold text-ink">{item.state}</h3>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-muted">{String(index + 1).padStart(2, "0")}</span>
                </div>
                <p className="mt-4 text-sm font-semibold text-ink">{item.metric}</p>
                <p className="mt-2 text-sm leading-6 text-muted">Next transition: {item.next}</p>
              </article>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

function DeploymentIntegration() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Marketplace and deployment integration"
            title="Deployment-ready lifecycle intelligence."
            description="Lifecycle data makes it easier to route devices into school labs, community hubs, NGO field offices, AI learning labs, workforce enablement and low-power Africa deployments."
          />
        </AnimatedSection>
        <CardGrid features={deploymentIntegrations} />
      </div>
    </section>
  );
}

function EsgIntelligence() {
  return (
    <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Sustainability and ESG intelligence"
            title="Lifecycle visibility enables measurable sustainability reporting."
            description="Circularity, reuse, repair, parts recovery, CO2 avoided and community access can be framed as operational evidence instead of vague sustainability claims."
          />
        </AnimatedSection>
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {esgMetrics.map((metric, index) => (
            <AnimatedSection key={metric.label} delay={index * 0.03}>
              <MetricTile metric={metric} />
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

function RepairRecoveryWorkflow() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Repair and recovery workflows"
            title="Repair-first operations connect diagnostics, parts and redeployment."
            description="Repair is a lifecycle engine: it extends useful life, produces quality evidence and decides whether devices return to deployment, inventory, recovery or recycling."
          />
        </AnimatedSection>
        <AnimatedSection delay={0.08}>
          <div className="mt-10 rounded-lg border border-line bg-white p-5 shadow-card">
            <div className="grid gap-3 md:grid-cols-7">
              {repairWorkflow.map((step, index) => (
                <div key={step} className="rounded-lg bg-paper p-4">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-flame-500 text-xs font-semibold text-white">
                    {index + 1}
                  </span>
                  <p className="mt-4 text-sm font-semibold text-ink">{step}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/book-repair">Book repair</ButtonLink>
              <ButtonLink href="/repair-status" variant="secondary">Track repair</ButtonLink>
              <ButtonLink href="/repair-pricing" variant="secondary">View repair pricing</ButtonLink>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

function TrustArchitecture() {
  return (
    <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Lifecycle trust architecture"
            title="Trust records make circular devices credible."
            description="Refurbished technology needs transparent grading, support records, wipe verification, repair history, asset tagging and warranty workflows."
          />
        </AnimatedSection>
        <CardGrid features={trustCards} />
      </div>
    </section>
  );
}

function AfricaIntelligence() {
  return (
    <section className="bg-ink px-4 py-20 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase text-flame-300">Africa deployment intelligence</p>
            <h2 className="text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-5xl">
              Lifecycle planning makes Africa deployments more realistic.
            </h2>
            <p className="mt-4 text-base leading-7 text-white/70 sm:text-lg">
              Low-power readiness, offline-first learning, shared device models, community maintenance, repair ecosystems and technician enablement all depend on lifecycle visibility.
            </p>
          </div>
        </AnimatedSection>
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
          {africaRegions.map((region, index) => (
            <AnimatedSection key={region.country} delay={index * 0.04}>
              <article className="h-full rounded-lg border border-white/10 bg-white/[0.07] p-5">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-xl font-semibold">{region.country}</h3>
                  <span className="text-2xl font-semibold text-flame-300">{region.readiness}%</span>
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-flame-500" style={{ width: `${region.readiness}%` }} />
                </div>
                <p className="mt-4 text-sm leading-6 text-white/72">{region.focus}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {region.topics.map((topic) => (
                    <span key={topic} className="rounded-full border border-white/10 bg-white/[0.08] px-3 py-1 text-xs font-semibold text-white/72">
                      {topic}
                    </span>
                  ))}
                </div>
              </article>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

function LifecycleStories() {
  return (
    <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Real-world lifecycle stories"
            title="Lifecycle intelligence becomes visible in schools, hubs and recovery routes."
            description="These examples show how recovered, repaired and refurbished devices move through operational stages into measurable community outcomes."
          />
        </AnimatedSection>
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
          {stories.map((story, index) => (
            <AnimatedSection key={story.title} delay={index * 0.04}>
              <article className="flex h-full flex-col rounded-lg border border-line bg-paper p-5 shadow-card transition hover:-translate-y-1 hover:shadow-soft">
                <span className="self-start rounded-full bg-ink px-3 py-1 text-xs font-semibold text-white">{story.devices}</span>
                <h3 className="mt-4 text-lg font-semibold text-ink">{story.title}</h3>
                <p className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-flame-600">{story.stages}</p>
                <p className="mt-3 text-sm font-semibold text-ink">{story.impact}</p>
                <p className="mt-3 text-sm leading-6 text-muted">{story.outcome}</p>
                <ButtonLink href={story.href} variant="ghost" className="mt-auto self-start px-0">
                  View pathway
                </ButtonLink>
              </article>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-lg bg-ink p-8 text-white shadow-soft md:p-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-flame-200">Next step</p>
            <h2 className="mt-3 max-w-4xl text-3xl font-semibold sm:text-4xl">
              Build digital access on measurable, reusable and repairable technology systems.
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-7 text-white/70">
              Start with a repair, recover retired assets, explore deployment routes or discuss partnership pathways for circular technology infrastructure.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <ButtonLink href="/book-repair">Book repair</ButtonLink>
            <ButtonLink href="/device-recycling" variant="secondary">Start recycling route</ButtonLink>
            <ButtonLink href="/deployment-map" variant="secondary">Explore deployments</ButtonLink>
            <ButtonLink href="/csr-partnerships" variant="secondary">Discuss partnership</ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}

function CardGrid({ features }: { features: FeatureCard[] }) {
  return (
    <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {features.map((feature, index) => (
        <AnimatedSection key={feature.title} delay={index * 0.03}>
          <FeatureTile feature={feature} />
        </AnimatedSection>
      ))}
    </div>
  );
}

function FeatureTile({ feature }: { feature: FeatureCard }) {
  const content = (
    <>
      <div className="flex items-start justify-between gap-4">
        <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-flame-500 text-white">
          <Icon name={feature.icon} className="h-5 w-5" />
        </span>
        {feature.metadata ? (
          <span className="rounded-full bg-flame-50 px-3 py-1 text-xs font-semibold text-flame-700">{feature.metadata}</span>
        ) : null}
      </div>
      <h3 className="mt-5 text-lg font-semibold text-ink">{feature.title}</h3>
      <p className="mt-3 text-sm leading-6 text-muted">{feature.description}</p>
      {feature.href ? (
        <p className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-flame-700">
          Explore route
          <Icon name="arrow" className="h-4 w-4" />
        </p>
      ) : null}
    </>
  );

  if (feature.href) {
    return (
      <a href={feature.href} className="block h-full rounded-lg border border-line bg-white p-5 shadow-card transition hover:-translate-y-1 hover:border-flame-200 hover:shadow-soft">
        {content}
      </a>
    );
  }

  return (
    <article className="h-full rounded-lg border border-line bg-white p-5 shadow-card transition hover:-translate-y-1 hover:shadow-soft">
      {content}
    </article>
  );
}

function MetricTile({ metric }: { metric: MetricCard }) {
  return (
    <article className="h-full rounded-lg border border-line bg-white p-5 shadow-card transition hover:-translate-y-1 hover:shadow-soft">
      <div className="flex items-start justify-between gap-4">
        <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-ink text-white">
          <Icon name={metric.icon} className="h-5 w-5" />
        </span>
        <div
          className="relative h-14 w-14 rounded-full"
          style={{ background: `conic-gradient(#f97316 ${metric.progress * 3.6}deg, #e8e2d8 0deg)` }}
        >
          <div className="absolute inset-2 rounded-full bg-white" />
          <span className="absolute inset-0 flex items-center justify-center text-[11px] font-semibold text-ink">
            {metric.progress}%
          </span>
        </div>
      </div>
      <p className="mt-5 text-3xl font-semibold text-ink">{metric.value}</p>
      <h3 className="mt-2 text-sm font-semibold uppercase tracking-[0.14em] text-flame-600">{metric.label}</h3>
      <p className="mt-3 text-sm leading-6 text-muted">{metric.detail}</p>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-paper">
        <div className="h-full rounded-full bg-flame-500" style={{ width: `${metric.progress}%` }} />
      </div>
    </article>
  );
}

function DarkMetric({ metric }: { metric: MetricCard }) {
  return (
    <div className="rounded-lg border border-white/10 bg-black/24 p-4">
      <div className="flex items-center justify-between gap-3">
        <Icon name={metric.icon} className="h-5 w-5 text-flame-300" />
        <span className="text-2xl font-semibold">{metric.value}</span>
      </div>
      <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-white/62">{metric.label}</p>
      <p className="mt-2 text-xs leading-5 text-white/68">{metric.detail}</p>
    </div>
  );
}

function ComparisonCard({
  title,
  points,
  tone
}: {
  title: string;
  points: string[];
  tone: "muted" | "active";
}) {
  return (
    <article className={tone === "active" ? "h-full rounded-lg border border-flame-200 bg-flame-50 p-6 shadow-card" : "h-full rounded-lg border border-line bg-white p-6 shadow-card"}>
      <h3 className="text-2xl font-semibold text-ink">{title}</h3>
      <div className="mt-6 grid gap-3">
        {points.map((point) => (
          <p key={point} className="flex items-center gap-2 text-sm font-semibold text-muted">
            <Icon name={tone === "active" ? "check" : "close"} className={tone === "active" ? "h-4 w-4 text-flame-600" : "h-4 w-4 text-muted"} />
            {point}
          </p>
        ))}
      </div>
    </article>
  );
}
