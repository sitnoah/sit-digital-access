import Link from "next/link";
import { Icon } from "@/components/icons";
import { contactQuickActions } from "@/lib/contact-options";

export function ContactQuickActions() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#0a0a0a] text-white shadow-soft">
        <div className="relative p-6 sm:p-8 lg:p-10">
          <div className="absolute inset-0 surface-grid opacity-[0.08]" />
          <div className="relative grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-flame-300">
                Quick actions
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">Need a faster route?</h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {contactQuickActions.map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/12 bg-white/[0.06] px-4 py-3 text-sm font-semibold text-white transition hover:border-flame-300 hover:bg-flame-500"
                >
                  <Icon name={action.icon} className="h-4 w-4 text-flame-300 transition group-hover:text-white" />
                  {action.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
