import { Suspense } from "react";
import { AdminSearchPage } from "@/components/admin/operations/admin-operations-pages";

export default function AdminSearchRoute() {
  return (
    <Suspense fallback={null}>
      <AdminSearchPage />
    </Suspense>
  );
}
