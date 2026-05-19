import Link from "next/link";
import { AnimatedSection } from "@/components/animated-section";
import { Icon } from "@/components/icons";
import { corporateReuseCapabilities, corporateReuseWorkflow } from "@/lib/donation-options";

export function CorporateRecyclingSection() {
  return (
    <section id="corporate-recycling" className="scroll-mt-36 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#0b0b0b] text-white shadow-soft">
        <div className="relative p-6 sm:p-8 lg:p-12">
          <div className="absolute inset-0 surface-grid opacity-[0.08]" />
          <div className="relative grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <AnimatedSection>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-flame-300">
                Corporate recycling
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                Responsible device reuse for companies.
              </h2>
              <p className="mt-5 text-base leading-8 text-white/68">
                Turn retired laptops, desktops and accessories from IT refresh cycles into a
                secure, practical social-impact pathway for learners, schools, NGOs and community
                hubs.
              </p>
              <div className="mt-8 grid gap-3">
                {corporateReuseCapabilities.map((item) => (
                  <div key={item.title} className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.055] p-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-flame-500 text-white">
                      <Icon name={item.icon} className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-white/58">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                href="#donation-form"
                className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-flame-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-flame-600"
              >
                Discuss Corporate Recycling
                <Icon name="arrow" className="h-4 w-4" />
              </Link>
            </AnimatedSection>

            <AnimatedSection delay={0.1}>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-4 backdrop-blur">
                <div className="grid gap-3 sm:grid-cols-2">
                  {corporateReuseWorkflow.map((step, index) => (
                    <article key={step.title} className="rounded-2xl border border-white/10 bg-black/24 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-flame-500 text-white">
                          <Icon name={step.icon} className="h-5 w-5" />
                        </span>
                        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-white/34">
                          0{index + 1}
                        </span>
                      </div>
                      <h3 className="mt-4 text-lg font-semibold text-white">{step.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-white/58">{step.description}</p>
                    </article>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  );
}
