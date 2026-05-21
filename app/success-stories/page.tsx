import type { Metadata } from "next";
import { AnimatedSection } from "@/components/animated-section";
import { ButtonLink } from "@/components/button-link";
import { Icon, type IconKey } from "@/components/icons";
import { SectionHeading } from "@/components/section-heading";
import { impactStats } from "@/lib/content";
import { successStories as ecosystemStories } from "@/lib/ecosystem-content";

export const metadata: Metadata = {
  title: "Impact Storytelling & Transformation",
  description:
    "Human-centred success stories showing how SIT Digital Access connects refurbished technology, digital skills, sustainability and Africa deployment pathways."
};

type Metric = {
  label: string;
  value: string;
  detail: string;
  icon: IconKey;
  progress: number;
};

type Story = {
  title: string;
  category: string;
  region: string;
  devices: string;
  people: string;
  sustainability: string;
  deploymentType: string;
  before: string;
  after: string;
  teaser: string;
  quote: string;
  icon: IconKey;
  href: string;
};

type Feature = {
  title: string;
  description: string;
  icon: IconKey;
  metadata?: string;
  href?: string;
};

type Region = {
  country: string;
  phase: string;
  score: number;
  stories: string[];
  focus: string;
  icon: IconKey;
};

const stat = (label: string, fallback: string) => impactStats.find((item) => item.label === label)?.value ?? fallback;
const statDetail = (label: string, fallback: string) => impactStats.find((item) => item.label === label)?.detail ?? fallback;

const heroMetrics: Metric[] = [
  {
    label: "Devices deployed",
    value: stat("Devices deployed", "500+"),
    detail: statDetail("Devices deployed", "Target for refurbished devices"),
    icon: "laptop",
    progress: 78
  },
  {
    label: "Learners reached",
    value: stat("Learners reached", "1,500+"),
    detail: statDetail("Learners reached", "Through access and training"),
    icon: "graduation",
    progress: 82
  },
  {
    label: "Community hubs enabled",
    value: "Hub routes",
    detail: "Shared access and local learning pathways",
    icon: "building",
    progress: 60
  },
  {
    label: "Schools supported",
    value: stat("Schools supported", "10+"),
    detail: statDetail("Schools supported", "Labs and learner access"),
    icon: "school",
    progress: 68
  },
  {
    label: "CO2 avoided",
    value: stat("CO2 saved through reuse", "25t"),
    detail: statDetail("CO2 saved through reuse", "Estimated circular impact"),
    icon: "leaf",
    progress: 72
  },
  {
    label: "Countries reached",
    value: stat("Countries served", "5+"),
    detail: "UK and Africa deployment pathways",
    icon: "globe",
    progress: 64
  }
];

const heroFlow = ["Recover", "Refurbish", "Deploy", "Learn", "Grow", "Impact"];
const impactJourney = ["Device recovery", "Refurbishment", "Deployment", "Learning", "Employment", "Community impact"];
const storyArchitecture = ["Challenge", "Access", "Deployment", "Learning", "Support", "Outcome", "Impact"];
const storyFilters = [
  "Learners",
  "Schools",
  "NGOs",
  "Community hubs",
  "Businesses",
  "CSR partnerships",
  "Africa deployments",
  "Women and youth empowerment",
  "AI literacy",
  "Workforce enablement"
];
const regionFilters = ["UK", "Liberia", "Ghana", "Sierra Leone", "Nigeria", "Wider Africa"];
const impactFilters = ["Education", "Sustainability", "Workforce", "Community", "ESG", "Circular reuse"];

const featuredStories: Story[] = [
  {
    title: "Learner transformation",
    category: "Learner",
    region: "UK and Africa",
    devices: "1 device reused",
    people: "40+ study hours enabled",
    sustainability: "One laptop kept in productive use",
    deploymentType: "Sponsored learner access",
    before: "Before digital access, learning depended on borrowed screens and short windows of availability.",
    after: "After deployment, a configured laptop creates private study time, confidence and a route into digital skills.",
    teaser: "A single refurbished laptop can turn occasional access into a steady learning rhythm.",
    quote: "Reliable access changes the shape of what a learner can practise, submit and imagine.",
    icon: "graduation",
    href: "/donate"
  },
  {
    title: "School lab deployment",
    category: "School",
    region: "School deployment",
    devices: "24-seat lab model",
    people: "Class rotation ready",
    sustainability: "Reusable devices prepared as a teaching asset",
    deploymentType: "School lab",
    before: "Before deployment, digital lessons relied on inconsistent access and shared devices.",
    after: "After deployment, a planned lab supports timetabled lessons, teacher enablement and practical coursework.",
    teaser: "A lab bundle can help a school move from ad hoc ICT access to a repeatable classroom model.",
    quote: "A school lab is not just hardware; it is predictable access.",
    icon: "school",
    href: "/schools"
  },
  {
    title: "Community hub launch",
    category: "Community hub",
    region: "Community access",
    devices: "10-24 shared devices",
    people: "Learners, job seekers and local groups",
    sustainability: "Shared-use model increases device value",
    deploymentType: "Community digital hub",
    before: "Before the hub, digital participation happened in fragments across phones, libraries and borrowed devices.",
    after: "After launch, a trusted space can support job search, guided learning and community confidence.",
    teaser: "Shared access multiplies the impact of each refurbished device.",
    quote: "A community hub turns devices into a place where people can return, learn and grow.",
    icon: "building",
    href: "/community-hubs"
  },
  {
    title: "NGO workforce enablement",
    category: "NGO",
    region: "Mission operations",
    devices: "Business laptop bundles",
    people: "Staff and volunteer teams",
    sustainability: "Refurbished procurement instead of new hardware",
    deploymentType: "NGO field office",
    before: "Before standardisation, mixed devices slowed reporting, coordination and cloud adoption.",
    after: "After the refresh, teams can work from shared systems with clearer asset records and support routes.",
    teaser: "Mission-led teams need practical technology that makes delivery easier.",
    quote: "Better devices give field teams more time for people and less time wrestling with systems.",
    icon: "business",
    href: "/businesses-ngos"
  },
  {
    title: "CSR partnership impact",
    category: "CSR",
    region: "Corporate refresh",
    devices: "Collection and reuse pipeline",
    people: "Schools, hubs and learners",
    sustainability: "Secure reuse, circularity and ESG evidence",
    deploymentType: "Corporate reuse partnership",
    before: "Before circular recovery, retired technology risked becoming waste or sitting unused.",
    after: "After collection, devices can be wiped, triaged, refurbished and routed into measurable access.",
    teaser: "Corporate refresh cycles can become visible digital inclusion infrastructure.",
    quote: "CSR becomes stronger when the outcome is traceable, reusable and human.",
    icon: "handshake",
    href: "/csr-partnerships"
  },
  {
    title: "AI literacy access",
    category: "Skills",
    region: "SIT Learning",
    devices: "Training-ready laptops",
    people: "Learner and educator cohorts",
    sustainability: "Higher-spec reused devices support modern learning",
    deploymentType: "AI literacy pathway",
    before: "Before hands-on access, AI literacy can feel distant, abstract or intimidating.",
    after: "After device-enabled learning, responsible AI becomes something people can practise safely.",
    teaser: "Modern digital confidence grows when access and training arrive together.",
    quote: "AI literacy should be practical, responsible and reachable.",
    icon: "sparkles",
    href: "/programmes"
  }
];

const humanStories: Story[] = [
  ...featuredStories,
  {
    title: "Women entrepreneurship access",
    category: "Women and youth",
    region: "Community enterprise",
    devices: "Shared laptops and hub devices",
    people: "Entrepreneurs and learners",
    sustainability: "Shared access expands the useful life of each device",
    deploymentType: "Community hub pathway",
    before: "Before access, business tasks, applications and learning depended on mobile-first workarounds.",
    after: "After deployment, a hub can support documents, training, market access and confidence.",
    teaser: "Device access can be a quiet foundation for local enterprise.",
    quote: "A laptop can become a workspace when the community around it is ready.",
    icon: "heart",
    href: "/community-hubs"
  },
  {
    title: "Workforce readiness",
    category: "Workforce",
    region: "Youth and adult learning",
    devices: "Learner cohort devices",
    people: "Job seekers and early-career learners",
    sustainability: "Circular devices support economic participation",
    deploymentType: "Skills cohort",
    before: "Before access, applications, CVs and online training were difficult to complete consistently.",
    after: "After deployment, learners can practise productivity tools, cloud collaboration and digital portfolios.",
    teaser: "Work readiness needs more than motivation; it needs practical access.",
    quote: "Digital confidence grows when people can practise every week.",
    icon: "business",
    href: "/programmes"
  }
];

const communityTransformation: Feature[] = [
  {
    title: "Rural digital inclusion",
    description: "Offline-first learning, low-power devices and shared-access planning for sites where infrastructure is uneven.",
    icon: "globe",
    metadata: "Africa pathways",
    href: "/deployment-map"
  },
  {
    title: "Community hub access",
    description: "Local organisations can host trusted spaces for learning, job search, enterprise and digital confidence.",
    icon: "building",
    metadata: "Shared access",
    href: "/community-hubs"
  },
  {
    title: "School lab transformation",
    description: "Refurbished devices can become timetable-ready labs with teacher support, asset records and maintenance routes.",
    icon: "school",
    metadata: "Education",
    href: "/schools"
  },
  {
    title: "Youth empowerment",
    description: "Learner devices and practical skills pathways can support coursework, portfolios and employability.",
    icon: "graduation",
    metadata: "Skills",
    href: "/programmes"
  },
  {
    title: "Teacher enablement",
    description: "Teacher access multiplies the value of classroom devices by strengthening preparation and digital delivery.",
    icon: "book",
    metadata: "SIT Learning",
    href: "/programmes"
  },
  {
    title: "NGO operations support",
    description: "Standardised devices, cloud setup and support records help mission-led teams run programmes more reliably.",
    icon: "business",
    metadata: "Operations",
    href: "/businesses-ngos"
  }
];

const sustainabilityStories: Metric[] = [
  { label: "Devices reused", value: stat("Devices deployed", "500+"), detail: "Prepared for learning, work and community access", icon: "recycle", progress: 78 },
  { label: "Repair-first philosophy", value: "Repair first", detail: "Extend useful life before replacement or recycling", icon: "wrench", progress: 82 },
  { label: "CO2 avoided", value: stat("CO2 saved through reuse", "25t"), detail: "Estimated circular technology impact", icon: "leaf", progress: 72 },
  { label: "Devices diverted", value: "Reuse route", detail: "Recover useful equipment before disposal", icon: "package", progress: 76 },
  { label: "Circularity score", value: "Reuse-first", detail: "Refurbish and redeploy before final recycling", icon: "chart", progress: 86 },
  { label: "Community reuse", value: "Shared access", detail: "One device can support many journeys through hubs and labs", icon: "users", progress: 70 }
];

const africaRegions: Region[] = [
  {
    country: "Liberia",
    phase: "Planning",
    score: 72,
    stories: ["School labs", "Vocational learning", "Community access"],
    focus: "Low-power labs, teacher enablement and donor-backed learning routes.",
    icon: "school"
  },
  {
    country: "Ghana",
    phase: "Active pathways",
    score: 78,
    stories: ["Community hubs", "NGO support", "AI literacy"],
    focus: "Urban and regional deployments with partner and training pathways.",
    icon: "building"
  },
  {
    country: "Sierra Leone",
    phase: "Partner onboarding",
    score: 66,
    stories: ["Offline learning", "Rural access", "Shared devices"],
    focus: "Connectivity-aware planning and maintenance ownership.",
    icon: "offline"
  },
  {
    country: "Nigeria",
    phase: "Expansion",
    score: 74,
    stories: ["Workforce enablement", "Innovation hubs", "NGO operations"],
    focus: "Business, youth and community deployment pathways.",
    icon: "network"
  },
  {
    country: "Wider Africa",
    phase: "Scaling model",
    score: 64,
    stories: ["CSR deployments", "School sponsorship", "Community hubs"],
    focus: "Repeatable partnership models for realistic local support.",
    icon: "globe"
  }
];

const csrStories: Feature[] = [
  {
    title: "Corporate recycling partnerships",
    description: "Retired devices can become secure recovery, reuse and ESG evidence instead of dormant assets.",
    icon: "recycle",
    metadata: "Circular recovery",
    href: "/device-recycling"
  },
  {
    title: "Device sponsorship",
    description: "Sponsor learner devices, classroom bundles, school labs or community hub kits with visible outcomes.",
    icon: "heart",
    metadata: "Sponsorship",
    href: "/donate"
  },
  {
    title: "School sponsorship",
    description: "Help a school move from occasional digital access to structured lab-based learning.",
    icon: "school",
    metadata: "Education",
    href: "/csr-partnerships"
  },
  {
    title: "ESG reporting outcomes",
    description: "Connect secure wipe, circularity, deployment and community evidence into sponsor-ready narratives.",
    icon: "leaf",
    metadata: "ESG",
    href: "/sustainability"
  },
  {
    title: "Community enablement",
    description: "Support hubs, libraries, charities and youth groups with practical shared access pathways.",
    icon: "users",
    metadata: "Community",
    href: "/community-hubs"
  },
  {
    title: "Digital skills pathways",
    description: "Pair devices with digital literacy, cybersecurity, AI literacy and workforce readiness.",
    icon: "graduation",
    metadata: "SIT Learning",
    href: "/programmes"
  }
];

const timeline = [
  { title: "Device recovery", description: "Devices are donated, traded in, collected or recovered from organisational refresh cycles.", icon: "truck" as IconKey },
  { title: "Repair and refurbishment", description: "Useful hardware is wiped, inspected, repaired, upgraded, graded and prepared for reuse.", icon: "wrench" as IconKey },
  { title: "Deployment", description: "Devices route into schools, hubs, NGOs, businesses, cohorts and Africa deployment pathways.", icon: "globe" as IconKey },
  { title: "Training", description: "SIT Learning pathways build confidence, skills and responsible digital participation.", icon: "graduation" as IconKey },
  { title: "Support", description: "Repair, lifecycle and helpdesk routes protect the long-term usefulness of every deployment.", icon: "headset" as IconKey },
  { title: "Community adoption", description: "Access becomes routine through learners, teachers, staff, volunteers and local champions.", icon: "users" as IconKey },
  { title: "Sustainability impact", description: "Reuse, repair and circular recovery reduce waste while expanding opportunity.", icon: "leaf" as IconKey }
];

const integrations: Feature[] = [
  { title: "Devices marketplace", description: "Story metrics connect back to prepared laptops, desktops, mini PCs and bundles.", icon: "laptop", href: "/devices" },
  { title: "Sustainability", description: "Circular outcomes become reusable ESG and public impact narratives.", icon: "leaf", href: "/sustainability" },
  { title: "Deployment map", description: "Regional stories show country pathways, readiness and support assumptions.", icon: "map", href: "/deployment-map" },
  { title: "Community hubs", description: "Shared access stories connect to hub packages and community deployment routes.", icon: "building", href: "/community-hubs" },
  { title: "CSR partnerships", description: "Sponsor stories connect enterprise giving to measurable social impact.", icon: "handshake", href: "/csr-partnerships" },
  { title: "Training programmes", description: "Story outcomes connect to digital literacy, AI literacy and workforce readiness.", icon: "book", href: "/programmes" },
  { title: "Impact dashboard", description: "Narratives sit beside public metrics for reach, training and circularity.", icon: "chart", href: "/impact" },
  { title: "Device lifecycle", description: "Stories show how recovery, repair, reuse, support and recycling become one system.", icon: "database", href: "/device-lifecycle" }
];

export default function SuccessStoriesPage() {
  return (
    <main>
      <StoryHero />
      <FeaturedStoriesSection />
      <StoryCollectionsSection />
      <HumanStoryCards />
      <ImpactJourneySection />
      <CommunityTransformationSection />
      <SustainabilityStorySection />
      <AfricaStoriesSection />
      <CsrStoriesSection />
      <StoryTimelineSection />
      <LiveImpactIntegrationSection />
      <FinalCtaSection />
    </main>
  );
}

function StoryHero() {
  return (
    <section className="overflow-hidden bg-ink px-4 py-20 text-white sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
        <AnimatedSection>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-flame-300">
            Impact storytelling and transformation
          </p>
          <h1 className="mt-5 max-w-5xl text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
            Stories of digital access, learning and measurable impact
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-white/72 sm:text-lg">
            Explore how refurbished technology, digital skills and community deployment pathways create real opportunities for learners, schools, NGOs, businesses and underserved communities.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="#featured-stories">Read featured stories</ButtonLink>
            <ButtonLink href="/impact" variant="secondary">View impact</ButtonLink>
          </div>
          <div className="mt-8 flex flex-wrap gap-2">
            {[
              "Real-world deployment pathways",
              "Community-first access",
              "Circular technology model",
              "Africa deployment ecosystem",
              "ESG-ready impact reporting"
            ].map((badge) => (
              <span key={badge} className="rounded-full border border-white/12 bg-white/[0.08] px-3 py-2 text-xs font-semibold text-white/78">
                {badge}
              </span>
            ))}
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.12}>
          <div className="rounded-lg border border-white/10 bg-white/[0.07] p-5 shadow-soft">
            <div className="rounded-lg bg-gradient-to-br from-flame-500 via-flame-400 to-white p-[1px]">
              <div className="rounded-lg bg-ink p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-flame-200">Story arc</p>
                <div className="mt-5 grid gap-2">
                  {heroFlow.map((step, index) => (
                    <div key={step} className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.06] p-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-flame-500 text-xs font-semibold text-white">
                        {index + 1}
                      </span>
                      <span className="text-sm font-semibold text-white">{step}</span>
                      <div className="ml-auto h-2 w-20 overflow-hidden rounded-full bg-white/10">
                        <div className="h-full rounded-full bg-flame-300" style={{ width: `${55 + index * 7}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {heroMetrics.map((metric) => (
                <DarkMetric key={metric.label} metric={metric} />
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

function FeaturedStoriesSection() {
  return (
    <section id="featured-stories" className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Featured impact stories"
            title="Editorial proof for the wider digital access ecosystem."
            description="Featured stories show the human arc behind refurbished technology: region, devices reused, people supported, sustainability contribution, story teaser and quote."
          />
        </AnimatedSection>
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {featuredStories.map((story, index) => (
            <AnimatedSection key={story.title} delay={index * 0.04} className={index === 0 ? "lg:col-span-2 lg:row-span-2" : undefined}>
              <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-line bg-white shadow-card transition hover:-translate-y-1 hover:shadow-soft">
                <div className="relative min-h-56 bg-ink p-6 text-white">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(249,115,22,0.34),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.08),transparent)]" />
                  <div className="relative z-10 flex h-full min-h-44 flex-col justify-between">
                    <div className="flex items-center justify-between gap-4">
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-ink">{story.category}</span>
                      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-flame-500 text-white">
                        <Icon name={story.icon} className="h-5 w-5" />
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-flame-200">{story.region}</p>
                      <h3 className={index === 0 ? "mt-2 text-3xl font-semibold" : "mt-2 text-2xl font-semibold"}>{story.title}</h3>
                    </div>
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="grid gap-2 text-xs font-semibold text-muted sm:grid-cols-3">
                    <span>{story.devices}</span>
                    <span>{story.people}</span>
                    <span>{story.sustainability}</span>
                  </div>
                  <p className="mt-5 text-base leading-7 text-muted">{story.teaser}</p>
                  <blockquote className="mt-5 border-l-4 border-flame-500 pl-4 text-sm font-semibold leading-6 text-ink">
                    {story.quote}
                  </blockquote>
                  <ButtonLink href={story.href} variant="ghost" className="mt-auto self-start px-0">
                    Follow story pathway
                  </ButtonLink>
                </div>
              </article>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

function StoryCollectionsSection() {
  return (
    <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
          <AnimatedSection>
            <SectionHeading
              eyebrow="Story collections"
              title="Browse by people, place, impact and sustainability."
              description="The public story library is structured for future filtering by audience, region, impact theme and circular technology outcomes."
            />
            <div className="mt-6 flex rounded-full border border-line bg-paper p-1 text-xs font-semibold text-muted">
              <span className="rounded-full bg-ink px-4 py-2 text-white">Grid</span>
              <span className="px-4 py-2">List</span>
            </div>
          </AnimatedSection>
          <AnimatedSection delay={0.08}>
            <div className="rounded-lg border border-line bg-paper p-5 shadow-card">
              <FilterRow title="Impact categories" items={storyFilters} />
              <FilterRow title="Regions" items={regionFilters} />
              <FilterRow title="Story lenses" items={impactFilters} />
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {ecosystemStories.slice(0, 3).map((story) => (
                  <div key={story.title} className="rounded-lg border border-line bg-white p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-flame-600">{story.category}</p>
                    <h3 className="mt-2 text-base font-semibold text-ink">{story.title}</h3>
                    <p className="mt-2 text-xs leading-5 text-muted">{story.metrics.join(" · ")}</p>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}

function HumanStoryCards() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Human-centred stories"
            title="Before digital access. After deployment. The human middle matters."
            description="Each story is designed to connect emotion with evidence: category, region, devices, people reached, sustainability impact, deployment type, before/after and quote."
          />
        </AnimatedSection>
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {humanStories.map((story, index) => (
            <AnimatedSection key={story.title} delay={index * 0.03}>
              <article className="flex h-full flex-col rounded-lg border border-line bg-white p-5 shadow-card transition hover:-translate-y-1 hover:shadow-soft">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-flame-600">{story.category}</p>
                    <h3 className="mt-2 text-xl font-semibold text-ink">{story.title}</h3>
                  </div>
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-flame-500 text-white">
                    <Icon name={story.icon} className="h-5 w-5" />
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {[story.region, story.devices, story.people].map((item) => (
                    <span key={`${story.title}-${item}`} className="rounded-full bg-paper px-3 py-1 text-xs font-semibold text-muted">
                      {item}
                    </span>
                  ))}
                </div>
                <div className="mt-5 grid gap-3 rounded-lg bg-paper p-4">
                  <p className="text-sm leading-6 text-muted"><strong className="text-ink">Before digital access:</strong> {story.before.replace("Before ", "")}</p>
                  <p className="text-sm leading-6 text-muted"><strong className="text-ink">After deployment:</strong> {story.after.replace("After ", "")}</p>
                </div>
                <p className="mt-4 text-sm leading-6 text-muted">{story.quote}</p>
                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.12em] text-flame-700">{story.deploymentType}</p>
                <ButtonLink href={story.href} variant="ghost" className="mt-auto self-start px-0">
                  Continue pathway
                </ButtonLink>
              </article>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

function ImpactJourneySection() {
  return (
    <section className="bg-ink px-4 py-20 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase text-flame-300">Impact journeys</p>
            <h2 className="text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-5xl">
              Every deployment creates a wider impact journey.
            </h2>
            <p className="mt-4 text-base leading-7 text-white/70 sm:text-lg">
              The strongest stories connect device recovery, refurbishment, deployment, learning, employment and community impact into one visible arc.
            </p>
          </div>
        </AnimatedSection>
        <AnimatedSection delay={0.08}>
          <div className="mt-10 rounded-lg border border-white/10 bg-white/[0.07] p-5">
            <div className="grid gap-3 md:grid-cols-6">
              {impactJourney.map((step, index) => (
                <div key={step} className="relative rounded-lg border border-white/10 bg-black/24 p-4">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-flame-500 text-xs font-semibold text-white">
                    {index + 1}
                  </span>
                  <h3 className="mt-4 text-sm font-semibold text-white">{step}</h3>
                  <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-flame-300" style={{ width: `${54 + index * 8}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {storyArchitecture.map((step) => (
                <span key={step} className="rounded-full border border-white/10 bg-white/[0.08] px-3 py-2 text-xs font-semibold text-white/78">
                  {step}
                </span>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

function CommunityTransformationSection() {
  return (
    <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Community transformation stories"
            title="Digital inclusion is most powerful when it becomes local routine."
            description="Stories can show rural digital inclusion, community hub access, school lab transformation, youth empowerment, women entrepreneurship, workforce readiness, teacher enablement and NGO operations support."
          />
        </AnimatedSection>
        <FeatureGrid features={communityTransformation} />
      </div>
    </section>
  );
}

function SustainabilityStorySection() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Sustainability and circular impact"
            title="Every reused device reduces waste while expanding opportunity."
            description="Success stories should make circular technology human: devices reused, repair-first thinking, CO2 avoided, devices diverted from landfill, circularity and community reuse."
          />
        </AnimatedSection>
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {sustainabilityStories.map((metric, index) => (
            <AnimatedSection key={metric.label} delay={index * 0.03}>
              <MetricTile metric={metric} />
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

function AfricaStoriesSection() {
  return (
    <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Africa deployment stories"
            title="Regional stories connect ambition to deployment reality."
            description="Country story panels show deployment pathways, community hubs, school labs, NGO partnerships, workforce enablement and AI literacy programmes."
          />
        </AnimatedSection>
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
          {africaRegions.map((region, index) => (
            <AnimatedSection key={region.country} delay={index * 0.04}>
              <article className="h-full rounded-lg border border-line bg-paper p-5 shadow-card transition hover:-translate-y-1 hover:bg-white hover:shadow-soft">
                <div className="flex items-start justify-between gap-4">
                  <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-flame-500 text-white">
                    <Icon name={region.icon} className="h-5 w-5" />
                  </span>
                  <span className="text-2xl font-semibold text-flame-600">{region.score}%</span>
                </div>
                <p className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-flame-600">{region.phase}</p>
                <h3 className="mt-2 text-xl font-semibold text-ink">{region.country}</h3>
                <p className="mt-3 text-sm leading-6 text-muted">{region.focus}</p>
                <div className="mt-5 h-2 overflow-hidden rounded-full bg-white">
                  <div className="h-full rounded-full bg-flame-500" style={{ width: `${region.score}%` }} />
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  {region.stories.map((story) => (
                    <span key={`${region.country}-${story}`} className="rounded-full border border-line bg-white px-3 py-1 text-xs font-semibold text-muted">
                      {story}
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

function CsrStoriesSection() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Corporate and CSR impact stories"
            title="CSR can become measurable digital access infrastructure."
            description="Enterprise-ready stories connect corporate recycling, device sponsorship, school sponsorship, ESG reporting, community enablement and digital skills pathways."
          />
        </AnimatedSection>
        <FeatureGrid features={csrStories} />
      </div>
    </section>
  );
}

function StoryTimelineSection() {
  return (
    <section className="bg-ink px-4 py-20 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase text-flame-300">Story timeline and milestones</p>
            <h2 className="text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-5xl">
              Milestones turn a donation or deployment into a documented transformation story.
            </h2>
            <p className="mt-4 text-base leading-7 text-white/70 sm:text-lg">
              Every strong public story has operational proof behind it: recovery, refurbishment, deployment, training, support, adoption and sustainability impact.
            </p>
          </div>
        </AnimatedSection>
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-7">
          {timeline.map((step, index) => (
            <AnimatedSection key={step.title} delay={index * 0.035}>
              <article className="h-full rounded-lg border border-white/10 bg-white/[0.07] p-5">
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-flame-500 text-white">
                  <Icon name={step.icon} className="h-5 w-5" />
                </span>
                <p className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-white/54">Milestone {index + 1}</p>
                <h3 className="mt-2 text-lg font-semibold text-white">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/68">{step.description}</p>
              </article>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

function LiveImpactIntegrationSection() {
  return (
    <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Live impact integration"
            title="Stories should point back into the operating system."
            description="Success stories connect directly into the devices marketplace, sustainability, deployment map, community hubs, CSR partnerships, training programmes, impact dashboard and device lifecycle intelligence."
          />
        </AnimatedSection>
        <FeatureGrid features={integrations} />
      </div>
    </section>
  );
}

function FinalCtaSection() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-lg bg-ink p-8 text-white shadow-soft md:p-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-flame-200">Next story</p>
            <h2 className="mt-3 max-w-4xl text-3xl font-semibold sm:text-4xl">
              Help create the next digital access success story.
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-7 text-white/70">
              Every repaired, refurbished and deployed device can become part of a larger story about education, opportunity, sustainability, community empowerment, workforce development and Africa digital transformation.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <ButtonLink href="/donate">Sponsor impact</ButtonLink>
            <ButtonLink href="/devices" variant="secondary">Request devices</ButtonLink>
            <ButtonLink href="/deployment-map" variant="secondary">Explore deployments</ButtonLink>
            <ButtonLink href="/csr-partnerships" variant="secondary">Partner with SIT Digital Access</ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}

function FilterRow({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="border-b border-line py-4 first:pt-0 last:border-b-0">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-flame-600">{title}</p>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span key={`${title}-${item}`} className="rounded-full border border-line bg-white px-3 py-2 text-xs font-semibold text-muted">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function FeatureGrid({ features }: { features: Feature[] }) {
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

function FeatureTile({ feature }: { feature: Feature }) {
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

function MetricTile({ metric }: { metric: Metric }) {
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

function DarkMetric({ metric }: { metric: Metric }) {
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
