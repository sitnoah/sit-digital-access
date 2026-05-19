import Link from "next/link";
import { AnimatedSection } from "@/components/animated-section";
import { Icon } from "@/components/icons";
import { labAddOns, labPackages } from "@/lib/school-solutions";

export function LabPackageBuilder() {
  return (
    <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-flame-600">
                Lab package builder
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                Build a school lab package.
              </h2>
              <p className="mt-4 text-base leading-8 text-muted">
                Start with a practical package, then add the accessories, software, support and
                training that match your teaching environment.
              </p>
            </div>
            <div className="rounded-2xl border border-line bg-paper p-4 shadow-card">
              <p className="text-sm font-semibold text-ink">Optional add-ons</p>
              <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                {labAddOns.map((item) => (
                  <span key={item} className="shrink-0 rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-muted">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </AnimatedSection>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
          {labPackages.map((pkg, index) => (
            <AnimatedSection key={pkg.title} delay={index * 0.04}>
              <article className="flex h-full flex-col rounded-2xl border border-line bg-paper p-5 shadow-card transition duration-300 hover:-translate-y-1 hover:border-flame-300 hover:bg-white hover:shadow-soft">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-flame-500 text-white">
                  <Icon name={pkg.icon} className="h-6 w-6" />
                </span>
                <h3 className="mt-5 text-xl font-semibold text-ink">{pkg.title}</h3>
                <p className="mt-2 text-3xl font-semibold text-flame-600">{pkg.deviceCount}</p>
                <dl className="mt-5 space-y-3 text-sm">
                  {[
                    ["Best for", pkg.bestFor],
                    ["Room size", pkg.roomSize],
                    ["Network", pkg.networkNeeds],
                    ["Support", pkg.supportLevel]
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-xl border border-line bg-white p-3">
                      <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">{label}</dt>
                      <dd className="mt-1 font-semibold text-ink">{value}</dd>
                    </div>
                  ))}
                </dl>
                <Link href="#school-enquiry" className="mt-auto inline-flex min-h-11 items-center justify-center rounded-full bg-ink px-4 pt-0 text-sm font-semibold text-white transition hover:bg-flame-600">
                  Request package
                </Link>
              </article>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
