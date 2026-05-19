"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
