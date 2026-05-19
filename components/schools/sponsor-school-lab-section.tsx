import Link from "next/link";
import { AnimatedSection } from "@/components/animated-section";
import { Icon } from "@/components/icons";
import { sponsorOptions } from "@/lib/school-solutions";

export function SponsorSchoolLabSection() {
  return (
    <section className="bg-ink px-4 py-20 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-flame-300">
                Sponsor a school lab
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                Help a school launch digital learning.
              </h2>
              <p className="mt-4 text-base leading-8 text-white/68">
                Donors, CSR teams and partners can fund learner devices, starter labs, full labs,
                instructor access, training and support.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/donate" className="inline-flex min-h-12 items-center justify-center rounded-full bg-flame-500 px-6 text-sm font-semibold text-white transition hover:bg-flame-600">
                  Sponsor a Lab
                </Link>
                <Link href="/contact" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/20 px-6 text-sm font-semibold text-white transition hover:border-flame-300 hover:bg-white/10">
                  Talk to Partnerships
                </Link>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {sponsorOptions.map((option, index) => (
                <AnimatedSection key={option.title} delay={index * 0.03}>
                  <article className="h-full rounded-2xl border border-white/10 bg-white/[0.055] p-5 backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-flame-300/50 hover:bg-white/[0.08]">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-flame-500 text-white">
                      <Icon name={option.icon} className="h-5 w-5" />
                    </span>
                    <h3 className="mt-5 text-lg font-semibold">{option.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-white/65">{option.description}</p>
                  </article>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
