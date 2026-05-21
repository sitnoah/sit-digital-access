import type { Metadata } from "next";
import { DeploymentMapExperience } from "@/components/deployment-map/deployment-map-experience";

export const metadata: Metadata = {
  title: "Africa Deployment Intelligence",
  description:
    "Africa deployment intelligence, readiness scoring, infrastructure planning, school lab rollout and community hub deployment strategy for SIT Digital Access."
};

export default function DeploymentMapPage() {
  return <DeploymentMapExperience />;
}
