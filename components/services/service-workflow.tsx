import { AnimatedSection } from "@/components/animated-section";
import { Icon } from "@/components/icons";
import { serviceWorkflowSteps } from "@/lib/services";

export function ServiceWorkflow() {
  return (
    <section className="bg-paper px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-flame-600">
              Operational workflow
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              How service delivery works.
            </h2>
            <p className="mt-4 text-base leading-8 text-muted">
              A practical delivery process keeps service requests grounded in user needs, device
              readiness, deployment constraints and support after handover.
            </p>
          </div>
        </AnimatedSection>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {serviceWorkflowSteps.map((step, index) => (
            <AnimatedSection key={step.title} delay={index * 0.04}>
              <article className="relative h-full rounded-2xl border border-line bg-white p-6 shadow-card">
                <div className="flex items-center justify-between gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-flame-500 text-white">
                    <Icon name={step.icon} className="h-6 w-6" />
                  </span>
                  <span className="text-sm font-semibold text-flame-600">0{index + 1}</span>
                </div>
                <h3 className="mt-5 text-xl font-semibold text-ink">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted">{step.description}</p>
                <div className="mt-5 rounded-2xl border border-line bg-paper p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                    Operations insight
                  </p>
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
