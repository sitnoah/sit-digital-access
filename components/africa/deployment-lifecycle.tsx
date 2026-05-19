import { Icon } from "@/components/icons";
import { africaLifecycleSteps } from "@/lib/data";

export function DeploymentLifecycle() {
  return (
    <section id="deployment-model" className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-flame-600">
            Deployment lifecycle
          </p>
          <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl">
            Built for schools that need devices to keep working after handover.
          </h2>
          <p className="mt-5 max-w-3xl text-base leading-7 text-muted">
            Successful deployment is not just shipment. The lifecycle connects assessment,
            device preparation, logistics, installation, local enablement and reporting.
          </p>
        </div>

        <div className="relative mt-12">
          <div className="absolute left-5 top-0 hidden h-full w-px bg-gradient-to-b from-flame-500 via-line to-transparent lg:left-1/2 lg:block" />
          <div className="grid gap-5">
            {africaLifecycleSteps.map((step, index) => {
              const alignRight = index % 2 === 1;
              return (
                <article
                  key={step.title}
                  className={`relative grid gap-5 lg:grid-cols-2 ${alignRight ? "" : "lg:[&>*:first-child]:col-start-1"}`}
                >
                  <div className={alignRight ? "lg:col-start-2" : ""}>
                    <div className="rounded-lg border border-line bg-paper p-5 shadow-card transition hover:-translate-y-1 hover:border-flame-300">
                      <div className="flex items-start gap-4">
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-ink text-flame-300">
                          <Icon name={step.icon} className="h-5 w-5" />
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-flame-600">
                            0{index + 1} · {step.metadata}
                          </p>
                          <h3 className="mt-2 text-xl font-semibold text-ink">{step.title}</h3>
                          <p className="mt-3 text-sm leading-6 text-muted">{step.description}</p>
                        </div>
                      </div>
                      <div className="mt-5 rounded-lg border border-line bg-white p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                          Operations insight
                        </p>
                        <p className="mt-2 text-sm font-semibold text-ink">{step.insight}</p>
                      </div>
                    </div>
                  </div>
                  <span className="absolute left-0 top-6 hidden h-10 w-10 items-center justify-center rounded-full border border-flame-300 bg-white text-sm font-semibold text-flame-600 shadow-card lg:left-1/2 lg:flex lg:-translate-x-1/2">
                    {index + 1}
                  </span>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
