import type { Metadata } from "next";
import Link from "next/link";
import { AnimatedSection } from "@/components/animated-section";
import { ButtonLink } from "@/components/button-link";
import { Icon } from "@/components/icons";
import { SectionHeading } from "@/components/section-heading";
import {
  bulkRepairFeatures,
  lifecycleSteps,
  repairCategoryCards,
  repairPricingBands,
  repairServiceCards,
  repairStatuses
} from "@/lib/repair-content";
import { repairRouteBookingHref, repairRouteOptions, type RepairRouteSlug } from "@/lib/repair-routes";

export const metadata: Metadata = {
  title: "Public Repairs",
  description:
    "Public repair operations from SIT Digital Access for diagnostics, upgrades, school lab support, repair tracking and circular device lifecycle routing."
};

const trustChips = [
  "UK intake",
  "Africa deployment support",
  "Diagnostics first",
  "Reuse before replacement",
  "School and SME support"
];

const heroStats = [
  { value: "Diagnostics first", label: "Repair decisions start with triage" },
  { value: "24-48h", label: "Diagnostic target after intake" },
  { value: `${repairCategoryCards.length}`, label: "Repair categories" },
  { value: "10+", label: "Circular lifecycle stages" }
];

const routeDetails: Record<RepairRouteSlug, { deviceCount: string; next: string; cta: string }> = {
  "drop-off-handover": {
    deviceCount: "1-5 devices",
    next: "Book the repair, bring the device and charger, then keep the ticket ID for status updates.",
    cta: "Choose drop-off"
  },
  "mail-in-repair": {
    deviceCount: "1-3 devices",
    next: "Book first, package securely, then include the ticket details with the device.",
    cta: "Choose mail-in"
  },
  "pickup-request": {
    deviceCount: "2+ devices",
    next: "Share address, device count and urgency so the team can plan collection and triage.",
    cta: "Request pickup"
  },
  "partner-handover": {
    deviceCount: "1-20 devices",
    next: "Use a trusted school, hub or partner point for handover and repair tracking.",
    cta: "Use partner handover"
  },
  "africa-deployment-support": {
    deviceCount: "Deployment batches",
    next: "Provide country, partner, power and criticality details for deployment-aware aftercare.",
    cta: "Plan aftercare"
  },
  "bulk-school-lab-support": {
    deviceCount: "5+ devices",
    next: "Provide an asset list, deadline and lab requirements for batch assessment and reporting.",
    cta: "Book batch repair"
  }
};

const workflowSteps = [
  "Submit repair request",
  "Device triage",
  "Diagnostics",
  "Estimate and approval",
  "Parts and repair",
  "Quality check",
  "Collection, return or redeployment"
];

const lifecycleFlow = [
  "Request",
  "Intake",
  "Diagnostics",
  "Repair",
  "Refurbish",
  "Inventory",
  "Deploy",
  "Support",
  "Recover",
  "Recycle"
];

const organisationAudiences = [
  "School labs",
  "SMEs",
  "NGOs",
  "Training centres",
  "Community hubs",
  "Corporate device refreshes"
];

const organisationFeatures = [
  "Batch repair",
  "Asset tagging",
  "Secure wipe",
  "Upgrade planning",
  "Deployment readiness",
  "Maintenance reports"
];

const organisationSupportItems = Array.from(
  new Set([...bulkRepairFeatures, ...organisationFeatures])
).slice(0, 12);

const pricingTeasers = [
  { label: "Diagnostics check", detail: "Initial symptoms review, hardware triage and repair recommendation.", range: "Quote required" },
  { label: "SSD / RAM upgrade", detail: "Performance upgrade route for learner, SME and lab-ready devices.", range: "Parts + labour" },
  { label: "OS recovery", detail: "Recovery, drivers, account prep and learner-ready setup checks.", range: "Guide price after triage" },
  { label: "Virus cleanup", detail: "Malware triage, cleanup, security checks and rebuild advice.", range: "Guide price after triage" },
  { label: "Keyboard / battery support", detail: "Input, charging, battery and power-on diagnostics with parts checks.", range: "Quote required" },
  { label: "School lab batch assessment", detail: "Bulk intake, asset tagging, pickup planning and repair reporting.", range: "Custom quote" }
];

const trackingStatuses = [
  "Received",
  "Diagnosing",
  "Awaiting approval",
  "Waiting parts",
  "In repair",
  "Quality check",
  "Ready for collection",
  "Completed"
];

export default function RepairsPage() {
  return (
    <main className="bg-paper">
      <HeroSection />
      <RepairPlatformSection />
      <RouteSelectorSection />
      <RepairCategoriesSection />
      <RepairWorkflowSection />
      <PricingTeaserSection />
      <LifecycleSection />
      <OrganisationSupportSection />
      <TrackingSection />
      <FinalCtaSection />
    </main>
  );
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-ink px-4 pb-16 pt-32 text-white sm:px-6 lg:px-8 lg:pb-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_12%,rgba(249,115,22,0.24),transparent_30%),radial-gradient(circle_at_90%_16%,rgba(249,115,22,0.16),transparent_28%),linear-gradient(135deg,#080808_0%,#151515_56%,#271303_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-paper to-transparent" />
      <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.04fr_0.96fr] lg:items-center">
        <AnimatedSection>
          <p className="inline-flex rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-xs font-semibold uppercase text-flame-100">
            Public repairs page
          </p>
          <h1 className="mt-6 max-w-5xl text-4xl font-semibold leading-tight tracking-normal sm:text-6xl">
            Keep useful devices working before replacement or recycling.
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-7 text-white/72 sm:text-lg">
            Book diagnostics, upgrades and repair support for laptops, desktops, mini PCs and school lab devices, with every repair connected to the SIT Digital Access circular technology lifecycle.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/book-repair">Book a repair</ButtonLink>
            <ButtonLink href="/repair-status" variant="secondary">Track repair status</ButtonLink>
          </div>
          <div className="mt-8 flex flex-wrap gap-2">
            {trustChips.map((chip) => (
              <span key={chip} className="rounded-full border border-white/12 bg-white/[0.06] px-3 py-1.5 text-xs font-semibold text-white/78">
                {chip}
              </span>
            ))}
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.08}>
          <div className="border border-white/10 bg-white/[0.07] p-5 shadow-2xl backdrop-blur">
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-5">
              <div>
                <p className="text-xs font-semibold uppercase text-flame-100">Repair operations</p>
                <h2 className="mt-2 text-2xl font-semibold">Diagnostics-to-lifecycle journey</h2>
              </div>
              <span className="rounded-full bg-flame-500/20 px-3 py-1.5 text-xs font-semibold text-flame-50">
                Reuse first
              </span>
            </div>
            <div className="grid gap-3 py-5 sm:grid-cols-2">
              {heroStats.map((stat) => (
                <div key={stat.label} className="border border-white/10 bg-black/18 p-4">
                  <p className="text-2xl font-semibold text-white">{stat.value}</p>
                  <p className="mt-2 text-xs leading-5 text-white/60">{stat.label}</p>
                </div>
              ))}
            </div>
            <div className="space-y-3 border-t border-white/10 pt-5">
              {["Book", "Diagnose", "Approve", "Repair", "Return"].map((step, index) => (
                <div key={step} className="grid grid-cols-[2rem_1fr] items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-flame-500 text-xs font-bold text-white">
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{step}</p>
                    <div className="mt-2 h-1.5 bg-white/10">
                      <div className="h-full bg-flame-400" style={{ width: `${Math.max(28, (index + 1) * 18)}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

function RepairPlatformSection() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Repair platform"
            title="A public repair journey connected to circular operations."
            description="Individuals, schools, SMEs, NGOs and partners can choose a route, book diagnostics, track repair progress and understand how every repair decision supports reuse before recycling."
          />
        </AnimatedSection>
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {repairServiceCards.map((feature, index) => (
            <AnimatedSection key={feature.title} delay={index * 0.04}>
              <article className="h-full border border-line bg-white p-5 shadow-card">
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-flame-50 text-flame-600">
                  <Icon name={feature.icon} className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-lg font-semibold text-ink">{feature.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted">{feature.description}</p>
              </article>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

function RouteSelectorSection() {
  return (
    <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Repair route selector"
            title="Choose the route that matches your device count, location and support model."
            description="Each route creates a tracked repair booking and helps the operations team plan intake, diagnostics, pickup, handover, partner support or deployment aftercare."
          />
        </AnimatedSection>
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {repairRouteOptions.map((route, index) => {
            const detail = routeDetails[route.slug];
            return (
              <AnimatedSection key={route.slug} delay={index * 0.035}>
                <article className="flex h-full flex-col border border-line bg-paper p-5 shadow-sm transition hover:-translate-y-1 hover:border-flame-300 hover:bg-white hover:shadow-card">
                  <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-white text-flame-600 ring-1 ring-line">
                    <Icon name={route.icon} className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold text-ink">{route.label}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted">{route.description}</p>
                  <dl className="mt-5 grid gap-3 text-sm">
                    <div>
                      <dt className="font-semibold text-ink">Best for</dt>
                      <dd className="mt-1 text-muted">{route.bestFor}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-ink">Typical device count</dt>
                      <dd className="mt-1 text-muted">{detail.deviceCount}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-ink">What happens next</dt>
                      <dd className="mt-1 text-muted">{detail.next}</dd>
                    </div>
                  </dl>
                  <Link
                    href={repairRouteBookingHref(route.slug)}
                    className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white transition hover:bg-graphite"
                  >
                    {detail.cta}
                    <Icon name="arrow" className="h-4 w-4" />
                  </Link>
                </article>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function RepairCategoriesSection() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Repair categories"
            title="From quick upgrades to deeper diagnostics."
            description="Choose the closest category, describe the symptoms clearly and the repair team will confirm the right diagnostic route before approved work begins."
          />
        </AnimatedSection>
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {repairCategoryCards.map((category, index) => (
            <AnimatedSection key={category.title} delay={index * 0.025}>
              <article className="flex h-full flex-col border border-line bg-white p-5 shadow-sm">
                <div className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-flame-50 text-flame-600">
                    <Icon name={category.icon} className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-base font-semibold text-ink">{category.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted">{category.description}</p>
                  </div>
                </div>
                <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold">
                  <span className="rounded-full bg-paper px-3 py-1.5 text-muted">{category.turnaround}</span>
                  <span className="rounded-full bg-flame-50 px-3 py-1.5 text-flame-700">{category.priceLabel}</span>
                </div>
                <Link
                  href={`/book-repair?category=${encodeURIComponent(category.value)}`}
                  className="mt-5 inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-flame-700 transition hover:text-flame-900"
                >
                  Book this repair
                  <Icon name="arrow" className="h-4 w-4" />
                </Link>
              </article>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

function RepairWorkflowSection() {
  return (
    <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <SectionHeading
            eyebrow="How repair works"
            title="A clear path from request to return, reuse or redeployment."
            description="The public journey is simple, while internal operations can still manage diagnostics, approvals, parts, technician assignment and quality checks."
          />
        </AnimatedSection>
        <div className="mt-10 grid gap-4 lg:grid-cols-7">
          {workflowSteps.map((step, index) => (
            <AnimatedSection key={step} delay={index * 0.04}>
              <article className="h-full border border-line bg-paper p-4">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-sm font-bold text-white">
                  {index + 1}
                </span>
                <h3 className="mt-4 text-sm font-semibold text-ink">{step}</h3>
              </article>
            </AnimatedSection>
          ))}
        </div>
        <p className="mt-6 text-sm leading-6 text-muted">
          Typical internal status stages include {repairStatuses.slice(0, 8).join(", ").toLowerCase()} and completion.
        </p>
      </div>
    </section>
  );
}

function PricingTeaserSection() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Pricing guide"
            title="Indicative bands before a final quote."
            description="Repair pricing depends on condition, parts availability, warranty route, data handling and approval. Diagnostics happen before paid work is treated as approved."
          />
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/repair-pricing" variant="dark">View pricing guide</ButtonLink>
            <ButtonLink href="/book-repair" variant="secondary">Book diagnostics</ButtonLink>
          </div>
          <p className="mt-5 text-sm leading-6 text-muted">
            Final quote depends on parts, condition and approval.
          </p>
        </AnimatedSection>
        <AnimatedSection delay={0.08}>
          <div className="grid gap-3 sm:grid-cols-2">
            {pricingTeasers.map((band) => {
              const source = repairPricingBands.find((item) => band.label.toLowerCase().includes(item.category.toLowerCase().split(" ")[0]));
              return (
                <article key={band.label} className="border border-line bg-white p-5 shadow-sm">
                  <p className="text-sm font-semibold text-ink">{band.label}</p>
                  <p className="mt-2 text-xl font-semibold text-flame-700">{band.range}</p>
                  <p className="mt-3 text-sm leading-6 text-muted">{source?.detail ?? band.detail}</p>
                </article>
              );
            })}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

function LifecycleSection() {
  return (
    <section className="bg-ink px-4 py-20 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-flame-200">Lifecycle integration</p>
              <h2 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl">
                Repair is part of the circular technology lifecycle.
              </h2>
              <p className="mt-4 text-sm leading-6 text-white/70">
                Devices can move from diagnostics into repair, refurbishment, inventory, deployment, support, recovery or recycling with a clearer operational record.
              </p>
              <div className="mt-8">
                <ButtonLink href="/device-lifecycle" variant="secondary">View device lifecycle</ButtonLink>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {lifecycleFlow.map((stage, index) => {
                const detail = lifecycleSteps.find((step) => step.title.toLowerCase().includes(stage.toLowerCase()));
                return (
                  <div key={stage} className="border border-white/10 bg-white/[0.06] p-4">
                    <span className="text-xs font-semibold text-flame-200">{String(index + 1).padStart(2, "0")}</span>
                    <p className="mt-3 text-sm font-semibold text-white">{stage}</p>
                    {detail ? <p className="mt-2 text-xs leading-5 text-white/55">{detail.description}</p> : null}
                  </div>
                );
              })}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

function OrganisationSupportSection() {
  return (
    <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Schools and organisations"
            title="Repair support for labs, teams, hubs and device refreshes."
            description="Batch repairs can be connected to asset tags, secure wipe requirements, upgrade planning, deployment readiness and maintenance reporting."
          />
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/book-repair?route=bulk-school-lab-support" variant="dark">Request school batch repair</ButtonLink>
            <ButtonLink href="/contact" variant="secondary">Talk to SIT Digital Access</ButtonLink>
          </div>
        </AnimatedSection>
        <AnimatedSection delay={0.08}>
          <div className="grid gap-4 md:grid-cols-2">
            {organisationAudiences.map((audience, index) => (
              <article key={audience} className="border border-line bg-paper p-5">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-flame-600 ring-1 ring-line">
                  <Icon name={index % 2 === 0 ? "school" : "business"} className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-base font-semibold text-ink">{audience}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">
                  Planned intake, clear diagnostics and lifecycle-aware repair reporting for shared device estates.
                </p>
              </article>
            ))}
          </div>
          <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {organisationSupportItems.map((feature) => (
              <div key={feature} className="flex items-center gap-2 border border-line bg-white px-3 py-2 text-sm font-semibold text-ink">
                <Icon name="check" className="h-4 w-4 text-green-600" />
                {feature}
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

function TrackingSection() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Track repair status"
            title="Follow the customer-safe repair journey."
            description="Use the repair status page for official ticket lookup. Keep your ticket ID and status token from the booking confirmation private."
          />
          <form action="/repair-status" method="get" className="mt-8 border border-line bg-white p-5 shadow-card">
            <label className="block text-sm font-semibold text-ink">
              Repair reference
              <input
                name="ticketId"
                required
                placeholder="SIT-REP-2026-0001"
                className="mt-2 w-full rounded-lg border border-line bg-white px-4 py-3 text-sm outline-none transition focus:border-flame-400 focus:ring-4 focus:ring-flame-100"
              />
            </label>
            <label className="mt-4 block text-sm font-semibold text-ink">
              Email or phone
              <input
                name="contact"
                placeholder="Used by support if follow-up is needed"
                className="mt-2 w-full rounded-lg border border-line bg-white px-4 py-3 text-sm outline-none transition focus:border-flame-400 focus:ring-4 focus:ring-flame-100"
              />
            </label>
            <button className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-flame-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-flame-600 sm:w-auto">
              Track status
              <Icon name="search" className="h-4 w-4" />
            </button>
          </form>
        </AnimatedSection>
        <AnimatedSection delay={0.08}>
          <div className="grid gap-3 sm:grid-cols-2">
            {trackingStatuses.map((status, index) => (
              <article key={status} className="border border-line bg-white p-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-paper text-xs font-bold text-ink">
                    {index + 1}
                  </span>
                  <p className="text-sm font-semibold text-ink">{status}</p>
                </div>
              </article>
            ))}
          </div>
        </AnimatedSection>
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
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-flame-200">Repair before replacement</p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight">Ready to extend the life of your device?</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-white/70">
              Book a repair, request school batch support or talk to SIT Digital Access about diagnostics, upgrades, refurbishment and lifecycle planning.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/book-repair">Book a repair</ButtonLink>
            <ButtonLink href="/book-repair?route=bulk-school-lab-support" variant="secondary">Request school batch repair</ButtonLink>
            <ButtonLink href="/contact" variant="ghost" className="text-white hover:bg-white/10">Talk to SIT Digital Access</ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
