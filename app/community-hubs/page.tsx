import type { Metadata } from "next";
import { AnimatedSection } from "@/components/animated-section";
import {
  EcosystemCtaBand,
  PathwayGrid,
  StoryGrid
} from "@/components/ecosystem/ecosystem-sections";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { communityHubPackages, successStories } from "@/lib/ecosystem-content";

export const metadata: Metadata = {
  title: "Community Hubs",
  description:
    "Community digital hub packages for libraries, churches, charities, NGOs, training centres and shared access spaces."
};

export default function CommunityHubsPage() {
  return (
    <main>
      <PageHero
        eyebrow="Community digital hubs"
        title="Shared technology access for communities, charities and local learning spaces."
        description="Plan practical digital hubs with refurbished devices, accessories, support routes, skills pathways and deployment-ready bundles."
        primary={{ label: "Explore hub packages", href: "#hub-packages" }}
        secondary={{ label: "Request devices", href: "/devices#device-request" }}
      />

      <div id="hub-packages">
        <PathwayGrid
          eyebrow="Hub packages"
          title="Build a hub around the people and space you already have."
          description="Each route connects device supply with setup, shared usage and support planning."
          pathways={communityHubPackages}
          surface="white"
        />
      </div>

      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <AnimatedSection>
            <SectionHeading
              eyebrow="Community outcomes"
              title="Digital inclusion works when access is recurring, supported and local."
              description="The same catalogue and programme model can serve libraries, churches, NGOs, youth groups, refugee support spaces and community training rooms."
            />
          </AnimatedSection>
          <div className="mt-10">
            <AnimatedSection delay={0.1}>
              <StoryGrid stories={successStories.filter((story) => story.category === "Community" || story.category === "NGO" || story.category === "Learner")} />
            </AnimatedSection>
          </div>
        </div>
      </section>

      <EcosystemCtaBand
        title="Plan a community hub with devices, training and support in one conversation."
        description="Share the site, learner group, device quantity and support needs through the existing contact and device request flows."
        primary={{ label: "Request hub devices", href: "/devices#device-request" }}
        secondary={{ label: "Discuss partnership", href: "/contact?type=PARTNERSHIP#contact-form" }}
      />
    </main>
  );
}

