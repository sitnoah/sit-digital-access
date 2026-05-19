import { AnimatedSection } from "@/components/animated-section";
import { Icon } from "@/components/icons";
import { serviceImpactMetrics, serviceTrustBadges } from "@/lib/services";

export function ServiceImpactTrust() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-flame-600">
                Impact and trust
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                Service delivery with security, documentation and support in view.
              </h2>
              <p className="mt-4 text-base leading-8 text-muted">
                Services are shaped around practical outcomes: configured devices, supported labs,
                training hours, issue resolution and deployment-ready workflows.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 lg:justify-end">
              {serviceTrustBadges.map((badge) => (
                <span key={badge} className="rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-muted shadow-sm">
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </AnimatedSection>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {serviceImpactMetrics.map((metric, index) => (
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
