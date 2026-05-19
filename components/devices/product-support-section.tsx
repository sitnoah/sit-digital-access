import { Icon } from "@/components/icons";
import type { DeviceProduct } from "@/types/device";

export function ProductSupportSection({ product }: { product: DeviceProduct }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {product.includedServices.map((service) => (
        <div key={service} className="flex items-start gap-3 rounded-lg border border-line bg-white p-4 shadow-card">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-flame-500 text-white">
            <Icon name="check" className="h-4 w-4" />
          </span>
          <p className="text-sm font-semibold leading-6 text-ink">{service}</p>
        </div>
      ))}
    </div>
  );
}
