import Link from "next/link";
import Image from "next/image";
import type { DeviceProduct } from "@/types/device";

export function RelatedDevices({ products }: { products: DeviceProduct[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {products.map((product) => (
        <Link
          key={product.slug}
          href={`/devices/${product.slug}`}
          className="group overflow-hidden rounded-lg border border-line bg-white shadow-card transition hover:-translate-y-1 hover:shadow-soft"
        >
          <div className="relative aspect-[4/3] bg-paper">
            <Image src={product.image} alt={product.name} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover transition group-hover:scale-[1.03]" />
          </div>
          <div className="p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-flame-600">{product.category}</p>
            <h3 className="mt-2 text-lg font-semibold text-ink">{product.name}</h3>
            <p className="mt-2 text-sm leading-6 text-muted">{product.shortDescription}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
