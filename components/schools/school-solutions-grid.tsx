import Link from "next/link";
import { AnimatedSection } from "@/components/animated-section";
import { Icon } from "@/components/icons";
import { schoolSolutions } from "@/lib/school-solutions";

export function SchoolSolutionsGrid() {
  return (
    <section id="school-solutions" className="scroll-mt-36 bg-[linear-gradient(180deg,#ffffff_0%,#f7f7f5_100%)] px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-flame-600">
              Education technology access
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              Everything a school or training centre needs to start small and grow responsibly.
            </h2>
            <p className="mt-4 text-base leading-8 text-muted">
              Device access works best when hardware, software, network setup, teaching needs and
              maintenance planning are considered together.
            </p>
          </div>
        </AnimatedSection>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {schoolSolutions.map((solution, index) => (
            <AnimatedSection key={solution.title} delay={index * 0.03}>
              <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white p-6 shadow-card transition duration-300 hover:-translate-y-1 hover:border-flame-300 hover:shadow-soft">
                <div className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-flame-500 via-flame-300 to-transparent transition duration-300 group-hover:scale-x-100" />
                <div className="flex items-start justify-between gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-flame-500 text-white shadow-card">
                    <Icon name={solution.icon} className="h-6 w-6" />
                  </span>
                  <span className="rounded-full bg-ink px-3 py-1 text-xs font-semibold text-white">
                    {solution.category}
                  </span>
                </div>
                <h3 className="mt-5 text-xl font-semibold tracking-tight text-ink">{solution.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted">{solution.description}</p>
                <div className="mt-5 rounded-2xl border border-line bg-paper p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Best for</p>
                  <p className="mt-2 text-sm font-semibold text-ink">{solution.bestFor}</p>
                </div>
                <ul className="mt-5 space-y-2">
                  {solution.includes.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm leading-6 text-muted">
                      <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-flame-600" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link href="#school-enquiry" className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold text-flame-600">
                  {solution.cta}
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
