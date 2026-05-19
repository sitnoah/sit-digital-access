import Image from "next/image";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  className?: string;
  variant?: "header" | "footer";
  showText?: boolean;
};

export function BrandLogo({ className, variant = "header", showText = true }: BrandLogoProps) {
  const isHeader = variant === "header";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-3",
        className
      )}
    >
      <span
        className={cn(
          "flex shrink-0 items-center justify-center",
          isHeader ? "h-16 w-16 sm:h-[72px] sm:w-[72px]" : "h-24 w-24 sm:h-28 sm:w-28"
        )}
      >
        <Image
          src="/images/sit-digital-access-logo.svg"
          alt="SIT Digital Access"
          width={512}
          height={512}
          priority={isHeader}
          className="block h-[92%] w-[92%] object-contain"
        />
      </span>
      {showText ? (
        <span className="min-w-0">
          <span
            className={cn(
              "block whitespace-nowrap font-semibold leading-6",
              isHeader ? "text-lg text-white" : "text-xl text-white"
            )}
          >
            SIT Digital Access
          </span>
          <span
            className={cn(
              "truncate text-xs",
              isHeader ? "hidden sm:block" : "block",
              isHeader ? "text-white/64" : "text-white/58"
            )}
          >
            Technology. Education. Empowerment.
          </span>
        </span>
      ) : null}
    </span>
  );
}
