import type { Metadata } from "next";
import { TradeInExperience } from "@/components/trade-in/trade-in-experience";

export const metadata: Metadata = {
  title: "Trade-In & Circular Recovery",
  description:
    "Trade-in, buyback and circular technology recovery for laptops, desktops, mini PCs and organisation IT refreshes through SIT Digital Access."
};

export default function TradeInRoute() {
  return <TradeInExperience />;
}
