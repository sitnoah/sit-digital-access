import type { Metadata } from "next";
import { AnimatedSection } from "@/components/animated-section";
import { ButtonLink } from "@/components/button-link";
import { Icon, type IconKey } from "@/components/icons";
import { SectionHeading } from "@/components/section-heading";
import { impactStats } from "@/lib/content";

export const metadata: Metadata = {
  title: "Circular Recovery, Secure Recycling & Reuse",
  description:
    "Secure corporate device recycling, reuse-first refurbishment, ESG reporting and responsible circular recovery from SIT Digital Access."
};

type MetricCard = {
  label: string;
  value: string;
  detail: string;
  icon: IconKey;
  progress: number;
};

type RouteCard = {
  title: string;
  bestFor: string;
  volume: string;
  reuse: string;
  esg: string;
  icon: IconKey;
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
    label: "Devices diverted",
    value: stat("Devices deployed", "500+"),
    detail: "Recovered for reuse, deployment or responsible processing",
    icon: "package",
    progress: 78
  },
  {
    label: "CO2 avoided",
    value: stat("CO2 saved through reuse", "25t"),
    detail: "Estimated circular impact through useful reuse",
    icon: "leaf",
    progress: 72
  },
  {
    label: "Community deployments",
    value: "Hub routes",
    detail: "Schools, hubs, NGOs and Africa deployment pathways",
    icon: "building",
    progress: 66
  },
  {
    label: "Repair and reuse rate",
    value: "Reuse-first",
    detail: "Repair and refurbish before responsible recycling",
    icon: "recycle",
    progress: 86
  }
];

const kpis: MetricCard[] = [
  ...heroMetrics,
  {
    label: "Devices reused",
    value: stat("Devices deployed", "500+"),
    detail: "Prepared for second-life access",
    icon: "laptop",
    progress: 80
  },
  {
    label: "Recycled responsibly",
    value: "Recovery route",
    detail: "Final route when reuse is no longer practical",
    icon: "shield",
    progress: 62
  },
  {
    label: "Schools supported",
    value: stat("Schools supported", "10+"),
    detail: "Labs and learner access",
    icon: "school",
    progress: 68
  },
  {
    label: "Learners reached",
    value: stat("Learners reached", "1,500+"),
    detail: "Access and training outcomes",
    icon: "graduation",
    progress: 82
  }
];

const heroFlow = ["Corporate refresh", "Refurbish", "Deploy", "Learn", "Reuse", "Recycle"];
const lifecycleFlow = ["Collect", "Secure wipe", "Diagnose", "Repair", "Refurbish", "Redeploy", "Support", "Recover", "Recycle"];

const recyclingRoutes: RouteCard[] = [
  {
    title: "Corporate device recycling",
    bestFor: "Enterprise refreshes, CSR teams and ESG leaders",
    volume: "20-1,000+ devices",
    reuse: "High for business laptops, mini PCs and accessories",
    esg: "Secure recovery, reuse reporting and donor-ready impact",
    icon: "building",
    href: "/contact?type=CORPORATE_RECYCLING#contact-form"
  },
  {
    title: "School and university refresh",
    bestFor: "ICT labs, staff devices and older learning equipment",
    volume: "10-300 devices",
    reuse: "Repairable devices can support learners or community hubs",
    esg: "Education impact, waste diversion and refresh evidence",
    icon: "school",
    href: "/schools"
  },
  {
    title: "NGO equipment recovery",
    bestFor: "Charities, field teams and programme offices",
    volume: "5-150 devices",
    reuse: "Strong for staff laptops and portable office kits",
    esg: "Mission operations, reuse value and lifecycle transparency",
    icon: "heart",
    href: "/businesses-ngos"
  },
  {
    title: "SME technology refresh",
    bestFor: "Small business replacements and hybrid teams",
    volume: "5-100 devices",
    reuse: "Good for repaired staff devices and trade-in routes",
    esg: "Lower waste, procurement savings and secure wipe route",
    icon: "business",
    href: "/trade-in"
  },
  {
    title: "Community device donations",
    bestFor: "Churches, libraries, hubs and local charities",
    volume: "1-50 devices",
    reuse: "Working devices can become shared access assets",
    esg: "Community benefit, learner access and reuse storytelling",
    icon: "users",
    href: "/donate#donation-form"
  },
  {
    title: "Bulk e-waste recovery",
    bestFor: "Mixed estates with accessories and end-of-life items",
    volume: "Assessment-led",
    reuse: "Parts recovery and responsible recycling route",
    esg: "Clear separation of reusable and end-of-life assets",
    icon: "factory",
    href: "/contact?type=PARTNERSHIP#contact-form"
  },
  {
    title: "Africa redeployment pathway",
    bestFor: "Low-power laptops, mini PCs and lab equipment",
    volume: "10-500 devices",
    reuse: "High when devices can support school labs and hubs",
    esg: "Digital inclusion, deployment readiness and regional impact",
    icon: "globe",
    href: "/deployment-map"
  },
  {
    title: "Repair and parts recovery",
    bestFor: "Broken, partial or repairable devices",
    volume: "Any quantity",
    reuse: "Repair first, then parts recovery or recycling",
    esg: "Extends useful life before final processing",
    icon: "wrench",
    href: "/repairs"
  }
];

const reuseJourney = [
  {
    title: "Donation and CSR intake",
    description: "Capture donor, organisation, device count, release notes and desired sustainability reporting needs.",
    value: "Creates a traceable starting point for ESG and reuse decisions.",
    impact: "Intake ready",
    icon: "truck" as IconKey
  },
  {
    title: "Secure data handling",
    description: "Route data-bearing devices through wipe guidance, custody records and corporate release controls.",
    value: "Protects donors, recipients and deployment partners.",
    impact: "Wipe first",
    icon: "shield" as IconKey
  },
  {
    title: "Diagnostics and triage",
    description: "Assess condition, power, storage, memory, accessories and repair viability before recycling.",
    value: "Separates reusable, repairable, parts and end-of-life assets.",
    impact: "Route decision",
    icon: "settings" as IconKey
  },
  {
    title: "Repair and upgrades",
    description: "Use repair workflows, SSD/RAM upgrades, batteries, chargers and parts recovery where practical.",
    value: "Extends useful life and reduces replacement pressure.",
    impact: "Repair-first",
    icon: "wrench" as IconKey
  },
  {
    title: "Refurbishment and grading",
    description: "Clean, test, grade, configure, asset tag and prepare devices for real deployment conditions.",
    value: "Turns retired hardware into useful education and work equipment.",
    impact: "Reuse ready",
    icon: "badge" as IconKey
  },
  {
    title: "Deployment planning",
    description: "Match devices to schools, hubs, NGOs, SME teams and Africa deployment pathways.",
    value: "Connects sustainability with practical digital inclusion.",
    impact: "Site matched",
    icon: "network" as IconKey
  },
  {
    title: "Community and school reuse",
    description: "Redeploy devices into school labs, learner access, community hubs and workforce enablement.",
    value: "Recovered technology becomes learning, work and participation.",
    impact: "Access enabled",
    icon: "school" as IconKey
  },
  {
    title: "Ongoing support and maintenance",
    description: "Support, repair, replacement planning and lifecycle tracking keep devices useful for longer.",
    value: "Protects the impact after the first handover.",
    impact: "Lifecycle support",
    icon: "headset" as IconKey
  },
  {
    title: "Responsible recycling and recovery",
    description: "When reuse is no longer practical, devices move to parts harvesting and responsible recycling.",
    value: "Closes the loop with evidence-ready recovery.",
    impact: "Closed loop",
    icon: "recycle" as IconKey
  }
];

const securityCards: FeatureCard[] = [
  { title: "Secure wipe workflows", description: "Data-bearing devices are routed through wipe guidance before reuse, resale, redeployment or final recovery.", icon: "shield" },
  { title: "Chain of custody", description: "Collection, intake, assessment and processing stages can be documented for corporate assurance.", icon: "database" },
  { title: "Asset tracking", description: "Serials, quantities, grades and destinations can support donor and partner reporting.", icon: "badge" },
  { title: "Corporate release controls", description: "Refresh-cycle donors need clear release notes, consent, contacts and status updates.", icon: "building" },
  { title: "Device records", description: "Records can connect recycling, repair, inventory, deployment and sustainability reporting.", icon: "package" },
  { title: "Secure logistics", description: "Collection planning can separate devices, chargers, accessories and sensitive assets.", icon: "truck" },
  { title: "Lifecycle documentation", description: "Operational evidence supports later audit, reporting and public impact storytelling.", icon: "chart" },
  { title: "Disposal verification", description: "End-of-life items can be separated from reuse candidates and routed for responsible processing.", icon: "check" }
];

const decisionCards = [
  {
    title: "Repair",
    icon: "wrench" as IconKey,
    points: ["Extend useful life", "Reduce procurement cost", "Faster redeployment"]
  },
  {
    title: "Refurbish",
    icon: "settings" as IconKey,
    points: ["Upgrade and prepare", "Community and education reuse", "Device lifecycle extension"]
  },
  {
    title: "Recycle",
    icon: "recycle" as IconKey,
    points: ["Responsible end-of-life processing", "Parts harvesting", "Material recovery"]
  }
];

const esgMetrics: MetricCard[] = [
  { label: "CO2 avoided", value: stat("CO2 saved through reuse", "25t"), detail: "Estimated reuse impact", icon: "leaf", progress: 72 },
  { label: "Devices diverted", value: stat("Devices deployed", "500+"), detail: "Recovered for circular outcomes", icon: "package", progress: 78 },
  { label: "Circularity score", value: "Reuse-first", detail: "Repair and redeploy before recycling", icon: "recycle", progress: 86 },
  { label: "Reuse ratio", value: "Assessment-led", detail: "Depends on device condition and route", icon: "chart", progress: 70 },
  { label: "Community impact", value: "Hub routes", detail: "Schools, hubs and NGO pathways", icon: "heart", progress: 66 },
  { label: "Procurement savings", value: stat("Cost savings generated", "80%"), detail: "Compared with new equipment", icon: "cost", progress: 80 }
];

const socialUseCases: FeatureCard[] = [
  { title: "School labs", description: "Recovered devices can become timetable-ready classroom and ICT lab access.", icon: "school", href: "/schools" },
  { title: "Community hubs", description: "Shared-access spaces can reuse repaired laptops, desktops and mini PCs.", icon: "building", href: "/community-hubs" },
  { title: "NGO workforce enablement", description: "Refurbished business devices can support staff, volunteers and field teams.", icon: "business", href: "/businesses-ngos" },
  { title: "AI literacy programmes", description: "Higher-spec recovered equipment can support AI and digital skills cohorts.", icon: "sparkles", href: "/programmes" },
  { title: "Teacher enablement", description: "Working laptops and accessories can support teachers and school administration.", icon: "graduation", href: "/programmes" },
  { title: "Rural digital inclusion", description: "Low-power devices can support Africa-ready shared access models.", icon: "globe", href: "/deployment-map" }
];

const trustCards: FeatureCard[] = [
  { title: "Transparent grading", description: "Condition grades clarify whether devices are ready for reuse, repair, parts or recycling.", icon: "badge" },
  { title: "Lifecycle readiness", description: "Recovered devices can move through test, wipe, configure, deploy, support and recover states.", icon: "database" },
  { title: "Warranty workflows", description: "Reusable devices can be prepared with support, documentation and replacement planning.", icon: "shield" },
  { title: "Repair history", description: "Repair and parts records improve confidence before redeployment.", icon: "wrench" },
  { title: "Sustainability indicators", description: "Reuse confidence, CO2 estimates and low-power suitability make impact visible.", icon: "leaf" },
  { title: "Deployment readiness", description: "Devices are matched to power, connectivity, support and training realities.", icon: "network" },
  { title: "Support planning", description: "Remote support, handover and replacement plans protect long-term value.", icon: "headset" }
];

const standards: FeatureCard[] = [
  { title: "Diagnostics-first approach", description: "Devices are assessed before route decisions are made.", icon: "settings" },
  { title: "Repair-first strategy", description: "Repair and upgrade options are considered before recycling.", icon: "wrench" },
  { title: "Parts recovery", description: "Non-deployable devices can still support repair and maintenance.", icon: "cpu" },
  { title: "Low-power deployment suitability", description: "Mini PCs and efficient laptops can be prioritised for constrained sites.", icon: "sun" },
  { title: "Device testing", description: "Hardware, power, storage, connectivity and stability checks inform reuse decisions.", icon: "badge" },
  { title: "Asset tagging", description: "Serials, grades and ownership notes can support reporting and inventory handover.", icon: "database" },
  { title: "Refurbishment standards", description: "Clean, wipe, configure, grade and package devices for practical deployment.", icon: "package" }
];

const collectionSteps = [
  "Submit enquiry",
  "Device assessment",
  "Collection planning",
  "Secure intake",
  "Diagnostics and wipe",
  "Reuse/recycle decision",
  "Reporting and impact summary"
];

const collectionGuidance = [
  { title: "Pickup guidance", detail: "Share location, floor access, contact person, device count and packaging needs." },
  { title: "Volume guidance", detail: "Small batches can be triaged quickly; larger refreshes benefit from a pre-collection inventory." },
  { title: "Timeline expectations", detail: "Turnaround depends on quantity, data-bearing assets, diagnostics and reporting requirements." },
  { title: "Collection routes", detail: "Mail-in, handover, local collection and corporate batch routes can be discussed." }
];

const storyCards = [
  {
    title: "School lab deployment",
    region: "Education",
    devices: "24-seat lab model",
    co2: "Reuse impact tracked",
    learners: "Classroom-ready access",
    quote: "A refresh batch can become practical lab capacity instead of disposal.",
    href: "/schools"
  },
  {
    title: "Corporate recycling partnership",
    region: "CSR and ESG",
    devices: "Refresh-cycle assets",
    co2: "CO2 avoided estimate",
    learners: "Schools and hubs",
    quote: "Retired business hardware can become a secure reuse pipeline with reporting evidence.",
    href: "/csr-partnerships"
  },
  {
    title: "NGO refresh programme",
    region: "Mission operations",
    devices: "Business laptop bundles",
    co2: "Reuse-first procurement",
    learners: "Staff and volunteers",
    quote: "Recovered technology can strengthen field operations and reduce technology waste.",
    href: "/businesses-ngos"
  },
  {
    title: "Community digital hub",
    region: "Community access",
    devices: "10-24 reused devices",
    co2: "Devices diverted",
    learners: "Shared access model",
    quote: "Refurbished devices can turn a local room into a practical access point.",
    href: "/community-hubs"
  },
  {
    title: "Workforce enablement initiative",
    region: "Training and work",
    devices: "Learning-ready devices",
    co2: "Circular skills route",
    learners: "Digital skills cohorts",
    quote: "Recovery works best when devices are paired with training and support.",
    href: "/programmes"
  }
];

export default function DeviceRecyclingPage() {
  return (
    <main>
      <RecoveryHero />
      <KpiDashboard />
      <RecyclingRoutes />
      <ReuseJourney />
      <SecureDataLayer />
      <ReuseBeforeRecycle />
      <EsgReporting />
      <AfricaSocialImpact />
      <TrustTransparency />
      <ProcessingStandards />
      <CollectionWorkflow />
      <ImpactStories />
      <FinalCta />
    </main>
  );
}

function RecoveryHero() {
  return (
    <section className="overflow-hidden bg-ink px-4 py-20 text-white sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <AnimatedSection>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-flame-300">
            Circular recovery and secure recycling
          </p>
          <h1 className="mt-5 max-w-5xl text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
            A reuse-first route for retired technology
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-white/72 sm:text-lg">
            Securely recover, repair, refurbish and redeploy laptops, desktops, mini PCs and
            accessories before responsible recycling, while supporting digital access and measurable
            sustainability impact.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/donate#donation-form">Schedule collection enquiry</ButtonLink>
            <ButtonLink href="#reuse-journey" variant="secondary">See reuse journey</ButtonLink>
          </div>
          <div className="mt-8 flex flex-wrap gap-2">
            {["Secure wipe workflows", "Reuse-first lifecycle", "ESG-ready reporting", "UK logistics support", "Africa deployment pathways"].map((badge) => (
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
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-flame-600">Reuse-first recovery flow</p>
              <div className="mt-4 grid gap-2">
                {heroFlow.map((step, index) => (
                  <div key={step} className="grid grid-cols-[32px_1fr] items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-flame-500 text-xs font-semibold text-white">
                      {index + 1}
                    </span>
                    <div>
                      <p className="text-sm font-semibold">{step}</p>
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

function KpiDashboard() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Circular recovery dashboard"
            title="Recovery, reuse and recycling signals in one public view."
            description="The page frames secure recovery as an operational sustainability workflow: devices recovered, reused, responsibly recycled, repaired, deployed and reported."
          />
        </AnimatedSection>
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {kpis.map((metric, index) => (
            <AnimatedSection key={metric.label} delay={index * 0.03}>
              <MetricTile metric={metric} />
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

function RecyclingRoutes() {
  return (
    <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Recycling routes"
            title="Choose the recovery route that matches the organisation and device estate."
            description="Corporate recycling, school refreshes, NGO recovery, SME trade-in and Africa redeployment can all start from the same reuse-first intake model."
          />
        </AnimatedSection>
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {recyclingRoutes.map((route, index) => (
            <AnimatedSection key={route.title} delay={index * 0.035}>
              <a href={route.href} className="block h-full rounded-lg border border-line bg-paper p-5 shadow-card transition hover:-translate-y-1 hover:border-flame-200 hover:bg-white hover:shadow-soft">
                <div className="flex items-start justify-between gap-4">
                  <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-flame-500 text-white">
                    <Icon name={route.icon} className="h-5 w-5" />
                  </span>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-muted">{route.volume}</span>
                </div>
                <h3 className="mt-5 text-lg font-semibold text-ink">{route.title}</h3>
                <div className="mt-4 grid gap-3 text-sm leading-6">
                  <p><strong className="text-ink">Best for:</strong> <span className="text-muted">{route.bestFor}</span></p>
                  <p><strong className="text-ink">Reuse potential:</strong> <span className="text-muted">{route.reuse}</span></p>
                  <p><strong className="text-ink">ESG value:</strong> <span className="text-muted">{route.esg}</span></p>
                </div>
                <p className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-flame-700">
                  Start route
                  <Icon name="arrow" className="h-4 w-4" />
                </p>
              </a>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

function ReuseJourney() {
  return (
    <section id="reuse-journey" className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Interactive reuse journey"
            title="From collection to secure wipe, deployment and responsible recovery."
            description="Recycling is not the starting assumption. Devices move through secure handling, diagnostics, repair, refurbishment, deployment planning and only then final recycling where needed."
          />
        </AnimatedSection>
        <AnimatedSection delay={0.08}>
          <div className="mt-10 rounded-lg border border-line bg-white p-4 shadow-card">
            <div className="flex flex-wrap gap-2">
              {lifecycleFlow.map((step, index) => (
                <span key={step} className="inline-flex items-center gap-2 rounded-full border border-line bg-paper px-3 py-2 text-xs font-semibold text-ink">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-flame-500 text-[10px] text-white">
                    {index + 1}
                  </span>
                  {step}
                </span>
              ))}
            </div>
          </div>
        </AnimatedSection>
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {reuseJourney.map((stage, index) => (
            <AnimatedSection key={stage.title} delay={index * 0.03}>
              <article className="h-full rounded-lg border border-line bg-white p-5 shadow-card transition hover:-translate-y-1 hover:shadow-soft">
                <div className="flex items-start justify-between gap-4">
                  <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-ink text-white">
                    <Icon name={stage.icon} className="h-5 w-5" />
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-flame-600">0{index + 1}</span>
                </div>
                <h3 className="mt-5 text-xl font-semibold text-ink">{stage.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted">{stage.description}</p>
                <div className="mt-5 rounded-lg bg-paper p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-flame-600">{stage.impact}</p>
                  <p className="mt-2 text-sm leading-6 text-muted">{stage.value}</p>
                </div>
              </article>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

function SecureDataLayer() {
  return (
    <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Data protection"
            title="Data protection and secure device handling."
            description="Enterprise recycling depends on trust. SIT Digital Access positions wipe workflows, chain of custody, asset records and secure logistics as part of the recovery model."
          />
        </AnimatedSection>
        <CardGrid features={securityCards} />
      </div>
    </section>
  );
}

function ReuseBeforeRecycle() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Reuse-before-recycle intelligence"
            title="Repair, refurbish and redeploy before final recycling."
            description="Recycling is the final route only when reuse is no longer practical."
          />
        </AnimatedSection>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {decisionCards.map((card, index) => (
            <AnimatedSection key={card.title} delay={index * 0.05}>
              <article className="h-full rounded-lg border border-line bg-white p-6 shadow-card transition hover:-translate-y-1 hover:shadow-soft">
                <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-flame-500 text-white">
                  <Icon name={card.icon} className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-2xl font-semibold text-ink">{card.title}</h3>
                <div className="mt-5 grid gap-3">
                  {card.points.map((point) => (
                    <p key={point} className="flex items-center gap-2 text-sm font-semibold text-muted">
                      <Icon name="check" className="h-4 w-4 text-flame-600" />
                      {point}
                    </p>
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

function EsgReporting() {
  return (
    <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
          <AnimatedSection>
            <SectionHeading
              eyebrow="Sustainability and ESG reporting"
              title="Suitable for ESG, CSR and sustainability reporting."
              description="Recovery programmes can support reuse estimates, secure wipe evidence, circularity metrics, community outcomes and deployment reporting."
            />
            <div className="mt-6 rounded-lg border border-flame-100 bg-flame-50 p-5">
              <p className="text-sm font-semibold text-flame-800">Downloadable-style report previews</p>
              <p className="mt-2 text-sm leading-6 text-flame-800/80">
                Circular recovery summaries, secure wipe evidence and donor impact packs can be prepared from operational records.
              </p>
            </div>
          </AnimatedSection>
          <div className="grid gap-4 md:grid-cols-2">
            {esgMetrics.map((metric, index) => (
              <AnimatedSection key={metric.label} delay={index * 0.035}>
                <MetricTile metric={metric} />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function AfricaSocialImpact() {
  return (
    <section className="bg-ink px-4 py-20 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase text-flame-300">Africa deployment and social impact</p>
            <h2 className="text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-5xl">
              Recovered devices can power learning and community access.
            </h2>
            <p className="mt-4 text-base leading-7 text-white/70 sm:text-lg">
              Device recovery connects into school labs, community hubs, NGO workforce enablement, AI literacy, teacher support and rural digital inclusion.
            </p>
          </div>
        </AnimatedSection>
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {socialUseCases.map((card, index) => (
            <AnimatedSection key={card.title} delay={index * 0.04}>
              <a href={card.href} className="block h-full rounded-lg border border-white/10 bg-white/[0.07] p-5 transition hover:-translate-y-1 hover:border-flame-300/50">
                <Icon name={card.icon} className="h-5 w-5 text-flame-300" />
                <h3 className="mt-4 text-lg font-semibold text-white">{card.title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/70">{card.description}</p>
              </a>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

function TrustTransparency() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Marketplace trust and transparency"
            title="Trust signals that make reuse credible."
            description="Recovered technology needs proof points: transparent grading, lifecycle readiness, warranty workflows, repair history, support planning and sustainability indicators."
          />
        </AnimatedSection>
        <CardGrid features={trustCards} />
      </div>
    </section>
  );
}

function ProcessingStandards() {
  return (
    <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Operational processing standards"
            title="A diagnostics-first processing model for circular recovery."
            description="The workflow prioritises testing, repair, low-power suitability, asset tagging and refurbishment standards before recycling decisions are made."
          />
        </AnimatedSection>
        <CardGrid features={standards} />
      </div>
    </section>
  );
}

function CollectionWorkflow() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Organisation collection workflow"
            title="Simple collection and recovery planning."
            description="Start with an enquiry, then align volume, logistics, secure intake, diagnostics, wipe needs, route decisions and reporting expectations."
          />
        </AnimatedSection>
        <div className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <AnimatedSection delay={0.08}>
            <div className="rounded-lg border border-line bg-white p-5 shadow-card">
              <div className="grid gap-3">
                {collectionSteps.map((step, index) => (
                  <div key={step} className="grid grid-cols-[40px_1fr] gap-4 rounded-lg bg-paper p-4">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-flame-500 text-sm font-semibold text-white">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-semibold text-ink">{step}</p>
                      <p className="mt-1 text-sm leading-6 text-muted">
                        {index === 0
                          ? "Share contact, location, device count and collection intent."
                          : "Progressively narrow the recovery route with evidence and impact in mind."}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
          <div className="grid gap-4">
            {collectionGuidance.map((item, index) => (
              <AnimatedSection key={item.title} delay={0.12 + index * 0.04}>
                <article className="rounded-lg border border-line bg-white p-5 shadow-card">
                  <h3 className="text-lg font-semibold text-ink">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted">{item.detail}</p>
                </article>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ImpactStories() {
  return (
    <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Success stories and impact"
            title="Recovery becomes powerful when retired devices become real access."
            description="These story patterns connect recycling and recovery with school labs, CSR partnerships, NGO refreshes, community hubs and workforce enablement."
          />
        </AnimatedSection>
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
          {storyCards.map((story, index) => (
            <AnimatedSection key={story.title} delay={index * 0.04}>
              <article className="flex h-full flex-col rounded-lg border border-line bg-paper p-5 shadow-card transition hover:-translate-y-1 hover:shadow-soft">
                <span className="self-start rounded-full bg-ink px-3 py-1 text-xs font-semibold text-white">{story.region}</span>
                <h3 className="mt-4 text-lg font-semibold text-ink">{story.title}</h3>
                <div className="mt-4 grid gap-2 text-xs font-semibold text-muted">
                  <span>{story.devices}</span>
                  <span>{story.co2}</span>
                  <span>{story.learners}</span>
                </div>
                <p className="mt-4 text-sm leading-6 text-muted">{story.quote}</p>
                <ButtonLink href={story.href} variant="ghost" className="mt-auto self-start px-0">
                  Learn more
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
              Turn retired technology into measurable environmental and social impact.
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-7 text-white/70">
              Start with a recycling enquiry, explore CSR routes, plan collection logistics or review the wider sustainability impact story.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <ButtonLink href="/donate#donation-form">Submit recycling enquiry</ButtonLink>
            <ButtonLink href="/csr-partnerships" variant="secondary">Explore CSR options</ButtonLink>
            <ButtonLink href="/contact?type=CORPORATE_RECYCLING#contact-form" variant="secondary">Discuss collection planning</ButtonLink>
            <ButtonLink href="/sustainability" variant="secondary">View sustainability impact</ButtonLink>
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

