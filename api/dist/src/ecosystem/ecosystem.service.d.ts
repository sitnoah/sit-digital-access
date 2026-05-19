import { ConfigService } from "@nestjs/config";
import { AuditService } from "../audit/audit.service";
import { FirestoreRepository } from "../common/firestore/firestore.repository";
import type { AuthenticatedRequest } from "../common/types";
import { FirebaseAdminService } from "../firebase/firebase-admin.service";
import { EcosystemIntegrationsService } from "./integrations.service";
declare const configs: {
    deployments: {
        collection: "deployments";
        resourceType: string;
        defaultStatus: string;
        defaultPriority: string;
    };
    recycling: {
        collection: "recycling";
        resourceType: string;
        defaultStatus: string;
        defaultPriority: string;
    };
    supportTickets: {
        collection: "supportTickets";
        resourceType: string;
        defaultStatus: string;
        defaultPriority: string;
    };
    repairTickets: {
        collection: "repairTickets";
        resourceType: string;
        defaultStatus: string;
        defaultPriority: string;
    };
    repairParts: {
        collection: "repairParts";
        resourceType: string;
        defaultStatus: string;
        defaultPriority: string;
    };
    repairTechnicians: {
        collection: "repairTechnicians";
        resourceType: string;
        defaultStatus: string;
        defaultPriority: string;
    };
    notifications: {
        collection: "notifications";
        resourceType: string;
        defaultStatus: string;
        defaultPriority: string;
    };
    savedViews: {
        collection: "savedViews";
        resourceType: string;
        defaultStatus: string;
    };
    successStories: {
        collection: "successStories";
        resourceType: string;
        defaultStatus: string;
    };
    trainingCohorts: {
        collection: "trainingCohorts";
        resourceType: string;
        defaultStatus: string;
        defaultPriority: string;
    };
    sustainabilityReports: {
        collection: "sustainabilityReports";
        resourceType: string;
        defaultStatus: string;
    };
};
type RepairTicketRecord = Record<string, unknown> & {
    id: string;
};
type UploadedRepairFile = {
    buffer: Buffer;
    originalname: string;
    mimetype: string;
    size: number;
};
export declare class EcosystemService {
    private readonly repository;
    private readonly auditService;
    private readonly integrations;
    private readonly firebaseAdmin;
    private readonly config;
    constructor(repository: FirestoreRepository, auditService: AuditService, integrations: EcosystemIntegrationsService, firebaseAdmin: FirebaseAdminService, config: ConfigService);
    list(key: keyof typeof configs): Promise<unknown[]>;
    listRepairOperations(): Promise<{
        tickets: RepairTicketRecord[];
        summary: {
            active: number;
            awaitingApproval: number;
            slaRisk: number;
            techniciansAvailable: number;
            overdue: number;
            dueWithin24Hours: number;
            blockedByParts: number;
            unassigned: number;
        };
    }>;
    createRepairTicket(dto: Record<string, unknown>, request: AuthenticatedRequest): Promise<Record<string, unknown> & {
        id: string;
    }>;
    updateRepairTicket(id: string, dto: Record<string, unknown>, request: AuthenticatedRequest): Promise<RepairTicketRecord>;
    uploadRepairAttachment(id: string, file: UploadedRepairFile | undefined, request: AuthenticatedRequest): Promise<RepairTicketRecord>;
    triageRepairTicket(id: string, request: AuthenticatedRequest): Promise<RepairTicketRecord>;
    listSavedViews(workspace?: string, request?: AuthenticatedRequest): Promise<(Record<string, unknown> & {
        id: string;
    })[]>;
    listPublishedStories(): Promise<(Record<string, unknown> & {
        id: string;
    })[]>;
    findById(key: keyof typeof configs, id: string): Promise<unknown>;
    create(key: keyof typeof configs, dto: Record<string, unknown>, request: AuthenticatedRequest): Promise<Record<string, unknown> & {
        id: string;
    }>;
    update(key: keyof typeof configs, id: string, dto: Record<string, unknown>, request: AuthenticatedRequest): Promise<unknown>;
    deleteSavedView(id: string, request: AuthenticatedRequest): Promise<{
        id: string;
        deleted: boolean;
    }>;
    createNotification(dto: Record<string, unknown>, request: AuthenticatedRequest): Promise<Record<string, unknown> & {
        id: string;
    }>;
    markNotification(id: string, read: boolean, request: AuthenticatedRequest): Promise<unknown>;
    retryNotification(id: string, request: AuthenticatedRequest): Promise<unknown>;
    publishStory(id: string, published: boolean, request: AuthenticatedRequest): Promise<unknown>;
    createDeploymentFromDeviceRequest(id: string, dto: Record<string, unknown>, request: AuthenticatedRequest): Promise<Record<string, unknown> & {
        id: string;
    }>;
    createRecyclingFromDonation(id: string, dto: Record<string, unknown>, request: AuthenticatedRequest): Promise<Record<string, unknown> & {
        id: string;
    }>;
    createSupportTicketFromInventory(id: string, dto: Record<string, unknown>, request: AuthenticatedRequest): Promise<Record<string, unknown> & {
        id: string;
    }>;
    bookPublicRepair(dto: Record<string, unknown>): Promise<{
        id: string;
        ticketId: string;
        statusToken: string;
        status: unknown;
        createdAt: unknown;
    }>;
    publicRepairStatus(ticketId: string, token: string): Promise<{
        id: string;
        ticketId: string;
        status: "NEW" | "COMPLETED" | "TRIAGE" | "DIAGNOSTICS" | "ESTIMATE_SENT" | "AWAITING_APPROVAL" | "REPAIR_IN_PROGRESS" | "WAITING_FOR_PARTS" | "QUALITY_CHECK" | "READY_FOR_PICKUP" | "READY_FOR_RETURN" | "CANCELLED" | "UNREPAIRABLE";
        publicStatusLabel: string;
        publicMessage: string;
        progressPercent: number;
        priority: string | null;
        repairCategory: string | null;
        deviceType: string | null;
        brand: string | null;
        model: string | null;
        repairRoute: string | null;
        location: string | null;
        slaTargetHours: number | null;
        createdAt: string | null;
        updatedAt: string | null;
        publicUpdates: any[];
        customerActionRequired: boolean;
        estimatedTurnaround: string;
        timeline: {
            label: string;
            status: "NEW" | "COMPLETED" | "TRIAGE" | "DIAGNOSTICS" | "ESTIMATE_SENT" | "AWAITING_APPROVAL" | "REPAIR_IN_PROGRESS" | "WAITING_FOR_PARTS" | "QUALITY_CHECK" | "READY_FOR_PICKUP" | "READY_FOR_RETURN" | "CANCELLED" | "UNREPAIRABLE";
            completed: boolean;
            active: boolean;
            timestamp: string | null;
            publicNote: string;
            date: string | null;
            description: string;
        }[];
        customerActions: ({
            type: string;
            label: string;
            enabled: boolean;
            href: string;
            description: string;
        } | {
            type: string;
            label: string;
            enabled: boolean;
            href: null;
            description: string;
        })[];
        nextStep: string;
    }>;
    createRepairTicketFromInventory(id: string, dto: Record<string, unknown>, request: AuthenticatedRequest): Promise<Record<string, unknown> & {
        id: string;
    }>;
    createQuoteDraft(id: string, dto: Record<string, unknown>, request: AuthenticatedRequest): Promise<unknown>;
    reserveInventory(id: string, dto: Record<string, unknown>, request: AuthenticatedRequest): Promise<unknown>;
    scheduleCollection(id: string, dto: Record<string, unknown>, request: AuthenticatedRequest): Promise<Record<string, unknown> & {
        id: string;
    }>;
    generateSustainabilityReport(dto: Record<string, unknown>, request: AuthenticatedRequest): Promise<Record<string, unknown> & {
        id: string;
    }>;
    sustainabilitySummary(): Promise<{
        devicesReused: number;
        devicesOffered: number;
        devicesDiverted: number;
        repairQueue: number;
        completedRepairs: number;
        retiredAssets: number;
        estimatedCo2SavedKg: number;
        circularityScore: number;
        generatedAt: string;
    }>;
    search(query: string): Promise<{
        id: string;
        recordId: string;
        type: "Enquiry" | "Device request" | "Donation" | "Inventory" | "Deployment" | "Recycling" | "Support" | "Repair" | "Repair part" | "Repair technician" | "Success story" | "Training cohort" | "Notification";
        title: string;
        summary: string;
        status: {} | null;
        href: "/admin/enquiries" | "/admin/device-requests" | "/admin/donations" | "/admin/inventory" | "/admin/deployments" | "/admin/recycling" | "/admin/support" | "/admin/repairs" | "/admin/repair-parts" | "/admin/repair-technicians" | "/admin/success-stories" | "/admin/training-cohorts" | "/admin/notifications";
        createdAt: {} | null;
    }[]>;
    seedDefaultStories(request: AuthenticatedRequest): Promise<unknown[]>;
    private notify;
    private enqueueEmail;
    private log;
    private resourceHref;
    private notificationCategory;
    private safeList;
    private repairSummary;
    private repairStatus;
    private activeRepairTicket;
    private repairDueAt;
    private repairReference;
    private timelineEntry;
    private timelineForUpdate;
    private safeFilename;
    private attachmentUrl;
    private generateRepairTriage;
    private heuristicRepairTriage;
    private openAiText;
    private estimateReadiness;
    private estimateRepairSla;
    private priorityFromUrgency;
    private publicStatusToken;
    private hashStatusToken;
    private matchesStatusToken;
    private asRepairStatus;
    private publicRepairTimeline;
    private publicRepairStepDescription;
    private publicRepairNextStep;
    private publicRepairRequiresAction;
    private publicRepairTurnaround;
    private publicRepairCustomerActions;
    private publicUpdateTimestamp;
    private publicUpdateNote;
    private safeString;
    private safeNumber;
    private asObject;
    private asArray;
}
export {};
