"use client";

import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/icons";
import { getEstimatedCo2SavedKg, getTrustBadges } from "@/lib/device-trust";
import type { DeviceProduct } from "@/types/device";

type DeviceProductCardProps = {
  product: DeviceProduct;
  selected: boolean;
  compareDisabled: boolean;
  onToggleCompare: (product: DeviceProduct) => void;
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
  onToggleCompare
}: DeviceProductCardProps) {
  return (
    <article className="group overflow-hidden rounded-lg border border-line bg-white shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-soft">
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
        <label className="absolute right-4 top-4 flex cursor-pointer items-center gap-2 rounded-full border border-white/70 bg-white/90 px-3 py-1.5 text-xs font-semibold text-ink shadow-card backdrop-blur">
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
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-ink">{product.name}</h3>
            <p className="mt-2 text-sm leading-6 text-muted">{product.shortDescription}</p>
          </div>
          <p className="shrink-0 text-right text-lg font-semibold text-flame-600">{product.priceLabel}</p>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {[...product.tags.slice(0, 2), ...getTrustBadges(product).slice(0, 2)].map((tag) => (
            <span key={tag} className="rounded-full border border-line bg-paper px-3 py-1 text-xs font-semibold text-muted">
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

        <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-muted">
          <Icon name="shield" className="h-4 w-4 text-flame-600" />
          {product.warranty}
        </div>
        <div className="mt-3 flex items-center gap-2 text-sm font-semibold text-green-700">
          <Icon name="leaf" className="h-4 w-4" />
          {getEstimatedCo2SavedKg(product).toLocaleString()}kg estimated CO2 avoided
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <Link
            href={`/devices/${product.slug}`}
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-ink px-4 text-sm font-semibold text-white transition hover:bg-flame-600"
          >
            View details
          </Link>
          <Link
            href={`/devices/${product.slug}#request-device`}
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-line bg-white px-4 text-sm font-semibold text-ink transition hover:border-flame-300 hover:text-flame-600"
          >
            Enquire
          </Link>
        </div>
      </div>
    </article>
  );
}
