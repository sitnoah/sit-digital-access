import type { AuthenticatedRequest } from "../common/types";
import { EcosystemRecordDto } from "./dto/ecosystem-record.dto";
import { EcosystemService } from "./ecosystem.service";
type UploadedAdminFile = {
    buffer: Buffer;
    originalname: string;
    mimetype: string;
    size: number;
};
export declare class EcosystemController {
    private readonly ecosystemService;
    constructor(ecosystemService: EcosystemService);
    publicStories(): Promise<{
        data: {
            title: string;
            name: string;
            slug: string;
            type: string;
            storyType: string;
            category: {};
            status: string;
            published: boolean;
            summary: {};
            body: string;
            fullStory: {};
            devicesProvided: number;
            deviceCount: {};
            mediaUrls: string[];
            visualAsset: {};
            tags: string[];
            skillsGained: string[];
            featured: boolean;
            consentConfirmed: boolean;
            updatedAt: {} | null;
            id: string;
        }[];
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
            type: "Enquiry" | "Device request" | "Donation" | "Inventory" | "Deployment" | "Recycling" | "Recycling partner" | "Support" | "Repair" | "Repair part" | "Repair technician" | "Success story" | "Training cohort" | "Notification";
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
        data: {
            records: (Record<string, unknown> & {
                id: string;
            })[];
            summary: {
                totalRecords: number;
                devicesDiverted: number;
                estimatedCo2KgAvoided: number;
                processing: number;
                secureWipePending: number;
                esgEvidenceReady: number;
                overdueCollections: number;
                partnersActive: number;
            };
        };
    }>;
    createRecycling(dto: EcosystemRecordDto, request: AuthenticatedRequest): Promise<{
        data: Record<string, unknown> & {
            id: string;
        };
    }>;
    updateRecycling(id: string, dto: EcosystemRecordDto, request: AuthenticatedRequest): Promise<{
        data: Record<string, unknown> & {
            id: string;
        };
    }>;
    uploadRecyclingAttachment(id: string, file: UploadedAdminFile, dto: EcosystemRecordDto, request: AuthenticatedRequest): Promise<{
        data: Record<string, unknown> & {
            id: string;
        };
    }>;
    recommendRecyclingRoute(id: string, request: AuthenticatedRequest): Promise<{
        data: Record<string, unknown> & {
            id: string;
        };
    }>;
    generateRecyclingReportPack(id: string, dto: EcosystemRecordDto, request: AuthenticatedRequest): Promise<{
        data: Record<string, unknown> & {
            id: string;
        };
    }>;
    listRecyclingPartners(): Promise<{
        data: unknown[];
    }>;
    createRecyclingPartner(dto: EcosystemRecordDto, request: AuthenticatedRequest): Promise<{
        data: Record<string, unknown> & {
            id: string;
        };
    }>;
    updateRecyclingPartner(id: string, dto: EcosystemRecordDto, request: AuthenticatedRequest): Promise<{
        data: unknown;
    }>;
    scheduleCollection(id: string, dto: EcosystemRecordDto, request: AuthenticatedRequest): Promise<{
        data: Record<string, unknown> & {
            id: string;
        };
    }>;
    listSupport(): Promise<{
        data: {
            tickets: {
                reference: string;
                supportReference: string;
                subject: string;
                title: string;
                name: string;
                requesterName: string;
                customerName: {};
                requesterEmail: string | null;
                email: {} | null;
                requesterPhone: string | null;
                phone: {} | null;
                category: "GENERAL_ENQUIRY" | "DEVICE_REQUEST" | "DONATION_SUPPORT" | "INVENTORY_ISSUE" | "REPAIR_SUPPORT" | "RECYCLING_SUPPORT" | "DEPLOYMENT_SUPPORT" | "TRAINING_SUPPORT" | "ACCOUNT_ACCESS";
                priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
                status: "NEW" | "CLOSED" | "OPEN" | "AWAITING_CUSTOMER" | "AWAITING_INTERNAL" | "ESCALATED" | "RESOLVED";
                channel: string;
                description: string;
                summary: {};
                message: {};
                internalNotes: {
                    id: string;
                    note: string;
                    createdAt: string;
                    author: string | null;
                }[];
                internalNoteLog: {
                    id: string;
                    note: string;
                    createdAt: string;
                    author: string | null;
                }[];
                assignedTo: string | null;
                assignedOwner: {} | null;
                linkedInventoryId: {} | null;
                linkedRepairTicketId: {} | null;
                linkedDonationId: {} | null;
                linkedDeploymentId: {} | null;
                slaDueAt: {};
                lastActivityAt: {} | null;
                timeline: unknown[];
                attachments: unknown[];
                id: string;
            }[];
            summary: {
                openTickets: number;
                highPriority: number;
                inventoryLinked: number;
                repairLinked: number;
                closedTickets: number;
                slaRisk: number;
                awaitingCustomer: number;
                escalated: number;
            };
        };
    }>;
    createSupport(dto: EcosystemRecordDto, request: AuthenticatedRequest): Promise<{
        data: {
            reference: string;
            supportReference: string;
            subject: string;
            title: string;
            name: string;
            requesterName: string;
            customerName: {};
            requesterEmail: string | null;
            email: {} | null;
            requesterPhone: string | null;
            phone: {} | null;
            category: "GENERAL_ENQUIRY" | "DEVICE_REQUEST" | "DONATION_SUPPORT" | "INVENTORY_ISSUE" | "REPAIR_SUPPORT" | "RECYCLING_SUPPORT" | "DEPLOYMENT_SUPPORT" | "TRAINING_SUPPORT" | "ACCOUNT_ACCESS";
            priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
            status: "NEW" | "CLOSED" | "OPEN" | "AWAITING_CUSTOMER" | "AWAITING_INTERNAL" | "ESCALATED" | "RESOLVED";
            channel: string;
            description: string;
            summary: {};
            message: {};
            internalNotes: {
                id: string;
                note: string;
                createdAt: string;
                author: string | null;
            }[];
            internalNoteLog: {
                id: string;
                note: string;
                createdAt: string;
                author: string | null;
            }[];
            assignedTo: string | null;
            assignedOwner: {} | null;
            linkedInventoryId: {} | null;
            linkedRepairTicketId: {} | null;
            linkedDonationId: {} | null;
            linkedDeploymentId: {} | null;
            slaDueAt: {};
            lastActivityAt: {} | null;
            timeline: unknown[];
            attachments: unknown[];
            id: string;
        };
    }>;
    getSupport(id: string): Promise<{
        data: {
            reference: string;
            supportReference: string;
            subject: string;
            title: string;
            name: string;
            requesterName: string;
            customerName: {};
            requesterEmail: string | null;
            email: {} | null;
            requesterPhone: string | null;
            phone: {} | null;
            category: "GENERAL_ENQUIRY" | "DEVICE_REQUEST" | "DONATION_SUPPORT" | "INVENTORY_ISSUE" | "REPAIR_SUPPORT" | "RECYCLING_SUPPORT" | "DEPLOYMENT_SUPPORT" | "TRAINING_SUPPORT" | "ACCOUNT_ACCESS";
            priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
            status: "NEW" | "CLOSED" | "OPEN" | "AWAITING_CUSTOMER" | "AWAITING_INTERNAL" | "ESCALATED" | "RESOLVED";
            channel: string;
            description: string;
            summary: {};
            message: {};
            internalNotes: {
                id: string;
                note: string;
                createdAt: string;
                author: string | null;
            }[];
            internalNoteLog: {
                id: string;
                note: string;
                createdAt: string;
                author: string | null;
            }[];
            assignedTo: string | null;
            assignedOwner: {} | null;
            linkedInventoryId: {} | null;
            linkedRepairTicketId: {} | null;
            linkedDonationId: {} | null;
            linkedDeploymentId: {} | null;
            slaDueAt: {};
            lastActivityAt: {} | null;
            timeline: unknown[];
            attachments: unknown[];
            id: string;
        };
    }>;
    updateSupport(id: string, dto: EcosystemRecordDto, request: AuthenticatedRequest): Promise<{
        data: {
            reference: string;
            supportReference: string;
            subject: string;
            title: string;
            name: string;
            requesterName: string;
            customerName: {};
            requesterEmail: string | null;
            email: {} | null;
            requesterPhone: string | null;
            phone: {} | null;
            category: "GENERAL_ENQUIRY" | "DEVICE_REQUEST" | "DONATION_SUPPORT" | "INVENTORY_ISSUE" | "REPAIR_SUPPORT" | "RECYCLING_SUPPORT" | "DEPLOYMENT_SUPPORT" | "TRAINING_SUPPORT" | "ACCOUNT_ACCESS";
            priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
            status: "NEW" | "CLOSED" | "OPEN" | "AWAITING_CUSTOMER" | "AWAITING_INTERNAL" | "ESCALATED" | "RESOLVED";
            channel: string;
            description: string;
            summary: {};
            message: {};
            internalNotes: {
                id: string;
                note: string;
                createdAt: string;
                author: string | null;
            }[];
            internalNoteLog: {
                id: string;
                note: string;
                createdAt: string;
                author: string | null;
            }[];
            assignedTo: string | null;
            assignedOwner: {} | null;
            linkedInventoryId: {} | null;
            linkedRepairTicketId: {} | null;
            linkedDonationId: {} | null;
            linkedDeploymentId: {} | null;
            slaDueAt: {};
            lastActivityAt: {} | null;
            timeline: unknown[];
            attachments: unknown[];
            id: string;
        };
    }>;
    assignSupport(id: string, dto: EcosystemRecordDto, request: AuthenticatedRequest): Promise<{
        data: {
            reference: string;
            supportReference: string;
            subject: string;
            title: string;
            name: string;
            requesterName: string;
            customerName: {};
            requesterEmail: string | null;
            email: {} | null;
            requesterPhone: string | null;
            phone: {} | null;
            category: "GENERAL_ENQUIRY" | "DEVICE_REQUEST" | "DONATION_SUPPORT" | "INVENTORY_ISSUE" | "REPAIR_SUPPORT" | "RECYCLING_SUPPORT" | "DEPLOYMENT_SUPPORT" | "TRAINING_SUPPORT" | "ACCOUNT_ACCESS";
            priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
            status: "NEW" | "CLOSED" | "OPEN" | "AWAITING_CUSTOMER" | "AWAITING_INTERNAL" | "ESCALATED" | "RESOLVED";
            channel: string;
            description: string;
            summary: {};
            message: {};
            internalNotes: {
                id: string;
                note: string;
                createdAt: string;
                author: string | null;
            }[];
            internalNoteLog: {
                id: string;
                note: string;
                createdAt: string;
                author: string | null;
            }[];
            assignedTo: string | null;
            assignedOwner: {} | null;
            linkedInventoryId: {} | null;
            linkedRepairTicketId: {} | null;
            linkedDonationId: {} | null;
            linkedDeploymentId: {} | null;
            slaDueAt: {};
            lastActivityAt: {} | null;
            timeline: unknown[];
            attachments: unknown[];
            id: string;
        };
    }>;
    escalateSupport(id: string, dto: EcosystemRecordDto, request: AuthenticatedRequest): Promise<{
        data: {
            reference: string;
            supportReference: string;
            subject: string;
            title: string;
            name: string;
            requesterName: string;
            customerName: {};
            requesterEmail: string | null;
            email: {} | null;
            requesterPhone: string | null;
            phone: {} | null;
            category: "GENERAL_ENQUIRY" | "DEVICE_REQUEST" | "DONATION_SUPPORT" | "INVENTORY_ISSUE" | "REPAIR_SUPPORT" | "RECYCLING_SUPPORT" | "DEPLOYMENT_SUPPORT" | "TRAINING_SUPPORT" | "ACCOUNT_ACCESS";
            priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
            status: "NEW" | "CLOSED" | "OPEN" | "AWAITING_CUSTOMER" | "AWAITING_INTERNAL" | "ESCALATED" | "RESOLVED";
            channel: string;
            description: string;
            summary: {};
            message: {};
            internalNotes: {
                id: string;
                note: string;
                createdAt: string;
                author: string | null;
            }[];
            internalNoteLog: {
                id: string;
                note: string;
                createdAt: string;
                author: string | null;
            }[];
            assignedTo: string | null;
            assignedOwner: {} | null;
            linkedInventoryId: {} | null;
            linkedRepairTicketId: {} | null;
            linkedDonationId: {} | null;
            linkedDeploymentId: {} | null;
            slaDueAt: {};
            lastActivityAt: {} | null;
            timeline: unknown[];
            attachments: unknown[];
            id: string;
        };
    }>;
    closeSupport(id: string, dto: EcosystemRecordDto, request: AuthenticatedRequest): Promise<{
        data: {
            reference: string;
            supportReference: string;
            subject: string;
            title: string;
            name: string;
            requesterName: string;
            customerName: {};
            requesterEmail: string | null;
            email: {} | null;
            requesterPhone: string | null;
            phone: {} | null;
            category: "GENERAL_ENQUIRY" | "DEVICE_REQUEST" | "DONATION_SUPPORT" | "INVENTORY_ISSUE" | "REPAIR_SUPPORT" | "RECYCLING_SUPPORT" | "DEPLOYMENT_SUPPORT" | "TRAINING_SUPPORT" | "ACCOUNT_ACCESS";
            priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
            status: "NEW" | "CLOSED" | "OPEN" | "AWAITING_CUSTOMER" | "AWAITING_INTERNAL" | "ESCALATED" | "RESOLVED";
            channel: string;
            description: string;
            summary: {};
            message: {};
            internalNotes: {
                id: string;
                note: string;
                createdAt: string;
                author: string | null;
            }[];
            internalNoteLog: {
                id: string;
                note: string;
                createdAt: string;
                author: string | null;
            }[];
            assignedTo: string | null;
            assignedOwner: {} | null;
            linkedInventoryId: {} | null;
            linkedRepairTicketId: {} | null;
            linkedDonationId: {} | null;
            linkedDeploymentId: {} | null;
            slaDueAt: {};
            lastActivityAt: {} | null;
            timeline: unknown[];
            attachments: unknown[];
            id: string;
        };
    }>;
    linkSupportRecord(id: string, dto: EcosystemRecordDto, request: AuthenticatedRequest): Promise<{
        data: {
            reference: string;
            supportReference: string;
            subject: string;
            title: string;
            name: string;
            requesterName: string;
            customerName: {};
            requesterEmail: string | null;
            email: {} | null;
            requesterPhone: string | null;
            phone: {} | null;
            category: "GENERAL_ENQUIRY" | "DEVICE_REQUEST" | "DONATION_SUPPORT" | "INVENTORY_ISSUE" | "REPAIR_SUPPORT" | "RECYCLING_SUPPORT" | "DEPLOYMENT_SUPPORT" | "TRAINING_SUPPORT" | "ACCOUNT_ACCESS";
            priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
            status: "NEW" | "CLOSED" | "OPEN" | "AWAITING_CUSTOMER" | "AWAITING_INTERNAL" | "ESCALATED" | "RESOLVED";
            channel: string;
            description: string;
            summary: {};
            message: {};
            internalNotes: {
                id: string;
                note: string;
                createdAt: string;
                author: string | null;
            }[];
            internalNoteLog: {
                id: string;
                note: string;
                createdAt: string;
                author: string | null;
            }[];
            assignedTo: string | null;
            assignedOwner: {} | null;
            linkedInventoryId: {} | null;
            linkedRepairTicketId: {} | null;
            linkedDonationId: {} | null;
            linkedDeploymentId: {} | null;
            slaDueAt: {};
            lastActivityAt: {} | null;
            timeline: unknown[];
            attachments: unknown[];
            id: string;
        };
    }>;
    listSupportTickets(): Promise<{
        data: {
            tickets: {
                reference: string;
                supportReference: string;
                subject: string;
                title: string;
                name: string;
                requesterName: string;
                customerName: {};
                requesterEmail: string | null;
                email: {} | null;
                requesterPhone: string | null;
                phone: {} | null;
                category: "GENERAL_ENQUIRY" | "DEVICE_REQUEST" | "DONATION_SUPPORT" | "INVENTORY_ISSUE" | "REPAIR_SUPPORT" | "RECYCLING_SUPPORT" | "DEPLOYMENT_SUPPORT" | "TRAINING_SUPPORT" | "ACCOUNT_ACCESS";
                priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
                status: "NEW" | "CLOSED" | "OPEN" | "AWAITING_CUSTOMER" | "AWAITING_INTERNAL" | "ESCALATED" | "RESOLVED";
                channel: string;
                description: string;
                summary: {};
                message: {};
                internalNotes: {
                    id: string;
                    note: string;
                    createdAt: string;
                    author: string | null;
                }[];
                internalNoteLog: {
                    id: string;
                    note: string;
                    createdAt: string;
                    author: string | null;
                }[];
                assignedTo: string | null;
                assignedOwner: {} | null;
                linkedInventoryId: {} | null;
                linkedRepairTicketId: {} | null;
                linkedDonationId: {} | null;
                linkedDeploymentId: {} | null;
                slaDueAt: {};
                lastActivityAt: {} | null;
                timeline: unknown[];
                attachments: unknown[];
                id: string;
            }[];
            summary: {
                openTickets: number;
                highPriority: number;
                inventoryLinked: number;
                repairLinked: number;
                closedTickets: number;
                slaRisk: number;
                awaitingCustomer: number;
                escalated: number;
            };
        };
    }>;
    createSupportTicket(dto: EcosystemRecordDto, request: AuthenticatedRequest): Promise<{
        data: {
            reference: string;
            supportReference: string;
            subject: string;
            title: string;
            name: string;
            requesterName: string;
            customerName: {};
            requesterEmail: string | null;
            email: {} | null;
            requesterPhone: string | null;
            phone: {} | null;
            category: "GENERAL_ENQUIRY" | "DEVICE_REQUEST" | "DONATION_SUPPORT" | "INVENTORY_ISSUE" | "REPAIR_SUPPORT" | "RECYCLING_SUPPORT" | "DEPLOYMENT_SUPPORT" | "TRAINING_SUPPORT" | "ACCOUNT_ACCESS";
            priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
            status: "NEW" | "CLOSED" | "OPEN" | "AWAITING_CUSTOMER" | "AWAITING_INTERNAL" | "ESCALATED" | "RESOLVED";
            channel: string;
            description: string;
            summary: {};
            message: {};
            internalNotes: {
                id: string;
                note: string;
                createdAt: string;
                author: string | null;
            }[];
            internalNoteLog: {
                id: string;
                note: string;
                createdAt: string;
                author: string | null;
            }[];
            assignedTo: string | null;
            assignedOwner: {} | null;
            linkedInventoryId: {} | null;
            linkedRepairTicketId: {} | null;
            linkedDonationId: {} | null;
            linkedDeploymentId: {} | null;
            slaDueAt: {};
            lastActivityAt: {} | null;
            timeline: unknown[];
            attachments: unknown[];
            id: string;
        };
    }>;
    getSupportTicket(id: string): Promise<{
        data: {
            reference: string;
            supportReference: string;
            subject: string;
            title: string;
            name: string;
            requesterName: string;
            customerName: {};
            requesterEmail: string | null;
            email: {} | null;
            requesterPhone: string | null;
            phone: {} | null;
            category: "GENERAL_ENQUIRY" | "DEVICE_REQUEST" | "DONATION_SUPPORT" | "INVENTORY_ISSUE" | "REPAIR_SUPPORT" | "RECYCLING_SUPPORT" | "DEPLOYMENT_SUPPORT" | "TRAINING_SUPPORT" | "ACCOUNT_ACCESS";
            priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
            status: "NEW" | "CLOSED" | "OPEN" | "AWAITING_CUSTOMER" | "AWAITING_INTERNAL" | "ESCALATED" | "RESOLVED";
            channel: string;
            description: string;
            summary: {};
            message: {};
            internalNotes: {
                id: string;
                note: string;
                createdAt: string;
                author: string | null;
            }[];
            internalNoteLog: {
                id: string;
                note: string;
                createdAt: string;
                author: string | null;
            }[];
            assignedTo: string | null;
            assignedOwner: {} | null;
            linkedInventoryId: {} | null;
            linkedRepairTicketId: {} | null;
            linkedDonationId: {} | null;
            linkedDeploymentId: {} | null;
            slaDueAt: {};
            lastActivityAt: {} | null;
            timeline: unknown[];
            attachments: unknown[];
            id: string;
        };
    }>;
    updateSupportTicket(id: string, dto: EcosystemRecordDto, request: AuthenticatedRequest): Promise<{
        data: {
            reference: string;
            supportReference: string;
            subject: string;
            title: string;
            name: string;
            requesterName: string;
            customerName: {};
            requesterEmail: string | null;
            email: {} | null;
            requesterPhone: string | null;
            phone: {} | null;
            category: "GENERAL_ENQUIRY" | "DEVICE_REQUEST" | "DONATION_SUPPORT" | "INVENTORY_ISSUE" | "REPAIR_SUPPORT" | "RECYCLING_SUPPORT" | "DEPLOYMENT_SUPPORT" | "TRAINING_SUPPORT" | "ACCOUNT_ACCESS";
            priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
            status: "NEW" | "CLOSED" | "OPEN" | "AWAITING_CUSTOMER" | "AWAITING_INTERNAL" | "ESCALATED" | "RESOLVED";
            channel: string;
            description: string;
            summary: {};
            message: {};
            internalNotes: {
                id: string;
                note: string;
                createdAt: string;
                author: string | null;
            }[];
            internalNoteLog: {
                id: string;
                note: string;
                createdAt: string;
                author: string | null;
            }[];
            assignedTo: string | null;
            assignedOwner: {} | null;
            linkedInventoryId: {} | null;
            linkedRepairTicketId: {} | null;
            linkedDonationId: {} | null;
            linkedDeploymentId: {} | null;
            slaDueAt: {};
            lastActivityAt: {} | null;
            timeline: unknown[];
            attachments: unknown[];
            id: string;
        };
    }>;
    createSupportTicketFromInventory(id: string, dto: EcosystemRecordDto, request: AuthenticatedRequest): Promise<{
        data: {
            reference: string;
            supportReference: string;
            subject: string;
            title: string;
            name: string;
            requesterName: string;
            customerName: {};
            requesterEmail: string | null;
            email: {} | null;
            requesterPhone: string | null;
            phone: {} | null;
            category: "GENERAL_ENQUIRY" | "DEVICE_REQUEST" | "DONATION_SUPPORT" | "INVENTORY_ISSUE" | "REPAIR_SUPPORT" | "RECYCLING_SUPPORT" | "DEPLOYMENT_SUPPORT" | "TRAINING_SUPPORT" | "ACCOUNT_ACCESS";
            priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
            status: "NEW" | "CLOSED" | "OPEN" | "AWAITING_CUSTOMER" | "AWAITING_INTERNAL" | "ESCALATED" | "RESOLVED";
            channel: string;
            description: string;
            summary: {};
            message: {};
            internalNotes: {
                id: string;
                note: string;
                createdAt: string;
                author: string | null;
            }[];
            internalNoteLog: {
                id: string;
                note: string;
                createdAt: string;
                author: string | null;
            }[];
            assignedTo: string | null;
            assignedOwner: {} | null;
            linkedInventoryId: {} | null;
            linkedRepairTicketId: {} | null;
            linkedDonationId: {} | null;
            linkedDeploymentId: {} | null;
            slaDueAt: {};
            lastActivityAt: {} | null;
            timeline: unknown[];
            attachments: unknown[];
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
    uploadRepairAttachment(id: string, file: UploadedAdminFile, request: AuthenticatedRequest): Promise<{
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
        data: {
            stories: {
                title: string;
                name: string;
                slug: string;
                type: string;
                storyType: string;
                category: {};
                status: string;
                published: boolean;
                summary: {};
                body: string;
                fullStory: {};
                devicesProvided: number;
                deviceCount: {};
                mediaUrls: string[];
                visualAsset: {};
                tags: string[];
                skillsGained: string[];
                featured: boolean;
                consentConfirmed: boolean;
                updatedAt: {} | null;
                id: string;
            }[];
            summary: {
                totalStories: number;
                published: number;
                drafts: number;
                awaitingReview: number;
                regionsRepresented: number;
                featured: number;
                storiesWithMedia: number;
                impactMetricsAttached: number;
            };
        };
    }>;
    createSuccessStory(dto: EcosystemRecordDto, request: AuthenticatedRequest): Promise<{
        data: {
            title: string;
            name: string;
            slug: string;
            type: string;
            storyType: string;
            category: {};
            status: string;
            published: boolean;
            summary: {};
            body: string;
            fullStory: {};
            devicesProvided: number;
            deviceCount: {};
            mediaUrls: string[];
            visualAsset: {};
            tags: string[];
            skillsGained: string[];
            featured: boolean;
            consentConfirmed: boolean;
            updatedAt: {} | null;
            id: string;
        };
    }>;
    seedSuccessStories(request: AuthenticatedRequest): Promise<{
        data: {
            title: string;
            name: string;
            slug: string;
            type: string;
            storyType: string;
            category: {};
            status: string;
            published: boolean;
            summary: {};
            body: string;
            fullStory: {};
            devicesProvided: number;
            deviceCount: {};
            mediaUrls: string[];
            visualAsset: {};
            tags: string[];
            skillsGained: string[];
            featured: boolean;
            consentConfirmed: boolean;
            updatedAt: {} | null;
            id: string;
        }[];
    }>;
    generateSuccessStoryDraft(dto: EcosystemRecordDto, request: AuthenticatedRequest): Promise<{
        data: Record<string, unknown> | {
            title: string;
            summary: string;
            body: string;
            quote: string;
            socialPost: string;
            tags: string[];
            tone: string;
            provider: string;
            generatedAt: string;
        };
    }>;
    updateSuccessStory(id: string, dto: EcosystemRecordDto, request: AuthenticatedRequest): Promise<{
        data: {
            title: string;
            name: string;
            slug: string;
            type: string;
            storyType: string;
            category: {};
            status: string;
            published: boolean;
            summary: {};
            body: string;
            fullStory: {};
            devicesProvided: number;
            deviceCount: {};
            mediaUrls: string[];
            visualAsset: {};
            tags: string[];
            skillsGained: string[];
            featured: boolean;
            consentConfirmed: boolean;
            updatedAt: {} | null;
            id: string;
        };
    }>;
    deleteSuccessStory(id: string, request: AuthenticatedRequest): Promise<{
        data: {
            id: string;
            deleted: boolean;
        };
    }>;
    publishSuccessStory(id: string, request: AuthenticatedRequest): Promise<{
        data: {
            title: string;
            name: string;
            slug: string;
            type: string;
            storyType: string;
            category: {};
            status: string;
            published: boolean;
            summary: {};
            body: string;
            fullStory: {};
            devicesProvided: number;
            deviceCount: {};
            mediaUrls: string[];
            visualAsset: {};
            tags: string[];
            skillsGained: string[];
            featured: boolean;
            consentConfirmed: boolean;
            updatedAt: {} | null;
            id: string;
        };
    }>;
    unpublishSuccessStory(id: string, request: AuthenticatedRequest): Promise<{
        data: {
            title: string;
            name: string;
            slug: string;
            type: string;
            storyType: string;
            category: {};
            status: string;
            published: boolean;
            summary: {};
            body: string;
            fullStory: {};
            devicesProvided: number;
            deviceCount: {};
            mediaUrls: string[];
            visualAsset: {};
            tags: string[];
            skillsGained: string[];
            featured: boolean;
            consentConfirmed: boolean;
            updatedAt: {} | null;
            id: string;
        };
    }>;
    featureSuccessStory(id: string, request: AuthenticatedRequest): Promise<{
        data: {
            title: string;
            name: string;
            slug: string;
            type: string;
            storyType: string;
            category: {};
            status: string;
            published: boolean;
            summary: {};
            body: string;
            fullStory: {};
            devicesProvided: number;
            deviceCount: {};
            mediaUrls: string[];
            visualAsset: {};
            tags: string[];
            skillsGained: string[];
            featured: boolean;
            consentConfirmed: boolean;
            updatedAt: {} | null;
            id: string;
        };
    }>;
    listTrainingCohorts(): Promise<{
        data: {
            cohorts: {
                name: string;
                title: string;
                cohortName: string;
                programmeType: "DIGITAL_LITERACY" | "AI_LITERACY" | "CYBERSECURITY_AWARENESS" | "TEACHER_ENABLEMENT" | "DEVICE_READINESS" | "EMPLOYABILITY_SKILLS" | "REPAIR_TECHNICIAN_TRAINING" | "COMMUNITY_HUB_TRAINING";
                trainingPathway: {};
                deliveryMode: string;
                status: "ACTIVE" | "COMPLETED" | "DRAFT" | "RECRUITING" | "CERTIFICATION_READY" | "ARCHIVED" | "AT_RISK";
                targetLearners: number;
                enrolledLearners: number;
                learnerCount: {};
                attendanceRate: number;
                completionRate: number;
                certificationReadiness: number;
                certificationChecklist: {};
                learnerRegister: Record<string, unknown>[];
                certificationEnabled: boolean;
                attendanceTrackingEnabled: boolean;
                owner: {} | null;
                assignedOwner: {} | null;
                timeline: unknown[];
                id: string;
            }[];
            summary: {
                totalCohorts: number;
                totalLearners: number;
                activeCohorts: number;
                certificationReady: number;
                sponsorFunded: number;
                schoolsLinked: number;
                completionRate: number;
                attendanceRisk: number;
            };
        };
    }>;
    createTrainingCohort(dto: EcosystemRecordDto, request: AuthenticatedRequest): Promise<{
        data: {
            name: string;
            title: string;
            cohortName: string;
            programmeType: "DIGITAL_LITERACY" | "AI_LITERACY" | "CYBERSECURITY_AWARENESS" | "TEACHER_ENABLEMENT" | "DEVICE_READINESS" | "EMPLOYABILITY_SKILLS" | "REPAIR_TECHNICIAN_TRAINING" | "COMMUNITY_HUB_TRAINING";
            trainingPathway: {};
            deliveryMode: string;
            status: "ACTIVE" | "COMPLETED" | "DRAFT" | "RECRUITING" | "CERTIFICATION_READY" | "ARCHIVED" | "AT_RISK";
            targetLearners: number;
            enrolledLearners: number;
            learnerCount: {};
            attendanceRate: number;
            completionRate: number;
            certificationReadiness: number;
            certificationChecklist: {};
            learnerRegister: Record<string, unknown>[];
            certificationEnabled: boolean;
            attendanceTrackingEnabled: boolean;
            owner: {} | null;
            assignedOwner: {} | null;
            timeline: unknown[];
            id: string;
        };
    }>;
    importTrainingLearners(id: string, file: UploadedAdminFile, request: AuthenticatedRequest): Promise<{
        data: {
            name: string;
            title: string;
            cohortName: string;
            programmeType: "DIGITAL_LITERACY" | "AI_LITERACY" | "CYBERSECURITY_AWARENESS" | "TEACHER_ENABLEMENT" | "DEVICE_READINESS" | "EMPLOYABILITY_SKILLS" | "REPAIR_TECHNICIAN_TRAINING" | "COMMUNITY_HUB_TRAINING";
            trainingPathway: {};
            deliveryMode: string;
            status: "ACTIVE" | "COMPLETED" | "DRAFT" | "RECRUITING" | "CERTIFICATION_READY" | "ARCHIVED" | "AT_RISK";
            targetLearners: number;
            enrolledLearners: number;
            learnerCount: {};
            attendanceRate: number;
            completionRate: number;
            certificationReadiness: number;
            certificationChecklist: {};
            learnerRegister: Record<string, unknown>[];
            certificationEnabled: boolean;
            attendanceTrackingEnabled: boolean;
            owner: {} | null;
            assignedOwner: {} | null;
            timeline: unknown[];
            id: string;
        };
    }>;
    generateTrainingCertificates(id: string, request: AuthenticatedRequest): Promise<{
        data: {
            name: string;
            title: string;
            cohortName: string;
            programmeType: "DIGITAL_LITERACY" | "AI_LITERACY" | "CYBERSECURITY_AWARENESS" | "TEACHER_ENABLEMENT" | "DEVICE_READINESS" | "EMPLOYABILITY_SKILLS" | "REPAIR_TECHNICIAN_TRAINING" | "COMMUNITY_HUB_TRAINING";
            trainingPathway: {};
            deliveryMode: string;
            status: "ACTIVE" | "COMPLETED" | "DRAFT" | "RECRUITING" | "CERTIFICATION_READY" | "ARCHIVED" | "AT_RISK";
            targetLearners: number;
            enrolledLearners: number;
            learnerCount: {};
            attendanceRate: number;
            completionRate: number;
            certificationReadiness: number;
            certificationChecklist: {};
            learnerRegister: Record<string, unknown>[];
            certificationEnabled: boolean;
            attendanceTrackingEnabled: boolean;
            owner: {} | null;
            assignedOwner: {} | null;
            timeline: unknown[];
            id: string;
        };
    }>;
    markTrainingCohortActive(id: string, request: AuthenticatedRequest): Promise<{
        data: {
            name: string;
            title: string;
            cohortName: string;
            programmeType: "DIGITAL_LITERACY" | "AI_LITERACY" | "CYBERSECURITY_AWARENESS" | "TEACHER_ENABLEMENT" | "DEVICE_READINESS" | "EMPLOYABILITY_SKILLS" | "REPAIR_TECHNICIAN_TRAINING" | "COMMUNITY_HUB_TRAINING";
            trainingPathway: {};
            deliveryMode: string;
            status: "ACTIVE" | "COMPLETED" | "DRAFT" | "RECRUITING" | "CERTIFICATION_READY" | "ARCHIVED" | "AT_RISK";
            targetLearners: number;
            enrolledLearners: number;
            learnerCount: {};
            attendanceRate: number;
            completionRate: number;
            certificationReadiness: number;
            certificationChecklist: {};
            learnerRegister: Record<string, unknown>[];
            certificationEnabled: boolean;
            attendanceTrackingEnabled: boolean;
            owner: {} | null;
            assignedOwner: {} | null;
            timeline: unknown[];
            id: string;
        };
    }>;
    completeTrainingCohort(id: string, request: AuthenticatedRequest): Promise<{
        data: {
            name: string;
            title: string;
            cohortName: string;
            programmeType: "DIGITAL_LITERACY" | "AI_LITERACY" | "CYBERSECURITY_AWARENESS" | "TEACHER_ENABLEMENT" | "DEVICE_READINESS" | "EMPLOYABILITY_SKILLS" | "REPAIR_TECHNICIAN_TRAINING" | "COMMUNITY_HUB_TRAINING";
            trainingPathway: {};
            deliveryMode: string;
            status: "ACTIVE" | "COMPLETED" | "DRAFT" | "RECRUITING" | "CERTIFICATION_READY" | "ARCHIVED" | "AT_RISK";
            targetLearners: number;
            enrolledLearners: number;
            learnerCount: {};
            attendanceRate: number;
            completionRate: number;
            certificationReadiness: number;
            certificationChecklist: {};
            learnerRegister: Record<string, unknown>[];
            certificationEnabled: boolean;
            attendanceTrackingEnabled: boolean;
            owner: {} | null;
            assignedOwner: {} | null;
            timeline: unknown[];
            id: string;
        };
    }>;
    exportTrainingRegister(id: string): Promise<{
        data: {
            filename: string;
            contentType: string;
            content: string;
        };
    }>;
    getTrainingCohort(id: string): Promise<{
        data: {
            name: string;
            title: string;
            cohortName: string;
            programmeType: "DIGITAL_LITERACY" | "AI_LITERACY" | "CYBERSECURITY_AWARENESS" | "TEACHER_ENABLEMENT" | "DEVICE_READINESS" | "EMPLOYABILITY_SKILLS" | "REPAIR_TECHNICIAN_TRAINING" | "COMMUNITY_HUB_TRAINING";
            trainingPathway: {};
            deliveryMode: string;
            status: "ACTIVE" | "COMPLETED" | "DRAFT" | "RECRUITING" | "CERTIFICATION_READY" | "ARCHIVED" | "AT_RISK";
            targetLearners: number;
            enrolledLearners: number;
            learnerCount: {};
            attendanceRate: number;
            completionRate: number;
            certificationReadiness: number;
            certificationChecklist: {};
            learnerRegister: Record<string, unknown>[];
            certificationEnabled: boolean;
            attendanceTrackingEnabled: boolean;
            owner: {} | null;
            assignedOwner: {} | null;
            timeline: unknown[];
            id: string;
        };
    }>;
    updateTrainingCohort(id: string, dto: EcosystemRecordDto, request: AuthenticatedRequest): Promise<{
        data: {
            name: string;
            title: string;
            cohortName: string;
            programmeType: "DIGITAL_LITERACY" | "AI_LITERACY" | "CYBERSECURITY_AWARENESS" | "TEACHER_ENABLEMENT" | "DEVICE_READINESS" | "EMPLOYABILITY_SKILLS" | "REPAIR_TECHNICIAN_TRAINING" | "COMMUNITY_HUB_TRAINING";
            trainingPathway: {};
            deliveryMode: string;
            status: "ACTIVE" | "COMPLETED" | "DRAFT" | "RECRUITING" | "CERTIFICATION_READY" | "ARCHIVED" | "AT_RISK";
            targetLearners: number;
            enrolledLearners: number;
            learnerCount: {};
            attendanceRate: number;
            completionRate: number;
            certificationReadiness: number;
            certificationChecklist: {};
            learnerRegister: Record<string, unknown>[];
            certificationEnabled: boolean;
            attendanceTrackingEnabled: boolean;
            owner: {} | null;
            assignedOwner: {} | null;
            timeline: unknown[];
            id: string;
        };
    }>;
    listSustainabilityReports(): Promise<{
        data: {
            reports: (Record<string, unknown> & {
                id: string;
            })[];
            summary: {
                totalReports: number;
                co2EstimatedKg: number;
                devicesDiverted: number;
                latestReport: {
                    id: string;
                    name: {};
                    createdAt: {} | null;
                    status: {} | null;
                } | null;
                reuseRate: number;
                recyclingRate: number;
                devicesReused: number;
                devicesRecycled: number;
                evidenceReadiness: number;
            };
        };
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
    exportSustainabilityReportPdf(id: string): Promise<{
        data: {
            available: boolean;
            format: "pdf" | "csv";
            filename: {};
            contentType: {};
            storagePath: {} | null;
            downloadUrl: {} | null;
            message: string;
        };
    }>;
    exportSustainabilityReportCsv(id: string): Promise<{
        data: {
            available: boolean;
            format: "pdf" | "csv";
            filename: {};
            contentType: {};
            storagePath: {} | null;
            downloadUrl: {} | null;
            message: string;
        };
    }>;
    getSustainabilityReport(id: string): Promise<{
        data: Record<string, unknown> & {
            id: string;
        };
    }>;
}
export {};
