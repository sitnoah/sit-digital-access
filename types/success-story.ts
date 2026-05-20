export type SuccessStoryStatus = "DRAFT" | "IN_REVIEW" | "PUBLISHED" | "ARCHIVED";

export type SuccessStoryType =
  | "LEARNER"
  | "SCHOOL"
  | "NGO"
  | "COMMUNITY"
  | "BUSINESS"
  | "DONOR"
  | "AFRICA_DEPLOYMENT";

export type SuccessStoryTimelineEntry = {
  id?: string;
  type?: string;
  title?: string;
  createdAt?: string;
  actorEmail?: string | null;
  metadata?: Record<string, unknown>;
};

export type SuccessStoryDraftResponse = {
  title: string;
  summary: string;
  body: string;
  quote?: string;
  socialPost?: string;
  tags: string[];
  tone: string;
  provider: "openai" | "heuristic";
  generatedAt: string;
  fallbackReason?: string;
};

export type SuccessStory = Record<string, unknown> & {
  id: string;
  title: string;
  slug?: string;
  type?: SuccessStoryType | string;
  storyType?: SuccessStoryType | string;
  status?: SuccessStoryStatus | string;
  region?: string | null;
  country?: string | null;
  beneficiaryName?: string | null;
  organisation?: string | null;
  summary?: string;
  body?: string;
  fullStory?: string;
  quote?: string | null;
  beforeSituation?: string | null;
  afterImpact?: string | null;
  devicesProvided?: number;
  deviceCount?: number;
  trainingLinked?: string | null;
  skillsGained?: unknown[];
  outcome?: string | null;
  mediaUrls?: unknown[];
  tags?: unknown[];
  featured?: boolean;
  published?: boolean;
  consentConfirmed?: boolean;
  createdBy?: string | null;
  createdByEmail?: string | null;
  createdAt?: string;
  updatedAt?: string;
  timeline?: SuccessStoryTimelineEntry[];
};

export type SuccessStorySummary = {
  totalStories: number;
  published: number;
  drafts: number;
  regionsRepresented: number;
  awaitingReview?: number;
  featured?: number;
  storiesWithMedia?: number;
  impactMetricsAttached?: number;
};

export type SuccessStoryListResponse = {
  stories: SuccessStory[];
  summary: SuccessStorySummary;
};
