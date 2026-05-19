"use client";

import Image from "next/image";
import { useState } from "react";
import type { DeviceProduct } from "@/types/device";
import { cn } from "@/lib/utils";

export function ProductImageGallery({ product }: { product: DeviceProduct }) {
  const [activeImage, setActiveImage] = useState(product.gallery[0] ?? product.image);

  return (
    <div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-line bg-paper shadow-soft">
        <Image
          src={activeImage}
          alt={product.name}
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3">
        {product.gallery.map((image) => (
          <button
            key={image}
            type="button"
            onClick={() => setActiveImage(image)}
            className={cn(
              "relative aspect-[4/3] overflow-hidden rounded-lg border bg-paper transition",
              activeImage === image ? "border-flame-500 ring-2 ring-flame-100" : "border-line hover:border-flame-300"
            )}
            aria-label={`View ${product.name} image`}
          >
            <Image src={image} alt="" fill sizes="160px" className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
