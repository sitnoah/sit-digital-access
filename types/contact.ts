import type { IconKey } from "@/components/icons";
import type { EnquiryType } from "@/lib/api";

export type ContactEnquiryRoute = {
  title: string;
  description: string;
  bestFor: string;
  tag: string;
  ctaLabel: string;
  ctaHref: string;
  icon: IconKey;
  enquiryType: EnquiryType;
};

export type ContactInfoItem = {
  label: string;
  value: string;
  icon: IconKey;
};

export type ContactTrustCard = {
  title: string;
  description: string;
  icon: IconKey;
};

export type ContactProcessStep = {
  title: string;
  description: string;
  icon: IconKey;
};

export type ContactQuickAction = {
  label: string;
  href: string;
  icon: IconKey;
};

export type ContactSelectOption<T extends string = string> = {
  label: string;
  value: T;
};
