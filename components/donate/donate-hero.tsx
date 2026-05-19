import Link from "next/link";
import { Icon } from "@/components/icons";
import { donationHeroFlow, donationHeroStats } from "@/lib/donation-options";

export function DonateHero() {
  return (
    <section className="relative overflow-hidden bg-[#090909] px-4 pb-20 pt-44 text-white sm:px-6 lg:px-8 lg:pb-24 lg:pt-48">
      <div className="absolute inset-0 surface-grid opacity-[0.08]" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-flame-500/12 to-transparent" />
      <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div>
          <span className="inline-flex rounded-full border border-flame-400/35 bg-flame-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-flame-100">
            DONATE · SPONSOR · RECYCLE · DEPLOY
          </span>
          <h1 className="mt-6 max-w-4xl text-4xl font-semibold leading-[1.04] tracking-tight sm:text-5xl lg:text-[64px]">
            Turn unused technology into real digital access.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-white/70 sm:text-lg">
            Companies, individuals and donors can help learners, schools and communities access
            refurbished devices, computer labs and practical digital skills through secure donation,
            sponsorship and responsible technology reuse.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="#donation-form"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-flame-500 px-6 py-3 text-sm font-semibold text-white shadow-card transition hover:bg-flame-600"
            >
              Start a Donation
              <Icon name="arrow" className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/28 px-6 py-3 text-sm font-semibold text-white transition hover:border-flame-300 hover:text-flame-100"
            >
              Ask About Partnerships
            </Link>
            <Link
              href="#sponsorship-packages"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/18 bg-white/8 px-6 py-3 text-sm font-semibold text-white transition hover:border-flame-300 hover:bg-white/12 hover:text-flame-100"
            >
              Sponsor a Lab
            </Link>
          </div>
        </div>

        <div>
          <div className="relative rounded-[2rem] border border-white/12 bg-white/[0.055] p-4 shadow-[0_28px_90px_rgba(0,0,0,0.42)] backdrop-blur-xl sm:p-5">
            <div className="rounded-[1.5rem] border border-white/10 bg-[#111] p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-flame-200">
                    Device donation dashboard
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                    Reuse pipeline
                  </h2>
                </div>
                <span className="rounded-full border border-flame-300/25 bg-flame-500/12 px-3 py-1 text-xs font-semibold text-flame-100">
                  Impact-ready
                </span>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-4">
                {donationHeroStats.map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
                    <p className="text-3xl font-semibold text-white">{stat.value}</p>
                    <p className="mt-1 text-sm font-semibold text-flame-200">{stat.label}</p>
                    <p className="mt-2 text-xs leading-5 text-white/48">{stat.detail}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-4">
                <div className="flex flex-wrap items-center gap-2">
                  {donationHeroFlow.map((step, index) => (
                    <div key={step} className="flex items-center gap-2">
                      <span className="rounded-full border border-white/10 bg-white/[0.07] px-3 py-2 text-xs font-semibold text-white/82">
                        {step}
                      </span>
                      {index < donationHeroFlow.length - 1 ? (
                        <Icon name="arrow" className="h-4 w-4 text-flame-300" />
                      ) : null}
                    </div>
                  ))}
                </div>
                <div className="mt-5 grid gap-4 md:grid-cols-[1fr_0.85fr] md:items-end">
                  <div className="relative min-h-44 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-zinc-800 to-black p-5">
                    <div className="absolute bottom-5 left-5 h-20 w-36 rounded-lg border border-white/20 bg-gradient-to-br from-zinc-900 to-zinc-700 shadow-soft">
                      <div className="mx-auto mt-3 h-10 w-28 rounded bg-flame-500/12" />
                    </div>
                    <div className="absolute bottom-4 right-8 h-28 w-16 rounded-xl border border-white/14 bg-gradient-to-br from-zinc-700 to-zinc-950 shadow-card" />
                    <div className="absolute right-5 top-5 rounded-xl border border-white/10 bg-white/[0.06] p-3 text-xs text-white/62">
                      Classroom bundle
                    </div>
                  </div>
                  <div className="rounded-2xl border border-flame-300/20 bg-flame-500/10 p-5">
                    <div className="flex items-start gap-3">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-flame-500 text-white">
                        <Icon name="shield" className="h-5 w-5" />
                      </span>
                      <p className="text-lg font-semibold leading-7 text-white">
                        Secure data wipe · Tested devices · Measurable impact
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
