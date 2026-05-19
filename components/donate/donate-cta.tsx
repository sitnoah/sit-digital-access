import Link from "next/link";
import { Icon } from "@/components/icons";

export function DonateCTA() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#0a0a0a] text-white shadow-soft">
        <div className="relative p-8 sm:p-10 lg:p-14">
          <div className="absolute inset-0 surface-grid opacity-[0.08]" />
          <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-flame-300">
                Ready to create access
              </p>
              <h2 className="mt-4 max-w-4xl text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                Your retired technology can become someone&apos;s first digital opportunity.
              </h2>
              <p className="mt-5 max-w-3xl text-base leading-8 text-white/68">
                Donate devices, sponsor learners or partner with SIT Digital Access to make
                practical technology access scalable.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Link
                href="#donation-form"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-flame-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-flame-600"
              >
                Start a Donation
                <Icon name="arrow" className="h-4 w-4" />
              </Link>
              <Link
                href="#sponsorship-packages"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/28 px-6 py-3 text-sm font-semibold text-white transition hover:border-flame-300 hover:text-flame-100"
              >
                Sponsor a Lab
              </Link>
              <Link
                href="/contact"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-white/8 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/12 hover:text-flame-100"
              >
                Talk to Partnerships
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
