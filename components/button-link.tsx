import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type ButtonLinkProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "dark" | "ghost";
  className?: string;
};

const variants = {
  primary:
    "bg-flame-500 text-white shadow-card hover:bg-flame-600 focus-visible:outline-flame-500",
  secondary:
    "border border-ink/10 bg-white text-ink shadow-card hover:border-flame-300 hover:text-flame-700 focus-visible:outline-flame-500",
  dark:
    "bg-ink text-white shadow-card hover:bg-graphite focus-visible:outline-flame-500",
  ghost:
    "bg-transparent text-ink hover:bg-white/70 focus-visible:outline-flame-500"
};

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
        variants[variant],
        className
      )}
    >
      <span>{children}</span>
      <ArrowRight className="h-4 w-4" aria-hidden="true" />
    </Link>
  );
}
