import Link from "next/link";
import { AnimatedSection } from "@/components/animated-section";
import { ButtonLink } from "@/components/button-link";
import { Icon } from "@/components/icons";
import { SectionHeading } from "@/components/section-heading";
import type {
  DeploymentMapRegion,
  EcosystemFeature,
  EcosystemMetric,
  EcosystemPathway,
  EcosystemStory
} from "@/lib/ecosystem-content";
import { cn } from "@/lib/utils";

export function EcosystemMetricGrid({ metrics }: { metrics: EcosystemMetric[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <article key={metric.label} className="rounded-lg border border-line bg-white p-5 shadow-card">
          <div className="flex items-center justify-between gap-4">
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-flame-500 text-white">
              <Icon name={metric.icon} className="h-5 w-5" />
            </span>
            <p className="text-right text-2xl font-semibold text-ink">{metric.value}</p>
          </div>
          <h3 className="mt-4 text-sm font-semibold uppercase tracking-[0.14em] text-flame-600">{metric.label}</h3>
          <p className="mt-3 text-sm leading-6 text-muted">{metric.detail}</p>
        </article>
      ))}
    </div>
  );
}

export function EcosystemFeatureGrid({ features }: { features: EcosystemFeature[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {features.map((feature) => (
        <article key={feature.title} className="rounded-lg border border-line bg-white p-5 shadow-card">
          <Icon name={feature.icon} className="h-5 w-5 text-flame-600" />
          {feature.metadata ? (
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-flame-600">{feature.metadata}</p>
          ) : null}
          <h3 className="mt-2 text-lg font-semibold tracking-tight text-ink">{feature.title}</h3>
          <p className="mt-3 text-sm leading-6 text-muted">{feature.description}</p>
        </article>
      ))}
    </div>
  );
}

export function ReuseJourneySection({ steps }: { steps: EcosystemFeature[] }) {
  return (
    <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Reuse journey"
            title="A practical path from retired hardware to real access."
            description="The ecosystem turns device refresh, donation and sponsorship into a clear operational route for secure reuse and measurable impact."
          />
        </AnimatedSection>
        <div className="mt-10 grid gap-4 lg:grid-cols-4">
          {steps.map((step, index) => (
            <AnimatedSection key={step.title} delay={index * 0.04}>
              <article className="relative h-full rounded-lg border border-line bg-paper p-5">
                <div className="flex items-center justify-between gap-4">
                  <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-ink text-white">
                    <Icon name={step.icon} className="h-5 w-5" />
                  </span>
                  <span className="text-sm font-semibold text-flame-600">0{index + 1}</span>
                </div>
                <p className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-flame-600">{step.metadata}</p>
                <h3 className="mt-2 text-xl font-semibold tracking-tight text-ink">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted">{step.description}</p>
              </article>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PathwayGrid({
  eyebrow,
  title,
  description,
  pathways,
  surface = "paper"
}: {
  eyebrow: string;
  title: string;
  description: string;
  pathways: EcosystemPathway[];
  surface?: "paper" | "white";
}) {
  return (
    <section className={cn("px-4 py-20 sm:px-6 lg:px-8", surface === "white" ? "bg-white" : "bg-paper")}>
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <SectionHeading eyebrow={eyebrow} title={title} description={description} />
        </AnimatedSection>
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {pathways.map((pathway, index) => (
            <AnimatedSection key={pathway.title} delay={index * 0.05}>
              <article className="flex h-full flex-col rounded-lg border border-line bg-white p-6 shadow-card">
                <div className="flex items-start justify-between gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-flame-500 text-white">
                    <Icon name={pathway.icon} className="h-5 w-5" />
                  </span>
                  {pathway.metadata ? (
                    <span className="rounded-full bg-flame-50 px-3 py-1 text-xs font-semibold text-flame-700">{pathway.metadata}</span>
                  ) : null}
                </div>
                <h3 className="mt-5 text-xl font-semibold tracking-tight text-ink">{pathway.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted">{pathway.description}</p>
                <div className="mt-5 grid gap-2">
                  {pathway.steps.map((step) => (
                    <p key={step} className="flex items-center gap-2 text-sm font-semibold text-ink">
                      <Icon name="check" className="h-4 w-4 text-flame-600" />
                      {step}
                    </p>
                  ))}
                </div>
                <ButtonLink href={pathway.href} variant="secondary" className="mt-auto self-start">
                  {pathway.ctaLabel}
                </ButtonLink>
              </article>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

export function StoryGrid({ stories }: { stories: EcosystemStory[] }) {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {stories.map((story) => (
        <article key={story.title} className="rounded-lg border border-line bg-white p-6 shadow-card">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-ink px-3 py-1 text-xs font-semibold text-white">{story.category}</span>
            <span className="rounded-full border border-line bg-paper px-3 py-1 text-xs font-semibold text-muted">{story.region}</span>
          </div>
          <h3 className="mt-5 text-xl font-semibold tracking-tight text-ink">{story.title}</h3>
          <p className="mt-3 text-sm leading-6 text-muted">{story.summary}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {story.metrics.map((metric) => (
              <span key={metric} className="rounded-full bg-flame-50 px-3 py-1 text-xs font-semibold text-flame-700">
                {metric}
              </span>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}

export function DeploymentReadinessGrid({ regions }: { regions: DeploymentMapRegion[] }) {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {regions.map((region) => (
        <article key={region.name} className="rounded-lg border border-line bg-white p-6 shadow-card">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-flame-600">{region.status}</p>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight text-ink">{region.name}</h3>
            </div>
            <div className="text-right">
              <p className="text-3xl font-semibold text-flame-600">{region.readiness}%</p>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">readiness</p>
            </div>
          </div>
          <div className="mt-5 h-2 overflow-hidden rounded-full bg-paper">
            <div className="h-full rounded-full bg-flame-500" style={{ width: `${region.readiness}%` }} />
          </div>
          <div className="mt-5 grid gap-3 text-sm leading-6 text-muted">
            <p><strong className="text-ink">Focus:</strong> {region.focus}</p>
            <p><strong className="text-ink">Power:</strong> {region.power}</p>
            <p><strong className="text-ink">Connectivity:</strong> {region.connectivity}</p>
            <p><strong className="text-ink">Partners:</strong> {region.partners}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

export function EcosystemCtaBand({
  title,
  description,
  primary,
  secondary
}: {
  title: string;
  description: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
}) {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-lg bg-ink p-8 text-white shadow-soft md:p-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-flame-200">Next step</p>
            <h2 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
            <p className="mt-4 max-w-3xl text-base leading-7 text-white/70">{description}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <Link href={primary.href} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-flame-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-flame-600">
              {primary.label}
              <Icon name="arrow" className="h-4 w-4" />
            </Link>
            {secondary ? (
              <Link href={secondary.href} className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/25 px-5 py-3 text-sm font-semibold text-white transition hover:border-flame-300 hover:text-flame-200">
                {secondary.label}
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

