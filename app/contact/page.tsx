import type { Metadata } from "next";
import { Suspense } from "react";
import { ContactFAQ } from "@/components/contact/contact-faq";
import { ContactForm } from "@/components/contact/contact-form";
import { ContactHero } from "@/components/contact/contact-hero";
import { ContactOperationsPanel } from "@/components/contact/contact-operations-panel";
import { ContactQuickActions } from "@/components/contact/contact-quick-actions";
import { EnquiryRouteCards } from "@/components/contact/enquiry-route-cards";
import { WhatHappensNext } from "@/components/contact/what-happens-next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact SIT Digital Access for device requests, partnerships, donations, sponsorship, IT support and Africa deployment planning."
};

export default function ContactPage() {
  return (
    <main>
      <ContactHero />
      <EnquiryRouteCards />

      <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
          <div className="order-2 lg:order-1">
            <ContactOperationsPanel />
          </div>
          <div className="order-1 lg:order-2">
            <Suspense fallback={null}>
              <ContactForm />
            </Suspense>
          </div>
        </div>
      </section>

      <WhatHappensNext />
      <ContactQuickActions />
      <ContactFAQ />
    </main>
  );
}
