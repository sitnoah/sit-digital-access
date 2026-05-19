import Link from "next/link";
import { Icon } from "@/components/icons";
import { contactHeroCards, contactHeroPipeline } from "@/lib/contact-options";

export function ContactHero() {
  return (
    <section className="relative overflow-hidden bg-[#0a0a0a] px-4 pb-20 pt-44 text-white sm:px-6 lg:px-8 lg:pb-24 lg:pt-48">
      <div className="absolute inset-0 surface-grid opacity-[0.08]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_26%,rgba(249,115,22,0.28),transparent_28%),linear-gradient(135deg,#0a0a0a_0%,#111_56%,#341604_100%)]" />
      <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div>
          <span className="inline-flex rounded-full border border-flame-400/35 bg-flame-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-flame-100">
            CONTACT · DEVICES · PARTNERSHIPS · DEPLOYMENT
          </span>
          <h1 className="mt-6 max-w-4xl text-4xl font-semibold leading-[1.04] tracking-tight sm:text-5xl lg:text-[60px]">
            Request devices, discuss a partnership or plan a deployment.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-white/70 sm:text-lg">
            Use one clear enquiry route for refurbished device requests, computer lab planning,
            sponsorship, device donations, digital skills support and Africa deployment
            conversations.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="#contact-form"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-flame-500 px-6 py-3 text-sm font-semibold text-white shadow-card transition hover:bg-flame-600"
            >
              Send Enquiry
              <Icon name="arrow" className="h-4 w-4" />
            </Link>
            <Link
              href="/devices#device-request"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/28 px-6 py-3 text-sm font-semibold text-white transition hover:border-flame-300 hover:text-flame-100"
            >
              Request Devices
            </Link>
            <Link
              href="/donate"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/18 bg-white/8 px-6 py-3 text-sm font-semibold text-white transition hover:border-flame-300 hover:bg-white/12 hover:text-flame-100"
            >
              Sponsor Devices
            </Link>
          </div>
        </div>

        <div className="relative rounded-[2rem] border border-white/12 bg-white/[0.055] p-4 shadow-[0_28px_90px_rgba(0,0,0,0.42)] backdrop-blur-xl sm:p-5">
          <div className="rounded-[1.5rem] border border-white/10 bg-[#111] p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-flame-200">
                  Enquiry operations
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight">Response pipeline</h2>
              </div>
              <span className="rounded-full border border-flame-300/25 bg-flame-500/12 px-3 py-1 text-xs font-semibold text-flame-100">
                Live-ready
              </span>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {contactHeroCards.map((card) => (
                <article key={card.title} className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-flame-500 text-white">
                    <Icon name={card.icon} className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-base font-semibold text-white">{card.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/52">{card.detail}</p>
                </article>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-4">
              <div className="flex flex-wrap items-center gap-2">
                {contactHeroPipeline.map((step, index) => (
                  <div key={step} className="flex items-center gap-2">
                    <span className="rounded-full border border-white/10 bg-white/[0.07] px-3 py-2 text-xs font-semibold text-white/82">
                      {step}
                    </span>
                    {index < contactHeroPipeline.length - 1 ? (
                      <Icon name="arrow" className="h-4 w-4 text-flame-300" />
                    ) : null}
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-2xl border border-flame-300/20 bg-flame-500/10 p-5">
                <div className="flex items-start gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-flame-500 text-white">
                    <Icon name="check" className="h-5 w-5" />
                  </span>
                  <p className="text-lg font-semibold leading-7 text-white">
                    Practical response · Clear next step · Deployment-aware support
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
