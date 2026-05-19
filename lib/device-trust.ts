import type { DeviceProduct, DeviceSpecification } from "@/types/device";

const gradeDescriptions: DeviceSpecification[] = [
  { label: "Grade A", value: "Excellent cosmetic condition with strong performance and minimal visible wear." },
  { label: "Grade B", value: "Good everyday condition with light marks, fully tested and deployment-ready." },
  { label: "Grade C", value: "Functional value option with more visible wear, best for budget or fixed-site use." },
  { label: "Tested accessories", value: "Checked for safe use, compatibility and practical deployment fit." }
];

const categoryCo2Estimates: Record<string, number> = {
  "Student laptops": 75,
  "Business laptops": 95,
  "Desktop PCs": 110,
  "Mini PCs": 55,
  "All-in-one PCs": 125,
  "Computer lab bundles": 1500,
  "AI learning lab bundles": 1750,
  Accessories: 18
};

export function getEstimatedCo2SavedKg(product: DeviceProduct) {
  return product.estimatedCo2SavedKg ?? categoryCo2Estimates[product.category] ?? 70;
}

export function getGradeDescriptions(product: DeviceProduct) {
  return product.gradeDescriptions ?? gradeDescriptions.filter((grade) => product.conditionGrades.includes(grade.label));
}

export function getLifecycleLabels(product: DeviceProduct) {
  return product.lifecycleLabels ?? [
    "Sourced",
    "Tested",
    "Securely wiped",
    "Configured",
    "Asset tagged",
    product.deploymentTypes.includes("Africa shipment") ? "Deployment packed" : "Support ready"
  ];
}

export function getWarrantyHighlights(product: DeviceProduct) {
  return product.warrantyHighlights ?? [
    product.warranty,
    "Support route documented",
    "Replacement planning available for bundles"
  ];
}

export function getTrustBadges(product: DeviceProduct) {
  return product.trustBadges ?? [
    "Secure wipe workflow",
    "Performance checked",
    "Asset records available",
    product.supportIncluded.includes("Training included") ? "Training-ready" : "Support-ready",
    product.deploymentTypes.includes("Africa shipment") ? "Africa-ready" : "Education-ready"
  ];
}

export function getSustainabilityHighlights(product: DeviceProduct) {
  return product.sustainabilityHighlights ?? [
    `${getEstimatedCo2SavedKg(product).toLocaleString()}kg estimated CO2 avoided through reuse`,
    product.lowPowerScore && product.lowPowerScore >= 80
      ? "Low-power fit for labs and shared access"
      : "Extends useful device life before recycling",
    "Prepared for redeployment rather than premature disposal"
  ];
}

