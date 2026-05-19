"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/brand-logo";
import { Icon } from "@/components/icons";
import { useAdminAuth } from "@/components/admin/admin-auth-context";
import { firebaseConfigStatus } from "@/lib/firebase";
import { cn } from "@/lib/utils";

const trustBadges = [
  "Firebase Auth",
  "Role-based access",
  "Admin custom claims",
  "Audit-ready actions"
];

function ProviderButton({
  label,
  provider,
  disabled,
  loading,
  onClick
}: {
  label: string;
  provider: "G" | "M" | "GH";
  disabled?: boolean;
  loading?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className="flex min-h-12 w-full items-center justify-center gap-3 rounded-full border border-line bg-white px-4 text-sm font-semibold text-ink shadow-sm transition hover:border-flame-300 hover:shadow-card disabled:cursor-not-allowed disabled:opacity-60"
      disabled={disabled || loading}
      onClick={onClick}
    >
      <span
        className={cn(
          "flex h-7 min-w-7 items-center justify-center rounded-full text-xs font-black",
          provider === "G" && "bg-white text-[#4285F4] ring-1 ring-line",
          provider === "M" && "bg-[#F25022] text-white",
          provider === "GH" && "bg-ink text-white"
        )}
      >
        {provider}
      </span>
      {loading ? "Opening provider..." : label}
    </button>
  );
}

export function AdminLoginPage() {
  const router = useRouter();
  const {
    loading,
    isAdmin,
    error,
    authActionError,
    authActionMessage,
    signInWithEmail,
    signInWithGoogle,
    signInWithMicrosoft,
    signInWithGitHub,
    resetPassword,
    clearAuthMessages
  } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [providerLoading, setProviderLoading] = useState<string | null>(null);
  const [resetMode, setResetMode] = useState(false);
  const firebaseConfigured = firebaseConfigStatus.configured;

  useEffect(() => {
    if (!loading && isAdmin) {
      router.replace("/admin/dashboard");
    }
  }, [isAdmin, loading, router]);

  async function handleEmailSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    if (resetMode) {
      await resetPassword(email);
    } else {
      await signInWithEmail(email, password);
    }
    setSubmitting(false);
  }

  async function handleProvider(provider: "google" | "microsoft" | "github") {
    setProviderLoading(provider);
    if (provider === "google") await signInWithGoogle();
    if (provider === "microsoft") await signInWithMicrosoft();
    if (provider === "github") await signInWithGitHub();
    setProviderLoading(null);
  }

  return (
    <main className="min-h-screen bg-[#070707] text-white">
      <div className="grid min-h-screen lg:grid-cols-[1.08fr_0.92fr]">
        <section className="relative overflow-hidden bg-orange-mesh px-6 py-8 sm:px-10 lg:px-14">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_12%,rgba(249,115,22,0.26),transparent_28%),linear-gradient(120deg,rgba(0,0,0,0.2),rgba(0,0,0,0.82))]" />
          <div className="relative z-10 flex min-h-full flex-col">
            <Link href="/" className="inline-flex w-fit">
              <BrandLogo />
            </Link>

            <div className="my-auto max-w-2xl py-16">
              <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-flame-100 backdrop-blur">
                Secure admin console
              </span>
              <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                Secure access to SIT Digital Access Admin
              </h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-white/72">
                Manage enquiries, device requests, donations, inventory, impact metrics and deployment workflows.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {trustBadges.map((badge) => (
                  <div key={badge} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.07] px-4 py-3 backdrop-blur">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-flame-500/15 text-flame-300">
                      <Icon name="shield" className="h-4 w-4" />
                    </span>
                    <span className="text-sm font-semibold text-white/86">{badge}</span>
                  </div>
                ))}
              </div>
            </div>

            <p className="relative z-10 text-xs text-white/45">
              Firebase credentials stay server-side. Admin access is authorised by custom claims.
            </p>
          </div>
        </section>

        <section className="flex min-h-screen items-center justify-center bg-paper px-4 py-10 text-ink sm:px-6 lg:px-10">
          <div className="w-full max-w-lg">
            <div className="rounded-[2rem] border border-line bg-white p-6 shadow-2xl shadow-black/10 sm:p-8">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-flame-600">
                  Admin sign in
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight">Welcome back</h2>
                <p className="mt-3 text-sm leading-6 text-muted">
                  Use a Firebase Authentication account with a valid SIT Digital Access admin custom claim.
                </p>
              </div>

              {!firebaseConfigured ? (
                <div className="mt-6 rounded-2xl border border-flame-200 bg-flame-50 p-4 text-sm text-flame-900">
                  <p className="font-semibold">Firebase client configuration is missing.</p>
                  <p className="mt-1 leading-6">
                    Add the `NEXT_PUBLIC_FIREBASE_*` variables to `.env.local`, then restart the Next.js dev server.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {firebaseConfigStatus.missingKeys.map((key) => (
                      <span key={key} className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-flame-700 ring-1 ring-flame-100">
                        {key}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                <ProviderButton
                  label="Google"
                  provider="G"
                  disabled={!firebaseConfigured || submitting}
                  loading={providerLoading === "google"}
                  onClick={() => void handleProvider("google")}
                />
                <ProviderButton
                  label="Microsoft"
                  provider="M"
                  disabled={!firebaseConfigured || submitting}
                  loading={providerLoading === "microsoft"}
                  onClick={() => void handleProvider("microsoft")}
                />
                <ProviderButton
                  label="GitHub"
                  provider="GH"
                  disabled={!firebaseConfigured || submitting}
                  loading={providerLoading === "github"}
                  onClick={() => void handleProvider("github")}
                />
              </div>

              <div className="my-7 flex items-center gap-4 text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                <span className="h-px flex-1 bg-line" />
                or continue with email
                <span className="h-px flex-1 bg-line" />
              </div>

              <form className="space-y-4" onSubmit={handleEmailSubmit}>
                <label className="block text-sm font-semibold">
                  Email address
                  <input
                    className="mt-2 w-full rounded-2xl border border-line px-4 py-3 text-sm outline-none transition focus:border-flame-400 focus:ring-4 focus:ring-flame-100"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    required
                    disabled={!firebaseConfigured}
                    onChange={(event) => {
                      clearAuthMessages();
                      setEmail(event.target.value);
                    }}
                  />
                </label>

                {!resetMode ? (
                  <label className="block text-sm font-semibold">
                    Password
                    <span className="mt-2 flex rounded-2xl border border-line bg-white focus-within:border-flame-400 focus-within:ring-4 focus-within:ring-flame-100">
                      <input
                        className="min-w-0 flex-1 rounded-2xl px-4 py-3 text-sm outline-none"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        value={password}
                        required
                        disabled={!firebaseConfigured}
                        onChange={(event) => {
                          clearAuthMessages();
                          setPassword(event.target.value);
                        }}
                      />
                      <button
                        type="button"
                        className="px-4 text-xs font-semibold text-muted transition hover:text-ink"
                        onClick={() => setShowPassword((value) => !value)}
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </span>
                  </label>
                ) : null}

                <div className="flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="button"
                    className="text-left font-semibold text-flame-600 transition hover:text-flame-700"
                    onClick={() => {
                      clearAuthMessages();
                      setResetMode((value) => !value);
                    }}
                  >
                    {resetMode ? "Back to sign in" : "Forgot password?"}
                  </button>
                  <span className="text-xs text-muted">Session handled securely by Firebase Auth.</span>
                </div>

                <button
                  className="min-h-12 w-full rounded-full bg-flame-500 px-5 text-sm font-semibold text-white shadow-lg shadow-flame-500/20 transition hover:bg-flame-600 disabled:cursor-not-allowed disabled:bg-muted"
                  disabled={!firebaseConfigured || submitting || Boolean(providerLoading)}
                >
                  {submitting
                    ? resetMode
                      ? "Sending reset email..."
                      : "Signing in..."
                    : resetMode
                      ? "Send reset email"
                      : "Sign in securely"}
                </button>
              </form>

              {authActionMessage ? (
                <p className="mt-5 rounded-2xl bg-green-50 px-4 py-3 text-sm font-medium text-green-800">
                  {authActionMessage}
                </p>
              ) : null}
              {authActionError || error ? (
                <p className="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  {authActionError ?? error}
                </p>
              ) : null}

              <div className="mt-7 rounded-2xl bg-paper p-4 text-xs leading-5 text-muted">
                Access requires one of: `superAdmin`, `admin`, `operationsManager`, `deviceManager`, `inventoryManager`, `donationsManager`, `deploymentCoordinator`, `countryManager`, `analyticsManager` or `supportAgent`.
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
