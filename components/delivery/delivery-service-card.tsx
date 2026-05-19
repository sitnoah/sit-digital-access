import Link from "next/link";
import { Icon } from "@/components/icons";
import type { DeliveryService } from "@/lib/delivery-services";

export function DeliveryServiceCard({ service }: { service: DeliveryService }) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white p-6 shadow-card transition duration-300 hover:-translate-y-1 hover:border-flame-300 hover:bg-[#101010] hover:shadow-soft">
      <div className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-flame-500 via-flame-300 to-transparent transition duration-300 group-hover:scale-x-100" />
      <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-flame-500/10 blur-3xl transition group-hover:bg-flame-500/24" />
      <div className="relative">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-flame-500 to-flame-600 text-white shadow-[0_18px_44px_rgba(249,115,22,0.28)] transition group-hover:bg-white group-hover:from-white group-hover:to-white group-hover:text-flame-600">
          <Icon name={service.icon} className="h-5 w-5" />
        </span>
        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-flame-600 transition group-hover:text-flame-300">
          {service.category}
        </p>
        <h3 className="mt-3 text-xl font-semibold leading-7 text-ink transition group-hover:text-white">
          {service.title}
        </h3>
        <p className="mt-3 text-sm leading-6 text-muted transition group-hover:text-white/68">
          {service.description}
        </p>
        <div className="mt-5 rounded-xl border border-line bg-paper p-4 transition group-hover:border-white/10 group-hover:bg-white/[0.06]">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted transition group-hover:text-white/44">
            Best for
          </p>
          <p className="mt-2 text-sm font-semibold leading-6 text-ink transition group-hover:text-white/82">
            {service.bestFor}
          </p>
        </div>
        <div className="mt-5 grid gap-2">
          {service.includes.map((item) => (
            <div key={item} className="flex items-start gap-2 text-sm leading-6 text-muted transition group-hover:text-white/72">
              <Icon name="check" className="mt-1 h-4 w-4 shrink-0 text-flame-600 transition group-hover:text-flame-300" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
      <Link
        href={service.ctaHref}
        className="relative mt-6 inline-flex items-center gap-2 text-sm font-semibold text-flame-600 transition hover:text-flame-700 group-hover:text-flame-300"
      >
        {service.ctaLabel}
        <Icon name="arrow" className="h-4 w-4" />
      </Link>
    </article>
  );
}
