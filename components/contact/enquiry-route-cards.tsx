import Link from "next/link";
import { AnimatedSection } from "@/components/animated-section";
import { Icon } from "@/components/icons";
import { enquiryRoutes } from "@/lib/contact-options";

export function EnquiryRouteCards() {
  return (
    <section className="bg-[linear-gradient(180deg,#ffffff_0%,#f7f7f5_100%)] px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-flame-600">
              Enquiry routes
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              Choose the right route for your enquiry.
            </h2>
            <p className="mt-4 text-base leading-8 text-muted">
              Whether you need one laptop, a full lab, a sponsorship route or Africa deployment
              planning, the team can guide you to the right next step.
            </p>
          </div>
        </AnimatedSection>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {enquiryRoutes.map((route, index) => (
            <AnimatedSection key={route.title} delay={index * 0.03}>
              <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white p-6 shadow-card transition duration-300 hover:-translate-y-1 hover:border-flame-300 hover:shadow-soft">
                <div className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-flame-500 via-flame-300 to-transparent transition duration-300 group-hover:scale-x-100" />
                <div className="flex items-start justify-between gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-flame-500 to-flame-600 text-white shadow-[0_18px_44px_rgba(249,115,22,0.24)]">
                    <Icon name={route.icon} className="h-5 w-5" />
                  </span>
                  <span className="rounded-full border border-flame-200 bg-flame-50 px-3 py-1 text-xs font-semibold text-flame-700">
                    {route.tag}
                  </span>
                </div>
                <h3 className="mt-5 text-xl font-semibold tracking-tight text-ink">{route.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted">{route.description}</p>
                <div className="mt-5 rounded-xl border border-line bg-paper p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
                    Best for
                  </p>
                  <p className="mt-2 text-sm font-semibold leading-6 text-ink">{route.bestFor}</p>
                </div>
                <Link
                  href={route.ctaHref}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-flame-600 transition hover:text-flame-700"
                >
                  {route.ctaLabel}
                  <Icon name="arrow" className="h-4 w-4" />
                </Link>
              </article>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
