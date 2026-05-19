import type { Metadata } from "next";
import { RepairCentresExperience } from "@/components/repairs/repair-centres-experience";

export const metadata: Metadata = {
  title: "Repair Centres",
  description: "SIT Digital Access repair routes for mail-in, pickup, partner handover and Africa deployment support."
};

export default function RepairCentresPage() {
  return (
    <main>
      <RepairCentresExperience />
    </main>
  );
}
