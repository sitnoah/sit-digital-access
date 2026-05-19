import type { Metadata } from "next";
import { EducationUseCases } from "@/components/schools/education-use-cases";
import { LabPackageBuilder } from "@/components/schools/lab-package-builder";
import { SchoolDeploymentJourney } from "@/components/schools/school-deployment-journey";
import { SchoolEnquiryForm } from "@/components/schools/school-enquiry-form";
import { SchoolFAQ } from "@/components/schools/school-faq";
import { SchoolInventoryDashboard } from "@/components/schools/school-inventory-dashboard";
import { SchoolSolutionsGrid } from "@/components/schools/school-solutions-grid";
import { SchoolsCTA } from "@/components/schools/schools-cta";
import { SchoolsHero } from "@/components/schools/schools-hero";
import { SponsorSchoolLabSection } from "@/components/schools/sponsor-school-lab-section";
import { TimetableCapacitySection } from "@/components/schools/timetable-capacity-section";

export const metadata: Metadata = {
  title: "Schools & Training Centres",
  description:
    "Premium school computer lab packages, learner devices, instructor devices, software setup, training, inventory planning and maintenance support for schools and training centres."
};

export default function SchoolsPage() {
  return (
    <main>
      <SchoolsHero />
      <SchoolSolutionsGrid />
      <LabPackageBuilder />
      <TimetableCapacitySection />
      <SchoolInventoryDashboard />
      <EducationUseCases />
      <SchoolDeploymentJourney />
      <SponsorSchoolLabSection />
      <SchoolEnquiryForm />
      <SchoolFAQ />
      <SchoolsCTA />
    </main>
  );
}
