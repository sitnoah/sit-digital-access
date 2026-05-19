import type { Metadata } from "next";
import { AdminLoginPage } from "@/components/admin/admin-login-page";

export const metadata: Metadata = {
  title: "Admin Sign In",
  description: "Secure sign in for SIT Digital Access administrators"
};

export default function AdminLoginRoute() {
  return <AdminLoginPage />;
}
