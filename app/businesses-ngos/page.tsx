import type { Metadata } from "next";
import { BusinessesNgosExperience } from "@/components/businesses-ngos/businesses-ngos-experience";

export const metadata: Metadata = {
  title: "Businesses & NGOs Technology Solutions",
  description:
    "Premium refurbished technology packages, field office kits, productivity setup, support and circular lifecycle planning for SMEs, NGOs and mission-led organisations."
};

export default function BusinessesAndNgosPage() {
  return <BusinessesNgosExperience />;
}
