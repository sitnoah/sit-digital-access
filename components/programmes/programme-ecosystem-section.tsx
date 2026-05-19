import { AnimatedSection } from "@/components/animated-section";
import { Icon } from "@/components/icons";
import { deploymentExamples, programmeEcosystem } from "@/lib/programmes";

export function ProgrammeEcosystemSection() {
  return (
    <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-flame-600">
              Technology + training + support
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              A joined-up programme ecosystem, not isolated device handouts.
            </h2>
            <p className="mt-4 text-base leading-8 text-muted">
              Each pathway can connect refurbished devices, practical setup, skills training,
              deployment planning, support and partner-ready reporting.
            </p>
          </div>
        </AnimatedSection>

        <div className="mt-10 rounded-3xl border border-line bg-[radial-gradient(circle_at_top_left,rgba(255,111,0,0.12),transparent_34%),linear-gradient(135deg,#111111,#1c1a17)] p-4 shadow-soft sm:p-6">
          <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
            {programmeEcosystem.map((item, index) => (
              <AnimatedSection key={item.title} delay={index * 0.03}>
                <article className="relative h-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] p-5 text-white backdrop-blur">
                  {index < programmeEcosystem.length - 1 ? (
                    <span className="absolute right-3 top-8 hidden h-px w-8 bg-gradient-to-r from-flame-400 to-transparent xl:block" />
                  ) : null}
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-flame-500 text-white shadow-card">
                    <Icon name={item.icon} className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/68">{item.description}</p>
                </article>
              </AnimatedSection>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {deploymentExamples.map((example, index) => (
            <AnimatedSection key={example.title} delay={index * 0.04}>
              <article className="group h-full rounded-2xl border border-line bg-paper p-6 shadow-card transition duration-300 hover:-translate-y-1 hover:border-flame-300 hover:bg-white hover:shadow-soft">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-flame-50 text-flame-600 transition group-hover:bg-flame-500 group-hover:text-white">
                  <Icon name={example.icon} className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-lg font-semibold text-ink">{example.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted">{example.description}</p>
              </article>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
