import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DeviceRequestForm } from "@/components/device-request-form";
import { Icon } from "@/components/icons";
import { ProductImageGallery } from "@/components/devices/product-image-gallery";
import { ProductSpecsTable } from "@/components/devices/product-specs-table";
import { ProductSupportSection } from "@/components/devices/product-support-section";
import { ProductTrustBadges } from "@/components/devices/product-trust-badges";
import { RelatedDevices } from "@/components/devices/related-devices";
import { DeviceMarketplaceTrust } from "@/components/devices/device-marketplace-trust";
import { deviceProducts, getDeviceProductBySlug, getRelatedDeviceProducts } from "@/lib/device-catalogue";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return deviceProducts.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getDeviceProductBySlug(slug);

  if (!product) {
    return { title: "Device not found" };
  }

  return {
    title: product.name,
    description: product.shortDescription
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getDeviceProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const related = getRelatedDeviceProducts(product);

  return (
    <main className="bg-paper">
      <section className="relative overflow-hidden bg-[#090909] px-4 pb-16 pt-36 text-white sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_22%,rgba(249,115,22,0.26),transparent_30%),linear-gradient(135deg,#111111_0%,#090909_58%,#2c1203_100%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <ProductImageGallery product={product} />
          <div>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-flame-500 px-3 py-1 text-xs font-semibold text-white">{product.category}</span>
              <span className="rounded-full border border-white/18 bg-white/8 px-3 py-1 text-xs font-semibold text-white/78">{product.availability}</span>
            </div>
            <h1 className="mt-6 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">{product.name}</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/72">{product.shortDescription}</p>
            <p className="mt-6 text-3xl font-semibold text-flame-300">{product.priceLabel}</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link href="#request-device" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-flame-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-flame-600">
                Request this device
                <Icon name="arrow" className="h-4 w-4" />
              </Link>
              <Link href="#request-device" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:border-flame-300 hover:text-flame-200">
                Ask about bulk order
              </Link>
              <Link href={`/devices?compare=${product.slug}#device-catalogue`} className="inline-flex min-h-12 items-center justify-center rounded-full border border-flame-400/40 bg-flame-500/10 px-6 py-3 text-sm font-semibold text-flame-100 transition hover:bg-flame-500 hover:text-white">
                Add to comparison
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <ProductTrustBadges product={product} />
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_380px] lg:items-start">
          <div className="space-y-10">
            <article className="rounded-lg border border-line bg-white p-6 shadow-card">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-flame-600">Overview</p>
              <h2 className="mt-3 text-2xl font-semibold text-ink">Prepared for practical deployment</h2>
              <p className="mt-4 text-base leading-8 text-muted">{product.longDescription}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {product.idealFor.map((item) => (
                  <span key={item} className="rounded-full border border-line bg-paper px-3 py-1 text-sm font-semibold text-muted">
                    {item}
                  </span>
                ))}
              </div>
            </article>

            <DeviceMarketplaceTrust product={product} />

            <section>
              <h2 className="text-2xl font-semibold text-ink">Specifications</h2>
              <div className="mt-4">
                <ProductSpecsTable product={product} />
              </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-lg border border-line bg-white p-6 shadow-card">
                <h2 className="text-xl font-semibold text-ink">Condition grades</h2>
                <div className="mt-4 grid gap-3">
                  {product.conditionGrades.map((grade) => (
                    <p key={grade} className="rounded-lg bg-paper px-4 py-3 text-sm font-semibold text-muted">{grade}</p>
                  ))}
                </div>
              </div>
              <div className="rounded-lg border border-line bg-white p-6 shadow-card">
                <h2 className="text-xl font-semibold text-ink">Deployment options</h2>
                <div className="mt-4 grid gap-3">
                  {product.deploymentTypes.map((type) => (
                    <p key={type} className="rounded-lg bg-paper px-4 py-3 text-sm font-semibold text-muted">{type}</p>
                  ))}
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-ink">Support included</h2>
              <div className="mt-4">
                <ProductSupportSection product={product} />
              </div>
            </section>

            <section className="rounded-lg border border-line bg-white p-6 shadow-card">
              <h2 className="text-2xl font-semibold text-ink">Bundle options</h2>
              <div className="mt-5 grid gap-3 md:grid-cols-3">
                {product.bundleOptions.map((option) => (
                  <div key={option} className="rounded-lg bg-paper p-4">
                    <Icon name="package" className="h-5 w-5 text-flame-600" />
                    <p className="mt-3 text-sm font-semibold text-ink">{option}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-lg border border-line bg-white p-6 shadow-card">
              <h2 className="text-2xl font-semibold text-ink">FAQs</h2>
              <div className="mt-5 divide-y divide-line">
                {product.faqs.map((faq) => (
                  <div key={faq.question} className="py-4 first:pt-0 last:pb-0">
                    <p className="font-semibold text-ink">{faq.question}</p>
                    <p className="mt-2 text-sm leading-6 text-muted">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-ink">Related devices</h2>
              <div className="mt-5">
                <RelatedDevices products={related} />
              </div>
            </section>
          </div>

          <aside id="request-device" className="sticky top-32">
            <DeviceRequestForm
              product={product}
              compact
              title="Enquire now"
              description="Request this product, ask about bulk quantities or share a deployment location."
            />
          </aside>
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/94 p-3 shadow-soft backdrop-blur lg:hidden">
        <Link href="#request-device" className="flex min-h-12 items-center justify-center rounded-full bg-flame-500 px-5 text-sm font-semibold text-white">
          Enquire about {product.name}
        </Link>
      </div>
    </main>
  );
}
