import type { Metadata } from "next";
import { Suspense } from "react";
import { BookRepairClient } from "@/components/repairs/BookRepairClient";

export const metadata: Metadata = {
  title: "Book Repair",
  description: "Book a laptop, desktop, mini PC or school lab repair with SIT Digital Access."
};

export default function BookRepairPage() {
  return (
    <main>
      <Suspense fallback={<div className="min-h-screen bg-paper" />}>
        <BookRepairClient />
      </Suspense>
    </main>
  );
}
