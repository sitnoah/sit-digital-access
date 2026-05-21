import type { Metadata } from "next";
import { AnimatedSection } from "@/components/animated-section";
import { ButtonLink } from "@/components/button-link";
import { Icon, type IconKey } from "@/components/icons";
import { SectionHeading } from "@/components/section-heading";
import { LiveSustainabilitySummary } from "@/components/ecosystem/live-ecosystem-data";
import { impactStats } from "@/lib/content";

export const metadata: Metadata = {
  title: "Sustainability, Circular Technology & Impact Intelligence",
  description:
    "Circular technology, reuse impact, ESG-ready reporting and Africa deployment sustainability from SIT Digital Access."
};

type MetricCard = {
  label: string;
  value: string;
  detail: string;
  icon: IconKey;
  progress: number;
};

type FeatureCard = {
  title: string;
  description: string;
  icon: IconKey;
  metadata?: string;
  href?: string;
};

const stat = (label: string, fallback: string) => impactStats.find((item) => item.label === label)?.value ?? fallback;
const statDetail = (label: string, fallback: string) => impactStats.find((item) => item.label === label)?.detail ?? fallback;

const heroMetrics: MetricCard[] = [
  {
    label: "Devices reused",
    value: stat("Devices deployed", "500+"),
    detail: "Prepared for second-life access",
    icon: "package",
    progress: 78
  },
  {
    label: "CO2 avoided",
    value: stat("CO2 saved through reuse", "25t"),
    detail: statDetail("CO2 saved through reuse", "Estimated circular impact"),
    icon: "leaf",
    progress: 72
  },
  {
    label: "Learners reached",
    value: stat("Learners reached", "1,500+"),
    detail: "Through access and training",
    icon: "graduation",
    progress: 82
  },
  {
    label: "Schools supported",
    value: stat("Schools supported", "10+"),
    detail: "Labs and learner access",
    icon: "school",
    progress: 68
  },
  {
    label: "Circularity score",
    value: "Reuse-first",
    detail: "Repair, refurbish and redeploy before recycling",
    icon: "recycle",
    progress: 86
  },
  {
    label: "Countries active",
    value: stat("Countries served", "5+"),
    detail: "UK and Africa partnerships",
    icon: "globe",
    progress: 64
  }
];

const dashboardMetrics: MetricCard[] = [
  ...heroMetrics,
  {
    label: "Businesses supported",
    value: stat("Businesses supported", "50+"),
    detail: "SMEs, NGOs and operational teams",
    icon: "business",
    progress: 66
  },
  {
    label: "Community hubs enabled",
    value: "Hub routes",
    detail: "Shared access, training and support pathways",
    icon: "building",
    progress: 58
  },
  {
    label: "Training hours delivered",
    value: stat("Training hours delivered", "2,000+"),
    detail: "Digital skills pathways",
    icon: "book",
    progress: 74
  },
  {
    label: "Devices repaired",
    value: "Repair-first",
    detail: "Extend device life before replacement",
    icon: "wrench",
    progress: 80
  },
  {
    label: "Devices diverted",
    value: stat("Devices deployed", "500+"),
    detail: "Reuse and recovery pathways",
    icon: "recycle",
    progress: 76
  },
  {
    label: "Recycled responsibly",
    value: "Recovery route",
    detail: "Responsible recycling when reuse is not viable",
    icon: "shield",
    progress: 62
  }
];

const heroFlow = ["Corporate refresh", "Refurbish", "Deploy", "Learn", "Support", "Reuse"];
const lifecycleFlow = ["Source", "Repair", "Refurbish", "Deploy", "Support", "Recover", "Reuse", "Recycle"];

const reuseJourney = [
  {
    title: "Donation and CSR intake",
    description: "Corporate refreshes, donor batches and community devices enter a controlled circular route.",
    value: "Captures provenance, quantity and intended impact route.",
    metric: "Intake ready",
    icon: "truck" as IconKey
  },
  {
    title: "Secure data handling",
    description: "Devices are triaged with secure wipe workflows, asset records and handover controls.",
    value: "Protects donors, recipients and deployment partners.",
    metric: "Wipe first",
    icon: "shield" as IconKey
  },
  {
    title: "Diagnostics and triage",
    description: "Teams decide whether each device is best suited for repair, refurbishment, parts recovery or recycling.",
    value: "Prevents usable technology from being retired too early.",
    metric: "Route decision",
    icon: "settings" as IconKey
  },
  {
    title: "Refurbishment and upgrades",
    description: "SSD, RAM, OS setup, accessories and quality checks prepare devices for practical second-life use.",
    value: "Creates reliable devices for classrooms, hubs and field teams.",
    metric: "Reuse ready",
    icon: "hardDrive" as IconKey
  },
  {
    title: "Deployment planning",
    description: "Power, connectivity, support ownership and training pathways are matched to the receiving site.",
    value: "Improves useful life in real-world conditions.",
    metric: "Site aligned",
    icon: "network" as IconKey
  },
  {
    title: "Community and school reuse",
    description: "Prepared technology supports learners, teachers, NGOs, hubs, SMEs and Africa deployment partners.",
    value: "Turns circular recovery into access, skills and participation.",
    metric: "Impact route",
    icon: "school" as IconKey
  },
  {
    title: "Support and maintenance",
    description: "Support, repair guidance and replacement planning keep devices useful after initial handover.",
    value: "Reduces avoidable replacement and downtime.",
    metric: "Lifecycle support",
    icon: "headset" as IconKey
  },
  {
    title: "Repair and lifecycle extension",
    description: "Repair workflows extend useful life before refurbishment, redeployment or recovery decisions.",
    value: "Keeps technology in service for longer.",
    metric: "Repair-first",
    icon: "wrench" as IconKey
  },
  {
    title: "Responsible recycling",
    description: "When reuse is no longer viable, devices can move into parts recovery and responsible recycling.",
    value: "Closes the loop with evidence-ready recovery.",
    metric: "Closed loop",
    icon: "recycle" as IconKey
  }
];

const intelligenceCards: FeatureCard[] = [
  { title: "Secure wipe workflows", description: "Data-bearing devices can be handled with wipe records, donor confidence and asset trail evidence.", icon: "shield" },
  { title: "Low-power deployments", description: "Mini PCs, efficient laptops and shared-access models support power-aware Africa deployment planning.", icon: "sun" },
  { title: "Repair-first strategy", description: "Repair and replacement planning are part of sustainability, not separate from it.", icon: "wrench" },
  { title: "Refurbishment readiness", description: "Grade, performance, battery, storage and software readiness determine practical reuse routes.", icon: "badge" },
  { title: "Lifecycle tracking", description: "Device records can connect request, intake, diagnostics, deployment, support and recovery states.", icon: "database" },
  { title: "ESG reporting", description: "Operational evidence can support sponsor, donor, board, CSR and sustainability summaries.", icon: "chart" },
  { title: "Asset recovery", description: "Trade-in, recycling and donation routes bring retired equipment back into a productive lifecycle.", icon: "package" },
  { title: "Circular procurement", description: "Buy, repair, reuse and recover decisions can be joined into one practical circular technology model.", icon: "recycle" },
  { title: "Community reuse pathways", description: "Devices are matched to schools, community hubs, NGOs, digital skills cohorts and deployment sites.", icon: "heart" }
];

const impactCards = [
  {
    title: "Education impact",
    kpi: stat("Schools supported", "10+"),
    region: "Schools and training centres",
    story: "School lab deployment pathways connect devices with learning access.",
    href: "/schools",
    icon: "school" as IconKey
  },
  {
    title: "Community impact",
    kpi: "Hub routes",
    region: "Libraries, charities and hubs",
    story: "Community access spaces can combine devices, training and support.",
    href: "/community-hubs",
    icon: "building" as IconKey
  },
  {
    title: "Workforce enablement",
    kpi: stat("Businesses supported", "50+"),
    region: "SMEs and NGOs",
    story: "Refurbished technology helps mission-led teams standardise operations.",
    href: "/businesses-ngos",
    icon: "business" as IconKey
  },
  {
    title: "Africa deployment reach",
    kpi: stat("Countries served", "5+"),
    region: "Liberia, Ghana, Sierra Leone, Nigeria and wider Africa",
    story: "Deployment planning is power-aware, support-ready and training-linked.",
    href: "/deployment-map",
    icon: "globe" as IconKey
  },
  {
    title: "Carbon reduction",
    kpi: stat("CO2 saved through reuse", "25t"),
    region: "Circular recovery",
    story: "Reuse estimates turn device recovery into measurable environmental value.",
    href: "/impact",
    icon: "leaf" as IconKey
  },
  {
    title: "Digital skills enablement",
    kpi: stat("Training hours delivered", "2,000+"),
    region: "SIT Learning pathways",
    story: "Technology access works best when paired with practical skills.",
    href: "/programmes",
    icon: "graduation" as IconKey
  }
];

const circularPathways: FeatureCard[] = [
  { title: "Repair before replacement", description: "Diagnostics, parts and repair workflows can extend useful device life.", icon: "wrench", href: "/repairs" },
  { title: "Refurbish before recycle", description: "Upgrade, wipe and configure devices for schools, hubs and teams before recycling is considered.", icon: "settings", href: "/devices" },
  { title: "Reuse before disposal", description: "Every recovered device creates another opportunity for learning, work or community access.", icon: "heart", href: "/impact" },
  { title: "Parts recovery", description: "Non-deployable devices can still support repair, refurbishment and maintenance operations.", icon: "cpu", href: "/trade-in" },
  { title: "Responsible recycling", description: "When reuse is not viable, recovery routes can connect to documented recycling workflows.", icon: "recycle", href: "/device-recycling" },
  { title: "Device lifecycle extension", description: "Request, repair, support, refresh and recover decisions are connected through the lifecycle model.", icon: "database", href: "/device-lifecycle" }
];

const trustCards: FeatureCard[] = [
  { title: "Transparent grading", description: "Clear condition grading helps partners understand device quality and tradeoffs.", icon: "badge" },
  { title: "Warranty workflows", description: "Support and replacement planning help second-life technology feel dependable.", icon: "shield" },
  { title: "Lifecycle readiness", description: "Devices can be prepared for test, wipe, configure, deploy, support and recovery states.", icon: "database" },
  { title: "Repair history", description: "Repair status, parts use and quality checks improve confidence in refurbished devices.", icon: "wrench" },
  { title: "Sustainability indicators", description: "CO2 estimates, low-power suitability and reuse confidence turn sustainability into visible product intelligence.", icon: "leaf" },
  { title: "Device provenance", description: "Donation, trade-in, CSR and recovery origins can support traceable circular reporting.", icon: "package" },
  { title: "Support planning", description: "Remote support, handover guidance and maintenance planning protect long-term value.", icon: "headset" },
  { title: "ESG readiness", description: "Operational records can feed donor reports, board packs and sponsor-ready summaries.", icon: "chart" }
];

const reportingFeatures: FeatureCard[] = [
  { title: "CO2 estimates", description: "Report public-safe estimates from reuse, refurbishment and recovery pathways.", icon: "leaf" },
  { title: "Circularity metrics", description: "Show devices reused, diverted, repaired, redeployed and responsibly recycled.", icon: "recycle" },
  { title: "Reuse reporting", description: "Connect device batches to schools, communities, NGOs and Africa deployment sites.", icon: "package" },
  { title: "Secure wipe evidence", description: "Evidence workflows support donor confidence and data handling assurance.", icon: "shield" },
  { title: "Deployment reporting", description: "Summarise sites, learners, hubs, countries, support ownership and training links.", icon: "globe" },
  { title: "Community impact summaries", description: "Translate operations into outcomes that boards, sponsors and donors can understand.", icon: "heart" }
];

const africaRegions = [
  {
    country: "Liberia",
    focus: "School labs, vocational learning and community hub pathways.",
    topics: ["Low-power computing", "School labs", "Local support ownership"],
    readiness: 72
  },
  {
    country: "Ghana",
    focus: "Community access, NGO operations and sponsor-backed digital skills.",
    topics: ["Shared access", "Community hubs", "Workforce enablement"],
    readiness: 78
  },
  {
    country: "Sierra Leone",
    focus: "Offline-first learning, rural access and education partnership planning.",
    topics: ["Offline-first learning", "Rural suitability", "Training handover"],
    readiness: 66
  },
  {
    country: "Nigeria",
    focus: "Workforce enablement, school deployments and regional partner growth.",
    topics: ["Repair ecosystems", "Digital skills", "Innovation hubs"],
    readiness: 74
  },
  {
    country: "Wider Africa",
    focus: "Deployment models that can scale through partners, sponsors and local ownership.",
    topics: ["Africa pathways", "CSR sponsorship", "Sustainability reporting"],
    readiness: 64
  }
];

const storyCards = [
  {
    title: "Community hub transformation",
    region: "Community access",
    devices: "10-24 reused devices",
    learners: "Shared access model",
    co2: "Reuse impact tracked",
    quote: "Prepared technology can turn a local space into a place for learning, work and confidence.",
    href: "/community-hubs"
  },
  {
    title: "School lab deployment",
    region: "Education",
    devices: "24-seat lab model",
    learners: "Classroom-ready access",
    co2: "Devices diverted",
    quote: "A planned lab helps schools move from occasional access to timetable-ready digital learning.",
    href: "/schools"
  },
  {
    title: "NGO workforce refresh",
    region: "Mission operations",
    devices: "Business laptop bundles",
    learners: "Staff and volunteer enablement",
    co2: "Reuse-first procurement",
    quote: "Second-life devices can strengthen field coordination without new-device costs.",
    href: "/businesses-ngos"
  },
  {
    title: "AI literacy access",
    region: "Digital skills",
    devices: "Training-ready devices",
    learners: "Cohort pathways",
    co2: "Circular learning route",
    quote: "Access to reliable devices helps responsible AI learning become practical, not abstract.",
    href: "/programmes"
  },
  {
    title: "Sponsor-backed learner access",
    region: "CSR partnership",
    devices: "Sponsored devices",
    learners: "Learner pathway",
    co2: "ESG-ready story",
    quote: "Corporate refresh cycles can become measurable education and sustainability outcomes.",
    href: "/csr-partnerships"
  }
];

const partnershipCards: FeatureCard[] = [
  { title: "Corporate recycling", description: "Turn retired equipment into secure recovery, reuse and reporting workflows.", icon: "recycle", href: "/device-recycling" },
  { title: "CSR partnerships", description: "Sponsor labs, learners, hubs and Africa deployment pathways.", icon: "handshake", href: "/csr-partnerships" },
  { title: "Device sponsorship", description: "Fund refurbished device access for learners, schools and community spaces.", icon: "heart", href: "/donate" },
  { title: "NGO partnerships", description: "Support field teams, community hubs and mission operations with practical technology.", icon: "business", href: "/businesses-ngos" },
  { title: "School lab sponsorship", description: "Create timetable-ready digital learning spaces with support and reporting.", icon: "school", href: "/schools" },
  { title: "Circular procurement partnerships", description: "Plan buy, repair, reuse, recover and report cycles with SIT Digital Access.", icon: "leaf", href: "/trade-in" }
];

export default function SustainabilityPage() {
  return (
    <main>
      <SustainabilityHero />
      <CircularImpactDashboard />
      <ReuseJourney />
      <SustainabilityIntelligence />
      <LiveImpactVisualisation />
      <CircularEconomyPathways />
      <MarketplaceTrust />
      <EsgReporting />
      <AfricaSustainability />
      <SuccessStories />
      <Partnerships />
      <FinalCta />
    </main>
  );
}

function SustainabilityHero() {
  return (
    <section className="overflow-hidden bg-ink px-4 py-20 text-white sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <AnimatedSection>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-flame-300">
            Sustainability and circular technology
          </p>
          <h1 className="mt-5 max-w-5xl text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
            Circular technology that keeps useful devices in education, work and community life
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-white/72 sm:text-lg">
            SIT Digital Access combines refurbishment, repair, deployment, reuse, recycling and
            digital skills enablement into a measurable sustainability and digital inclusion ecosystem.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="#reuse-journey">See reuse journey</ButtonLink>
            <ButtonLink href="/csr-partnerships" variant="secondary">
              Discuss CSR
            </ButtonLink>
          </div>
          <div className="mt-8 flex flex-wrap gap-2">
            {["Reuse-first model", "ESG-ready reporting", "Secure wipe workflows", "Circular technology lifecycle", "Africa deployment pathways"].map((badge) => (
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
                <div key={metric.label} className="rounded-lg border border-white/10 bg-black/24 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <Icon name={metric.icon} className="h-5 w-5 text-flame-300" />
                    <span className="text-2xl font-semibold">{metric.value}</span>
                  </div>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-white/62">{metric.label}</p>
                  <p className="mt-2 text-xs leading-5 text-white/68">{metric.detail}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-lg bg-white p-4 text-ink">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-flame-600">Impact operating model</p>
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

function CircularImpactDashboard() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Circular impact dashboard"
            title="A live-style dashboard for reuse, recovery and digital inclusion."
            description="Public impact figures are shown with operational context: devices reused, CO2 avoided, learners reached, recovery routes, repairs and ESG-ready circularity signals."
          />
        </AnimatedSection>

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {dashboardMetrics.map((metric, index) => (
            <AnimatedSection key={metric.label} delay={index * 0.025}>
              <article className="h-full rounded-lg border border-line bg-white p-5 shadow-card transition hover:-translate-y-1 hover:shadow-soft">
                <div className="flex items-start justify-between gap-4">
                  <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-ink text-white">
                    <Icon name={metric.icon} className="h-5 w-5" />
                  </span>
                  <div className="relative h-14 w-14 rounded-full bg-paper">
                    <div className="absolute inset-1 rounded-full bg-white" />
                    <div
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: `conic-gradient(#f97316 ${metric.progress * 3.6}deg, #e8e2d8 0deg)`
                      }}
                    />
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
            </AnimatedSection>
          ))}
        </div>

        <div className="mt-8">
          <AnimatedSection delay={0.1}>
            <LiveSustainabilitySummary />
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}

function ReuseJourney() {
  return (
    <section id="reuse-journey" className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Interactive reuse journey"
            title="From retired hardware to secure reuse, deployment and recovery."
            description="The circular journey connects donor intake, data handling, diagnostics, refurbishment, deployment, support, repair and responsible recycling."
          />
        </AnimatedSection>
        <AnimatedSection delay={0.08}>
          <div className="mt-10 overflow-hidden rounded-lg border border-line bg-paper p-4">
            <div className="flex flex-wrap gap-2">
              {lifecycleFlow.map((step, index) => (
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
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {reuseJourney.map((stage, index) => (
            <AnimatedSection key={stage.title} delay={index * 0.035}>
              <article className="h-full rounded-lg border border-line bg-paper p-5 transition hover:-translate-y-1 hover:bg-white hover:shadow-card">
                <div className="flex items-start justify-between gap-4">
                  <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-ink text-white">
                    <Icon name={stage.icon} className="h-5 w-5" />
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-flame-600">0{index + 1}</span>
                </div>
                <h3 className="mt-5 text-xl font-semibold text-ink">{stage.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted">{stage.description}</p>
                <div className="mt-5 rounded-lg border border-line bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-flame-600">{stage.metric}</p>
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

function SustainabilityIntelligence() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Sustainability intelligence layer"
            title="Sustainability built into the operational lifecycle."
            description="SIT Digital Access links sustainability to the practical work of wiping, testing, repairing, configuring, deploying, supporting and recovering devices."
          />
        </AnimatedSection>
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {intelligenceCards.map((card, index) => (
            <AnimatedSection key={card.title} delay={index * 0.03}>
              <FeatureTile feature={card} />
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

function LiveImpactVisualisation() {
  return (
    <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Live impact visualisation"
            title="Circular technology turns into education, community and workforce outcomes."
            description="These impact cards connect sustainability metrics with deployment routes, regional coverage, training and public credibility."
          />
        </AnimatedSection>
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {impactCards.map((card, index) => (
            <AnimatedSection key={card.title} delay={index * 0.04}>
              <article className="flex h-full flex-col rounded-lg border border-line bg-paper p-6 shadow-card transition hover:-translate-y-1 hover:shadow-soft">
                <div className="flex items-start justify-between gap-4">
                  <Icon name={card.icon} className="h-6 w-6 text-flame-600" />
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-muted">{card.region}</span>
                </div>
                <p className="mt-5 text-3xl font-semibold text-ink">{card.kpi}</p>
                <h3 className="mt-2 text-xl font-semibold text-ink">{card.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted">{card.story}</p>
                <ButtonLink href={card.href} variant="secondary" className="mt-auto self-start">
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

function CircularEconomyPathways() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Circular economy pathways"
            title="Repair, reuse, refurbish and recover before disposal."
            description="Every recovered device creates another opportunity for learning, work or community access."
          />
        </AnimatedSection>
        <CardGrid features={circularPathways} />
      </div>
    </section>
  );
}

function MarketplaceTrust() {
  return (
    <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Marketplace trust and transparency"
            title="Premium trust architecture for refurbished technology."
            description="Refurbished technology needs visible proof: condition, provenance, warranty, repair status, support planning and sustainability indicators."
          />
        </AnimatedSection>
        <CardGrid features={trustCards} />
      </div>
    </section>
  );
}

function EsgReporting() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <AnimatedSection>
            <SectionHeading
              eyebrow="ESG and CSR reporting"
              title="Support ESG and CSR reporting with measurable operational evidence."
              description="Public sustainability storytelling can connect into admin sustainability reports, recycling evidence, secure wipe records, donor summaries and sponsor-ready reporting."
            />
            <div className="mt-6 flex flex-col gap-3 sm:flex-row lg:flex-col">
              <ButtonLink href="/csr-partnerships">Discuss partnership</ButtonLink>
              <ButtonLink href="/contact?type=PARTNERSHIP#contact-form" variant="secondary">Plan ESG reporting</ButtonLink>
            </div>
          </AnimatedSection>
          <div>
            <div className="grid gap-4 md:grid-cols-2">
              {reportingFeatures.map((card, index) => (
                <AnimatedSection key={card.title} delay={index * 0.035}>
                  <FeatureTile feature={card} />
                </AnimatedSection>
              ))}
            </div>
            <AnimatedSection delay={0.12}>
              <div className="mt-6 rounded-lg border border-line bg-white p-5 shadow-card">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-flame-600">Sample report preview</p>
                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  {["Circular recovery summary", "Secure wipe evidence", "Deployment impact pack"].map((item) => (
                    <div key={item} className="rounded-lg bg-paper p-4">
                      <Icon name="chart" className="h-5 w-5 text-flame-600" />
                      <p className="mt-3 text-sm font-semibold text-ink">{item}</p>
                      <p className="mt-2 text-xs leading-5 text-muted">Board, donor and partner-ready evidence layer.</p>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  );
}

function AfricaSustainability() {
  return (
    <section className="bg-ink px-4 py-20 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase text-flame-300">Africa deployment sustainability</p>
            <h2 className="text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-5xl">
              Regional impact with power-aware, support-ready assumptions.
            </h2>
            <p className="mt-4 text-base leading-7 text-white/70 sm:text-lg">
              Sustainability in Africa deployment depends on low-power computing, shared access, offline-first learning, repair ecosystems and local support ownership.
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

function SuccessStories() {
  return (
    <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Success stories and real-world impact"
            title="Sustainability becomes credible when it is visible in schools, hubs and communities."
            description="These public story patterns connect circular technology recovery with education, operations, digital skills and sponsor-backed outcomes."
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
                  <span>{story.learners}</span>
                  <span>{story.co2}</span>
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

function Partnerships() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Sustainability partnerships"
            title="Build circular technology programmes with measurable social and environmental value."
            description="Connect sustainability into recycling, CSR, device sponsorship, NGO support, school labs and circular procurement partnerships."
          />
        </AnimatedSection>
        <CardGrid features={partnershipCards} />
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
              Turn retired technology into measurable digital and environmental impact.
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-7 text-white/70">
              Start with recycling, explore impact, discuss a CSR partnership or plan an Africa deployment pathway with devices, training and support connected.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <ButtonLink href="/device-recycling">Start recycling route</ButtonLink>
            <ButtonLink href="/impact" variant="secondary">View impact</ButtonLink>
            <ButtonLink href="/csr-partnerships" variant="secondary">Discuss CSR partnership</ButtonLink>
            <ButtonLink href="/deployment-map" variant="secondary">Explore deployments</ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}

function CardGrid({ features }: { features: FeatureCard[] }) {
  return (
    <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
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
