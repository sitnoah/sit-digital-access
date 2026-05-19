"use client";

import Link from "next/link";
import { Icon } from "@/components/icons";
import type { ServiceItem } from "@/types/service";

type ServiceComparisonDrawerProps = {
  services: ServiceItem[];
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  onRemove: (slug: string) => void;
};

export function ServiceComparisonDrawer({
  services,
  open,
  onOpen,
  onClose,
  onRemove
}: ServiceComparisonDrawerProps) {
  if (!open) {
    return (
      <button
        type="button"
        disabled={services.length === 0}
        onClick={onOpen}
        className="inline-flex min-h-11 items-center justify-center rounded-full bg-ink px-4 text-sm font-semibold text-white shadow-card transition hover:bg-flame-600 disabled:cursor-not-allowed disabled:bg-muted"
      >
        Compare selected ({services.length})
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[90] bg-black/45">
      <aside className="absolute inset-y-0 right-0 w-full max-w-5xl overflow-y-auto bg-white p-5 shadow-soft">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-flame-600">Comparison</p>
            <h2 className="mt-2 text-2xl font-semibold text-ink">Compare selected services</h2>
            <p className="mt-2 text-sm text-muted">Select up to 3 services to compare delivery fit, support and deployment readiness.</p>
          </div>
          <button type="button" className="rounded-full border border-line p-2" onClick={onClose} aria-label="Close comparison">
            <Icon name="close" className="h-4 w-4" />
          </button>
        </div>

        {services.length === 0 ? (
          <div className="mt-10 rounded-lg border border-line bg-paper p-8 text-center">
            <p className="text-sm font-semibold text-ink">No services selected</p>
            <p className="mt-2 text-sm text-muted">Use the compare checkboxes in the catalogue.</p>
          </div>
        ) : (
          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[760px] border-separate border-spacing-0 overflow-hidden rounded-lg border border-line text-left text-sm">
              <thead>
                <tr className="bg-ink text-white">
                  <th className="p-4 font-semibold">Criteria</th>
                  {services.map((service) => (
                    <th key={service.slug} className="p-4 font-semibold">
                      <div className="flex items-start justify-between gap-3">
                        <span>{service.title}</span>
                        <button type="button" onClick={() => onRemove(service.slug)} aria-label={`Remove ${service.title}`}>
                          <Icon name="close" className="h-4 w-4 text-white/70" />
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["Best for", (item: ServiceItem) => item.bestFor.join(", ")],
                  ["Delivery complexity", (item: ServiceItem) => item.deliveryComplexity],
                  ["Deployment readiness", (item: ServiceItem) => item.deploymentReadiness],
                  ["Training included", (item: ServiceItem) => (item.trainingLinked ? "Training-linked" : "Optional")],
                  ["Support level", (item: ServiceItem) => item.supportLevel],
                  ["Africa readiness", (item: ServiceItem) => (item.africaReady ? "Africa-ready" : "Standard")]
                ].map(([label, getter]) => (
                  <tr key={label as string} className="odd:bg-white even:bg-paper">
                    <td className="border-t border-line p-4 font-semibold text-ink">{label as string}</td>
                    {services.map((service) => (
                      <td key={service.slug} className="border-t border-line p-4 text-muted">
                        {(getter as (service: ServiceItem) => string)(service)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button type="button" className="min-h-11 rounded-full border border-line px-5 text-sm font-semibold" onClick={onClose}>
            Continue browsing
          </button>
          <Link href="#service-enquiry" onClick={onClose} className="inline-flex min-h-11 items-center justify-center rounded-full bg-flame-500 px-5 text-sm font-semibold text-white">
            Ask about these services
          </Link>
        </div>
      </aside>
    </div>
  );
}
