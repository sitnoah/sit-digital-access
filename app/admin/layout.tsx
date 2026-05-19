import type { Metadata } from "next";
import { AdminAuthProvider } from "@/components/admin/admin-auth-context";
import { AdminShell } from "@/components/admin/admin-shell";

export const metadata: Metadata = {
  title: "Admin",
  description: "SIT Digital Access admin command centre"
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminShell>{children}</AdminShell>
    </AdminAuthProvider>
  );
}
