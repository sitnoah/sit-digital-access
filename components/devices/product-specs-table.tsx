import type { DeviceProduct } from "@/types/device";

export function ProductSpecsTable({ product }: { product: DeviceProduct }) {
  return (
    <div className="overflow-hidden rounded-lg border border-line bg-white shadow-card">
      {product.specifications.map((spec) => (
        <div key={spec.label} className="grid gap-2 border-b border-line p-4 last:border-b-0 sm:grid-cols-[220px_1fr]">
          <p className="text-sm font-semibold text-ink">{spec.label}</p>
          <p className="text-sm leading-6 text-muted">{spec.value}</p>
        </div>
      ))}
    </div>
  );
}
