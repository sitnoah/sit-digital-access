import { Icon } from "@/components/icons";
import {
  getEstimatedCo2SavedKg,
  getGradeDescriptions,
  getLifecycleLabels,
  getSustainabilityHighlights,
  getTrustBadges,
  getWarrantyHighlights
} from "@/lib/device-trust";
import type { DeviceProduct } from "@/types/device";

type DeviceMarketplaceTrustProps = {
  product?: DeviceProduct;
};

const fallbackLifecycle = ["Source", "Test", "Wipe", "Configure", "Deploy", "Support"];
const fallbackGrades = [
  { label: "Grade A", value: "Best cosmetic condition for premium learner, staff and public-facing use." },
  { label: "Grade B", value: "Strong everyday value for classrooms, teams and shared access." },
  { label: "Grade C", value: "Budget-conscious functional devices for fixed sites and supervised labs." }
];

export function DeviceMarketplaceTrust({ product }: DeviceMarketplaceTrustProps) {
  const lifecycle = product ? getLifecycleLabels(product) : fallbackLifecycle;
  const grades = product ? getGradeDescriptions(product) : fallbackGrades;
  const trustBadges = product ? getTrustBadges(product) : ["Secure wipe", "Grade transparency", "Support workflow", "Bulk ready"];
  const sustainability = product
    ? getSustainabilityHighlights(product)
    : ["Estimated CO2 avoided through reuse", "Devices diverted from premature waste", "Circular technology route"];
  const warranty = product
    ? getWarrantyHighlights(product)
    : ["Warranty-ready workflow", "Support and replacement planning", "Deployment documentation"];
  const co2 = product ? `${getEstimatedCo2SavedKg(product).toLocaleString()}kg` : "Reuse";

  return (
    <section className="rounded-lg border border-line bg-white p-6 shadow-card">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-flame-600">
            Marketplace trust
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink">
            {product ? `${product.name} confidence profile` : "Why refurbished technology works here."}
          </h2>
          <p className="mt-4 text-sm leading-6 text-muted">
            Refurbished devices are strongest when condition, readiness, support and sustainability
            are visible before a request is made. This layer explains the tradeoffs clearly for
            schools, NGOs, businesses and deployment partners.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg bg-paper p-4">
              <Icon name="leaf" className="h-5 w-5 text-flame-600" />
              <p className="mt-3 text-2xl font-semibold text-ink">{co2}</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-muted">estimated CO2 avoided</p>
            </div>
            <div className="rounded-lg bg-paper p-4">
              <Icon name="package" className="h-5 w-5 text-flame-600" />
              <p className="mt-3 text-2xl font-semibold text-ink">Bulk</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-muted">education and deployment support</p>
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="grid gap-3 sm:grid-cols-2">
            {trustBadges.map((badge) => (
              <p key={badge} className="flex items-center gap-2 rounded-lg bg-paper px-4 py-3 text-sm font-semibold text-ink">
                <Icon name="check" className="h-4 w-4 text-flame-600" />
                {badge}
              </p>
            ))}
          </div>

          <div className="rounded-lg border border-line p-4">
            <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-flame-600">Lifecycle readiness</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {lifecycle.map((step) => (
                <span key={step} className="rounded-full border border-line bg-paper px-3 py-1 text-xs font-semibold text-muted">
                  {step}
                </span>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-line p-4">
              <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-flame-600">Grade clarity</h3>
              <div className="mt-3 grid gap-2">
                {grades.map((grade) => (
                  <p key={grade.label} className="text-sm leading-6 text-muted">
                    <strong className="text-ink">{grade.label}:</strong> {grade.value}
                  </p>
                ))}
              </div>
            </div>
            <div className="rounded-lg border border-line p-4">
              <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-flame-600">Warranty and reuse</h3>
              <div className="mt-3 grid gap-2">
                {[...warranty, ...sustainability].slice(0, 5).map((item) => (
                  <p key={item} className="flex gap-2 text-sm leading-6 text-muted">
                    <Icon name="shield" className="mt-0.5 h-4 w-4 shrink-0 text-flame-600" />
                    {item}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
