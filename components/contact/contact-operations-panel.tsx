import { AnimatedSection } from "@/components/animated-section";
import { Icon } from "@/components/icons";
import { contactInfoItems, contactSupportCategories, contactTrustCards } from "@/lib/contact-options";

export function ContactOperationsPanel() {
  return (
    <aside className="rounded-[2rem] border border-line bg-white p-5 shadow-soft sm:p-6">
      <AnimatedSection>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-flame-600">
          Contact information
        </p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink">
          A practical route into the SIT Digital Access team.
        </h2>
        <p className="mt-3 text-sm leading-6 text-muted">
          We aim to respond with a practical next step after reviewing your enquiry.
        </p>
      </AnimatedSection>

      <div className="mt-6 grid gap-3">
        {contactInfoItems.map((item) => (
          <div key={item.label} className="flex gap-3 rounded-2xl border border-line bg-paper p-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ink text-flame-300">
              <Icon name={item.icon} className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{item.label}</p>
              <p className="mt-1 text-sm font-semibold leading-6 text-ink">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-line bg-[#0d0d0d] p-5 text-white">
        <p className="text-sm font-semibold text-flame-300">Support categories</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {contactSupportCategories.map((category) => (
            <span key={category} className="rounded-full border border-white/10 bg-white/[0.07] px-3 py-1 text-xs font-semibold text-white/78">
              {category}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
        {contactTrustCards.map((card) => (
          <article key={card.title} className="rounded-2xl border border-line bg-white p-4 shadow-sm">
            <Icon name={card.icon} className="h-5 w-5 text-flame-600" />
            <h3 className="mt-3 text-sm font-semibold text-ink">{card.title}</h3>
            <p className="mt-1 text-sm leading-6 text-muted">{card.description}</p>
          </article>
        ))}
      </div>
    </aside>
  );
}
