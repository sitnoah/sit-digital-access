import { AnimatedSection } from "@/components/animated-section";
import { Icon } from "@/components/icons";
import { educationUseCases } from "@/lib/school-solutions";

export function EducationUseCases() {
  return (
    <section className="bg-[linear-gradient(180deg,#ffffff_0%,#f7f7f5_100%)] px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-flame-600">
              Education use cases
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              Support the lessons, cohorts and learning hubs already on your timetable.
            </h2>
            <p className="mt-4 text-base leading-8 text-muted">
              Device and support choices should follow the teaching model, training pathway and
              supervision needs of each learning environment.
            </p>
          </div>
        </AnimatedSection>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {educationUseCases.map((useCase, index) => (
            <AnimatedSection key={useCase.title} delay={index * 0.03}>
              <article className="h-full rounded-2xl border border-line bg-white p-6 shadow-card transition duration-300 hover:-translate-y-1 hover:border-flame-300 hover:shadow-soft">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-flame-500 text-white">
                  <Icon name={useCase.icon} className="h-6 w-6" />
                </span>
                <h3 className="mt-5 text-xl font-semibold text-ink">{useCase.title}</h3>
                <dl className="mt-5 space-y-3 text-sm">
                  {[
                    ["Device type", useCase.recommendedDevice],
                    ["Support", useCase.supportRequirement],
                    ["Training", useCase.trainingPathway]
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-xl border border-line bg-paper p-3">
                      <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">{label}</dt>
                      <dd className="mt-1 font-semibold text-ink">{value}</dd>
                    </div>
                  ))}
                </dl>
              </article>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
