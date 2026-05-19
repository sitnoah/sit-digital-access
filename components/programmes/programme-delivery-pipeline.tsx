import { AnimatedSection } from "@/components/animated-section";
import { Icon } from "@/components/icons";
import { programmeDeliverySteps } from "@/lib/programmes";

export function ProgrammeDeliveryPipeline() {
  return (
    <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-flame-600">
              Delivery model
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              How programme delivery works.
            </h2>
            <p className="mt-4 text-base leading-8 text-muted">
              Programme delivery connects assessment, device planning, configured delivery,
              training, setup and support into one operational route.
            </p>
          </div>
        </AnimatedSection>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {programmeDeliverySteps.map((step, index) => (
            <AnimatedSection key={step.title} delay={index * 0.04}>
              <article className="group relative h-full overflow-hidden rounded-2xl border border-line bg-paper p-5 shadow-card transition duration-300 hover:-translate-y-1 hover:border-flame-300 hover:shadow-soft">
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-flame-500 to-transparent" />
                <div className="flex items-start justify-between gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-ink text-flame-300">
                    <Icon name={step.icon} className="h-5 w-5" />
                  </span>
                  <span className="text-sm font-semibold text-flame-600">0{index + 1}</span>
                </div>
                <h3 className="mt-5 text-xl font-semibold text-ink">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted">{step.description}</p>
                <div className="mt-5 grid gap-3 text-sm">
                  <p className="rounded-xl border border-line bg-white p-3"><strong>Timeline:</strong> {step.timeline}</p>
                  <p className="rounded-xl border border-line bg-white p-3"><strong>Support:</strong> {step.support}</p>
                  <p className="rounded-xl border border-line bg-white p-3"><strong>Consideration:</strong> {step.consideration}</p>
                </div>
              </article>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
