import { Icon } from "@/components/icons";
import type { IconKey } from "@/components/icons";
import { getEstimatedCo2SavedKg, getTrustBadges } from "@/lib/device-trust";
import type { DeviceProduct } from "@/types/device";

export function ProductTrustBadges({ product }: { product: DeviceProduct }) {
  const badges: { label: string; icon: IconKey }[] = [
    { label: "Tested & configured", icon: "check" },
    { label: "Securely wiped", icon: "shield" },
    { label: "Asset tagged", icon: "badge" },
    { label: "Support available", icon: "headset" },
    ...(product.deploymentTypes.includes("Africa shipment")
      ? [{ label: "Africa deployment ready", icon: "globe" as IconKey }]
      : [])
  ];
  const extendedBadges = getTrustBadges(product)
    .filter((label) => !badges.some((badge) => badge.label === label))
    .slice(0, 2)
    .map((label) => ({ label, icon: "sparkles" as IconKey }));
  const allBadges = [
    ...badges,
    { label: `${getEstimatedCo2SavedKg(product).toLocaleString()}kg CO2 avoided`, icon: "leaf" as IconKey },
    ...extendedBadges
  ].slice(0, 6);

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
      {allBadges.map(({ label, icon }) => (
        <div key={label} className="rounded-lg border border-line bg-white p-4 shadow-card">
          <Icon name={icon} className="h-5 w-5 text-flame-600" />
          <p className="mt-3 text-sm font-semibold text-ink">{label}</p>
        </div>
      ))}
    </div>
  );
}
