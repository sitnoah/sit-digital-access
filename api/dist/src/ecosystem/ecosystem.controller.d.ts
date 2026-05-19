import type { AuthenticatedRequest } from "../common/types";
import { EcosystemRecordDto } from "./dto/ecosystem-record.dto";
import { EcosystemService } from "./ecosystem.service";
type UploadedRepairFile = {
    buffer: Buffer;
    originalname: string;
    mimetype: string;
    size: number;
};
export declare class EcosystemController {
    private readonly ecosystemService;
    constructor(ecosystemService: EcosystemService);
    publicStories(): Promise<{
        data: (Record<string, unknown> & {
            id: string;
        })[];
    }>;
    publicSustainabilitySummary(): Promise<{
        data: {
            devicesReused: number;
            devicesOffered: number;
            devicesDiverted: number;
            repairQueue: number;
            completedRepairs: number;
            retiredAssets: number;
            estimatedCo2SavedKg: number;
            circularityScore: number;
            generatedAt: string;
        };
    }>;
    bookRepair(dto: EcosystemRecordDto): Promise<{
        data: {
            id: string;
            ticketId: string;
            statusToken: string;
            status: unknown;
            createdAt: unknown;
        };
    }>;
    createPublicRepair(dto: EcosystemRecordDto): Promise<{
        data: {
            id: string;
            ticketId: string;
            statusToken: string;
            status: unknown;
            createdAt: unknown;
        };
    }>;
    repairStatus(ticketId?: string, token?: string): Promise<{
        data: {
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
        };
    }>;
    search(query?: string): Promise<{
        data: {
            id: string;
            recordId: string;
            type: "Enquiry" | "Device request" | "Donation" | "Inventory" | "Deployment" | "Recycling" | "Support" | "Repair" | "Repair part" | "Repair technician" | "Success story" | "Training cohort" | "Notification";
            title: string;
            summary: string;
            status: {} | null;
            href: "/admin/enquiries" | "/admin/device-requests" | "/admin/donations" | "/admin/inventory" | "/admin/deployments" | "/admin/recycling" | "/admin/support" | "/admin/repairs" | "/admin/repair-parts" | "/admin/repair-technicians" | "/admin/success-stories" | "/admin/training-cohorts" | "/admin/notifications";
            createdAt: {} | null;
        }[];
    }>;
    listDeployments(): Promise<{
        data: unknown[];
    }>;
    createDeployment(dto: EcosystemRecordDto, request: AuthenticatedRequest): Promise<{
        data: Record<string, unknown> & {
            id: string;
        };
    }>;
    updateDeployment(id: string, dto: EcosystemRecordDto, request: AuthenticatedRequest): Promise<{
        data: unknown;
    }>;
    createQuote(id: string, dto: EcosystemRecordDto, request: AuthenticatedRequest): Promise<{
        data: unknown;
    }>;
    reserveInventory(id: string, dto: EcosystemRecordDto, request: AuthenticatedRequest): Promise<{
        data: unknown;
    }>;
    convertDeployment(id: string, dto: EcosystemRecordDto, request: AuthenticatedRequest): Promise<{
        data: Record<string, unknown> & {
            id: string;
        };
    }>;
    listRecycling(): Promise<{
        data: unknown[];
    }>;
    createRecycling(dto: EcosystemRecordDto, request: AuthenticatedRequest): Promise<{
        data: Record<string, unknown> & {
            id: string;
        };
    }>;
    updateRecycling(id: string, dto: EcosystemRecordDto, request: AuthenticatedRequest): Promise<{
        data: unknown;
    }>;
    scheduleCollection(id: string, dto: EcosystemRecordDto, request: AuthenticatedRequest): Promise<{
        data: Record<string, unknown> & {
            id: string;
        };
    }>;
    listSupportTickets(): Promise<{
        data: unknown[];
    }>;
    createSupportTicket(dto: EcosystemRecordDto, request: AuthenticatedRequest): Promise<{
        data: Record<string, unknown> & {
            id: string;
        };
    }>;
    updateSupportTicket(id: string, dto: EcosystemRecordDto, request: AuthenticatedRequest): Promise<{
        data: unknown;
    }>;
    createSupportTicketFromInventory(id: string, dto: EcosystemRecordDto, request: AuthenticatedRequest): Promise<{
        data: Record<string, unknown> & {
            id: string;
        };
    }>;
    listRepairTickets(): Promise<{
        data: {
            tickets: (Record<string, unknown> & {
                id: string;
            })[];
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
        };
    }>;
    createRepairTicket(dto: EcosystemRecordDto, request: AuthenticatedRequest): Promise<{
        data: Record<string, unknown> & {
            id: string;
        };
    }>;
    updateRepairTicket(id: string, dto: EcosystemRecordDto, request: AuthenticatedRequest): Promise<{
        data: Record<string, unknown> & {
            id: string;
        };
    }>;
    uploadRepairAttachment(id: string, file: UploadedRepairFile, request: AuthenticatedRequest): Promise<{
        data: Record<string, unknown> & {
            id: string;
        };
    }>;
    triageRepairTicket(id: string, request: AuthenticatedRequest): Promise<{
        data: Record<string, unknown> & {
            id: string;
        };
    }>;
    createRepairTicketFromInventory(id: string, dto: EcosystemRecordDto, request: AuthenticatedRequest): Promise<{
        data: Record<string, unknown> & {
            id: string;
        };
    }>;
    listRepairParts(): Promise<{
        data: unknown[];
    }>;
    createRepairPart(dto: EcosystemRecordDto, request: AuthenticatedRequest): Promise<{
        data: Record<string, unknown> & {
            id: string;
        };
    }>;
    updateRepairPart(id: string, dto: EcosystemRecordDto, request: AuthenticatedRequest): Promise<{
        data: unknown;
    }>;
    listRepairTechnicians(): Promise<{
        data: unknown[];
    }>;
    createRepairTechnician(dto: EcosystemRecordDto, request: AuthenticatedRequest): Promise<{
        data: Record<string, unknown> & {
            id: string;
        };
    }>;
    updateRepairTechnician(id: string, dto: EcosystemRecordDto, request: AuthenticatedRequest): Promise<{
        data: unknown;
    }>;
    listNotifications(): Promise<{
        data: unknown[];
    }>;
    createNotification(dto: EcosystemRecordDto, request: AuthenticatedRequest): Promise<{
        data: Record<string, unknown> & {
            id: string;
        };
    }>;
    markNotificationRead(id: string, request: AuthenticatedRequest): Promise<{
        data: unknown;
    }>;
    markNotificationUnread(id: string, request: AuthenticatedRequest): Promise<{
        data: unknown;
    }>;
    retryNotification(id: string, request: AuthenticatedRequest): Promise<{
        data: unknown;
    }>;
    listSavedViews(workspace: string | undefined, request: AuthenticatedRequest): Promise<{
        data: (Record<string, unknown> & {
            id: string;
        })[];
    }>;
    createSavedView(dto: EcosystemRecordDto, request: AuthenticatedRequest): Promise<{
        data: Record<string, unknown> & {
            id: string;
        };
    }>;
    updateSavedView(id: string, dto: EcosystemRecordDto, request: AuthenticatedRequest): Promise<{
        data: unknown;
    }>;
    deleteSavedView(id: string, request: AuthenticatedRequest): Promise<{
        data: {
            id: string;
            deleted: boolean;
        };
    }>;
    listSuccessStories(): Promise<{
        data: unknown[];
    }>;
    createSuccessStory(dto: EcosystemRecordDto, request: AuthenticatedRequest): Promise<{
        data: Record<string, unknown> & {
            id: string;
        };
    }>;
    seedSuccessStories(request: AuthenticatedRequest): Promise<{
        data: unknown[];
    }>;
    updateSuccessStory(id: string, dto: EcosystemRecordDto, request: AuthenticatedRequest): Promise<{
        data: unknown;
    }>;
    publishSuccessStory(id: string, request: AuthenticatedRequest): Promise<{
        data: unknown;
    }>;
    unpublishSuccessStory(id: string, request: AuthenticatedRequest): Promise<{
        data: unknown;
    }>;
    listTrainingCohorts(): Promise<{
        data: unknown[];
    }>;
    createTrainingCohort(dto: EcosystemRecordDto, request: AuthenticatedRequest): Promise<{
        data: Record<string, unknown> & {
            id: string;
        };
    }>;
    updateTrainingCohort(id: string, dto: EcosystemRecordDto, request: AuthenticatedRequest): Promise<{
        data: unknown;
    }>;
    listSustainabilityReports(): Promise<{
        data: unknown[];
    }>;
    createSustainabilityReport(dto: EcosystemRecordDto, request: AuthenticatedRequest): Promise<{
        data: Record<string, unknown> & {
            id: string;
        };
    }>;
    generateSustainabilityReport(dto: EcosystemRecordDto, request: AuthenticatedRequest): Promise<{
        data: Record<string, unknown> & {
            id: string;
        };
    }>;
}
export {};
