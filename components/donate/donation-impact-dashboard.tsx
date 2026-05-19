import { AnimatedSection } from "@/components/animated-section";
import { Icon } from "@/components/icons";
import { donationImpactExamples, donationImpactMetrics } from "@/lib/donation-options";

export function DonationImpactDashboard() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-flame-600">
                Impact transparency
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                See what your donation can unlock.
              </h2>
              <p className="mt-4 text-base leading-8 text-muted">
                Device donation and sponsorship can be translated into visible outputs: prepared
                devices, supported learners, enabled classrooms, lab deployments and reuse impact.
              </p>
            </div>
            <div className="rounded-2xl border border-line bg-white p-4 shadow-card">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                    Donation impact model
                  </p>
                  <p className="mt-1 text-lg font-semibold text-ink">Reusable, reportable, practical</p>
                </div>
                <span className="rounded-full bg-flame-50 px-3 py-1 text-xs font-semibold text-flame-700">
                  Dashboard view
                </span>
              </div>
              <div className="mt-5 h-28 rounded-xl border border-line bg-[linear-gradient(180deg,#fff_0%,#fff7ed_100%)] p-4">
                <div className="flex h-full items-end gap-2">
                  {[34, 58, 46, 72, 62, 84, 78, 92].map((height, index) => (
                    <span
                      key={height + index}
                      className="flex-1 rounded-t-lg bg-gradient-to-t from-flame-600 to-flame-300"
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {donationImpactMetrics.map((metric, index) => (
            <AnimatedSection key={metric.label} delay={index * 0.03}>
              <article className="rounded-2xl border border-line bg-white p-6 shadow-card">
                <div className="flex items-start justify-between gap-4">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-ink text-flame-300">
                    <Icon name={metric.icon} className="h-5 w-5" />
                  </span>
                  <p className="text-3xl font-semibold text-flame-600">{metric.value}</p>
                </div>
                <h3 className="mt-5 text-lg font-semibold text-ink">{metric.label}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{metric.detail}</p>
              </article>
            </AnimatedSection>
          ))}
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-4">
          {donationImpactExamples.map((example) => (
            <article key={example.title} className="rounded-2xl border border-line bg-paper p-5">
              <Icon name={example.icon} className="h-5 w-5 text-flame-600" />
              <h3 className="mt-4 text-lg font-semibold text-ink">{example.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{example.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
