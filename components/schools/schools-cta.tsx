import Link from "next/link";
import { AnimatedSection } from "@/components/animated-section";
import { Icon } from "@/components/icons";

export function SchoolsCTA() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <AnimatedSection>
        <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_18%_15%,rgba(255,111,0,0.28),transparent_34%),linear-gradient(135deg,#0b0b0b,#201913_58%,#ff6f00)] p-8 text-white shadow-soft sm:p-10 lg:p-14">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-flame-200">
                Education access planning
              </p>
              <h2 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight sm:text-5xl">
                Let&apos;s make digital learning practical, affordable and sustainable.
              </h2>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
              <Link href="#school-enquiry" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-ink transition hover:bg-flame-50">
                Plan a Lab
                <Icon name="arrow" className="h-4 w-4" />
              </Link>
              <Link href="/devices" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/30 px-6 text-sm font-semibold text-white transition hover:border-flame-300 hover:bg-white/10">
                Request Devices
              </Link>
              <Link href="/donate" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/30 px-6 text-sm font-semibold text-white transition hover:border-flame-300 hover:bg-white/10">
                Sponsor a School
              </Link>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </section>
  );
}
