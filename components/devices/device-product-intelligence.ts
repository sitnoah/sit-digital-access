import type { DeviceProduct } from "@/types/device";

export function getDeploymentConfidence(product: DeviceProduct) {
  const score = product.africaFit ?? product.educationFit ?? 70;
  if (score >= 90) return { label: "High Africa-ready confidence", score };
  if (score >= 75) return { label: "Strong deployment fit", score };
  return { label: "Assessment-led deployment fit", score };
}

export function getPowerEstimate(product: DeviceProduct) {
  const score = product.lowPowerScore ?? 60;
  if (product.category === "Computer lab bundles" || product.category === "AI learning lab bundles") return "Bundle assessed";
  if (score >= 90) return "15-35W typical";
  if (score >= 75) return "25-55W typical";
  if (score >= 60) return "45-95W typical";
  return "Site dependent";
}

export function getPerformanceLevel(product: DeviceProduct) {
  const score = product.performanceScore ?? 65;
  if (score >= 90) return "High performance";
  if (score >= 78) return "Strong everyday performance";
  if (score >= 65) return "Reliable learning performance";
  return "Basic access performance";
}

export function getSustainabilityScore(product: DeviceProduct) {
  return Math.min(
    99,
    Math.round(((product.lowPowerScore ?? 68) + (product.educationFit ?? 72) + (product.africaFit ?? 72)) / 3)
  );
}

export function getDeliveryEstimate(product: DeviceProduct) {
  if (product.availability === "Available now") return "Fast intake ready";
  if (product.availability === "Limited stock") return "Confirm stock";
  if (product.availability === "Coming soon") return "Pipeline stock";
  if (product.availability === "Bundle only") return "Bundle planning";
  return "Quote and assess";
}

export function getBulkAvailability(product: DeviceProduct) {
  if (product.bundleOptions.length >= 3) return "Bulk available";
  if (product.deploymentTypes.some((type) => type.includes("bundle") || type.includes("lab"))) return "Bundle capable";
  return "Single or small batch";
}

export function getAfricaSuitability(product: DeviceProduct) {
  const score = product.africaFit ?? 65;
  if (score >= 88) return "High";
  if (score >= 72) return "Medium";
  return "Assessment";
}

export function getLifecycleEstimate(product: DeviceProduct) {
  if ((product.performanceScore ?? 0) >= 85 && product.conditionGrades.includes("Grade A")) return "3-5 year reuse window";
  if (product.conditionGrades.includes("Grade C")) return "1-3 year value window";
  return "2-4 year reuse window";
}

