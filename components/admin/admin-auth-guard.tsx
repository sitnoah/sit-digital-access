"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Icon } from "@/components/icons";
import { useAdminAuth } from "@/components/admin/admin-auth-context";

function AdminLoadingScreen({ message = "Checking secure admin session..." }: { message?: string }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-ink px-4 text-white">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/[0.06] p-6 text-center shadow-2xl backdrop-blur">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-flame-500 text-white shadow-lg shadow-flame-500/20">
          <Icon name="shield" className="h-5 w-5" />
        </span>
        <p className="mt-5 text-sm font-semibold text-white">{message}</p>
        <p className="mt-2 text-xs leading-5 text-white/55">SIT Digital Access Admin</p>
      </div>
    </main>
  );
}

export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { loading, isAdmin, idToken } = useAdminAuth();

  useEffect(() => {
    if (!loading && (!isAdmin || !idToken)) {
      router.replace("/admin/login");
    }
  }, [idToken, isAdmin, loading, router]);

  if (loading) {
    return <AdminLoadingScreen />;
  }

  if (!isAdmin || !idToken) {
    return <AdminLoadingScreen message="Redirecting to secure sign in..." />;
  }

  return <>{children}</>;
}
