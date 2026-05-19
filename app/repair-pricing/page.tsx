import type { Metadata } from "next";
import { RepairPricingExperience } from "@/components/repairs/repair-pricing-page";

export const metadata: Metadata = {
  title: "Repair Pricing",
  description:
    "Transparent diagnostics, repair estimate bands, warranty-aware handling and bulk school repair support from SIT Digital Access."
};

export default function RepairPricingPage() {
  return (
    <main>
      <RepairPricingExperience />
    </main>
  );
}
