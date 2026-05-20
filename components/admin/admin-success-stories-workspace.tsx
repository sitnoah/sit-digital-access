"use client";

import type { FormEvent, ReactNode } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Icon, type IconKey } from "@/components/icons";
import { useAdminAuth } from "@/components/admin/admin-auth-context";
import { adminApi, API_BASE_URL, type ApiRecord, type EcosystemRecordPayload } from "@/lib/api";
import { cn } from "@/lib/utils";
import type {
  SuccessStory,
  SuccessStoryDraftResponse,
  SuccessStoryListResponse,
  SuccessStoryStatus,
  SuccessStoryType
} from "@/types/success-story";

const emptySummary = {
  totalStories: 0,
  published: 0,
  drafts: 0,
  regionsRepresented: 0,
  awaitingReview: 0,
  featured: 0,
  storiesWithMedia: 0,
  impactMetricsAttached: 0
};

const storyTypes: Array<{ value: SuccessStoryType; label: string }> = [
  { value: "LEARNER", label: "Learner" },
  { value: "SCHOOL", label: "School" },
  { value: "NGO", label: "NGO" },
  { value: "COMMUNITY", label: "Community" },
  { value: "BUSINESS", label: "Business" },
  { value: "DONOR", label: "Donor" },
  { value: "AFRICA_DEPLOYMENT", label: "Africa deployment" }
];

const statusOptions: Array<{ value: SuccessStoryStatus; label: string }> = [
  { value: "DRAFT", label: "Draft" },
  { value: "IN_REVIEW", label: "In review" },
  { value: "PUBLISHED", label: "Published" },
  { value: "ARCHIVED", label: "Archived" }
];

const workflowTabs = [
  "All stories",
  "Drafts",
  "Review",
  "Published",
  "Featured",
  "By region",
  "Media library"
] as const;

type WorkflowTab = (typeof workflowTabs)[number];

type ConnectedRecords = {
  deployments: ApiRecord[];
  donations: ApiRecord[];
  training: ApiRecord[];
};

function numberValue(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

function storyStatus(value: unknown, published?: unknown): SuccessStoryStatus {
  const status = String(value ?? "").toUpperCase().replace(/[\s-]+/g, "_");
  if (status === "PUBLISHED" || published === true) return "PUBLISHED";
  if (status === "IN_REVIEW" || status === "REVIEW" || status === "AWAITING_REVIEW") return "IN_REVIEW";
  if (status === "ARCHIVED") return "ARCHIVED";
  return "DRAFT";
}

function storyTypeLabel(value: unknown) {
  const type = String(value ?? "COMMUNITY").toUpperCase().replace(/[\s-]+/g, "_");
  return storyTypes.find((item) => item.value === type)?.label ?? "Community";
}

function statusClass(status: SuccessStoryStatus) {
  if (status === "PUBLISHED") return "border-emerald-200 bg-emerald-50 text-emerald-700";
  if (status === "IN_REVIEW") return "border-orange-200 bg-orange-50 text-orange-700";
  if (status === "ARCHIVED") return "border-slate-200 bg-slate-100 text-slate-600";
  return "border-purple-200 bg-purple-50 text-purple-700";
}

function formatDate(value: unknown) {
  if (!value) return "Not set";
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return "Not set";
  return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

function storyTitle(story: SuccessStory) {
  return story.title || String(story.name ?? "Untitled success story");
}

function storyMedia(story: SuccessStory) {
  const media = Array.isArray(story.mediaUrls) ? story.mediaUrls.map(String).filter(Boolean) : [];
  const visual = typeof story.visualAsset === "string" && story.visualAsset ? story.visualAsset : null;
  return visual && !media.includes(visual) ? [visual, ...media] : media;
}

function arrayText(value: unknown, fallback = "") {
  return Array.isArray(value) ? value.map(String).join(", ") : fallback;
}

function splitList(value: string) {
  return value
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function formText(form: FormData, key: string) {
  const value = form.get(key);
  return typeof value === "string" ? value : "";
}

function recordLabel(record: ApiRecord) {
  return String(record.title ?? record.name ?? record.organisation ?? record.donorName ?? record.cohortName ?? record.id);
}

export function AdminSuccessStoriesWorkspace() {
  const { token } = useAdminAuth();
  const [stories, setStories] = useState<SuccessStory[]>([]);
  const [summary, setSummary] = useState(emptySummary);
  const [connected, setConnected] = useState<ConnectedRecords>({ deployments: [], donations: [], training: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<WorkflowTab>("All stories");
  const [storyDrawer, setStoryDrawer] = useState<{ mode: "create" | "edit"; story?: SuccessStory; draft?: SuccessStoryDraftResponse } | null>(null);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [selectedStory, setSelectedStory] = useState<SuccessStory | null>(null);
  const [busyAction, setBusyAction] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    const settled = await Promise.allSettled([
      adminApi.getSuccessStoryOperations(token),
      adminApi.listDeployments(token),
      adminApi.listDonations(token),
      adminApi.listTrainingCohorts(token)
    ]);

    if (settled[0].status === "fulfilled") {
      const payload: SuccessStoryListResponse = settled[0].value;
      setStories(payload.stories ?? []);
      setSummary({ ...emptySummary, ...(payload.summary ?? {}) });
    } else {
      setStories([]);
      setSummary(emptySummary);
      setError(settled[0].reason instanceof Error ? settled[0].reason.message : "Failed to fetch success stories.");
    }

    setConnected({
      deployments: settled[1].status === "fulfilled" ? settled[1].value : [],
      donations: settled[2].status === "fulfilled" ? settled[2].value : [],
      training: settled[3].status === "fulfilled" ? settled[3].value : []
    });
    setLoading(false);
  }, [token]);

  useEffect(() => {
    void load();
  }, [load]);

  const filteredStories = useMemo(() => {
    const search = query.trim().toLowerCase();
    return stories.filter((story) => {
      const status = storyStatus(story.status, story.published);
      const matchesTab =
        activeTab === "All stories" ||
        (activeTab === "Drafts" && status === "DRAFT") ||
        (activeTab === "Review" && status === "IN_REVIEW") ||
        (activeTab === "Published" && status === "PUBLISHED") ||
        (activeTab === "Featured" && story.featured === true) ||
        (activeTab === "By region" && Boolean(story.region || story.country)) ||
        (activeTab === "Media library" && storyMedia(story).length > 0);
      if (!matchesTab) return false;
      if (!search) return true;
      return [
        storyTitle(story),
        story.summary,
        story.body,
        story.region,
        story.country,
        story.beneficiaryName,
        story.organisation,
        storyTypeLabel(story.type ?? story.storyType),
        arrayText(story.tags),
        arrayText(story.skillsGained)
      ].join(" ").toLowerCase().includes(search);
    });
  }, [activeTab, query, stories]);

  const upsertStory = useCallback((story: SuccessStory) => {
    setStories((current) => [story, ...current.filter((item) => item.id !== story.id)]);
    void load();
  }, [load]);

  const createOrUpdateStory = useCallback(async (payload: EcosystemRecordPayload, story?: SuccessStory) => {
    if (!token) return;
    const saved = story
      ? await adminApi.updateSuccessStory(token, story.id, payload)
      : await adminApi.createSuccessStory(token, payload);
    upsertStory(saved);
    setStoryDrawer(null);
  }, [token, upsertStory]);

  const seedDefaults = useCallback(async () => {
    if (!token) return;
    setBusyAction("seed");
    try {
      await adminApi.seedSuccessStories(token);
      await load();
    } finally {
      setBusyAction(null);
    }
  }, [load, token]);

  const publishStory = useCallback(async (story: SuccessStory) => {
    if (!token) return;
    setBusyAction(`publish-${story.id}`);
    try {
      upsertStory(await adminApi.publishSuccessStory(token, story.id));
    } finally {
      setBusyAction(null);
    }
  }, [token, upsertStory]);

  const featureStory = useCallback(async (story: SuccessStory) => {
    if (!token) return;
    setBusyAction(`feature-${story.id}`);
    try {
      upsertStory(await adminApi.featureSuccessStory(token, story.id));
    } finally {
      setBusyAction(null);
    }
  }, [token, upsertStory]);

  const archiveStory = useCallback(async (story: SuccessStory) => {
    if (!token) return;
    setBusyAction(`archive-${story.id}`);
    try {
      upsertStory(await adminApi.updateSuccessStory(token, story.id, { status: "ARCHIVED", published: false, featured: false }));
    } finally {
      setBusyAction(null);
    }
  }, [token, upsertStory]);

  const duplicateStory = useCallback(async (story: SuccessStory) => {
    if (!token) return;
    setBusyAction(`duplicate-${story.id}`);
    try {
      const copy = await adminApi.createSuccessStory(token, {
        title: `${storyTitle(story)} copy`,
        type: story.type ?? story.storyType ?? "COMMUNITY",
        storyType: story.type ?? story.storyType ?? "COMMUNITY",
        country: story.country,
        region: story.region,
        beneficiaryName: story.beneficiaryName,
        organisation: story.organisation,
        summary: story.summary,
        body: story.body ?? story.fullStory,
        fullStory: story.fullStory ?? story.body,
        quote: story.quote,
        beforeSituation: story.beforeSituation,
        afterImpact: story.afterImpact,
        devicesProvided: story.devicesProvided ?? story.deviceCount ?? 0,
        trainingLinked: story.trainingLinked,
        skillsGained: Array.isArray(story.skillsGained) ? story.skillsGained : [],
        outcome: story.outcome,
        mediaUrls: storyMedia(story),
        tags: Array.isArray(story.tags) ? story.tags : [],
        status: "DRAFT",
        published: false,
        featured: false
      });
      upsertStory(copy);
    } finally {
      setBusyAction(null);
    }
  }, [token, upsertStory]);

  const sharePreview = useCallback(async (story: SuccessStory) => {
    const url = `${window.location.origin}/success-stories#${encodeURIComponent(String(story.slug ?? story.id))}`;
    await navigator.clipboard?.writeText(url);
  }, []);

  return (
    <main className="space-y-6">
      <section className="overflow-hidden rounded-[1.75rem] bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.25),transparent_35%),linear-gradient(135deg,#080808,#171717_58%,#271303)] p-6 text-white shadow-2xl shadow-black/10 md:p-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-4xl">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-flame-500 text-white shadow-lg shadow-flame-500/25">
              <Icon name="sparkles" className="h-5 w-5" />
            </span>
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-flame-200">Impact publishing studio</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Success stories and impact storytelling</h1>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-white/68 sm:text-base">
              Publish learner, school, NGO, community, donor and Africa deployment stories with evidence, outcomes, visuals and measurable impact.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="inline-flex min-h-11 items-center gap-2 rounded-full bg-flame-500 px-4 text-sm font-semibold text-white hover:bg-flame-600" onClick={() => setStoryDrawer({ mode: "create" })}>
              <Icon name="sparkles" className="h-4 w-4" />
              Create story
            </button>
            <button className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 px-4 text-sm font-semibold text-white hover:border-flame-200" onClick={() => void seedDefaults()} disabled={busyAction === "seed"}>
              <Icon name="database" className="h-4 w-4" />
              Seed default stories
            </button>
            <button className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 px-4 text-sm font-semibold text-white hover:border-flame-200" onClick={() => setAssistantOpen(true)}>
              <Icon name="truck" className="h-4 w-4" />
              Import from deployment
            </button>
            <button className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 px-4 text-sm font-semibold text-white hover:border-flame-200" onClick={() => setAssistantOpen(true)}>
              <Icon name="sparkles" className="h-4 w-4" />
              Generate story with AI
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi title="Total stories" value={summary.totalStories} icon="book" />
        <Kpi title="Published stories" value={summary.published} icon="check" />
        <Kpi title="Drafts" value={summary.drafts} icon="list" />
        <Kpi title="Awaiting review" value={summary.awaitingReview ?? 0} icon="sliders" />
        <Kpi title="Regions represented" value={summary.regionsRepresented} icon="globe" />
        <Kpi title="Featured stories" value={summary.featured ?? 0} icon="badge" />
        <Kpi title="Stories with media" value={summary.storiesWithMedia ?? 0} icon="monitor" />
        <Kpi title="Impact metrics attached" value={summary.impactMetricsAttached ?? 0} icon="chart" />
      </section>

      {error ? (
        <section className="rounded-[1.25rem] border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="font-semibold">Success story data could not be loaded.</p>
              <p className="mt-1">{error}</p>
              <p className="mt-2 break-all text-xs font-semibold">API base: {API_BASE_URL}</p>
            </div>
            <button className="rounded-full bg-amber-900 px-4 py-2 text-xs font-semibold text-white" onClick={() => void load()}>Retry</button>
          </div>
        </section>
      ) : null}

      <section className="rounded-[1.5rem] border border-line bg-white p-5 shadow-card">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-ink">Story workflow</h2>
            <p className="text-sm text-muted">Move stories from draft to review, publishing, feature placement and public credibility.</p>
          </div>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search title, region, beneficiary, tags..."
              className="min-h-11 w-full rounded-full border border-line px-4 text-sm outline-none focus:border-flame-400 lg:w-80"
            />
            <div className="flex flex-wrap gap-2">
              {workflowTabs.map((tab) => (
                <button
                  key={tab}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-semibold",
                    activeTab === tab ? "border-flame-500 bg-flame-50 text-flame-700" : "border-line text-muted hover:border-flame-300"
                  )}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <StoryAssistantPanel onOpen={() => setAssistantOpen(true)} />

      {loading ? <LoadingGrid /> : null}
      {!loading && filteredStories.length === 0 ? (
        <EmptyState
          onCreate={() => setStoryDrawer({ mode: "create" })}
          onSeed={() => void seedDefaults()}
          onGenerate={() => setAssistantOpen(true)}
        />
      ) : null}
      {!loading && filteredStories.length > 0 ? (
        activeTab === "Media library"
          ? <MediaLibrary stories={filteredStories} onView={setSelectedStory} />
          : (
            <StoriesTable
              stories={filteredStories}
              busyAction={busyAction}
              onEdit={(story) => setStoryDrawer({ mode: "edit", story })}
              onPreview={setSelectedStory}
              onPublish={publishStory}
              onFeature={featureStory}
              onArchive={archiveStory}
              onDuplicate={duplicateStory}
              onShare={sharePreview}
            />
          )
      ) : null}

      {storyDrawer ? (
        <StoryDrawer
          mode={storyDrawer.mode}
          story={storyDrawer.story}
          draft={storyDrawer.draft}
          onClose={() => setStoryDrawer(null)}
          onSubmit={createOrUpdateStory}
        />
      ) : null}
      {assistantOpen ? (
        <AiStoryDrawer
          connected={connected}
          onClose={() => setAssistantOpen(false)}
          onUseDraft={(draft) => {
            setAssistantOpen(false);
            setStoryDrawer({ mode: "create", draft });
          }}
        />
      ) : null}
      {selectedStory ? (
        <StoryDetailDrawer
          story={selectedStory}
          onClose={() => setSelectedStory(null)}
          onEdit={() => {
            setStoryDrawer({ mode: "edit", story: selectedStory });
            setSelectedStory(null);
          }}
        />
      ) : null}
    </main>
  );
}

function Kpi({ title, value, icon }: { title: string; value: number | string; icon: IconKey }) {
  return (
    <article className="rounded-[1.25rem] border border-line bg-white p-5 shadow-card">
      <div className="flex items-start justify-between gap-4">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-flame-50 text-flame-600">
          <Icon name={icon} className="h-5 w-5" />
        </span>
        <strong className="text-2xl tracking-tight text-ink">{typeof value === "number" ? value.toLocaleString() : value}</strong>
      </div>
      <h3 className="mt-4 text-sm font-semibold text-ink">{title}</h3>
    </article>
  );
}

function StoryAssistantPanel({ onOpen }: { onOpen: () => void }) {
  return (
    <section className="rounded-[1.5rem] border border-line bg-white p-5 shadow-card">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-flame-600">AI story assistant</p>
          <h2 className="mt-2 text-lg font-semibold text-ink">Generate story from impact data</h2>
          <p className="mt-1 text-sm leading-6 text-muted">
            Draft donor-ready stories from deployment, donation and training signals, then edit for consent, local context and publication quality.
          </p>
        </div>
        <button className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-ink px-4 text-sm font-semibold text-white" onClick={onOpen}>
          <Icon name="sparkles" className="h-4 w-4" />
          Open assistant
        </button>
      </div>
    </section>
  );
}

function EmptyState({ onCreate, onSeed, onGenerate }: { onCreate: () => void; onSeed: () => void; onGenerate: () => void }) {
  return (
    <section className="rounded-[1.5rem] border border-dashed border-line bg-white p-10 text-center shadow-card">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-flame-50 text-flame-600">
        <Icon name="sparkles" className="h-5 w-5" />
      </span>
      <h3 className="mt-5 text-xl font-semibold tracking-tight text-ink">No success stories yet</h3>
      <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-muted">
        Create your first impact story or seed default examples to showcase how refurbished technology, training and deployment programmes change lives.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white" onClick={onCreate}>Create story</button>
        <button className="rounded-full border border-line px-4 py-2 text-sm font-semibold hover:border-flame-300" onClick={onSeed}>Seed default stories</button>
        <Link className="rounded-full border border-line px-4 py-2 text-sm font-semibold hover:border-flame-300" href="/admin/deployments">Import from deployment</Link>
        <button className="rounded-full border border-line px-4 py-2 text-sm font-semibold hover:border-flame-300" onClick={onGenerate}>Generate with AI</button>
      </div>
    </section>
  );
}

function StoriesTable({
  stories,
  busyAction,
  onEdit,
  onPreview,
  onPublish,
  onFeature,
  onArchive,
  onDuplicate,
  onShare
}: {
  stories: SuccessStory[];
  busyAction: string | null;
  onEdit: (story: SuccessStory) => void;
  onPreview: (story: SuccessStory) => void;
  onPublish: (story: SuccessStory) => Promise<void>;
  onFeature: (story: SuccessStory) => Promise<void>;
  onArchive: (story: SuccessStory) => Promise<void>;
  onDuplicate: (story: SuccessStory) => Promise<void>;
  onShare: (story: SuccessStory) => Promise<void>;
}) {
  return (
    <section className="overflow-hidden rounded-[1.5rem] border border-line bg-white shadow-card">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1320px] text-left text-sm">
          <thead className="bg-paper text-xs uppercase tracking-wide text-muted">
            <tr>
              {["Story title", "Story type", "Region", "Beneficiary", "Devices delivered", "Training outcome", "Status", "Featured", "Last updated", "Actions"].map((header) => (
                <th key={header} className="px-4 py-3">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {stories.map((story) => {
              const status = storyStatus(story.status, story.published);
              return (
                <tr key={story.id} className="hover:bg-flame-50/35">
                  <td className="px-4 py-4">
                    <button className="max-w-xs text-left font-semibold text-ink hover:text-flame-700" onClick={() => onPreview(story)}>{storyTitle(story)}</button>
                    <p className="mt-1 line-clamp-2 max-w-md text-xs leading-5 text-muted">{story.summary}</p>
                  </td>
                  <td className="px-4 py-4 text-muted">{storyTypeLabel(story.type ?? story.storyType)}</td>
                  <td className="px-4 py-4 text-muted">{story.region ?? story.country ?? "Not set"}</td>
                  <td className="px-4 py-4 text-muted">{story.beneficiaryName ?? story.organisation ?? "Not set"}</td>
                  <td className="px-4 py-4 font-semibold text-ink">{numberValue(story.devicesProvided ?? story.deviceCount)}</td>
                  <td className="px-4 py-4 text-muted">{story.outcome ?? story.trainingLinked ?? "Not attached"}</td>
                  <td className="px-4 py-4"><span className={cn("rounded-full border px-3 py-1 text-xs font-bold", statusClass(status))}>{status.replaceAll("_", " ")}</span></td>
                  <td className="px-4 py-4 text-muted">{story.featured ? "Yes" : "No"}</td>
                  <td className="px-4 py-4 text-muted">{formatDate(story.updatedAt ?? story.createdAt)}</td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-2">
                      <button className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold hover:border-flame-300" onClick={() => onEdit(story)}>Edit</button>
                      <button className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold hover:border-flame-300" onClick={() => onPreview(story)}>Preview</button>
                      <button className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold hover:border-flame-300 disabled:opacity-50" disabled={busyAction === `publish-${story.id}` || status === "PUBLISHED"} onClick={() => void onPublish(story)}>Publish</button>
                      <button className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold hover:border-flame-300 disabled:opacity-50" disabled={busyAction === `feature-${story.id}` || story.featured === true} onClick={() => void onFeature(story)}>Feature</button>
                      <button className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold hover:border-flame-300 disabled:opacity-50" disabled={busyAction === `archive-${story.id}`} onClick={() => void onArchive(story)}>Archive</button>
                      <button className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold hover:border-flame-300 disabled:opacity-50" disabled={busyAction === `duplicate-${story.id}`} onClick={() => void onDuplicate(story)}>Duplicate</button>
                      <button className="rounded-full bg-ink px-3 py-1.5 text-xs font-semibold text-white" onClick={() => void onShare(story)}>Share</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function MediaLibrary({ stories, onView }: { stories: SuccessStory[]; onView: (story: SuccessStory) => void }) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {stories.map((story) => (
        <article key={story.id} className="rounded-[1.25rem] border border-line bg-white p-4 shadow-card">
          <div className="flex h-40 items-center justify-center rounded-xl bg-paper text-flame-600">
            <Icon name="monitor" className="h-8 w-8" />
          </div>
          <h3 className="mt-4 font-semibold text-ink">{storyTitle(story)}</h3>
          <p className="mt-2 text-sm text-muted">{storyMedia(story).length} media reference{storyMedia(story).length === 1 ? "" : "s"} attached</p>
          <button className="mt-4 rounded-full border border-line px-3 py-1.5 text-xs font-semibold hover:border-flame-300" onClick={() => onView(story)}>Preview story</button>
        </article>
      ))}
    </section>
  );
}

function StoryDrawer({
  mode,
  story,
  draft,
  onClose,
  onSubmit
}: {
  mode: "create" | "edit";
  story?: SuccessStory;
  draft?: SuccessStoryDraftResponse;
  onClose: () => void;
  onSubmit: (payload: EcosystemRecordPayload, story?: SuccessStory) => Promise<void>;
}) {
  const title = story ? storyTitle(story) : draft?.title ?? "";
  const summary = story?.summary ?? draft?.summary ?? "";
  const body = story?.body ?? story?.fullStory ?? draft?.body ?? "";
  return (
    <Drawer title={mode === "edit" ? "Edit impact story" : "Create impact story"} onClose={onClose}>
      <form
        className="space-y-5"
        onSubmit={(event: FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          const form = new FormData(event.currentTarget);
          const status = formText(form, "status") as SuccessStoryStatus;
          void onSubmit({
            title: formText(form, "title"),
            type: formText(form, "type"),
            storyType: formText(form, "type"),
            country: formText(form, "country"),
            region: formText(form, "region"),
            beneficiaryName: formText(form, "beneficiaryName"),
            organisation: formText(form, "organisation"),
            summary: formText(form, "summary"),
            body: formText(form, "body"),
            fullStory: formText(form, "body"),
            quote: formText(form, "quote"),
            beforeSituation: formText(form, "beforeSituation"),
            afterImpact: formText(form, "afterImpact"),
            devicesProvided: Number(formText(form, "devicesProvided") || 0),
            trainingLinked: formText(form, "trainingLinked"),
            skillsGained: splitList(formText(form, "skillsGained")),
            outcome: formText(form, "outcome"),
            mediaUrls: splitList(formText(form, "mediaUrls")),
            tags: splitList(formText(form, "tags")),
            status,
            published: status === "PUBLISHED",
            featured: form.get("featured") === "on",
            consentConfirmed: form.get("consentConfirmed") === "on"
          }, story);
        }}
      >
        <Field name="title" label="Title" defaultValue={title} required />
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-sm font-semibold text-ink">
            Story type
            <select name="type" defaultValue={String(story?.type ?? story?.storyType ?? "LEARNER").toUpperCase()} className="mt-2 w-full rounded-lg border border-line p-3 text-sm">
              {storyTypes.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}
            </select>
          </label>
          <label className="block text-sm font-semibold text-ink">
            Publish status
            <select name="status" defaultValue={storyStatus(story?.status, story?.published)} className="mt-2 w-full rounded-lg border border-line p-3 text-sm">
              {statusOptions.map((status) => <option key={status.value} value={status.value}>{status.label}</option>)}
            </select>
          </label>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field name="country" label="Country / region" defaultValue={String(story?.country ?? "")} />
          <Field name="region" label="Region" defaultValue={String(story?.region ?? "")} />
          <Field name="beneficiaryName" label="Beneficiary name" defaultValue={String(story?.beneficiaryName ?? "")} />
          <Field name="organisation" label="Organisation" defaultValue={String(story?.organisation ?? "")} />
        </div>
        <Textarea name="summary" label="Summary" defaultValue={summary} required rows={3} />
        <Textarea name="body" label="Full story" defaultValue={body} required rows={8} />
        <Textarea name="quote" label="Quote" defaultValue={String(story?.quote ?? draft?.quote ?? "")} rows={3} />
        <div className="grid gap-3 sm:grid-cols-2">
          <Textarea name="beforeSituation" label="Before situation" defaultValue={String(story?.beforeSituation ?? "")} rows={4} />
          <Textarea name="afterImpact" label="After impact" defaultValue={String(story?.afterImpact ?? "")} rows={4} />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field name="devicesProvided" label="Devices provided" type="number" defaultValue={String(story?.devicesProvided ?? story?.deviceCount ?? 0)} />
          <Field name="trainingLinked" label="Training linked" defaultValue={String(story?.trainingLinked ?? "")} />
        </div>
        <Textarea name="skillsGained" label="Skills gained" defaultValue={arrayText(story?.skillsGained)} placeholder="Job search, digital confidence, portfolio building" rows={3} />
        <Textarea name="outcome" label="Employment or education outcome" defaultValue={String(story?.outcome ?? "")} rows={3} />
        <Textarea name="mediaUrls" label="Images / video links" defaultValue={arrayText(storyMedia(story ?? ({ id: "draft", title: "" } as SuccessStory)))} placeholder="One URL per line or comma separated" rows={3} />
        <Field name="tags" label="Tags" defaultValue={arrayText(story?.tags, draft?.tags?.join(", ") ?? "")} placeholder="donor, africa, learner" />
        <div className="grid gap-3 rounded-xl bg-paper p-4 text-sm">
          <Toggle name="consentConfirmed" label="Consent confirmed" defaultChecked={story?.consentConfirmed === true} />
          <Toggle name="featured" label="Feature on homepage" defaultChecked={story?.featured === true} />
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" className="rounded-full border border-line px-4 py-2 text-sm font-semibold" onClick={onClose}>Cancel</button>
          <button className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white">{mode === "edit" ? "Save changes" : "Create story"}</button>
        </div>
      </form>
    </Drawer>
  );
}

function AiStoryDrawer({ connected, onClose, onUseDraft }: { connected: ConnectedRecords; onClose: () => void; onUseDraft: (draft: SuccessStoryDraftResponse) => void }) {
  const { token } = useAdminAuth();
  const [draft, setDraft] = useState<SuccessStoryDraftResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token) return;
    const form = new FormData(event.currentTarget);
    setGenerating(true);
    setError(null);
    try {
      setDraft(await adminApi.generateSuccessStoryDraft(token, {
        deploymentId: formText(form, "deploymentId"),
        donationId: formText(form, "donationId"),
        trainingCohortId: formText(form, "trainingCohortId"),
        beneficiaryType: formText(form, "beneficiaryType"),
        tone: formText(form, "tone"),
        region: formText(form, "region"),
        country: formText(form, "country"),
        devicesProvided: Number(formText(form, "devicesProvided") || 1),
        outcome: formText(form, "outcome"),
        notes: formText(form, "notes")
      }));
    } catch (draftError) {
      setError(draftError instanceof Error ? draftError.message : "AI story generation failed.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Drawer title="Generate story from impact data" onClose={onClose}>
      <form className="space-y-5" onSubmit={(event) => void submit(event)}>
        <RecordSelect name="deploymentId" label="Select deployment" records={connected.deployments} />
        <RecordSelect name="donationId" label="Select device donation" records={connected.donations} />
        <RecordSelect name="trainingCohortId" label="Select training cohort" records={connected.training} />
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-sm font-semibold text-ink">
            Beneficiary type
            <select name="beneficiaryType" className="mt-2 w-full rounded-lg border border-line p-3 text-sm">
              {storyTypes.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}
            </select>
          </label>
          <label className="block text-sm font-semibold text-ink">
            Tone
            <select name="tone" className="mt-2 w-full rounded-lg border border-line p-3 text-sm">
              {["Professional", "Donor-ready", "Community-focused", "Press release", "Social media"].map((tone) => <option key={tone}>{tone}</option>)}
            </select>
          </label>
          <Field name="region" label="Region" placeholder="Accra, Greater Manchester, Nairobi..." />
          <Field name="country" label="Country" placeholder="Ghana" />
          <Field name="devicesProvided" label="Devices provided" type="number" defaultValue="1" />
          <Field name="outcome" label="Outcome" placeholder="Learners completed digital skills sessions" />
        </div>
        <Textarea name="notes" label="Drafting notes" placeholder="Include campaign, school, donor, training or consent context." rows={4} />
        {error ? <p className="rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p> : null}
        <div className="flex flex-wrap justify-end gap-3">
          <button type="button" className="rounded-full border border-line px-4 py-2 text-sm font-semibold" onClick={onClose}>Cancel</button>
          <button className="rounded-full border border-line px-4 py-2 text-sm font-semibold" name="draftAction" value="headline" disabled={generating}>Generate headline</button>
          <button className="rounded-full border border-line px-4 py-2 text-sm font-semibold" name="draftAction" value="quote" disabled={generating}>Generate quote</button>
          <button className="rounded-full border border-line px-4 py-2 text-sm font-semibold" name="draftAction" value="social" disabled={generating}>Generate social post</button>
          <button className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white" name="draftAction" value="story" disabled={generating}>{generating ? "Generating..." : "Generate draft story"}</button>
        </div>
      </form>
      {draft ? (
        <section className="mt-6 rounded-xl border border-line bg-paper p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-flame-600">{draft.provider === "openai" ? "AI draft" : "Heuristic draft"}</p>
          <h3 className="mt-2 text-lg font-semibold text-ink">{draft.title}</h3>
          <p className="mt-2 text-sm leading-6 text-muted">{draft.summary}</p>
          <p className="mt-3 whitespace-pre-line text-sm leading-6 text-ink">{draft.body}</p>
          {draft.quote ? <blockquote className="mt-4 rounded-lg bg-white p-3 text-sm font-semibold text-ink">{draft.quote}</blockquote> : null}
          {draft.socialPost ? <p className="mt-3 rounded-lg bg-white p-3 text-sm text-muted">{draft.socialPost}</p> : null}
          <button className="mt-4 rounded-full bg-flame-500 px-4 py-2 text-sm font-semibold text-white" onClick={() => onUseDraft(draft)}>Use draft in story form</button>
        </section>
      ) : null}
    </Drawer>
  );
}

function StoryDetailDrawer({ story, onClose, onEdit }: { story: SuccessStory; onClose: () => void; onEdit: () => void }) {
  const status = storyStatus(story.status, story.published);
  return (
    <Drawer title={storyTitle(story)} onClose={onClose}>
      <div className="space-y-5">
        <section className="rounded-xl bg-paper p-4">
          <div className="flex flex-wrap gap-2">
            <span className={cn("rounded-full border px-3 py-1 text-xs font-bold", statusClass(status))}>{status.replaceAll("_", " ")}</span>
            <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-ink">{storyTypeLabel(story.type ?? story.storyType)}</span>
            {story.featured ? <span className="rounded-full bg-flame-50 px-3 py-1 text-xs font-bold text-flame-700">Featured</span> : null}
          </div>
          <p className="mt-4 text-sm leading-6 text-muted">{story.summary}</p>
          <button className="mt-4 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white" onClick={onEdit}>Edit story</button>
        </section>
        <section>
          <h3 className="font-semibold text-ink">Story body</h3>
          <p className="mt-3 whitespace-pre-line text-sm leading-7 text-muted">{story.body || story.fullStory || "No full story stored."}</p>
        </section>
        <div className="grid gap-3 sm:grid-cols-2">
          <MiniStat label="Beneficiary" value={story.beneficiaryName ?? story.organisation ?? "Not set"} />
          <MiniStat label="Region" value={story.region ?? story.country ?? "Not set"} />
          <MiniStat label="Devices delivered" value={numberValue(story.devicesProvided ?? story.deviceCount)} />
          <MiniStat label="Training outcome" value={story.outcome ?? story.trainingLinked ?? "Not attached"} />
        </div>
        <section>
          <h3 className="font-semibold text-ink">Evidence and media</h3>
          <div className="mt-3 grid gap-3">
            <MiniStat label="Consent" value={story.consentConfirmed ? "Confirmed" : "Not confirmed"} />
            <MiniStat label="Media links" value={storyMedia(story).length} />
            <MiniStat label="Tags" value={arrayText(story.tags, "None")} />
          </div>
        </section>
        <section>
          <h3 className="font-semibold text-ink">Timeline</h3>
          <div className="mt-3 space-y-2">
            {(story.timeline ?? []).map((entry, index) => (
              <div key={entry.id ?? index} className="rounded-lg border border-line p-3 text-sm">
                <p className="font-semibold text-ink">{entry.title ?? "Story activity"}</p>
                <p className="mt-1 text-xs text-muted">{formatDate(entry.createdAt)} · {entry.actorEmail ?? "System"}</p>
              </div>
            ))}
            {!story.timeline?.length ? <p className="rounded-lg bg-paper p-3 text-sm text-muted">No timeline activity recorded yet.</p> : null}
          </div>
        </section>
      </div>
    </Drawer>
  );
}

function LoadingGrid() {
  return <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{[1, 2, 3, 4].map((item) => <div key={item} className="h-40 animate-pulse rounded-[1.25rem] bg-paper" />)}</div>;
}

function MiniStat({ label, value }: { label: string; value: number | string | null | undefined }) {
  return (
    <div className="rounded-lg bg-paper p-3">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">{label}</p>
      <p className="mt-1 font-semibold text-ink">{typeof value === "number" ? value.toLocaleString() : value ?? "Not set"}</p>
    </div>
  );
}

function Drawer({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 p-4">
      <aside className="flex h-full w-full max-w-3xl flex-col overflow-hidden rounded-[1.25rem] bg-white shadow-2xl">
        <header className="flex items-center justify-between gap-4 border-b border-line p-5">
          <h2 className="text-lg font-semibold text-ink">{title}</h2>
          <button className="rounded-full border border-line p-2 hover:border-flame-300" onClick={onClose} aria-label="Close">
            <Icon name="close" className="h-4 w-4" />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
      </aside>
    </div>
  );
}

function Field({
  name,
  label,
  type = "text",
  placeholder,
  defaultValue = "",
  required = false
}: {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  defaultValue?: string;
  required?: boolean;
}) {
  return (
    <label className="block text-sm font-semibold text-ink">
      {label}
      <input className="mt-2 w-full rounded-lg border border-line p-3 text-sm" name={name} type={type} placeholder={placeholder} defaultValue={defaultValue} required={required} />
    </label>
  );
}

function Textarea({
  name,
  label,
  placeholder,
  defaultValue = "",
  rows = 4,
  required = false
}: {
  name: string;
  label: string;
  placeholder?: string;
  defaultValue?: string;
  rows?: number;
  required?: boolean;
}) {
  return (
    <label className="block text-sm font-semibold text-ink">
      {label}
      <textarea className="mt-2 w-full rounded-lg border border-line p-3 text-sm" name={name} placeholder={placeholder} defaultValue={defaultValue} rows={rows} required={required} />
    </label>
  );
}

function Toggle({ name, label, defaultChecked = false }: { name: string; label: string; defaultChecked?: boolean }) {
  return (
    <label className="flex items-center gap-3 text-sm font-semibold text-ink">
      <input className="h-4 w-4 rounded border-line" name={name} type="checkbox" defaultChecked={defaultChecked} />
      {label}
    </label>
  );
}

function RecordSelect({ name, label, records }: { name: string; label: string; records: ApiRecord[] }) {
  return (
    <label className="block text-sm font-semibold text-ink">
      {label}
      <select name={name} className="mt-2 w-full rounded-lg border border-line p-3 text-sm">
        <option value="">No linked record</option>
        {records.map((record) => <option key={record.id} value={record.id}>{recordLabel(record)}</option>)}
      </select>
    </label>
  );
}
