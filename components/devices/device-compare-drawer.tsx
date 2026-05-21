"use client";

import Link from "next/link";
import { Icon } from "@/components/icons";
import {
  getAfricaSuitability,
  getBulkAvailability,
  getLifecycleEstimate,
  getPerformanceLevel,
  getPowerEstimate,
  getSustainabilityScore
} from "@/components/devices/device-product-intelligence";
import { getEstimatedCo2SavedKg } from "@/lib/device-trust";
import type { DeviceProduct } from "@/types/device";

type DeviceCompareDrawerProps = {
  products: DeviceProduct[];
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  onRemove: (slug: string) => void;
};

export function DeviceCompareDrawer({
  products,
  open,
  onOpen,
  onClose,
  onRemove
}: DeviceCompareDrawerProps) {
  if (!open) {
    return (
      <button
        type="button"
        disabled={products.length === 0}
        onClick={onOpen}
        className="inline-flex min-h-11 items-center justify-center rounded-full bg-ink px-4 text-sm font-semibold text-white shadow-card transition hover:bg-flame-600 disabled:cursor-not-allowed disabled:bg-muted"
      >
        Compare selected ({products.length})
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[90] bg-black/45">
      <aside className="absolute inset-y-0 right-0 w-full max-w-5xl overflow-y-auto bg-white p-5 shadow-soft">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-flame-600">Comparison</p>
            <h2 className="mt-2 text-2xl font-semibold text-ink">Compare selected products</h2>
            <p className="mt-2 text-sm text-muted">Select up to 3 products to compare deployment fit, support, sustainability and pricing.</p>
          </div>
          <button type="button" className="rounded-full border border-line p-2" onClick={onClose} aria-label="Close comparison">
            <Icon name="close" className="h-4 w-4" />
          </button>
        </div>

        {products.length === 0 ? (
          <div className="mt-10 rounded-lg border border-line bg-paper p-8 text-center">
            <p className="text-sm font-semibold text-ink">No products selected</p>
            <p className="mt-2 text-sm text-muted">Use the compare checkboxes in the catalogue.</p>
          </div>
        ) : (
          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[760px] border-separate border-spacing-0 overflow-hidden rounded-lg border border-line text-left text-sm">
              <thead>
                <tr className="bg-ink text-white">
                  <th className="p-4 font-semibold">Criteria</th>
                  {products.map((product) => (
                    <th key={product.slug} className="p-4 font-semibold">
                      <div className="flex items-start justify-between gap-3">
                        <span>{product.name}</span>
                        <button type="button" onClick={() => onRemove(product.slug)} aria-label={`Remove ${product.name}`}>
                          <Icon name="close" className="h-4 w-4 text-white/70" />
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["Category", (p: DeviceProduct) => p.category],
                  ["Best for", (p: DeviceProduct) => p.bestFor],
                  ["Processor", (p: DeviceProduct) => p.processorOptions.join(", ")],
                  ["RAM", (p: DeviceProduct) => p.ramOptions.join(", ")],
                  ["Storage", (p: DeviceProduct) => p.storageOptions.join(", ")],
                  ["Performance", (p: DeviceProduct) => getPerformanceLevel(p)],
                  ["Power usage", (p: DeviceProduct) => getPowerEstimate(p)],
                  ["Sustainability", (p: DeviceProduct) => `${getSustainabilityScore(p)}/100 · ${getEstimatedCo2SavedKg(p).toLocaleString()}kg estimated CO2 avoided`],
                  ["Upgradeability", (p: DeviceProduct) => p.includedServices.slice(0, 4).join(", ")],
                  ["Deployment suitability", (p: DeviceProduct) => `${getAfricaSuitability(p)} Africa suitability · ${p.deploymentTypes.join(", ")}`],
                  ["Condition", (p: DeviceProduct) => p.conditionGrades.join(", ")],
                  ["Support", (p: DeviceProduct) => p.supportIncluded.slice(0, 4).join(", ")],
                  ["Warranty", (p: DeviceProduct) => p.warranty],
                  ["Estimated lifecycle", (p: DeviceProduct) => getLifecycleEstimate(p)],
                  ["Bulk readiness", (p: DeviceProduct) => getBulkAvailability(p)],
                  ["Price", (p: DeviceProduct) => p.priceLabel],
                  ["Availability", (p: DeviceProduct) => p.availability]
                ].map(([label, getter]) => (
                  <tr key={label as string} className="odd:bg-white even:bg-paper">
                    <td className="border-t border-line p-4 font-semibold text-ink">{label as string}</td>
                    {products.map((product) => (
                      <td key={product.slug} className="border-t border-line p-4 text-muted">
                        {(getter as (product: DeviceProduct) => string)(product)}
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
          <Link href="/contact" className="inline-flex min-h-11 items-center justify-center rounded-full bg-flame-500 px-5 text-sm font-semibold text-white">
            Ask about these options
          </Link>
        </div>
      </aside>
    </div>
  );
}
