import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/icons";

const heroMetrics = [
  { title: "24 devices configured", icon: "laptop" as const },
  { title: "School lab setup", icon: "school" as const },
  { title: "Microsoft 365 ready", icon: "cloud" as const },
  { title: "Offline deployment", icon: "offline" as const }
];

const trustIndicators = [
  "Secure setup",
  "Deployment-aware",
  "Training-supported",
  "Africa-ready",
  "Support-ready"
];

export function ServicesHero() {
  return (
    <section className="relative overflow-hidden bg-[#090909] px-4 pb-20 pt-44 text-white sm:px-6 lg:px-8 lg:pb-24 lg:pt-48">
      <div className="absolute inset-0 surface-grid opacity-[0.08]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_20%,rgba(249,115,22,0.30),transparent_30%),linear-gradient(135deg,#0a0a0a_0%,#111_55%,#321604_100%)]" />
      <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div>
          <span className="inline-flex rounded-full border border-flame-400/35 bg-flame-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-flame-100">
            SERVICES · SETUP · SUPPORT · DEPLOYMENT
          </span>
          <h1 className="mt-6 max-w-4xl text-4xl font-semibold leading-[1.04] tracking-tight sm:text-5xl lg:text-[60px]">
            Technology, setup, support and training services designed for practical digital access.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-white/70 sm:text-lg">
            From procurement and secure wiping to lab deployment, cloud setup, IT support and
            digital skills enablement, SIT Digital Access helps schools, SMEs, NGOs and communities
            use technology with confidence from day one.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="#service-enquiry" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-flame-500 px-6 py-3 text-sm font-semibold text-white shadow-card transition hover:bg-flame-600">
              Request Services
              <Icon name="arrow" className="h-4 w-4" />
            </Link>
            <Link href="/devices" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/28 px-6 py-3 text-sm font-semibold text-white transition hover:border-flame-300 hover:text-flame-100">
              Explore Devices
            </Link>
            <Link href="/africa-deployment" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/18 bg-white/8 px-6 py-3 text-sm font-semibold text-white transition hover:border-flame-300 hover:bg-white/12 hover:text-flame-100">
              Plan a Deployment
            </Link>
          </div>
        </div>

        <div className="relative rounded-[2rem] border border-white/12 bg-white/[0.055] p-4 shadow-[0_28px_90px_rgba(0,0,0,0.42)] backdrop-blur-xl sm:p-5">
          <div className="rounded-[1.5rem] border border-white/10 bg-[#111] p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-flame-200">
                  Service operations
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight">Deployment readiness dashboard</h2>
              </div>
              <span className="rounded-full border border-flame-300/25 bg-flame-500/12 px-3 py-1 text-xs font-semibold text-flame-100">
                Live workflow
              </span>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {heroMetrics.map((metric) => (
                <article key={metric.title} className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-flame-500 text-white">
                    <Icon name={metric.icon} className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-base font-semibold text-white">{metric.title}</h3>
                </article>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-4">
              <p className="text-sm font-semibold text-white">Device setup workflow</p>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {["Assess", "Wipe", "Configure", "Deploy", "Support"].map((step, index, steps) => (
                  <div key={step} className="flex items-center gap-2">
                    <span className="rounded-full border border-white/10 bg-white/[0.07] px-3 py-2 text-xs font-semibold text-white/82">
                      {step}
                    </span>
                    {index < steps.length - 1 ? <Icon name="arrow" className="h-4 w-4 text-flame-300" /> : null}
                  </div>
                ))}
              </div>
              <div className="mt-5 grid gap-2 sm:grid-cols-2">
                {trustIndicators.map((item) => (
                  <div key={item} className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.045] px-3 py-2 text-sm font-semibold text-white/74">
                    <Icon name="check" className="h-4 w-4 text-flame-300" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.05] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
                Support queue
              </p>
              <div className="mt-3 space-y-2">
                {["Lab network check", "Endpoint readiness", "Training pathway"].map((item) => (
                  <div key={item} className="flex items-center justify-between rounded-xl bg-black/20 px-3 py-2">
                    <span className="text-sm font-semibold text-white/78">{item}</span>
                    <span className="text-xs font-semibold text-flame-200">Ready</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-white p-4">
              <div className="relative aspect-[16/6]">
                <Image
                  src="/devices/computer-lab.svg"
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 42vw, 100vw"
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
