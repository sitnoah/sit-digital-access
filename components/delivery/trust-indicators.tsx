import { Icon } from "@/components/icons";
import { deliveryTrustIndicators } from "@/lib/delivery-services";

export function TrustIndicators() {
  return (
    <div className="grid gap-3 min-[420px]:grid-cols-2 xl:grid-cols-5">
      {deliveryTrustIndicators.map((item) => (
        <div
          key={item.label}
          className="group flex min-h-20 items-center gap-3 rounded-2xl border border-line bg-white p-3.5 shadow-sm transition hover:-translate-y-0.5 hover:border-flame-200 hover:shadow-card"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-flame-50 text-flame-600 transition group-hover:bg-flame-500 group-hover:text-white">
            <Icon name={item.icon} className="h-4 w-4" />
          </span>
          <p className="text-[13px] font-semibold leading-5 text-ink sm:text-sm">{item.label}</p>
        </div>
      ))}
    </div>
  );
}
