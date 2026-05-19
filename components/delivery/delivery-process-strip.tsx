import { Icon } from "@/components/icons";
import { deliveryProcessSteps } from "@/lib/delivery-services";

export function DeliveryProcessStrip() {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-card">
      <div className="flex overflow-x-auto">
        {deliveryProcessSteps.map((step, index) => (
          <div key={step.label} className="relative flex min-w-36 flex-1 items-center gap-3 border-r border-line px-4 py-5 last:border-r-0">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ink text-flame-300">
              <Icon name={step.icon} className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">0{index + 1}</p>
              <p className="text-sm font-semibold text-ink">{step.label}</p>
            </div>
            {index < deliveryProcessSteps.length - 1 ? (
              <span className="absolute right-3 top-1/2 hidden -translate-y-1/2 text-flame-400 lg:block">→</span>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
