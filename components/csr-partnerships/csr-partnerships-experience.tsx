"use client";

import { AnimatedSection } from "@/components/animated-section";
import { ButtonLink } from "@/components/button-link";
import { Icon, type IconKey } from "@/components/icons";
import { SectionHeading } from "@/components/section-heading";
import { impactStats } from "@/lib/data";
import { deploymentMapRegions, successStories } from "@/lib/ecosystem-content";

const trustBadges = [
  "ESG-ready reporting",
  "Secure wipe workflows",
  "Circular technology model",
  "UK operations",
  "Africa deployment partnerships"
];

const heroFlow = ["Corporate refresh", "Secure wipe", "Refurbish", "Deploy", "Train", "Impact"];

const devicesMetric = impactStats.find((metric) => metric.label === "Devices deployed");
const schoolsMetric = impactStats.find((metric) => metric.label === "Schools supported");
const learnersMetric = impactStats.find((metric) => metric.label === "Learners reached");
const co2Metric = impactStats.find((metric) => metric.label === "CO2 saved through reuse");

const heroMetrics = [
  {
    value: devicesMetric?.value ?? "500+",
    label: "Devices diverted from landfill",
    detail: "Target for refurbished device reuse"
  },
  {
    value: schoolsMetric?.value ?? "10+",
    label: "Schools and hubs supported",
    detail: "Labs, hubs and learner access"
  },
  {
    value: learnersMetric?.value ?? "1,500+",
    label: "Learners enabled",
    detail: "Through access and training"
  },
  {
    value: co2Metric?.value ?? "25t",
    label: "Estimated CO2 avoided",
    detail: "Estimated circular impact"
  }
];

const partnershipRoutes: Array<{
  title: string;
  bestFor: string;
  scale: string;
  esg: string;
  areas: string[];
  href: string;
  cta: string;
  icon: IconKey;
}> = [
  {
    title: "Corporate device recycling",
    bestFor: "Enterprises refreshing laptops, desktops, monitors and accessories.",
    scale: "25-1,000+ assets",
    esg: "Reuse, secure wipe, circular recovery and landfill diversion evidence.",
    areas: ["Circular IT", "CO2 avoided", "Device recovery"],
    href: "/donate#donation-form",
    cta: "Discuss recycling",
    icon: "recycle"
  },
  {
    title: "Sponsor school and hub labs",
    bestFor: "CSR teams funding practical learning infrastructure.",
    scale: "10-30 devices per lab",
    esg: "Education access, community inclusion and deployment reporting.",
    areas: ["Schools", "Community hubs", "Digital inclusion"],
    href: "/donate",
    cta: "Sponsor a lab",
    icon: "school"
  },
  {
    title: "Sponsor digital skills cohorts",
    bestFor: "Foundations and employers supporting employability and AI readiness.",
    scale: "15-100 learners per cohort",
    esg: "Skills participation, completion signals and sponsor-ready outcomes.",
    areas: ["SIT Learning", "AI literacy", "Cybersecurity"],
    href: "/contact?type=PARTNERSHIP#contact-form",
    cta: "Plan a cohort",
    icon: "graduation"
  },
  {
    title: "NGO technology partnership",
    bestFor: "Companies supporting field offices, charities and delivery partners.",
    scale: "5-100 staff devices",
    esg: "Operational resilience for mission-led teams and community programmes.",
    areas: ["NGO operations", "Field teams", "Support"],
    href: "/businesses-ngos",
    cta: "Support NGOs",
    icon: "heart"
  },
  {
    title: "Employee giving and volunteering",
    bestFor: "HR, CSR and employee engagement teams.",
    scale: "Team events and recurring drives",
    esg: "Volunteer hours, device preparation and mentorship participation.",
    areas: ["Mentorship", "Prep days", "Giving"],
    href: "/contact?type=PARTNERSHIP#contact-form",
    cta: "Plan engagement",
    icon: "users"
  },
  {
    title: "Community innovation sponsorship",
    bestFor: "Brands supporting coworking, enterprise and youth innovation hubs.",
    scale: "Hub, cohort or event sponsorship",
    esg: "Local enterprise, shared access and inclusive innovation outcomes.",
    areas: ["Innovation hubs", "Youth access", "Coworking"],
    href: "/community-hubs",
    cta: "Sponsor a hub",
    icon: "sparkles"
  },
  {
    title: "Africa deployment partnership",
    bestFor: "International partners, donors and Africa-focused CSR programmes.",
    scale: "Pilot, country or regional pathway",
    esg: "Deployment, training, community access and support readiness reporting.",
    areas: ["Africa access", "Schools", "Workforce"],
    href: "/africa-deployment",
    cta: "Plan deployment",
    icon: "globe"
  },
  {
    title: "Circular procurement partnership",
    bestFor: "Procurement and sustainability leaders reducing technology waste.",
    scale: "Recurring refresh and recovery cycle",
    esg: "Reuse-first purchasing, repair, trade-in, recycling and reporting.",
    areas: ["Procurement", "Trade-in", "Lifecycle"],
    href: "/trade-in",
    cta: "Explore circular route",
    icon: "package"
  }
];

const dashboardMetrics = [
  { label: "Devices recovered", value: "500+", detail: "Reuse and recovery target", progress: 72, icon: "laptop" as IconKey },
  { label: "Devices reused", value: "Reuse first", detail: "Priority before recycling", progress: 84, icon: "recycle" as IconKey },
  { label: "Devices recycled responsibly", value: "Auditable", detail: "End-of-life route", progress: 58, icon: "shield" as IconKey },
  { label: "CO2 avoided", value: "25t", detail: "Estimated circular saving", progress: 68, icon: "leaf" as IconKey },
  { label: "Learners reached", value: "1,500+", detail: "Access and skills", progress: 76, icon: "graduation" as IconKey },
  { label: "Schools supported", value: "10+", detail: "Labs and learner access", progress: 62, icon: "school" as IconKey },
  { label: "Community hubs enabled", value: "6+", detail: "Shared access signal", progress: 54, icon: "building" as IconKey },
  { label: "Digital skills cohorts funded", value: "Cohort-ready", detail: "SIT Learning pathways", progress: 64, icon: "book" as IconKey }
];

const recyclingFeatures = [
  { title: "Device audits", description: "Capture asset type, count, condition and reuse potential before collection.", icon: "search" as IconKey },
  { title: "Collection planning", description: "Coordinate site, quantity, handover, packing and chain-of-custody needs.", icon: "truck" as IconKey },
  { title: "Secure wipe workflows", description: "Route data-bearing assets through wipe evidence and controlled reuse decisions.", icon: "shield" as IconKey },
  { title: "Asset tracking", description: "Record serials, grades, route decisions and deployment readiness signals.", icon: "database" as IconKey },
  { title: "Lifecycle reporting", description: "Show what was reused, refurbished, deployed, recovered or recycled.", icon: "chart" as IconKey },
  { title: "Refurbishment pathways", description: "Move viable devices into repair, upgrade and deployment preparation.", icon: "wrench" as IconKey },
  { title: "Parts recovery", description: "Harvest useful components where full-device reuse is not practical.", icon: "cpu" as IconKey },
  { title: "Responsible recycling", description: "Route end-of-life assets toward compliant processing and evidence capture.", icon: "recycle" as IconKey }
];

const recyclingTimeline = ["Audit", "Collection", "Secure wipe", "Assessment", "Refurbish", "Deploy", "Report"];

const sponsorshipCards = [
  { title: "Sponsor a learner", impact: "Reliable device access for one learner", devices: "1 laptop", training: "Digital literacy or employability", reporting: "Learner access summary", icon: "graduation" as IconKey },
  { title: "Sponsor a school lab", impact: "Timetable-ready classroom access", devices: "12-30 devices", training: "Teacher enablement", reporting: "Lab deployment report", icon: "school" as IconKey },
  { title: "Sponsor a community hub", impact: "Shared learning and work access", devices: "10-24 devices", training: "Community digital skills", reporting: "Hub impact evidence", icon: "building" as IconKey },
  { title: "Sponsor AI literacy programmes", impact: "Practical responsible AI confidence", devices: "Cohort device pool", training: "AI literacy pathway", reporting: "Participation summary", icon: "sparkles" as IconKey },
  { title: "Sponsor cybersecurity cohorts", impact: "Safer everyday technology use", devices: "Training devices", training: "Cybersecurity awareness", reporting: "Completion signal", icon: "shield" as IconKey },
  { title: "Sponsor repair technician training", impact: "Local maintenance capacity", devices: "Repair practice assets", training: "Technician pathway", reporting: "Skills and readiness report", icon: "wrench" as IconKey },
  { title: "Sponsor women and youth empowerment", impact: "Skills, access and employment readiness", devices: "Learner and hub devices", training: "Employability and entrepreneurship", reporting: "Donor impact story", icon: "heart" as IconKey }
];

const trainingPathways = [
  "Digital literacy",
  "AI literacy",
  "Cybersecurity awareness",
  "Productivity skills",
  "Employability training",
  "Coding pathways",
  "Teacher enablement"
];

const reportingCards = [
  { title: "Reuse-first metrics", description: "Track devices that return to useful service before recycling.", icon: "recycle" as IconKey },
  { title: "CO2 avoided estimates", description: "Estimate circular impact from recovery, reuse and diversion signals.", icon: "leaf" as IconKey },
  { title: "Secure wipe evidence", description: "Record wipe status and evidence for data-bearing assets.", icon: "shield" as IconKey },
  { title: "Chain of custody", description: "Document collection, handover, assessment and deployment activities.", icon: "list" as IconKey },
  { title: "Donation records", description: "Store donor, device and sponsorship records for audit-ready reporting.", icon: "database" as IconKey },
  { title: "Deployment reports", description: "Connect prepared devices to schools, hubs, NGOs and Africa partners.", icon: "map" as IconKey },
  { title: "Community impact evidence", description: "Link devices to stories, cohorts, learners and community outcomes.", icon: "users" as IconKey },
  { title: "Sponsor-ready ESG summaries", description: "Create board, donor and sustainability-ready evidence packs.", icon: "chart" as IconKey }
];

const africaImpact = [
  { country: "Liberia deployments", focus: "School labs, vocational learning and donor-backed access.", outcomes: ["Schools", "Community hubs", "Workforce enablement"], readiness: 72 },
  { country: "Ghana partnerships", focus: "Urban and regional school, SME and community hub deployments.", outcomes: ["NGOs", "Innovation hubs", "Training pathways"], readiness: 82 },
  { country: "Sierra Leone outreach", focus: "Offline-ready school labs and sponsored learner access.", outcomes: ["Schools", "Community hubs", "Digital skills"], readiness: 68 },
  { country: "Nigeria digital access", focus: "Partner-led labs, community hubs and workforce access.", outcomes: ["NGOs", "Workforce enablement", "Innovation hubs"], readiness: 76 },
  { country: "Wider Africa expansion", focus: "Repeatable partner-led deployment and support models.", outcomes: ["Schools", "Hubs", "Local support"], readiness: 64 }
];

const storyCards = [
  { title: "Sponsored school lab", region: "School deployment", devices: "24-seat lab", learners: "One class rotation", sponsor: "Corporate sponsor", quote: "A sponsored lab can move a school from occasional access to a planned learning environment.", href: "/success-stories" },
  { title: "NGO workforce upgrade", region: "NGO operations", devices: "Business laptops", learners: "Staff and volunteers", sponsor: "Foundation partner", quote: "Reliable devices help mission teams spend more time delivering programmes and less time fighting basic IT.", href: "/businesses-ngos" },
  { title: "Community digital hub", region: "Community access", devices: "10-24 devices", learners: "Local learners and job seekers", sponsor: "CSR programme", quote: "Shared access creates a recurring place for digital confidence, learning and work.", href: "/community-hubs" },
  { title: "Youth AI literacy cohort", region: "Skills pathway", devices: "Cohort device pool", learners: "Youth participants", sponsor: "Skills sponsor", quote: "AI literacy is strongest when learners also have reliable device access.", href: "/programmes" },
  { title: "Corporate recycling partnership", region: "Circular IT", devices: "Refresh-cycle assets", learners: "Schools and hubs", sponsor: "Enterprise donor", quote: "Retired technology can become a practical reuse pipeline with ESG evidence.", href: "/device-recycling" }
];

const engagementCards = [
  { title: "Device preparation days", description: "Employee teams help prepare, sort, tag or package devices for social-impact routes.", icon: "package" as IconKey },
  { title: "Volunteer mentorship", description: "Staff share practical workplace, technology and career guidance with learners.", icon: "users" as IconKey },
  { title: "Digital skills mentoring", description: "Support learners or community groups with safe, useful digital skills practice.", icon: "graduation" as IconKey },
  { title: "Community support initiatives", description: "Sponsor local access spaces, skills sessions and shared technology programmes.", icon: "heart" as IconKey },
  { title: "Corporate impact events", description: "Turn annual CSR moments into measurable technology recovery and access campaigns.", icon: "sparkles" as IconKey }
];

export function CsrPartnershipsExperience() {
  return (
    <main className="bg-paper">
      <HeroSection />
      <PartnershipRoutesSection />
      <EsgDashboardSection />
      <CorporateRecyclingSection />
      <SponsorshipPathwaysSection />
      <SkillsEcosystemSection />
      <ReportingSection />
      <AfricaImpactSection />
      <SuccessStoriesSection />
      <EmployeeEngagementSection />
      <FinalCtaSection />
    </main>
  );
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-ink px-4 pb-16 pt-32 text-white sm:px-6 lg:px-8 lg:pb-24">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#080808_0%,#151515_56%,#2b1505_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-paper to-transparent" />
      <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <AnimatedSection>
          <p className="inline-flex rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-xs font-semibold uppercase text-flame-100">
            CSR, ESG and corporate impact
          </p>
          <h1 className="mt-6 max-w-5xl text-4xl font-semibold leading-tight tracking-normal sm:text-6xl">
            Convert corporate technology refresh cycles into measurable social impact
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-7 text-white/72 sm:text-lg">
            Transform retired technology into digital access, school labs, community hubs, digital skills training and Africa deployment pathways with measurable ESG and CSR outcomes.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="#partnership-routes">View partnership routes</ButtonLink>
            <ButtonLink href="/donate#donation-form" variant="secondary">Start a donation</ButtonLink>
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
              <p className="text-xs font-semibold uppercase text-flame-100">Corporate impact pathway</p>
              <h2 className="mt-2 text-2xl font-semibold">A refresh cycle can become a deployment pipeline.</h2>
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
              {heroFlow.map((stage, index) => (
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

function PartnershipRoutesSection() {
  return (
    <section id="partnership-routes" className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Partnership route selector"
            title="Choose the CSR and ESG model that fits your organisation."
            description="Each route connects corporate intent to recovery, reuse, sponsorship, training, deployment and reporting outcomes."
          />
        </AnimatedSection>
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {partnershipRoutes.map((route, index) => (
            <AnimatedSection key={route.title} delay={index * 0.025}>
              <article className="flex h-full flex-col border border-line bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-flame-300 hover:shadow-card">
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-flame-50 text-flame-600">
                  <Icon name={route.icon} className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-lg font-semibold text-ink">{route.title}</h3>
                <dl className="mt-5 grid gap-3 text-sm">
                  <Spec label="Best for" value={route.bestFor} />
                  <Spec label="Typical scale" value={route.scale} />
                  <Spec label="ESG outcomes" value={route.esg} />
                </dl>
                <div className="mt-5 flex flex-wrap gap-2">
                  {route.areas.map((area) => (
                    <span key={`${route.title}-${area}`} className="rounded-full bg-paper px-3 py-1 text-xs font-semibold text-muted">
                      {area}
                    </span>
                  ))}
                </div>
                <ButtonLink href={route.href} variant="secondary" className="mt-auto self-start">{route.cta}</ButtonLink>
              </article>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

function EsgDashboardSection() {
  return (
    <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <SectionHeading
            eyebrow="ESG impact dashboard"
            title="Make social impact visible enough for executives, donors and ESG teams."
            description="These public-safe dashboard signals show the shape of a measurable circular technology and digital inclusion programme."
          />
        </AnimatedSection>
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {dashboardMetrics.map((metric, index) => (
            <AnimatedSection key={metric.label} delay={index * 0.025}>
              <article className="h-full border border-line bg-paper p-5">
                <div className="flex items-center justify-between gap-4">
                  <Icon name={metric.icon} className="h-5 w-5 text-flame-600" />
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-muted">{metric.progress}% signal</span>
                </div>
                <p className="mt-5 text-2xl font-semibold text-ink">{metric.value}</p>
                <h3 className="mt-2 text-sm font-semibold uppercase tracking-[0.12em] text-flame-700">{metric.label}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{metric.detail}</p>
                <div className="mt-5 h-2 bg-white">
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

function CorporateRecyclingSection() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Corporate recycling programme"
            title="Corporate device recycling and circular recovery"
            description="Move retired technology through a controlled route for audit, collection, secure wipe, assessment, refurbishment, deployment and reporting."
          />
        </AnimatedSection>
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {recyclingFeatures.map((feature, index) => (
            <AnimatedSection key={feature.title} delay={index * 0.025}>
              <article className="h-full border border-line bg-white p-5 shadow-sm">
                <Icon name={feature.icon} className="h-5 w-5 text-flame-600" />
                <h3 className="mt-4 text-base font-semibold text-ink">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{feature.description}</p>
              </article>
            </AnimatedSection>
          ))}
        </div>
        <AnimatedSection delay={0.08}>
          <div className="mt-8 border border-line bg-white p-5 shadow-card">
            <div className="grid gap-2 md:grid-cols-7">
              {recyclingTimeline.map((step, index) => (
                <div key={step} className="border border-line bg-paper p-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-flame-500 text-xs font-bold text-white">{index + 1}</span>
                  <p className="mt-4 text-sm font-semibold text-ink">{step}</p>
                </div>
              ))}
            </div>
            <ButtonLink href="/contact?type=PARTNERSHIP#contact-form" variant="dark" className="mt-6">Discuss recycling</ButtonLink>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

function SponsorshipPathwaysSection() {
  return (
    <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Sponsorship pathways"
            title="Fund practical access, skills and deployment outcomes."
            description="Sponsorship can support one learner, a full lab, community hub, skills cohort or local technician pathway."
          />
        </AnimatedSection>
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-7">
          {sponsorshipCards.map((card, index) => (
            <AnimatedSection key={card.title} delay={index * 0.025}>
              <article className="flex h-full flex-col border border-line bg-paper p-5">
                <Icon name={card.icon} className="h-5 w-5 text-flame-600" />
                <h3 className="mt-5 text-base font-semibold text-ink">{card.title}</h3>
                <Spec label="Typical impact" value={card.impact} />
                <Spec label="Devices required" value={card.devices} />
                <Spec label="Training linkage" value={card.training} />
                <Spec label="Reporting outcomes" value={card.reporting} />
                <ButtonLink href="/donate" variant="secondary" className="mt-auto self-start">Sponsor route</ButtonLink>
              </article>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

function SkillsEcosystemSection() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.86fr_1.14fr] lg:items-start">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Powered by SIT Learning"
            title="Technology access works best when paired with digital skills"
            description="Sponsorship can connect devices with practical skills pathways so learners, teachers, staff and communities get more value from access."
          />
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/programmes" variant="dark">Explore training pathways</ButtonLink>
            <ButtonLink href="/contact?type=PARTNERSHIP#contact-form" variant="secondary">Sponsor a cohort</ButtonLink>
          </div>
        </AnimatedSection>
        <AnimatedSection delay={0.08}>
          <div className="grid gap-3 sm:grid-cols-2">
            {trainingPathways.map((pathway, index) => (
              <article key={pathway} className="border border-line bg-white p-5 shadow-sm">
                <Icon name={index === 1 ? "sparkles" : index === 2 ? "shield" : index === 5 ? "cpu" : "graduation"} className="h-5 w-5 text-flame-600" />
                <h3 className="mt-4 text-base font-semibold text-ink">{pathway}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">A practical sponsor-ready learning pathway connected to devices, cohorts and community access.</p>
              </article>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

function ReportingSection() {
  return (
    <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <SectionHeading
            eyebrow="ESG and compliance reporting"
            title="Support internal ESG, CSR and sustainability reporting requirements."
            description="Evidence can be structured around reuse, data handling, chain-of-custody, donation records, deployment reports and community impact."
          />
        </AnimatedSection>
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {reportingCards.map((card, index) => (
            <AnimatedSection key={card.title} delay={index * 0.025}>
              <article className="h-full border border-line bg-paper p-5">
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

function AfricaImpactSection() {
  const regionLookups = new Map(deploymentMapRegions.map((region) => [region.name, region]));

  return (
    <section className="bg-ink px-4 py-20 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Africa deployment impact"
            title="Corporate partnerships can support Africa-ready access pathways."
            description="Device recovery, sponsorship and skills funding can connect to school labs, community hubs, NGOs, workforce enablement and innovation hubs."
            className="text-white [&_h2]:text-white [&_p]:text-white/70"
          />
        </AnimatedSection>
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {africaImpact.map((item, index) => {
            const profile = regionLookups.get(item.country.replace(" deployments", "").replace(" partnerships", "").replace(" outreach", "").replace(" digital access", ""));
            return (
              <AnimatedSection key={item.country} delay={index * 0.035}>
                <article className="h-full border border-white/10 bg-white/[0.06] p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-flame-200">{profile?.status ?? "Planning"}</p>
                  <h3 className="mt-3 text-lg font-semibold text-white">{item.country}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/64">{item.focus}</p>
                  <div className="mt-5 h-2 bg-white/10">
                    <div className="h-full bg-flame-400" style={{ width: `${item.readiness}%` }} />
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {item.outcomes.map((outcome) => (
                      <span key={`${item.country}-${outcome}`} className="rounded-full bg-white/[0.08] px-3 py-1 text-xs font-semibold text-white/75">{outcome}</span>
                    ))}
                  </div>
                </article>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function SuccessStoriesSection() {
  const corporateStory = successStories.find((story) => story.title === "Corporate reuse partnership");

  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Success stories"
            title="Impact stories that make corporate support tangible."
            description={corporateStory?.summary ?? "Corporate support can connect retired technology, sponsorship and training to measurable community impact."}
          />
        </AnimatedSection>
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {storyCards.map((story, index) => (
            <AnimatedSection key={story.title} delay={index * 0.035}>
              <article className="flex h-full flex-col border border-line bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-flame-700">{story.region}</p>
                <h3 className="mt-3 text-lg font-semibold text-ink">{story.title}</h3>
                <div className="mt-4 space-y-2 text-sm text-muted">
                  <p><strong className="text-ink">Devices:</strong> {story.devices}</p>
                  <p><strong className="text-ink">Learners reached:</strong> {story.learners}</p>
                  <p><strong className="text-ink">Sponsor type:</strong> {story.sponsor}</p>
                </div>
                <blockquote className="mt-4 border-l-2 border-flame-500 pl-3 text-sm leading-6 text-muted">{story.quote}</blockquote>
                <ButtonLink href={story.href} variant="secondary" className="mt-auto self-start">View pathway</ButtonLink>
              </article>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

function EmployeeEngagementSection() {
  return (
    <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Employee engagement and volunteering"
            title="Make corporate impact participatory, practical and measurable."
            description="CSR programmes can include employee giving, mentorship, device preparation days, community initiatives and annual impact events."
          />
        </AnimatedSection>
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {engagementCards.map((card, index) => (
            <AnimatedSection key={card.title} delay={index * 0.035}>
              <article className="h-full border border-line bg-paper p-5">
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

function FinalCtaSection() {
  return (
    <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl border border-line bg-ink p-6 text-white shadow-2xl md:p-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-flame-200">Corporate impact partnership</p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight">
              Build a practical CSR and ESG technology impact programme
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-white/70">
              Start with retired technology, sponsorship, deployment planning or ESG reporting needs, then connect into the broader SIT Digital Access ecosystem.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/donate#donation-form">Start a donation</ButtonLink>
            <ButtonLink href="/africa-deployment#africa-enquiry" variant="secondary">Sponsor a deployment</ButtonLink>
            <ButtonLink href="/contact" variant="secondary">Talk to SIT Digital Access</ButtonLink>
            <ButtonLink href="/contact?type=PARTNERSHIP#contact-form" variant="ghost" className="text-white hover:bg-white/10">Plan an ESG partnership</ButtonLink>
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
