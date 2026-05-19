"use client";

import type { DeliveryServiceCategory } from "@/lib/delivery-services";
import { deliveryServiceTabs } from "@/lib/delivery-services";
import { cn } from "@/lib/utils";

type ServiceTabsProps = {
  active: DeliveryServiceCategory;
  onChange: (tab: DeliveryServiceCategory) => void;
};

export function ServiceTabs({ active, onChange }: ServiceTabsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2" role="tablist" aria-label="Delivery service categories">
      {deliveryServiceTabs.map((tab) => (
        <button
          key={tab}
          type="button"
          role="tab"
          aria-selected={active === tab}
          onClick={() => onChange(tab)}
          className={cn(
            "shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-flame-400",
            active === tab
              ? "border-ink bg-ink text-white shadow-card"
              : "border-line bg-white text-muted hover:border-flame-300 hover:text-ink"
          )}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
