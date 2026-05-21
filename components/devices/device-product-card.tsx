"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/icons";
import {
  getAfricaSuitability,
  getBulkAvailability,
  getDeliveryEstimate,
  getDeploymentConfidence,
  getPerformanceLevel,
  getPowerEstimate,
  getSustainabilityScore
} from "@/components/devices/device-product-intelligence";
import { getEstimatedCo2SavedKg, getTrustBadges } from "@/lib/device-trust";
import type { DeviceProduct } from "@/types/device";

type DeviceProductCardProps = {
  product: DeviceProduct;
  selected: boolean;
  compareDisabled: boolean;
  onToggleCompare: (product: DeviceProduct) => void;
  onQuickPreview: (product: DeviceProduct) => void;
};

function availabilityClass(value: string) {
  if (value === "Available now") return "bg-green-50 text-green-700";
  if (value === "Limited stock") return "bg-amber-50 text-amber-700";
  if (value === "Coming soon") return "bg-blue-50 text-blue-700";
  return "bg-flame-50 text-flame-700";
}

export function DeviceProductCard({
  product,
  selected,
  compareDisabled,
  onToggleCompare,
  onQuickPreview
}: DeviceProductCardProps) {
  const [saved, setSaved] = useState(false);
  const confidence = getDeploymentConfidence(product);
  const sustainabilityScore = getSustainabilityScore(product);
  const gallery = [product.image, ...product.gallery.filter((image) => image !== product.image)].slice(0, 3);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-line bg-white shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-soft">
      <div className="relative aspect-[4/3] overflow-hidden bg-paper">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw"
          className="object-cover transition duration-500 group-hover:scale-[1.03]"
        />
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-ink px-3 py-1 text-xs font-semibold text-white">
            {product.category}
          </span>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${availabilityClass(product.availability)}`}>
            {product.availability}
          </span>
        </div>
        <div className="absolute right-4 top-4 flex gap-2">
          <button
            type="button"
            onClick={() => setSaved((value) => !value)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/70 bg-white/90 text-ink shadow-card backdrop-blur transition hover:text-flame-600"
            aria-label={saved ? `Remove ${product.name} from saved devices` : `Save ${product.name}`}
          >
            <Icon name={saved ? "badge" : "heart"} className="h-4 w-4" />
          </button>
          <label className="flex cursor-pointer items-center gap-2 rounded-full border border-white/70 bg-white/90 px-3 py-1.5 text-xs font-semibold text-ink shadow-card backdrop-blur">
            <input
              type="checkbox"
              checked={selected}
              disabled={!selected && compareDisabled}
              onChange={() => onToggleCompare(product)}
              className="h-4 w-4 rounded border-line text-flame-500"
            />
            Compare
          </label>
        </div>
        <div className="absolute bottom-4 left-4 flex gap-2">
          {gallery.map((image, index) => (
            <span key={`${product.slug}-${image}-${index}`} className="relative h-9 w-12 overflow-hidden rounded-md border border-white/75 bg-white shadow-sm">
              <Image src={image} alt="" fill sizes="48px" className="object-cover" />
            </span>
          ))}
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-flame-200 bg-flame-50 px-3 py-1 text-xs font-semibold text-flame-700">
                {product.conditionGrades[0] ?? "Tested"}
              </span>
              <span className="rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                {getAfricaSuitability(product)} Africa suitability
              </span>
            </div>
            <h3 className="mt-3 text-lg font-semibold text-ink">{product.name}</h3>
            <p className="mt-2 text-sm leading-6 text-muted">{product.shortDescription}</p>
          </div>
          <p className="shrink-0 text-right text-lg font-semibold text-flame-600">{product.priceLabel}</p>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {[...product.tags.slice(0, 3), ...getTrustBadges(product).slice(0, 3)].map((tag, index) => (
            <span key={`${product.slug}-${tag}-${index}`} className="rounded-full border border-line bg-paper px-3 py-1 text-xs font-semibold text-muted">
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-5 grid gap-3 rounded-lg bg-paper p-4 text-sm">
          <p>
            <span className="font-semibold text-ink">Best for:</span>{" "}
            <span className="text-muted">{product.bestFor}</span>
          </p>
          <p>
            <span className="font-semibold text-ink">Typical spec:</span>{" "}
            <span className="text-muted">{product.specifications[0]?.value}</span>
          </p>
          <p>
            <span className="font-semibold text-ink">Condition:</span>{" "}
            <span className="text-muted">{product.conditionGrades.join(", ")}</span>
          </p>
        </div>

        <div className="mt-4 grid gap-3 rounded-lg border border-line p-4 text-xs font-semibold text-muted sm:grid-cols-2">
          <MetricPill label="Readiness" value={`${confidence.score}%`} />
          <MetricPill label="Sustainability" value={`${sustainabilityScore}/100`} />
          <MetricPill label="Power" value={getPowerEstimate(product)} />
          <MetricPill label="Performance" value={getPerformanceLevel(product)} />
          <MetricPill label="Support" value={`${product.supportIncluded.length} services`} />
          <MetricPill label="Delivery" value={getDeliveryEstimate(product)} />
        </div>

        <div className="mt-4 flex items-start gap-2 text-sm font-semibold text-muted">
          <Icon name="shield" className="mt-0.5 h-4 w-4 shrink-0 text-flame-600" />
          <span>{product.warranty}</span>
        </div>
        <div className="mt-3 flex items-center gap-2 text-sm font-semibold text-green-700">
          <Icon name="leaf" className="h-4 w-4" />
          {getEstimatedCo2SavedKg(product).toLocaleString()}kg estimated CO2 avoided
        </div>
        <div className="mt-3 flex items-center gap-2 text-sm font-semibold text-ink">
          <Icon name="package" className="h-4 w-4 text-flame-600" />
          {getBulkAvailability(product)} · {confidence.label}
        </div>

        <div className="mt-auto grid gap-3 pt-5 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => onQuickPreview(product)}
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-line bg-white px-4 text-sm font-semibold text-ink transition hover:border-flame-300 hover:text-flame-600"
          >
            Quick preview
          </button>
          <Link
            href={`/devices/${product.slug}`}
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-ink px-4 text-sm font-semibold text-white transition hover:bg-flame-600"
          >
            View details
          </Link>
          <Link
            href={`/devices/${product.slug}#request-device`}
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-flame-500 px-4 text-sm font-semibold text-white transition hover:bg-flame-600 sm:col-span-2"
          >
            Enquire
          </Link>
        </div>
      </div>
    </article>
  );
}

function MetricPill({ label, value }: { label: string; value: string }) {
  return (
    <p>
      <span className="block text-[10px] uppercase tracking-[0.12em] text-muted">{label}</span>
      <span className="mt-1 block text-ink">{value}</span>
    </p>
  );
}
