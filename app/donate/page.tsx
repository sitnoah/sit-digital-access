import type { Metadata } from "next";
import { CorporateRecyclingSection } from "@/components/donate/corporate-recycling-section";
import { DonateCTA } from "@/components/donate/donate-cta";
import { DonateHero } from "@/components/donate/donate-hero";
import { DonationFAQ } from "@/components/donate/donation-faq";
import { DonationForm } from "@/components/donate/donation-form";
import { DonationImpactDashboard } from "@/components/donate/donation-impact-dashboard";
import { DonationJourneyTimeline } from "@/components/donate/donation-journey-timeline";
import { DonationPathwayCards } from "@/components/donate/donation-pathway-cards";
import { SponsorshipPackages } from "@/components/donate/sponsorship-packages";
import { TrustAndSafetySection } from "@/components/donate/trust-and-safety-section";

export const metadata: Metadata = {
  title: "Donate or Sponsor Devices",
  description:
    "Donate used technology, sponsor learner devices, support classroom bundles or create a corporate recycling partnership with SIT Digital Access."
};

export default function DonatePage() {
  return (
    <main>
      <DonateHero />
      <DonationPathwayCards />
      <CorporateRecyclingSection />
      <SponsorshipPackages />
      <DonationImpactDashboard />
      <TrustAndSafetySection />
      <DonationForm />
      <DonationJourneyTimeline />
      <DonationFAQ />
      <DonateCTA />
    </main>
  );
}
