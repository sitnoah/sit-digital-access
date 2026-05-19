import type { Metadata } from "next";
import "./globals.css";
import { SiteShell } from "@/components/site-shell";

export const metadata: Metadata = {
  title: {
    default: "SIT Digital Access | Affordable Technology Access",
    template: "%s | SIT Digital Access"
  },
  description:
    "SIT Digital Access provides refurbished laptops, desktops, mini PCs, digital skills enablement, IT support and secure technology deployment for schools, communities, SMEs, NGOs and training centres across the UK and Africa.",
  openGraph: {
    title: "SIT Digital Access",
    description:
      "Affordable refurbished devices, computer labs, training and deployment support for learning, work and digital growth.",
    url: "https://sitdigitalaccess.example",
    siteName: "SIT Digital Access",
    locale: "en_GB",
    type: "website"
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico"
  },
  metadataBase: new URL("https://sitdigitalaccess.example")
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB">
      <body className="antialiased">
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
