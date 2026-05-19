"use client";

import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/icons";
import { getEstimatedCo2SavedKg, getTrustBadges } from "@/lib/device-trust";
import type { DeviceProduct } from "@/types/device";

type DeviceListItemProps = {
  product: DeviceProduct;
  selected: boolean;
  compareDisabled: boolean;
  onToggleCompare: (product: DeviceProduct) => void;
};

export function DeviceListItem({
  product,
  selected,
  compareDisabled,
  onToggleCompare
}: DeviceListItemProps) {
  return (
    <article className="grid gap-5 rounded-lg border border-line bg-white p-4 shadow-card transition hover:-translate-y-0.5 hover:shadow-soft md:grid-cols-[220px_1fr_auto]">
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-paper md:aspect-auto">
        <Image src={product.image} alt={product.name} fill sizes="220px" className="object-cover" />
      </div>
      <div>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-ink px-3 py-1 text-xs font-semibold text-white">{product.category}</span>
          <span className="rounded-full bg-flame-50 px-3 py-1 text-xs font-semibold text-flame-700">{product.availability}</span>
        </div>
        <h3 className="mt-4 text-xl font-semibold text-ink">{product.name}</h3>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">{product.shortDescription}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {[...product.supportIncluded.slice(0, 3), ...getTrustBadges(product).slice(0, 2)].map((item) => (
            <span key={item} className="rounded-full border border-line bg-paper px-3 py-1 text-xs font-semibold text-muted">
              {item}
            </span>
          ))}
        </div>
        <p className="mt-4 flex items-center gap-2 text-sm font-semibold text-green-700">
          <Icon name="leaf" className="h-4 w-4" />
          {getEstimatedCo2SavedKg(product).toLocaleString()}kg estimated CO2 avoided through reuse
        </p>
      </div>
      <div className="flex flex-col gap-3 md:min-w-44 md:items-end">
        <p className="text-2xl font-semibold text-flame-600">{product.priceLabel}</p>
        <label className="flex items-center gap-2 text-sm font-semibold text-muted">
          <input
            type="checkbox"
            checked={selected}
            disabled={!selected && compareDisabled}
            onChange={() => onToggleCompare(product)}
            className="h-4 w-4 rounded border-line text-flame-500"
          />
          Compare
        </label>
        <Link href={`/devices/${product.slug}`} className="inline-flex min-h-10 w-full items-center justify-center rounded-full bg-ink px-4 text-sm font-semibold text-white md:w-auto">
          View details
        </Link>
        <Link href={`/devices/${product.slug}#request-device`} className="inline-flex min-h-10 w-full items-center justify-center rounded-full border border-line bg-white px-4 text-sm font-semibold text-ink md:w-auto">
          Enquire
        </Link>
      </div>
    </article>
  );
}
