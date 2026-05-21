import type { Metadata } from "next";
import { CommunityHubsExperience } from "@/components/community-hubs/community-hubs-experience";

export const metadata: Metadata = {
  title: "Community Digital Hubs",
  description:
    "Community digital hub and inclusion platform for refurbished devices, training pathways, Africa-ready deployment and local support."
};

export default function CommunityHubsPage() {
  return <CommunityHubsExperience />;
}
