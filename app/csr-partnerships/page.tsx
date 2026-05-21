import type { Metadata } from "next";
import { CsrPartnershipsExperience } from "@/components/csr-partnerships/csr-partnerships-experience";

export const metadata: Metadata = {
  title: "CSR, ESG & Corporate Impact Partnerships",
  description:
    "Corporate impact, ESG and CSR technology partnerships for secure device recovery, school and community sponsorship, skills enablement and Africa deployment pathways."
};

export default function CsrPartnershipsPage() {
  return <CsrPartnershipsExperience />;
}
