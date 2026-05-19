import Link from "next/link";
import { Icon } from "@/components/icons";
import { donationCtaOptions } from "@/lib/data";

export function DonationCTA() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-lg bg-ink text-white shadow-soft">
        <div className="relative grid gap-10 px-6 py-12 sm:px-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-14">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_24%,rgba(249,115,22,0.42),transparent_30%),linear-gradient(135deg,#111111_0%,#1b1b1b_58%,#3b1a07_100%)]" />
          <div className="relative">
            <p className="mb-3 text-sm font-semibold uppercase text-flame-300">Donate or sponsor</p>
            <h2 className="text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
              Turn unused technology into learning opportunity.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/72">
              Retired business hardware and targeted sponsorship can become secure,
              configured devices for learners, classrooms, community hubs and field teams.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/donate"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-flame-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-flame-600"
              >
                Donate Devices
              </Link>
              <Link
                href="/donate"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/28 px-6 py-3 text-sm font-semibold text-white transition hover:border-flame-300 hover:text-flame-200"
              >
                Sponsor a Lab
              </Link>
              <Link
                href="/contact"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/18 px-6 py-3 text-sm font-semibold text-white/84 transition hover:border-white/40 hover:text-white"
              >
                Talk to Partnerships
              </Link>
            </div>
          </div>

          <div className="relative grid gap-3 sm:grid-cols-2">
            {donationCtaOptions.map((option, index) => (
              <div key={option} className="rounded-lg border border-white/12 bg-white/[0.07] p-4 backdrop-blur">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-flame-500 text-white">
                    <Icon name={index === 0 ? "laptop" : index === 4 ? "recycle" : "heart"} className="h-4 w-4" />
                  </span>
                  <p className="text-sm font-semibold leading-5">{option}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
