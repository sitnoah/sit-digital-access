import type { Metadata } from "next";
import { RepairStatusLookup } from "@/components/repairs/repair-status-lookup";

export const metadata: Metadata = {
  title: "Repair Status",
  description: "Track a SIT Digital Access repair ticket using a ticket ID and customer status token."
};

export default function RepairStatusPage() {
  return (
    <main>
      <RepairStatusLookup />
    </main>
  );
}
