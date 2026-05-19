import Image from "next/image";
import Link from "next/link";
import { AnimatedSection } from "@/components/animated-section";
import { Icon } from "@/components/icons";
import type { Programme } from "@/types/programme";

export function ProgrammeDetailHero({ programme }: { programme: Programme }) {
  return (
    <section className="relative overflow-hidden bg-[radial-gradient(circle_at_72%_18%,rgba(255,111,0,0.22),transparent_34%),linear-gradient(135deg,#080808,#161616_54%,#21170f)] px-4 pb-20 pt-20 text-white sm:px-6 lg:px-8 lg:pt-24">
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-flame-400/60 to-transparent" />
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.98fr_1.02fr] lg:items-center">
        <AnimatedSection>
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-flame-400/40 bg-flame-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-flame-200">
              <Icon name={programme.icon} className="h-4 w-4" />
              {programme.category}
            </div>
            <h1 className="mt-6 max-w-4xl text-4xl font-semibold tracking-tight sm:text-5xl">
              {programme.title}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/72">
              {programme.longDescription}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">
                {programme.deploymentReadiness} deployment readiness
              </span>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">
                {programme.trainingIncluded ? "Training included" : "Training optional"}
              </span>
              {programme.sponsorReady ? (
                <span className="rounded-full bg-flame-500 px-3 py-1 text-xs font-semibold text-white">
                  Sponsor-ready
                </span>
              ) : null}
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="#programme-enquiry" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-flame-500 px-6 text-sm font-semibold text-white transition hover:bg-flame-600">
                Start enquiry
                <Icon name="arrow" className="h-4 w-4" />
              </Link>
              <Link href="/donate" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/20 px-6 text-sm font-semibold text-white transition hover:border-flame-300 hover:bg-white/10">
                Sponsor this programme
              </Link>
              <Link href="/programmes#programme-catalogue" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/20 px-6 text-sm font-semibold text-white transition hover:border-flame-300 hover:bg-white/10">
                Compare programmes
              </Link>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.08}>
          <div className="relative">
            <div className="absolute -inset-8 rounded-full bg-flame-500/20 blur-3xl" />
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.06] p-5 shadow-soft backdrop-blur">
              <div className="relative aspect-[16/11] overflow-hidden rounded-2xl bg-white/8">
                <Image
                  src={programme.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-contain p-8"
                  priority
                />
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {[
                  ["Cohort", programme.cohortRange],
                  ["Devices", programme.deviceRange],
                  ["Support", programme.supportLevel]
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/48">{label}</p>
                    <p className="mt-2 text-sm font-semibold text-white">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
