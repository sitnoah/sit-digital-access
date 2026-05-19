import { AnimatedSection } from "@/components/animated-section";
import { Icon } from "@/components/icons";
import { schoolJourneySteps } from "@/lib/school-solutions";

export function SchoolDeploymentJourney() {
  return (
    <section className="bg-paper px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-flame-600">
              School deployment journey
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              From first conversation to a lab that keeps working after handover.
            </h2>
            <p className="mt-4 text-base leading-8 text-muted">
              A connected deployment workflow helps schools plan devices, software, teaching use,
              support expectations and future refresh needs together.
            </p>
          </div>
        </AnimatedSection>

        <div className="mt-10 grid gap-5 lg:grid-cols-7">
          {schoolJourneySteps.map((step, index) => (
            <AnimatedSection key={step.title} delay={index * 0.03}>
              <article className="relative h-full rounded-2xl border border-line bg-white p-5 shadow-card">
                {index < schoolJourneySteps.length - 1 ? (
                  <span className="absolute -right-3 top-10 hidden h-px w-6 bg-flame-300 lg:block" />
                ) : null}
                <div className="flex items-center justify-between gap-4">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-flame-500 text-white">
                    <Icon name={step.icon} className="h-5 w-5" />
                  </span>
                  <span className="text-sm font-semibold text-flame-600">0{index + 1}</span>
                </div>
                <h3 className="mt-5 text-lg font-semibold text-ink">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted">{step.description}</p>
                <div className="mt-5 rounded-2xl bg-paper p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Insight</p>
                  <p className="mt-2 text-sm font-semibold text-ink">{step.insight}</p>
                </div>
              </article>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
