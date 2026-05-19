import Link from "next/link";
import { AnimatedSection } from "@/components/animated-section";
import { Icon } from "@/components/icons";
import { programmeImpactMetrics, sponsorshipModels } from "@/lib/programmes";

export function ProgrammeImpactSection() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-flame-600">
                Sponsorship and impact
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                Programmes designed for measurable impact.
              </h2>
              <p className="mt-4 text-base leading-8 text-muted">
                Programme-level reporting can support CSR, NGO and donor accountability workflows
                across device access, training, deployment and learner outcomes.
              </p>
            </div>
            <div className="rounded-2xl border border-line bg-white p-5 shadow-card">
              <p className="text-sm font-semibold text-ink">Sponsorship models</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {sponsorshipModels.map((item) => (
                  <span key={item} className="rounded-full border border-flame-200 bg-flame-50 px-3 py-1 text-xs font-semibold text-flame-700">
                    {item}
                  </span>
                ))}
              </div>
              <Link href="/donate" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-flame-600">
                Explore sponsorship
                <Icon name="arrow" className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </AnimatedSection>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {programmeImpactMetrics.map((metric, index) => (
            <AnimatedSection key={metric.label} delay={index * 0.03}>
              <article className="rounded-2xl border border-line bg-white p-6 shadow-card">
                <div className="flex items-start justify-between gap-4">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-ink text-flame-300">
                    <Icon name={metric.icon} className="h-5 w-5" />
                  </span>
                  <p className="text-3xl font-semibold text-flame-600">{metric.value}</p>
                </div>
                <h3 className="mt-5 text-lg font-semibold text-ink">{metric.label}</h3>
              </article>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
