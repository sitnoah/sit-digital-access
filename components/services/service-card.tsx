import Link from "next/link";
import { Icon } from "@/components/icons";
import type { ServiceItem } from "@/types/service";

type ServiceCardProps = {
  service: ServiceItem;
  selected: boolean;
  onToggleCompare: (slug: string) => void;
};

export function ServiceCard({ service, selected, onToggleCompare }: ServiceCardProps) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white p-5 shadow-card transition duration-300 hover:-translate-y-1 hover:border-flame-300 hover:shadow-soft">
      <div className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-flame-500 via-flame-300 to-transparent transition duration-300 group-hover:scale-x-100" />
      <div className="flex items-start justify-between gap-4">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-flame-500 text-white shadow-card">
          <Icon name={service.icon} className="h-6 w-6" />
        </span>
        <label className="flex items-center gap-2 text-xs font-semibold text-muted">
          <input
            type="checkbox"
            checked={selected}
            onChange={() => onToggleCompare(service.slug)}
            className="h-4 w-4 rounded border-line text-flame-500 focus:ring-flame-400"
          />
          Compare
        </label>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <span className="rounded-full bg-ink px-3 py-1 text-xs font-semibold text-white">
          {service.category}
        </span>
        <span className="rounded-full bg-flame-50 px-3 py-1 text-xs font-semibold text-flame-700">
          {service.deploymentReadiness} readiness
        </span>
        {service.africaReady ? (
          <span className="rounded-full border border-line bg-paper px-3 py-1 text-xs font-semibold text-muted">
            Africa-ready
          </span>
        ) : null}
      </div>

      <h3 className="mt-5 text-xl font-semibold tracking-tight text-ink">{service.title}</h3>
      <p className="mt-3 text-sm leading-6 text-muted">{service.shortDescription}</p>

      <div className="mt-5 rounded-2xl border border-line bg-paper p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Best for</p>
        <p className="mt-2 text-sm font-semibold text-ink">{service.bestFor.slice(0, 3).join(", ")}</p>
      </div>

      <ul className="mt-5 space-y-2">
        {service.includedFeatures.slice(0, 3).map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm leading-6 text-muted">
            <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-flame-600" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto grid gap-3 pt-6 sm:grid-cols-2">
        <Link href={`/services/${service.slug}`} className="inline-flex min-h-11 items-center justify-center rounded-full bg-ink px-4 text-sm font-semibold text-white transition hover:bg-flame-600">
          Learn more
        </Link>
        <Link href="#service-enquiry" className="inline-flex min-h-11 items-center justify-center rounded-full border border-line px-4 text-sm font-semibold text-ink transition hover:border-flame-300 hover:text-flame-600">
          Request service
        </Link>
      </div>
    </article>
  );
}
