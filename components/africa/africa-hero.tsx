import Link from "next/link";
import { AfricaDeploymentMap } from "@/components/africa/africa-deployment-map";
import { Icon } from "@/components/icons";
import { africaHeroTrustIndicators } from "@/lib/data";

export function AfricaHero() {
  return (
    <section className="relative overflow-hidden bg-[#080808] pt-28 text-white sm:pt-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_77%_22%,rgba(249,115,22,0.34),transparent_30%),radial-gradient(circle_at_24%_16%,rgba(255,255,255,0.09),transparent_24%),linear-gradient(135deg,#080808_0%,#111111_54%,#351704_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,8,8,0.98)_0%,rgba(8,8,8,0.82)_48%,rgba(8,8,8,0.5)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-paper to-transparent" />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 pb-14 pt-10 sm:px-6 lg:grid-cols-[0.98fr_1.02fr] lg:px-8 lg:pb-20 lg:pt-20">
        <div className="self-center">
          <span className="inline-flex rounded-full border border-flame-400/35 bg-flame-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-flame-100">
            UK-Based · Africa-Focused · Deployment-Ready
          </span>
          <h1 className="mt-7 max-w-4xl text-4xl font-semibold leading-[1.04] tracking-tight sm:text-5xl lg:text-6xl">
            Refurbished technology as a bridge to digital education across Africa.
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-white/76 sm:text-lg">
            SIT Digital Access delivers practical deployment models for schools, NGOs,
            vocational centres and community learning hubs with logistics planning,
            power-aware infrastructure, local maintenance and offline-first learning support.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="#africa-enquiry"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-flame-500 px-6 py-3 text-sm font-semibold text-white shadow-card transition hover:bg-flame-600 focus:outline-none focus:ring-2 focus:ring-flame-300"
            >
              Discuss Deployment
              <Icon name="arrow" className="h-4 w-4" />
            </Link>
            <Link
              href="/donate"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/32 px-6 py-3 text-sm font-semibold text-white transition hover:border-flame-300 hover:text-flame-200 focus:outline-none focus:ring-2 focus:ring-flame-300"
            >
              Sponsor a Lab
            </Link>
            <Link
              href="#deployment-model"
              className="inline-flex min-h-12 items-center justify-center gap-2 px-2 py-3 text-sm font-semibold text-white/88 transition hover:text-flame-200"
            >
              View Deployment Model
              <Icon name="arrow" className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-9 grid gap-3 sm:grid-cols-2">
            {africaHeroTrustIndicators.map((item) => (
              <div key={item.title} className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/[0.04] p-3 backdrop-blur">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-flame-500/14 text-flame-300 ring-1 ring-flame-400/25">
                  <Icon name={item.icon} className="h-4 w-4" />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-white">{item.title}</span>
                  <span className="mt-1 block text-xs leading-5 text-white/56">{item.description}</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        <AfricaDeploymentMap variant="hero" activeCountry="Ghana" />
      </div>
    </section>
  );
}
