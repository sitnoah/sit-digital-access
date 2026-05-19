import Link from "next/link";
import { Icon } from "@/components/icons";

export function AfricaCTA() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-lg bg-[#080808] p-8 text-white shadow-soft sm:p-10 lg:p-14">
        <div className="relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_86%_20%,rgba(249,115,22,0.32),transparent_32%),radial-gradient(circle_at_18%_0%,rgba(255,255,255,0.1),transparent_22%)]" />
          <div className="relative grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-flame-300">
                Deployment partnership
              </p>
              <h2 className="mt-4 max-w-3xl text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
                Let&apos;s make digital access affordable, practical and scalable.
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-7 text-white/68">
                Partner with SIT Digital Access to deploy reliable technology infrastructure
                for learning, skills and opportunity.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Link
                href="/devices#device-request"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-flame-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-flame-600"
              >
                Request Devices
                <Icon name="arrow" className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:border-flame-300 hover:text-flame-200"
              >
                Become a Partner
              </Link>
              <Link
                href="/donate"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-flame-400/40 bg-flame-500/10 px-6 py-3 text-sm font-semibold text-flame-100 transition hover:bg-flame-500 hover:text-white"
              >
                Sponsor a Lab
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
