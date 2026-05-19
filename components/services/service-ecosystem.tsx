import { AnimatedSection } from "@/components/animated-section";
import { Icon } from "@/components/icons";
import { serviceEcosystem } from "@/lib/services";

export function ServiceEcosystem() {
  return (
    <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-flame-600">
              Service ecosystem
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              Technology access works best when devices, setup, training and support work together.
            </h2>
            <p className="mt-4 text-base leading-8 text-muted">
              SIT Digital Access services are modular, but they are designed to connect into one
              practical operating model for delivery, support and reporting.
            </p>
          </div>
        </AnimatedSection>

        <div className="mt-10 rounded-3xl border border-line bg-[radial-gradient(circle_at_top_left,rgba(255,111,0,0.12),transparent_34%),linear-gradient(135deg,#111111,#1c1a17)] p-4 shadow-soft sm:p-6">
          <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-7">
            {serviceEcosystem.map((item, index) => (
              <AnimatedSection key={item.title} delay={index * 0.03}>
                <article className="relative h-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] p-5 text-white backdrop-blur">
                  {index < serviceEcosystem.length - 1 ? (
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
      </div>
    </section>
  );
}
