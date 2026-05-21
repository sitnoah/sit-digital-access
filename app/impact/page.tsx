import type { Metadata } from "next";
import { AnimatedSection } from "@/components/animated-section";
import { ButtonLink } from "@/components/button-link";
import { Icon, type IconKey } from "@/components/icons";
import { SectionHeading } from "@/components/section-heading";
import { impactStats } from "@/lib/content";

export const metadata: Metadata = {
  title: "Impact Intelligence & Digital Inclusion",
  description:
    "A premium public impact intelligence dashboard for SIT Digital Access, showing digital inclusion, education, sustainability and Africa deployment outcomes."
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

type StoryCard = {
  title: string;
  category: string;
  region: string;
  devices: string;
  outcome: string;
  sustainability: string;
  before: string;
  after: string;
  quote: string;
  href: string;
};

const stat = (label: string, fallback: string) => impactStats.find((item) => item.label === label)?.value ?? fallback;
const detail = (label: string, fallback: string) => impactStats.find((item) => item.label === label)?.detail ?? fallback;

const heroMetrics: MetricCard[] = [
  {
    label: "Devices deployed",
    value: stat("Devices deployed", "500+"),
    detail: detail("Devices deployed", "Target for refurbished devices"),
    icon: "laptop",
    progress: 78
  },
  {
    label: "Learners reached",
    value: stat("Learners reached", "1,500+"),
    detail: detail("Learners reached", "Through access and training"),
    icon: "graduation",
    progress: 82
  },
  {
    label: "Schools supported",
    value: stat("Schools supported", "10+"),
    detail: detail("Schools supported", "Labs and learner access"),
    icon: "school",
    progress: 68
  },
  {
    label: "Businesses upgraded",
    value: stat("Businesses supported", "50+"),
    detail: detail("Businesses supported", "SMEs and NGO teams"),
    icon: "business",
    progress: 66
  },
  {
    label: "CO2 avoided",
    value: stat("CO2 saved through reuse", "25t"),
    detail: detail("CO2 saved through reuse", "Estimated circular impact"),
    icon: "leaf",
    progress: 72
  },
  {
    label: "Training hours delivered",
    value: stat("Training hours delivered", "2,000+"),
    detail: detail("Training hours delivered", "Digital skills pathways"),
    icon: "book",
    progress: 74
  }
];

const dashboardMetrics: MetricCard[] = [
  ...heroMetrics,
  {
    label: "Countries served",
    value: stat("Countries served", "5+"),
    detail: "UK and Africa partnerships",
    icon: "globe",
    progress: 64
  },
  {
    label: "Cost savings generated",
    value: stat("Cost savings generated", "80%"),
    detail: "Compared with new equipment",
    icon: "cost",
    progress: 80
  },
  {
    label: "Community hubs enabled",
    value: "Hub routes",
    detail: "Shared access and training pathways",
    icon: "building",
    progress: 58
  },
  {
    label: "Devices repaired",
    value: "Repair-first",
    detail: "Lifecycle extension before replacement",
    icon: "wrench",
    progress: 80
  },
  {
    label: "Devices reused",
    value: stat("Devices deployed", "500+"),
    detail: "Prepared for second-life access",
    icon: "recycle",
    progress: 78
  },
  {
    label: "Sponsorships completed",
    value: "Sponsor-ready",
    detail: "Learner, lab and hub pathways",
    icon: "handshake",
    progress: 62
  }
];

const heroFlow = ["Recover", "Refurbish", "Deploy", "Learn", "Work", "Reuse", "Impact"];
const lifecycleFlow = ["Procurement", "Repair", "Refurbish", "Deploy", "Support", "Recover", "Recycle"];
const mapFilters = ["Education", "Community hubs", "Workforce enablement", "AI literacy", "School labs", "NGO support"];

const regionalImpact = [
  {
    country: "Liberia",
    phase: "Planning",
    readiness: 72,
    devices: "Lab-ready bundles",
    labs: "Vocational and school lab pathways",
    hubs: "Community access planning",
    learners: "Learner access routes",
    partners: "Education and NGO partners",
    training: "Digital literacy and teacher enablement",
    connectivity: "Offline-first and low-power assumptions",
    support: "Local ownership model"
  },
  {
    country: "Ghana",
    phase: "Active pathways",
    readiness: 78,
    devices: "Laptops, mini PCs and accessories",
    labs: "Community and education deployments",
    hubs: "Hub and NGO pathways",
    learners: "Training cohort potential",
    partners: "Community and CSR partners",
    training: "AI literacy and workforce readiness",
    connectivity: "Mixed broadband and mobile data",
    support: "Remote and local handover routes"
  },
  {
    country: "Sierra Leone",
    phase: "Partner onboarding",
    readiness: 66,
    devices: "Low-power deployment candidates",
    labs: "Rural and school lab planning",
    hubs: "Community support centres",
    learners: "Shared access model",
    partners: "Education and community partners",
    training: "Offline-first learning support",
    connectivity: "Connectivity-constrained planning",
    support: "Maintenance owner needed"
  },
  {
    country: "Nigeria",
    phase: "Expansion",
    readiness: 74,
    devices: "Workforce and learning devices",
    labs: "Innovation and school lab pathways",
    hubs: "Coworking and community hub potential",
    learners: "Youth and workforce enablement",
    partners: "NGO and business networks",
    training: "Cybersecurity, AI and productivity skills",
    connectivity: "Urban and regional variation",
    support: "Repair ecosystem opportunity"
  },
  {
    country: "Wider Africa",
    phase: "Scaling model",
    readiness: 64,
    devices: "Assessment-led deployment",
    labs: "Sponsor-backed access models",
    hubs: "Replicable hub pathways",
    learners: "Community learning pathways",
    partners: "CSR, NGO and implementation partners",
    training: "SIT Learning-aligned delivery",
    connectivity: "Power and connectivity planning first",
    support: "Partner-led support ownership"
  }
];

const stories: StoryCard[] = [
  {
    title: "Learner access pathway",
    category: "Learner",
    region: "UK and Africa",
    devices: "1 sponsored laptop",
    outcome: "Private study time, coursework access and digital confidence",
    sustainability: "One useful device kept in circulation",
    before: "Phone-only or shared access limited learning time.",
    after: "A configured laptop creates a reliable study and skills pathway.",
    quote: "Device access changes the rhythm of learning from occasional to possible.",
    href: "/success-stories"
  },
  {
    title: "School deployment",
    category: "School",
    region: "School lab pathway",
    devices: "24-seat lab model",
    outcome: "Timetable-ready digital learning",
    sustainability: "Reusable devices deployed as a classroom asset",
    before: "Ad hoc device access and unreliable ICT availability.",
    after: "A planned lab supports lessons, assignments and teacher enablement.",
    quote: "A school lab is not just hardware; it is repeatable access.",
    href: "/schools"
  },
  {
    title: "NGO operations",
    category: "NGO",
    region: "Mission operations",
    devices: "Business laptop bundles",
    outcome: "Staff and volunteer coordination",
    sustainability: "Refurbished procurement route",
    before: "Mixed devices slowed programme administration.",
    after: "Standardised laptops and cloud setup reduce operational friction.",
    quote: "Operational technology helps mission-led teams spend more time on delivery.",
    href: "/businesses-ngos"
  },
  {
    title: "SME productivity",
    category: "Business",
    region: "SME support",
    devices: "Staff refresh pathway",
    outcome: "Hybrid work and productivity readiness",
    sustainability: "Cost saving compared with new equipment",
    before: "Older devices limited cloud adoption and team workflows.",
    after: "Affordable refurbished technology supports daily operations.",
    quote: "Access to practical technology can unlock professional consistency.",
    href: "/businesses-ngos"
  },
  {
    title: "Community hub transformation",
    category: "Community",
    region: "Community access",
    devices: "10-24 shared devices",
    outcome: "Digital inclusion, job search and guided learning",
    sustainability: "Shared-use model increases device value",
    before: "Community members relied on limited or borrowed access.",
    after: "A hub can provide structured digital participation.",
    quote: "A shared device can support many journeys when the space is trusted.",
    href: "/community-hubs"
  },
  {
    title: "Teacher enablement",
    category: "Education",
    region: "School support",
    devices: "Teacher and admin devices",
    outcome: "Planning, teaching resources and classroom confidence",
    sustainability: "Repairable devices extended into teaching use",
    before: "Digital learning depended on inconsistent teacher access.",
    after: "Reliable teacher devices strengthen classroom delivery.",
    quote: "Teacher access multiplies the value of every learner device.",
    href: "/programmes"
  },
  {
    title: "AI literacy access",
    category: "Skills",
    region: "SIT Learning",
    devices: "Training-ready laptops",
    outcome: "Responsible AI confidence and practical awareness",
    sustainability: "Higher-spec reused devices support modern learning",
    before: "AI literacy felt abstract without device access.",
    after: "Hands-on sessions make responsible use tangible.",
    quote: "Modern skills need practical access, not just inspiration.",
    href: "/programmes"
  },
  {
    title: "Workforce readiness",
    category: "Workforce",
    region: "Youth and adult learning",
    devices: "Learner cohort devices",
    outcome: "Employability, remote work and digital confidence",
    sustainability: "Circular devices support economic participation",
    before: "Digital gaps limited applications, training and work readiness.",
    after: "Device access plus training creates a pathway to opportunity.",
    quote: "Digital access is a bridge between potential and participation.",
    href: "/programmes"
  }
];

const learningOutcomes: FeatureCard[] = [
  { title: "Digital literacy", description: "Basic access, confidence, browser use, documents, email and safe digital participation.", icon: "book" },
  { title: "AI literacy", description: "Responsible AI awareness, practical use cases and confidence with modern tools.", icon: "sparkles" },
  { title: "Cybersecurity awareness", description: "Passwords, phishing, device safety and everyday online risk reduction.", icon: "shield" },
  { title: "Workforce readiness", description: "CVs, remote work, cloud collaboration and employability skills.", icon: "business" },
  { title: "Teacher enablement", description: "Classroom planning, digital resources and learner support capacity.", icon: "graduation" },
  { title: "Remote work capability", description: "Devices, setup and support for distributed staff and mission-led teams.", icon: "cloud" },
  { title: "Community learning", description: "Shared access sessions through libraries, churches, hubs and charities.", icon: "users" },
  { title: "SME productivity", description: "Affordable technology, cloud setup and operational consistency.", icon: "chart" }
];

const sustainabilityMetrics: MetricCard[] = [
  { label: "Devices reused", value: stat("Devices deployed", "500+"), detail: "Second-life access pathways", icon: "recycle", progress: 78 },
  { label: "Devices diverted from landfill", value: stat("Devices deployed", "500+"), detail: "Useful recovery before disposal", icon: "package", progress: 76 },
  { label: "Circularity score", value: "Reuse-first", detail: "Repair and refurbish before recycling", icon: "leaf", progress: 86 },
  { label: "Repair-first recoveries", value: "Repair route", detail: "Extend useful device life", icon: "wrench", progress: 80 },
  { label: "CO2 avoided", value: stat("CO2 saved through reuse", "25t"), detail: "Estimated circular impact", icon: "leaf", progress: 72 },
  { label: "Low-power deployments", value: "Mini PC ready", detail: "Power-aware Africa pathways", icon: "sun", progress: 70 },
  { label: "Secure wipe workflows", value: "Wipe-first", detail: "Data handling before reuse", icon: "shield", progress: 82 }
];

const communityEnablement: FeatureCard[] = [
  { title: "School computer labs", description: "Timetable-ready device bundles for digital learning and teacher support.", icon: "school", metadata: "Education", href: "/schools" },
  { title: "Community digital hubs", description: "Shared technology access for job search, learning and local inclusion.", icon: "building", metadata: "Community", href: "/community-hubs" },
  { title: "NGO field office upgrades", description: "Affordable staff devices, cloud setup and support for mission operations.", icon: "business", metadata: "NGO", href: "/businesses-ngos" },
  { title: "Women and youth empowerment", description: "Learner access, skills confidence and employability pathways.", icon: "heart", metadata: "Inclusion", href: "/programmes" },
  { title: "Rural digital access", description: "Low-power, offline-first and shared-access models for constrained sites.", icon: "globe", metadata: "Africa", href: "/deployment-map" },
  { title: "Coworking and innovation hubs", description: "Device and support routes for community entrepreneurship and workforce spaces.", icon: "network", metadata: "Innovation", href: "/community-hubs" }
];

const csrCards: FeatureCard[] = [
  { title: "Corporate recycling impact", description: "Turn retired hardware into secure recovery, reuse and digital inclusion outcomes.", icon: "recycle", href: "/device-recycling" },
  { title: "ESG metrics", description: "Support circularity, CO2, reuse and community impact evidence.", icon: "chart", href: "/sustainability" },
  { title: "Sponsorship outcomes", description: "Sponsor learners, labs, hubs and digital skills cohorts with visible reporting.", icon: "handshake", href: "/csr-partnerships" },
  { title: "Community deployment reach", description: "Connect CSR investment to schools, hubs, NGOs and Africa deployment pathways.", icon: "globe", href: "/deployment-map" },
  { title: "Digital skills enablement", description: "Pair technology access with AI literacy, cybersecurity and employability.", icon: "graduation", href: "/programmes" },
  { title: "Sustainability reporting", description: "Designed for measurable CSR and ESG outcomes.", icon: "leaf", href: "/sustainability" }
];

const trustCards: FeatureCard[] = [
  { title: "Transparent metrics", description: "Public indicators use existing impact stats and operationally grounded categories.", icon: "chart" },
  { title: "Secure wipe verification", description: "Recovered devices can route through wipe-first workflows before reuse.", icon: "shield" },
  { title: "Deployment reporting", description: "Site, partner, device, learner and training context can inform impact outputs.", icon: "globe" },
  { title: "Device traceability", description: "Lifecycle intelligence connects procurement, repair, deployment, support and recovery.", icon: "database" },
  { title: "Sustainability reporting", description: "Reuse, CO2, circularity and recovery signals support ESG-ready summaries.", icon: "leaf" },
  { title: "Support records", description: "Aftercare, repair and customer support protect long-term access.", icon: "headset" },
  { title: "Operational readiness", description: "Power, connectivity, training and support assumptions improve deployment realism.", icon: "settings" }
];

const roadmap = [
  { title: "Expanded Africa deployment", detail: "Scale country pathways with realistic infrastructure, training and support assumptions.", icon: "globe" as IconKey },
  { title: "Community hub growth", detail: "Support more shared-access spaces for learning, work and local participation.", icon: "building" as IconKey },
  { title: "School lab expansion", detail: "Create more timetable-ready labs with asset tagging and support ownership.", icon: "school" as IconKey },
  { title: "AI literacy scaling", detail: "Pair refurbished devices with practical, responsible AI learning pathways.", icon: "sparkles" as IconKey },
  { title: "Workforce enablement", detail: "Support SMEs, NGOs, youth and community members with work-ready access.", icon: "business" as IconKey },
  { title: "Circular technology expansion", detail: "Grow repair, recovery, trade-in, recycling and sustainability reporting together.", icon: "recycle" as IconKey },
  { title: "Repair ecosystem development", detail: "Build technician, parts and aftercare capacity around deployed devices.", icon: "wrench" as IconKey }
];

export default function ImpactPage() {
  return (
    <main>
      <ImpactHero />
      <LiveImpactDashboard />
      <RegionalImpactMap />
      <HumanImpactStories />
      <EducationWorkforceOutcomes />
      <SustainabilityImpact />
      <CommunityNgoEnablement />
      <CorporateCsrImpact />
      <LifecycleIntelligence />
      <ImpactTrust />
      <FutureGrowthVision />
      <FinalCta />
    </main>
  );
}

function ImpactHero() {
  return (
    <section className="overflow-hidden bg-ink px-4 py-20 text-white sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <AnimatedSection>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-flame-300">
            Impact intelligence and digital inclusion
          </p>
          <h1 className="mt-5 max-w-5xl text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
            Measuring digital access through learning, work and sustainability impact
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-white/72 sm:text-lg">
            SIT Digital Access combines refurbished technology, digital skills, sustainability and
            deployment operations into measurable social and environmental outcomes across schools,
            communities, NGOs and businesses.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/donate">Sponsor impact</ButtonLink>
            <ButtonLink href="/csr-partnerships" variant="secondary">Partner with us</ButtonLink>
          </div>
          <div className="mt-8 flex flex-wrap gap-2">
            {["ESG-ready reporting", "Circular technology model", "Africa deployment partnerships", "Education-first access", "Community enablement"].map((badge) => (
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
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-flame-600">Impact pathway</p>
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

function LiveImpactDashboard() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Live impact dashboard"
            title="Impact indicators for social, education and sustainability outcomes."
            description="The dashboard combines public-safe metrics with deployment, learning, circularity and sponsorship signals that can later connect to live operational records."
          />
        </AnimatedSection>
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {dashboardMetrics.map((metric, index) => (
            <AnimatedSection key={metric.label} delay={index * 0.025}>
              <MetricTile metric={metric} />
            </AnimatedSection>
          ))}
        </div>
        <AnimatedSection delay={0.12}>
          <div className="mt-8 grid gap-4 rounded-lg border border-line bg-white p-5 shadow-card lg:grid-cols-[1fr_1fr_1fr]">
            <MiniChart title="Deployment trend" values={[36, 52, 58, 68, 76, 82]} />
            <MiniChart title="Education access growth" values={[24, 40, 48, 61, 74, 84]} />
            <MiniChart title="Circular reuse signal" values={[42, 50, 63, 70, 78, 86]} />
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

function RegionalImpactMap() {
  return (
    <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Regional impact map"
            title="Africa deployment visibility with practical readiness signals."
            description="Country panels show the kinds of conditions that shape impact: devices, labs, hubs, learners, NGO partnerships, training programmes, connectivity and support readiness."
          />
        </AnimatedSection>
        <AnimatedSection delay={0.08}>
          <div className="mt-8 flex flex-wrap gap-2 rounded-lg border border-line bg-paper p-4">
            {mapFilters.map((filter) => (
              <span key={filter} className="rounded-full border border-line bg-white px-3 py-2 text-xs font-semibold text-muted">
                {filter}
              </span>
            ))}
          </div>
        </AnimatedSection>
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
          {regionalImpact.map((region, index) => (
            <AnimatedSection key={region.country} delay={index * 0.04}>
              <article className="h-full rounded-lg border border-line bg-paper p-5 shadow-card transition hover:-translate-y-1 hover:bg-white hover:shadow-soft">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-flame-600">{region.phase}</p>
                    <h3 className="mt-2 text-xl font-semibold text-ink">{region.country}</h3>
                  </div>
                  <span className="text-2xl font-semibold text-flame-600">{region.readiness}%</span>
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-white">
                  <div className="h-full rounded-full bg-flame-500" style={{ width: `${region.readiness}%` }} />
                </div>
                <div className="mt-5 grid gap-2 text-sm leading-6 text-muted">
                  <p><strong className="text-ink">Devices:</strong> {region.devices}</p>
                  <p><strong className="text-ink">Labs:</strong> {region.labs}</p>
                  <p><strong className="text-ink">Hubs:</strong> {region.hubs}</p>
                  <p><strong className="text-ink">Learners:</strong> {region.learners}</p>
                  <p><strong className="text-ink">NGO partnerships:</strong> {region.partners}</p>
                  <p><strong className="text-ink">Training:</strong> {region.training}</p>
                  <p><strong className="text-ink">Connectivity:</strong> {region.connectivity}</p>
                  <p><strong className="text-ink">Support:</strong> {region.support}</p>
                </div>
              </article>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

function HumanImpactStories() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Human impact stories"
            title="The outcomes behind the numbers."
            description="Impact is strongest when metrics are connected to real pathways: learners, schools, NGOs, businesses, hubs, teachers, AI literacy and workforce readiness."
          />
        </AnimatedSection>
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {stories.map((story, index) => (
            <AnimatedSection key={story.title} delay={index * 0.035}>
              <article className="flex h-full flex-col rounded-lg border border-line bg-white p-5 shadow-card transition hover:-translate-y-1 hover:shadow-soft">
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-ink px-3 py-1 text-xs font-semibold text-white">{story.category}</span>
                  <span className="rounded-full border border-line bg-paper px-3 py-1 text-xs font-semibold text-muted">{story.region}</span>
                </div>
                <h3 className="mt-5 text-xl font-semibold text-ink">{story.title}</h3>
                <div className="mt-4 grid gap-2 text-xs font-semibold text-muted">
                  <span>{story.devices}</span>
                  <span>{story.outcome}</span>
                  <span>{story.sustainability}</span>
                </div>
                <div className="mt-5 grid gap-3 rounded-lg bg-paper p-4">
                  <p className="text-sm leading-6 text-muted"><strong className="text-ink">Before:</strong> {story.before}</p>
                  <p className="text-sm leading-6 text-muted"><strong className="text-ink">After:</strong> {story.after}</p>
                </div>
                <p className="mt-4 text-sm leading-6 text-muted">{story.quote}</p>
                <ButtonLink href={story.href} variant="ghost" className="mt-auto self-start px-0">
                  View story route
                </ButtonLink>
              </article>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

function EducationWorkforceOutcomes() {
  return (
    <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
          <AnimatedSection>
            <SectionHeading
              eyebrow="Education and workforce outcomes"
              title="Technology access creates measurable opportunity."
              description="Devices create impact when they are paired with practical learning pathways, confidence, support and community ownership."
            />
            <div className="mt-6 rounded-lg border border-flame-100 bg-flame-50 p-5">
              <p className="text-sm font-semibold text-flame-800">Powered by SIT Learning</p>
              <p className="mt-2 text-sm leading-6 text-flame-800/80">
                Training pathways connect device access with digital literacy, AI literacy, cybersecurity awareness, employability and teacher enablement.
              </p>
            </div>
            <ButtonLink href="/programmes" className="mt-6">Explore training pathways</ButtonLink>
          </AnimatedSection>
          <div className="grid gap-4 md:grid-cols-2">
            {learningOutcomes.map((feature, index) => (
              <AnimatedSection key={feature.title} delay={index * 0.03}>
                <FeatureTile feature={feature} />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function SustainabilityImpact() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Sustainability and circular impact"
            title="Digital inclusion and sustainability can scale together."
            description="Refurbished technology supports access while reducing waste, extending useful life and creating ESG-ready evidence."
          />
        </AnimatedSection>
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {sustainabilityMetrics.map((metric, index) => (
            <AnimatedSection key={metric.label} delay={index * 0.03}>
              <MetricTile metric={metric} />
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

function CommunityNgoEnablement() {
  return (
    <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Community and NGO enablement"
            title="Impact reaches beyond devices into local operating capacity."
            description="Refurbished technology can equip classrooms, hubs, NGO teams, women and youth programmes, rural access routes and innovation spaces."
          />
        </AnimatedSection>
        <CardGrid features={communityEnablement} />
      </div>
    </section>
  );
}

function CorporateCsrImpact() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Corporate and CSR impact"
            title="Designed for measurable CSR and ESG outcomes."
            description="Corporate technology refresh cycles can become recycling impact, sponsorship outcomes, skills enablement, deployment reach and sustainability reporting."
          />
        </AnimatedSection>
        <CardGrid features={csrCards} />
      </div>
    </section>
  );
}

function LifecycleIntelligence() {
  return (
    <section className="bg-ink px-4 py-20 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase text-flame-300">Lifecycle and sustainability intelligence</p>
            <h2 className="text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-5xl">
              Impact is stronger when device history, repair, recycling and deployment are connected.
            </h2>
            <p className="mt-4 text-base leading-7 text-white/70 sm:text-lg">
              The same circular lifecycle can connect devices marketplace, repairs, recycling, sustainability and deployment intelligence.
            </p>
          </div>
        </AnimatedSection>
        <AnimatedSection delay={0.08}>
          <div className="mt-10 rounded-lg border border-white/10 bg-white/[0.07] p-5">
            <div className="flex flex-wrap gap-2">
              {lifecycleFlow.map((step, index) => (
                <span key={step} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.08] px-3 py-2 text-xs font-semibold text-white/78">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-flame-500 text-[10px] text-white">
                    {index + 1}
                  </span>
                  {step}
                </span>
              ))}
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/device-lifecycle">View lifecycle</ButtonLink>
              <ButtonLink href="/repairs" variant="secondary">Repairs</ButtonLink>
              <ButtonLink href="/device-recycling" variant="secondary">Recycling</ButtonLink>
              <ButtonLink href="/sustainability" variant="secondary">Sustainability</ButtonLink>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

function ImpactTrust() {
  return (
    <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Impact transparency and trust"
            title="Public impact needs credible operational proof points."
            description="Trust is built through traceable devices, secure handling, support records, deployment reporting, sustainability metrics and readiness assumptions."
          />
        </AnimatedSection>
        <CardGrid features={trustCards} />
      </div>
    </section>
  );
}

function FutureGrowthVision() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Future growth vision"
            title="A roadmap for scaling digital inclusion with circular technology."
            description="The next layer of impact comes from deeper Africa deployment, more hubs and labs, skills pathways, repair ecosystems and circular recovery capacity."
          />
        </AnimatedSection>
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-7">
          {roadmap.map((item, index) => (
            <AnimatedSection key={item.title} delay={index * 0.035}>
              <article className="h-full rounded-lg border border-line bg-white p-5 shadow-card transition hover:-translate-y-1 hover:shadow-soft">
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-flame-500 text-white">
                  <Icon name={item.icon} className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-lg font-semibold text-ink">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted">{item.detail}</p>
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
              Help expand affordable technology access with measurable impact.
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-7 text-white/70">
              Request devices, sponsor learner access, partner with SIT Digital Access or explore Africa deployment pathways.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <ButtonLink href="/devices">Request devices</ButtonLink>
            <ButtonLink href="/donate" variant="secondary">Sponsor a learner</ButtonLink>
            <ButtonLink href="/csr-partnerships" variant="secondary">Partner with SIT Digital Access</ButtonLink>
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

function MiniChart({ title, values }: { title: string; values: number[] }) {
  return (
    <div className="rounded-lg bg-paper p-4">
      <p className="text-sm font-semibold text-ink">{title}</p>
      <div className="mt-4 flex h-28 items-end gap-2">
        {values.map((value, index) => (
          <div key={`${title}-${index}`} className="flex flex-1 flex-col items-center gap-2">
            <div className="w-full rounded-t-lg bg-flame-500" style={{ height: `${value}%` }} />
            <span className="text-[10px] font-semibold text-muted">{index + 1}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

