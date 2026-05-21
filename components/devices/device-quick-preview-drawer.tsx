"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Icon } from "@/components/icons";
import {
  getAfricaSuitability,
  getBulkAvailability,
  getDeliveryEstimate,
  getDeploymentConfidence,
  getLifecycleEstimate,
  getPerformanceLevel,
  getPowerEstimate,
  getSustainabilityScore
} from "@/components/devices/device-product-intelligence";
import { deviceProducts } from "@/lib/device-catalogue";
import { getEstimatedCo2SavedKg, getSustainabilityHighlights, getTrustBadges } from "@/lib/device-trust";
import { cn } from "@/lib/utils";
import type { DeviceProduct } from "@/types/device";

type DeviceQuickPreviewDrawerProps = {
  product: DeviceProduct;
  onClose: () => void;
};

const tabs = [
  "Overview",
  "Specifications",
  "Deployment suitability",
  "Sustainability",
  "Support and warranty",
  "Included software",
  "Recommended use cases",
  "Related devices"
] as const;

type Tab = (typeof tabs)[number];

export function DeviceQuickPreviewDrawer({ product, onClose }: DeviceQuickPreviewDrawerProps) {
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const confidence = getDeploymentConfidence(product);
  const relatedProducts = useMemo(
    () =>
      deviceProducts
        .filter((item) => item.slug !== product.slug && item.useCases.some((useCase) => product.useCases.includes(useCase)))
        .slice(0, 3),
    [product]
  );

  return (
    <div className="fixed inset-0 z-[95] bg-black/50">
      <aside className="absolute inset-y-0 right-0 flex w-full max-w-5xl flex-col overflow-hidden bg-white shadow-soft">
        <div className="border-b border-line p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-flame-600">Quick preview</p>
              <h2 className="mt-2 text-2xl font-semibold text-ink">{product.name}</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">{product.shortDescription}</p>
            </div>
            <button type="button" className="rounded-full border border-line p-2" onClick={onClose} aria-label="Close product preview">
              <Icon name="close" className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto">
          <div className="grid gap-6 p-5 lg:grid-cols-[0.75fr_1.25fr]">
            <div className="space-y-4">
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-paper">
                <Image src={product.image} alt={product.name} fill sizes="(min-width: 1024px) 360px, 100vw" className="object-cover" />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  ["Africa fit", `${getAfricaSuitability(product)} (${confidence.score}%)`],
                  ["Sustainability", `${getSustainabilityScore(product)}/100`],
                  ["Power", getPowerEstimate(product)],
                  ["Performance", getPerformanceLevel(product)]
                ].map(([label, value]) => (
                  <div key={label} className="rounded-lg border border-line bg-paper p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">{label}</p>
                    <p className="mt-2 text-sm font-semibold text-ink">{value}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-lg border border-flame-100 bg-flame-50 p-4">
                <p className="text-sm font-semibold text-flame-800">{confidence.label}</p>
                <p className="mt-2 text-sm leading-6 text-flame-800/80">
                  {getBulkAvailability(product)} with {getDeliveryEstimate(product).toLowerCase()} planning and {getLifecycleEstimate(product).toLowerCase()}.
                </p>
              </div>
            </div>

            <div>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "shrink-0 rounded-full border px-4 py-2 text-xs font-semibold transition",
                      activeTab === tab ? "border-ink bg-ink text-white" : "border-line bg-white text-muted hover:text-ink"
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="mt-5 rounded-lg border border-line p-5">
                {activeTab === "Overview" ? <Overview product={product} /> : null}
                {activeTab === "Specifications" ? <Specifications product={product} /> : null}
                {activeTab === "Deployment suitability" ? <DeploymentSuitability product={product} /> : null}
                {activeTab === "Sustainability" ? <Sustainability product={product} /> : null}
                {activeTab === "Support and warranty" ? <Support product={product} /> : null}
                {activeTab === "Included software" ? <IncludedSoftware product={product} /> : null}
                {activeTab === "Recommended use cases" ? <UseCases product={product} /> : null}
                {activeTab === "Related devices" ? <RelatedDevices products={relatedProducts} /> : null}
              </div>
            </div>
          </div>

          <div className="border-t border-line p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Link href={`/devices/${product.slug}`} className="inline-flex min-h-11 items-center justify-center rounded-full border border-line bg-white px-5 text-sm font-semibold text-ink">
                View full details
              </Link>
              <Link href={`/devices/${product.slug}#request-device`} className="inline-flex min-h-11 items-center justify-center rounded-full bg-flame-500 px-5 text-sm font-semibold text-white">
                Request this device
              </Link>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

function Overview({ product }: { product: DeviceProduct }) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-ink">Marketplace overview</h3>
      <p className="mt-3 text-sm leading-6 text-muted">{product.longDescription}</p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Info label="Price guide" value={product.priceLabel} />
        <Info label="Availability" value={product.availability} />
        <Info label="Typical deployment" value={product.deploymentTypes.slice(0, 3).join(", ")} />
        <Info label="Estimated learner capacity" value={capacityFor(product)} />
      </div>
    </div>
  );
}

function Specifications({ product }: { product: DeviceProduct }) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-ink">Specifications</h3>
      <div className="mt-4 grid gap-3">
        {product.specifications.map((spec) => (
          <Info key={spec.label} label={spec.label} value={spec.value} />
        ))}
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <Info label="Processor options" value={product.processorOptions.join(", ")} />
        <Info label="RAM options" value={product.ramOptions.join(", ")} />
        <Info label="Storage options" value={product.storageOptions.join(", ")} />
      </div>
    </div>
  );
}

function DeploymentSuitability({ product }: { product: DeviceProduct }) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-ink">Deployment suitability</h3>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Info label="Africa redeployment suitability" value={getAfricaSuitability(product)} />
        <Info label="Power requirements" value={getPowerEstimate(product)} />
        <Info label="Offline-first suitability" value={product.lowPowerScore && product.lowPowerScore >= 80 ? "Strong" : "Assessment-led"} />
        <Info label="Connectivity assumptions" value={connectivityAssumption(product)} />
        <Info label="Upgrade pathways" value={product.includedServices.slice(0, 4).join(", ")} />
        <Info label="Typical scenarios" value={product.idealFor.slice(0, 4).join(", ")} />
      </div>
    </div>
  );
}

function Sustainability({ product }: { product: DeviceProduct }) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-ink">Sustainability</h3>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Info label="Estimated CO2 avoided" value={`${getEstimatedCo2SavedKg(product).toLocaleString()}kg`} />
        <Info label="Circular economy score" value={`${getSustainabilityScore(product)}/100`} />
        <Info label="Expected lifecycle" value={getLifecycleEstimate(product)} />
        <Info label="Recyclability" value="Responsible recovery pathway available" />
      </div>
      <div className="mt-5 grid gap-2">
        {getSustainabilityHighlights(product).map((item) => (
          <p key={item} className="flex gap-2 text-sm leading-6 text-muted">
            <Icon name="leaf" className="mt-0.5 h-4 w-4 shrink-0 text-green-700" />
            {item}
          </p>
        ))}
      </div>
    </div>
  );
}

function Support({ product }: { product: DeviceProduct }) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-ink">Support and warranty</h3>
      <p className="mt-3 text-sm font-semibold text-ink">{product.warranty}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {[...product.supportIncluded, ...getTrustBadges(product)].map((item, index) => (
          <span key={`${item}-${index}`} className="rounded-full border border-line bg-paper px-3 py-1 text-xs font-semibold text-muted">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function IncludedSoftware({ product }: { product: DeviceProduct }) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-ink">Included software and setup</h3>
      <div className="mt-4 grid gap-3">
        {product.includedServices.map((service) => (
          <p key={service} className="flex gap-2 rounded-lg bg-paper p-3 text-sm font-semibold text-ink">
            <Icon name="check" className="h-4 w-4 shrink-0 text-flame-600" />
            {service}
          </p>
        ))}
      </div>
    </div>
  );
}

function UseCases({ product }: { product: DeviceProduct }) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-ink">Recommended use cases</h3>
      <div className="mt-4 flex flex-wrap gap-2">
        {[...product.useCases, ...product.idealFor].map((item, index) => (
          <span key={`${item}-${index}`} className="rounded-full border border-line bg-paper px-3 py-1 text-xs font-semibold text-muted">
            {item}
          </span>
        ))}
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {product.bundleOptions.map((bundle) => (
          <Info key={bundle} label="Bundle option" value={bundle} />
        ))}
      </div>
    </div>
  );
}

function RelatedDevices({ products }: { products: DeviceProduct[] }) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-ink">Related devices</h3>
      <div className="mt-4 grid gap-3">
        {products.length > 0 ? (
          products.map((product) => (
            <Link key={product.slug} href={`/devices/${product.slug}`} className="rounded-lg border border-line p-4 transition hover:border-flame-200 hover:bg-flame-50">
              <p className="text-sm font-semibold text-ink">{product.name}</p>
              <p className="mt-1 text-xs leading-5 text-muted">{product.shortDescription}</p>
            </Link>
          ))
        ) : (
          <p className="text-sm text-muted">No closely related devices found for this preview.</p>
        )}
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-paper p-3">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">{label}</p>
      <p className="mt-2 text-sm font-semibold leading-6 text-ink">{value || "Assessment required"}</p>
    </div>
  );
}

function capacityFor(product: DeviceProduct) {
  if (product.category.includes("bundles")) return "12-30 learners per bundle";
  if (product.deploymentTypes.includes("Classroom bundle")) return "Shared classroom set";
  if (product.useCases.includes("NGO")) return "Staff or field team users";
  return "Individual or small cohort users";
}

function connectivityAssumption(product: DeviceProduct) {
  if (product.useCases.includes("Low power") || product.deploymentTypes.includes("Low-power lab")) return "Offline-first or constrained connectivity";
  if (product.useCases.includes("Remote learning")) return "Wi-Fi and browser-first learning";
  return "Standard site connectivity";
}

