"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EcosystemService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const crypto_1 = require("crypto");
const audit_service_1 = require("../audit/audit.service");
const constants_1 = require("../common/constants");
const firestore_repository_1 = require("../common/firestore/firestore.repository");
const sanitize_1 = require("../common/sanitize");
const firebase_admin_service_1 = require("../firebase/firebase-admin.service");
const integrations_service_1 = require("./integrations.service");
const configs = {
    deployments: { collection: constants_1.COLLECTIONS.deployments, resourceType: "deployments", defaultStatus: "PLANNING", defaultPriority: "MEDIUM" },
    recycling: { collection: constants_1.COLLECTIONS.recycling, resourceType: "recycling", defaultStatus: "INTAKE", defaultPriority: "MEDIUM" },
    supportTickets: { collection: constants_1.COLLECTIONS.supportTickets, resourceType: "supportTickets", defaultStatus: "OPEN", defaultPriority: "MEDIUM" },
    repairTickets: { collection: constants_1.COLLECTIONS.repairTickets, resourceType: "repairTickets", defaultStatus: "NEW", defaultPriority: "MEDIUM" },
    repairParts: { collection: constants_1.COLLECTIONS.repairParts, resourceType: "repairParts", defaultStatus: "AVAILABLE", defaultPriority: "MEDIUM" },
    repairTechnicians: { collection: constants_1.COLLECTIONS.repairTechnicians, resourceType: "repairTechnicians", defaultStatus: "AVAILABLE", defaultPriority: "MEDIUM" },
    notifications: { collection: constants_1.COLLECTIONS.notifications, resourceType: "notifications", defaultStatus: "UNREAD", defaultPriority: "MEDIUM" },
    savedViews: { collection: constants_1.COLLECTIONS.savedViews, resourceType: "savedViews", defaultStatus: "ACTIVE" },
    successStories: { collection: constants_1.COLLECTIONS.successStories, resourceType: "successStories", defaultStatus: "DRAFT" },
    trainingCohorts: { collection: constants_1.COLLECTIONS.trainingCohorts, resourceType: "trainingCohorts", defaultStatus: "PLANNING", defaultPriority: "MEDIUM" },
    sustainabilityReports: { collection: constants_1.COLLECTIONS.sustainabilityReports, resourceType: "sustainabilityReports", defaultStatus: "GENERATED" }
};
const searchableCollections = [
    { label: "Enquiry", href: "/admin/enquiries", collection: constants_1.COLLECTIONS.enquiries },
    { label: "Device request", href: "/admin/device-requests", collection: constants_1.COLLECTIONS.deviceRequests },
    { label: "Donation", href: "/admin/donations", collection: constants_1.COLLECTIONS.donations },
    { label: "Inventory", href: "/admin/inventory", collection: constants_1.COLLECTIONS.inventory },
    { label: "Deployment", href: "/admin/deployments", collection: constants_1.COLLECTIONS.deployments },
    { label: "Recycling", href: "/admin/recycling", collection: constants_1.COLLECTIONS.recycling },
    { label: "Support", href: "/admin/support", collection: constants_1.COLLECTIONS.supportTickets },
    { label: "Repair", href: "/admin/repairs", collection: constants_1.COLLECTIONS.repairTickets },
    { label: "Repair part", href: "/admin/repair-parts", collection: constants_1.COLLECTIONS.repairParts },
    { label: "Repair technician", href: "/admin/repair-technicians", collection: constants_1.COLLECTIONS.repairTechnicians },
    { label: "Success story", href: "/admin/success-stories", collection: constants_1.COLLECTIONS.successStories },
    { label: "Training cohort", href: "/admin/training-cohorts", collection: constants_1.COLLECTIONS.trainingCohorts },
    { label: "Notification", href: "/admin/notifications", collection: constants_1.COLLECTIONS.notifications }
];
const repairStatuses = [
    "NEW",
    "TRIAGE",
    "DIAGNOSTICS",
    "ESTIMATE_SENT",
    "AWAITING_APPROVAL",
    "REPAIR_IN_PROGRESS",
    "WAITING_FOR_PARTS",
    "QUALITY_CHECK",
    "READY_FOR_PICKUP",
    "READY_FOR_RETURN",
    "COMPLETED",
    "CANCELLED",
    "UNREPAIRABLE"
];
const repairStatusMeta = {
    NEW: {
        label: "Booking received",
        message: "Your repair booking has been received and is waiting for triage.",
        progress: 8
    },
    TRIAGE: {
        label: "Triage in progress",
        message: "The repair team is checking the intake details, route and urgency.",
        progress: 18
    },
    DIAGNOSTICS: {
        label: "Diagnostics in progress",
        message: "A technician is checking the device and confirming the repair route.",
        progress: 34
    },
    ESTIMATE_SENT: {
        label: "Estimate sent",
        message: "An estimate or warranty route has been prepared for review.",
        progress: 48
    },
    AWAITING_APPROVAL: {
        label: "Awaiting approval",
        message: "The repair is paused until approval, parts confirmation or warranty decision.",
        progress: 52
    },
    REPAIR_IN_PROGRESS: {
        label: "Repair in progress",
        message: "The approved repair or upgrade work is underway.",
        progress: 68
    },
    WAITING_FOR_PARTS: {
        label: "Waiting for parts",
        message: "The repair is waiting for a part, compatibility check or supplier confirmation.",
        progress: 58
    },
    QUALITY_CHECK: {
        label: "Quality check",
        message: "The device is being tested before collection, return or deployment.",
        progress: 84
    },
    READY_FOR_PICKUP: {
        label: "Ready for pickup",
        message: "The device is ready for pickup or handover.",
        progress: 94
    },
    READY_FOR_RETURN: {
        label: "Ready for return",
        message: "The device is ready for return dispatch or arranged handover.",
        progress: 94
    },
    COMPLETED: {
        label: "Completed",
        message: "The repair has been completed and closed.",
        progress: 100
    },
    CANCELLED: {
        label: "Cancelled",
        message: "This repair has been cancelled and no further work is scheduled.",
        progress: 100
    },
    UNREPAIRABLE: {
        label: "Unrepairable",
        message: "The device is not practical to repair and the team will advise reuse, parts or recycling options.",
        progress: 100
    }
};
let EcosystemService = class EcosystemService {
    repository;
    auditService;
    integrations;
    firebaseAdmin;
    config;
    constructor(repository, auditService, integrations, firebaseAdmin, config) {
        this.repository = repository;
        this.auditService = auditService;
        this.integrations = integrations;
        this.firebaseAdmin = firebaseAdmin;
        this.config = config;
    }
    list(key) {
        return this.repository.list(configs[key].collection, 200);
    }
    async listRepairOperations() {
        const [tickets, technicians] = await Promise.all([
            this.safeList(constants_1.COLLECTIONS.repairTickets, 500),
            this.safeList(constants_1.COLLECTIONS.repairTechnicians, 500)
        ]);
        return {
            tickets,
            summary: this.repairSummary(tickets, technicians)
        };
    }
    async createRepairTicket(dto, request) {
        const repairReference = this.safeString(dto.repairReference) ?? this.repairReference();
        const issueDescription = dto.issueDescription ?? dto.summary ?? dto.message ?? "";
        const repairCategory = dto.repairCategory ?? dto.category ?? "Diagnostics";
        const status = this.repairStatus(dto.status);
        const route = this.safeString(dto.repairRoute) ?? "DROP_OFF";
        const timeline = [
            this.timelineEntry("created", "Repair ticket created", request, {
                status,
                repairReference,
                source: dto.sourceType ?? "adminRepairCommandCentre"
            })
        ];
        return this.create("repairTickets", {
            ...dto,
            repairReference,
            title: dto.title ?? `${dto.deviceType ?? "Device"} repair ticket`,
            summary: dto.summary ?? issueDescription,
            issueDescription,
            repairCategory,
            category: repairCategory,
            status,
            repairRoute: route,
            priority: dto.priority ?? this.priorityFromUrgency(dto.urgency),
            consentCaptured: dto.consentCaptured ?? dto.dataHandlingConsent ?? false,
            slaTargetHours: dto.slaTargetHours ?? this.estimateRepairSla({
                ...dto,
                repairCategory,
                issueDescription
            }),
            diagnostics: {
                ...this.asObject(dto.diagnostics),
                submittedSymptoms: issueDescription,
                category: repairCategory,
                deviceType: dto.deviceType ?? null
            },
            timeline,
            sourceType: dto.sourceType ?? "adminRepairCommandCentre",
            channel: dto.channel ?? "ADMIN_FORM"
        }, request);
    }
    async updateRepairTicket(id, dto, request) {
        const before = await this.findById("repairTickets", id);
        const timeline = this.timelineForUpdate(before, dto, request);
        const updatePayload = {
            ...dto,
            ...(timeline.length ? { timeline: [...this.asArray(before.timeline), ...timeline] } : {})
        };
        const after = await this.repository.update(constants_1.COLLECTIONS.repairTickets, id, (0, sanitize_1.sanitizePayload)(updatePayload));
        await this.log(request, "UPDATE_REPAIRTICKETS", "repairTickets", id, before, after);
        return after;
    }
    async uploadRepairAttachment(id, file, request) {
        if (!file?.buffer?.length) {
            throw new common_1.BadRequestException("A repair attachment file is required.");
        }
        const before = await this.findById("repairTickets", id);
        const bucket = this.firebaseAdmin.storage.bucket();
        const filename = this.safeFilename(file.originalname);
        const storagePath = `repair-ticket-attachments/${id}/${Date.now()}-${filename}`;
        const storageFile = bucket.file(storagePath);
        await storageFile.save(file.buffer, {
            resumable: false,
            metadata: {
                contentType: file.mimetype,
                metadata: {
                    uploadedByUid: request.user.uid,
                    uploadedByEmail: request.user.email ?? ""
                }
            }
        });
        const downloadUrl = await this.attachmentUrl(storageFile, bucket.name, storagePath);
        const attachment = (0, sanitize_1.sanitizePayload)({
            id: (0, crypto_1.randomBytes)(8).toString("hex"),
            filename,
            originalFilename: file.originalname,
            contentType: file.mimetype,
            size: file.size,
            storagePath,
            downloadUrl,
            uploadedByUid: request.user.uid,
            uploadedByEmail: request.user.email ?? null,
            uploadedAt: new Date().toISOString()
        });
        const after = await this.repository.update(constants_1.COLLECTIONS.repairTickets, id, (0, sanitize_1.sanitizePayload)({
            attachments: [...this.asArray(before.attachments), attachment],
            timeline: [
                ...this.asArray(before.timeline),
                this.timelineEntry("attachment", "Attachment uploaded", request, {
                    filename,
                    contentType: file.mimetype
                })
            ]
        }));
        await this.log(request, "UPLOAD_REPAIR_ATTACHMENT", "repairTickets", id, before, after);
        return after;
    }
    async triageRepairTicket(id, request) {
        const before = await this.findById("repairTickets", id);
        const aiTriage = await this.generateRepairTriage(before);
        const after = await this.repository.update(constants_1.COLLECTIONS.repairTickets, id, (0, sanitize_1.sanitizePayload)({
            aiTriage,
            diagnostics: {
                ...this.asObject(before.diagnostics),
                aiTriageSummary: aiTriage.summary,
                likelyFault: aiTriage.likelyFault,
                recommendedAction: aiTriage.recommendedAction
            },
            timeline: [
                ...this.asArray(before.timeline),
                this.timelineEntry("ai-triage", aiTriage.provider === "heuristic" ? "Heuristic triage generated" : "AI triage generated", request, {
                    provider: aiTriage.provider,
                    confidence: aiTriage.confidence,
                    likelyFault: aiTriage.likelyFault
                })
            ]
        }));
        await this.log(request, "TRIAGE_REPAIRTICKET", "repairTickets", id, before, after);
        return after;
    }
    async listSavedViews(workspace, request) {
        const views = await this.repository.list(constants_1.COLLECTIONS.savedViews, 200);
        return views.filter((view) => {
            const matchesWorkspace = !workspace || view.workspace === workspace;
            const matchesUser = !request?.user?.uid || !view.createdByUid || view.createdByUid === request.user.uid || view.shared === true;
            return matchesWorkspace && matchesUser;
        });
    }
    async listPublishedStories() {
        const stories = await this.repository.list(constants_1.COLLECTIONS.successStories, 100);
        return stories.filter((story) => story.published === true || story.status === "PUBLISHED");
    }
    findById(key, id) {
        return this.repository.findById(configs[key].collection, id);
    }
    async create(key, dto, request) {
        const config = configs[key];
        const payload = (0, sanitize_1.sanitizePayload)({
            ...dto,
            status: dto.status ?? config.defaultStatus,
            priority: dto.priority ?? config.defaultPriority ?? null,
            createdByUid: request.user.uid,
            createdByEmail: request.user.email ?? null
        });
        const record = await this.repository.create(config.collection, payload);
        await this.log(request, `CREATE_${config.resourceType.toUpperCase()}`, config.resourceType, record.id, null, record);
        await this.notify(request, {
            title: `${config.resourceType} record created`,
            message: String(dto.title ?? dto.name ?? dto.summary ?? `New ${config.resourceType} record`),
            category: this.notificationCategory(config.resourceType),
            priority: String(dto.priority ?? config.defaultPriority ?? "MEDIUM"),
            linkedResourceType: config.resourceType,
            linkedResourceId: record.id,
            actionHref: this.resourceHref(config.resourceType)
        });
        return record;
    }
    async update(key, id, dto, request) {
        const config = configs[key];
        const before = await this.findById(key, id);
        const after = await this.repository.update(config.collection, id, (0, sanitize_1.sanitizePayload)(dto));
        await this.log(request, `UPDATE_${config.resourceType.toUpperCase()}`, config.resourceType, id, before, after);
        return after;
    }
    async deleteSavedView(id, request) {
        const before = await this.repository.findById(constants_1.COLLECTIONS.savedViews, id);
        await this.repository.delete(constants_1.COLLECTIONS.savedViews, id);
        await this.log(request, "DELETE_SAVED_VIEW", "savedViews", id, before, null);
        return { id, deleted: true };
    }
    async createNotification(dto, request) {
        return this.create("notifications", {
            ...dto,
            read: dto.read ?? false,
            deliveryStatus: dto.deliveryStatus ?? "IN_APP"
        }, request);
    }
    async markNotification(id, read, request) {
        return this.update("notifications", id, {
            read,
            status: read ? "READ" : "UNREAD",
            readAt: read ? new Date().toISOString() : null
        }, request);
    }
    async retryNotification(id, request) {
        const notification = await this.repository.findById(constants_1.COLLECTIONS.notifications, id);
        await this.integrations.enqueue({
            type: "NOTIFICATION",
            resourceType: "notifications",
            resourceId: id,
            payload: notification
        });
        return this.update("notifications", id, {
            deliveryStatus: "QUEUED",
            attempts: Number(notification.attempts ?? 0) + 1,
            lastError: null
        }, request);
    }
    async publishStory(id, published, request) {
        return this.update("successStories", id, {
            published,
            status: published ? "PUBLISHED" : "DRAFT",
            publishedAt: published ? new Date().toISOString() : null
        }, request);
    }
    async createDeploymentFromDeviceRequest(id, dto, request) {
        const source = await this.repository.findById(constants_1.COLLECTIONS.deviceRequests, id);
        const title = dto.title ?? `${source.organisation ?? source.requesterName ?? "Device request"} deployment`;
        const deployment = await this.create("deployments", {
            title,
            summary: dto.summary ?? source.intendedUse ?? source.notes ?? "Deployment created from device request.",
            sourceType: "deviceRequests",
            sourceId: id,
            deviceRequestId: id,
            status: "PLANNING",
            priority: source.priority ?? "MEDIUM",
            country: source.country ?? null,
            location: source.deploymentLocation ?? null,
            assignedOwner: dto.assignedOwner ?? source.assignedOwner ?? request.user.email ?? null,
            readinessScore: dto.readinessScore ?? this.estimateReadiness(source),
            deviceCount: source.quantity ?? null,
            metadata: { sourceSnapshot: source, ...(typeof dto.metadata === "object" && dto.metadata ? dto.metadata : {}) }
        }, request);
        await this.repository.update(constants_1.COLLECTIONS.deviceRequests, id, (0, sanitize_1.sanitizePayload)({
            status: "RESERVED",
            deploymentType: source.deploymentType ?? "Deployment project",
            metadata: {
                ...(this.asObject(source.metadata)),
                deploymentId: deployment.id,
                convertedAt: new Date().toISOString()
            }
        }));
        return deployment;
    }
    async createRecyclingFromDonation(id, dto, request) {
        const source = await this.repository.findById(constants_1.COLLECTIONS.donations, id);
        const deviceCount = Number(source.deviceCount ?? dto.deviceCount ?? 0);
        const recycling = await this.create("recycling", {
            title: dto.title ?? `${source.organisation ?? source.donorName ?? "Corporate"} recycling intake`,
            summary: dto.summary ?? source.message ?? "Recycling workflow created from donation record.",
            sourceType: "donations",
            sourceId: id,
            donationId: id,
            status: dto.status ?? "COLLECTION_PLANNED",
            processingStage: dto.processingStage ?? "Collection planning",
            priority: source.priority ?? "MEDIUM",
            country: source.country ?? null,
            pickupLocation: dto.pickupLocation ?? source.pickupLocation ?? null,
            deviceCount,
            devicesDiverted: deviceCount,
            estimatedCo2SavedKg: Number(dto.estimatedCo2SavedKg ?? Math.max(deviceCount * 75, 250)),
            assignedOwner: dto.assignedOwner ?? source.assignedOwner ?? request.user.email ?? null,
            metadata: { sourceSnapshot: source, ...(typeof dto.metadata === "object" && dto.metadata ? dto.metadata : {}) }
        }, request);
        await this.repository.update(constants_1.COLLECTIONS.donations, id, (0, sanitize_1.sanitizePayload)({
            status: "COLLECTION_ARRANGED",
            collectionPlan: dto.notes ?? source.collectionPlan ?? "Collection task created in recycling operations.",
            metadata: {
                ...(this.asObject(source.metadata)),
                recyclingId: recycling.id,
                collectionDate: dto.collectionDate ?? null,
                collectionWindow: dto.collectionWindow ?? null
            }
        }));
        return recycling;
    }
    async createSupportTicketFromInventory(id, dto, request) {
        const source = await this.repository.findById(constants_1.COLLECTIONS.inventory, id);
        const ticket = await this.create("supportTickets", {
            title: dto.title ?? `Support for ${source.assetTag ?? source.brand ?? "inventory asset"}`,
            summary: dto.summary ?? dto.message ?? source.notes ?? "Support ticket created from inventory record.",
            sourceType: "inventory",
            sourceId: id,
            inventoryId: id,
            status: dto.status ?? "OPEN",
            priority: dto.priority ?? (source.status === "REPAIR" ? "HIGH" : "MEDIUM"),
            assignedOwner: dto.assignedOwner ?? request.user.email ?? null,
            category: dto.category ?? "Inventory support",
            metadata: { sourceSnapshot: source, ...(typeof dto.metadata === "object" && dto.metadata ? dto.metadata : {}) }
        }, request);
        const history = Array.isArray(source.supportHistory) ? source.supportHistory : [];
        await this.repository.update(constants_1.COLLECTIONS.inventory, id, (0, sanitize_1.sanitizePayload)({
            status: source.status === "DEPLOYED" ? source.status : "REPAIR",
            supportHistory: [
                ...history,
                {
                    note: `Support ticket ${ticket.id} created`,
                    createdAt: new Date().toISOString(),
                    author: request.user.email ?? request.user.uid
                }
            ]
        }));
        return ticket;
    }
    async bookPublicRepair(dto) {
        const statusToken = this.publicStatusToken();
        const issueDescription = dto.issueDescription ?? dto.message ?? dto.notes ?? null;
        const repairCategory = dto.repairCategory ?? dto.category ?? null;
        const repairRoute = dto.repairRoute ?? (dto.mailIn ? "MAIL_IN" : dto.pickupRequested ? "PICKUP_REQUEST" : "DROP_OFF");
        const priority = dto.priority ?? this.priorityFromUrgency(dto.urgency);
        const ticket = await this.repository.create(constants_1.COLLECTIONS.repairTickets, (0, sanitize_1.sanitizePayload)({
            ...dto,
            title: dto.title ?? `${dto.deviceType ?? "Device"} repair booking`,
            summary: dto.summary ?? issueDescription ?? "Public repair booking submitted.",
            message: issueDescription,
            issueDescription,
            repairRoute,
            mailIn: repairRoute === "MAIL_IN" || repairRoute === "Mail-in repair" || dto.mailIn === true,
            pickupRequested: repairRoute === "PICKUP_REQUEST" || repairRoute === "Pickup request" || dto.pickupRequested === true,
            status: "NEW",
            priority,
            sourceType: "publicRepairBooking",
            channel: dto.channel ?? "PUBLIC_FORM",
            slaTargetHours: dto.slaTargetHours ?? this.estimateRepairSla(dto),
            statusTokenHash: this.hashStatusToken(statusToken),
            publicUpdates: [
                {
                    status: "NEW",
                    title: "Repair booking received",
                    message: "Your booking has been received and is waiting for triage.",
                    createdAt: new Date().toISOString()
                }
            ],
            diagnostics: {
                submittedSymptoms: issueDescription,
                category: repairCategory,
                deviceType: dto.deviceType ?? null,
                brand: dto.brand ?? null,
                model: dto.model ?? null,
                assetTag: dto.assetTag ?? null,
                issueStartedAt: dto.issueStartedAt ?? null,
                damagedOrDropped: dto.damagedOrDropped ?? null,
                dataRecoveryNeeded: dto.dataRecoveryNeeded ?? null,
                powersOn: dto.powersOn ?? null,
                purchasedFromSit: dto.purchasedFromSit ?? null,
                urgency: dto.urgency ?? null,
                preferredContactMethod: dto.preferredContactMethod ?? null,
                dataHandlingConsent: dto.dataHandlingConsent ?? null,
                diagnosticAcknowledgement: dto.diagnosticAcknowledgement ?? null
            }
        }));
        await this.integrations.enqueue({
            type: "NOTIFICATION",
            resourceType: "repairTickets",
            resourceId: ticket.id,
            payload: {
                title: "New public repair booking",
                message: dto.message ?? dto.notes ?? "A repair booking was submitted.",
                ticketId: ticket.id
            }
        });
        return {
            id: ticket.id,
            ticketId: ticket.id,
            statusToken,
            status: ticket.status,
            createdAt: ticket.createdAt
        };
    }
    async publicRepairStatus(ticketId, token) {
        const trimmedTicketId = ticketId.trim();
        const trimmedToken = token.trim().toUpperCase();
        if (!trimmedTicketId || !trimmedToken) {
            throw new common_1.NotFoundException("Repair status was not found");
        }
        let ticket;
        try {
            ticket = await this.repository.findById(constants_1.COLLECTIONS.repairTickets, trimmedTicketId);
        }
        catch {
            throw new common_1.NotFoundException("Repair status was not found");
        }
        if (!this.matchesStatusToken(ticket, trimmedToken)) {
            throw new common_1.NotFoundException("Repair status was not found");
        }
        const diagnostics = this.asObject(ticket.diagnostics);
        const status = this.asRepairStatus(ticket.status);
        const repairCategory = this.safeString(ticket.repairCategory ?? ticket.category ?? diagnostics.category);
        const deviceType = this.safeString(ticket.deviceType ?? diagnostics.deviceType);
        const brand = this.safeString(ticket.brand ?? diagnostics.brand);
        const model = this.safeString(ticket.model ?? diagnostics.model);
        const repairRoute = this.safeString(ticket.repairRoute);
        const location = this.safeString(ticket.location);
        const meta = repairStatusMeta[status];
        return {
            id: ticket.id,
            ticketId: ticket.id,
            status,
            publicStatusLabel: meta.label,
            publicMessage: meta.message,
            progressPercent: meta.progress,
            priority: this.safeString(ticket.priority),
            repairCategory,
            deviceType,
            brand,
            model,
            repairRoute,
            location,
            slaTargetHours: this.safeNumber(ticket.slaTargetHours),
            createdAt: this.safeString(ticket.createdAt),
            updatedAt: this.safeString(ticket.updatedAt),
            publicUpdates: Array.isArray(ticket.publicUpdates) ? ticket.publicUpdates : [],
            customerActionRequired: this.publicRepairRequiresAction(status),
            estimatedTurnaround: this.publicRepairTurnaround(status, repairCategory),
            timeline: this.publicRepairTimeline(status, ticket),
            customerActions: this.publicRepairCustomerActions(status),
            nextStep: this.publicRepairNextStep(status, repairCategory)
        };
    }
    async createRepairTicketFromInventory(id, dto, request) {
        const source = await this.repository.findById(constants_1.COLLECTIONS.inventory, id);
        const ticket = await this.create("repairTickets", {
            title: dto.title ?? `Repair ${source.assetTag ?? source.brand ?? "inventory asset"}`,
            summary: dto.summary ?? dto.message ?? source.notes ?? "Repair ticket created from device lifecycle record.",
            sourceType: "inventory",
            sourceId: id,
            inventoryId: id,
            status: dto.status ?? "DIAGNOSTICS",
            priority: dto.priority ?? (source.status === "REPAIR" ? "HIGH" : "MEDIUM"),
            category: dto.category ?? "Diagnostics",
            assignedOwner: dto.assignedOwner ?? request.user.email ?? null,
            slaTargetHours: dto.slaTargetHours ?? this.estimateRepairSla(dto),
            diagnostics: dto.diagnostics ?? {
                deviceType: source.deviceType ?? null,
                visibleIssue: source.notes ?? null
            },
            metadata: { sourceSnapshot: source, ...(typeof dto.metadata === "object" && dto.metadata ? dto.metadata : {}) }
        }, request);
        const history = Array.isArray(source.supportHistory) ? source.supportHistory : [];
        await this.repository.update(constants_1.COLLECTIONS.inventory, id, (0, sanitize_1.sanitizePayload)({
            status: "REPAIR",
            supportHistory: [
                ...history,
                {
                    note: `Repair ticket ${ticket.id} opened`,
                    createdAt: new Date().toISOString(),
                    author: request.user.email ?? request.user.uid
                }
            ],
            lifecycle: {
                ...this.asObject(source.lifecycle),
                lastInspection: new Date().toISOString()
            },
            metadata: {
                ...this.asObject(source.metadata),
                activeRepairTicketId: ticket.id
            }
        }));
        return ticket;
    }
    async createQuoteDraft(id, dto, request) {
        const source = await this.repository.findById(constants_1.COLLECTIONS.deviceRequests, id);
        const quoteDraft = {
            quoteId: `Q-${new Date().getFullYear()}-${id.slice(0, 6).toUpperCase()}`,
            createdAt: new Date().toISOString(),
            createdBy: request.user.email ?? request.user.uid,
            quantity: source.quantity ?? null,
            deviceCategory: source.deviceCategory ?? null,
            estimatedUnitPrice: dto.estimatedUnitPrice ?? null,
            notes: dto.notes ?? "Draft quote created from admin workflow."
        };
        const after = await this.repository.update(constants_1.COLLECTIONS.deviceRequests, id, (0, sanitize_1.sanitizePayload)({
            status: "QUOTED",
            fulfilmentPlan: dto.fulfilmentPlan ?? source.fulfilmentPlan ?? "Quote draft created.",
            metadata: { ...this.asObject(source.metadata), quoteDraft }
        }));
        await this.log(request, "CREATE_QUOTE_DRAFT", "deviceRequests", id, source, after);
        await this.enqueueEmail("deviceRequests", id, { action: "QUOTE_DRAFT_CREATED", quoteDraft, source });
        return after;
    }
    async reserveInventory(id, dto, request) {
        const source = await this.repository.findById(constants_1.COLLECTIONS.deviceRequests, id);
        const requestedCount = Number(source.quantity ?? 1);
        const inventoryIds = Array.isArray(dto.inventoryIds) ? dto.inventoryIds.map(String) : [];
        let reservedCount = 0;
        if (inventoryIds.length) {
            await Promise.all(inventoryIds.map(async (inventoryId) => {
                await this.repository.update(constants_1.COLLECTIONS.inventory, inventoryId, (0, sanitize_1.sanitizePayload)({
                    status: "RESERVED",
                    assignedTo: source.organisation ?? source.requesterName ?? null,
                    metadata: { reservedForRequestId: id, reservedAt: new Date().toISOString() }
                }));
                reservedCount += 1;
            }));
        }
        const after = await this.repository.update(constants_1.COLLECTIONS.deviceRequests, id, (0, sanitize_1.sanitizePayload)({
            status: "RESERVED",
            metadata: {
                ...this.asObject(source.metadata),
                reservationPlan: {
                    reservedAt: new Date().toISOString(),
                    requestedCount,
                    reservedCount,
                    inventoryIds,
                    notes: dto.notes ?? "Reservation workflow completed."
                }
            }
        }));
        await this.log(request, "RESERVE_INVENTORY_FOR_REQUEST", "deviceRequests", id, source, after);
        return after;
    }
    async scheduleCollection(id, dto, request) {
        const recycling = await this.createRecyclingFromDonation(id, dto, request);
        await this.enqueueEmail("donations", id, { action: "COLLECTION_SCHEDULED", recycling });
        return recycling;
    }
    async generateSustainabilityReport(dto, request) {
        const summary = await this.sustainabilitySummary();
        return this.create("sustainabilityReports", {
            title: dto.title ?? `Sustainability report ${new Date().toLocaleDateString("en-GB")}`,
            reportType: dto.reportType ?? "ESTIMATED_REUSE_IMPACT",
            periodStart: dto.periodStart ?? null,
            periodEnd: dto.periodEnd ?? null,
            reportData: summary,
            status: "GENERATED",
            estimatedCo2SavedKg: summary.estimatedCo2SavedKg,
            devicesDiverted: summary.devicesDiverted,
            metadata: dto.metadata ?? null
        }, request);
    }
    async sustainabilitySummary() {
        const [inventory, donations, recycling, repairs, impact] = await Promise.all([
            this.repository.list(constants_1.COLLECTIONS.inventory, 500),
            this.repository.list(constants_1.COLLECTIONS.donations, 500),
            this.repository.list(constants_1.COLLECTIONS.recycling, 500),
            this.repository.list(constants_1.COLLECTIONS.repairTickets, 500),
            this.repository.getSingleton(constants_1.COLLECTIONS.impactStats, "current", {})
        ]);
        const deployed = inventory.filter((item) => item.status === "DEPLOYED").length;
        const repaired = inventory.filter((item) => item.status === "REPAIR").length;
        const retired = inventory.filter((item) => item.status === "RETIRED").length;
        const donatedDevices = donations.reduce((sum, item) => sum + Number(item.deviceCount ?? 0), 0);
        const recycledDevices = recycling.reduce((sum, item) => sum + Number(item.devicesDiverted ?? item.deviceCount ?? 0), 0);
        const completedRepairs = repairs.filter((item) => item.status === "COMPLETED").length;
        const estimatedCo2SavedKg = Math.max(Number(impact.co2SavedKg ?? 0), deployed * 75 + donatedDevices * 50 + completedRepairs * 45 + recycling.reduce((sum, item) => sum + Number(item.estimatedCo2SavedKg ?? 0), 0));
        return {
            devicesReused: deployed,
            devicesOffered: donatedDevices,
            devicesDiverted: Math.max(recycledDevices, donatedDevices + retired),
            repairQueue: repaired,
            completedRepairs,
            retiredAssets: retired,
            estimatedCo2SavedKg,
            circularityScore: Math.min(100, Math.round(((deployed + repaired + donatedDevices) / Math.max(1, inventory.length + donatedDevices)) * 100)),
            generatedAt: new Date().toISOString()
        };
    }
    async search(query) {
        const trimmed = query.trim().toLowerCase();
        if (!trimmed)
            return [];
        const collections = await Promise.all(searchableCollections.map(async (config) => {
            const records = await this.repository.list(config.collection, 50);
            return records
                .filter((record) => JSON.stringify(record).toLowerCase().includes(trimmed))
                .slice(0, 8)
                .map((record) => ({
                id: `${config.collection}-${record.id}`,
                recordId: record.id,
                type: config.label,
                title: String(record.title ?? record.name ?? record.organisation ?? record.requesterName ?? record.donorName ?? record.assetTag ?? record.email ?? record.id),
                summary: String(record.summary ?? record.message ?? record.notes ?? record.status ?? "Matched admin record"),
                status: record.status ?? null,
                href: config.href,
                createdAt: record.createdAt ?? null
            }));
        }));
        return collections.flat().slice(0, 30);
    }
    async seedDefaultStories(request) {
        const existing = await this.repository.list(constants_1.COLLECTIONS.successStories, 5);
        if (existing.length)
            return existing;
        const defaults = [
            {
                title: "Learner device access pathway",
                category: "Learner",
                region: "UK and Africa",
                summary: "A sponsored refurbished laptop helps a learner move from phone-only access to reliable study, practice and portfolio work.",
                metrics: ["1 device reused", "40+ study hours enabled", "Digital skills pathway ready"],
                visualAsset: "/stories/learner-access.svg",
                published: true,
                status: "PUBLISHED"
            },
            {
                title: "Community hub launch",
                category: "Community",
                region: "Community access",
                summary: "A local hub offers digital inclusion sessions, job-search support and guided learning with prepared devices and accessories.",
                metrics: ["24 shared seats", "Remote support route", "Reuse-first equipment"],
                visualAsset: "/stories/community-hub.svg",
                published: true,
                status: "PUBLISHED"
            }
        ];
        const created = [];
        for (const story of defaults) {
            created.push(await this.create("successStories", story, request));
        }
        return created;
    }
    async notify(request, dto) {
        const notification = await this.repository.create(constants_1.COLLECTIONS.notifications, (0, sanitize_1.sanitizePayload)({
            ...dto,
            status: "UNREAD",
            read: false,
            deliveryStatus: "IN_APP",
            createdByUid: request.user.uid,
            createdByEmail: request.user.email ?? null
        }));
        await this.integrations.enqueue({
            type: "NOTIFICATION",
            resourceType: "notifications",
            resourceId: notification.id,
            payload: notification
        });
        return notification;
    }
    async enqueueEmail(resourceType, resourceId, payload) {
        return this.integrations.enqueue({ type: "EMAIL", resourceType, resourceId, payload });
    }
    async log(request, action, resourceType, resourceId, before, after) {
        await this.auditService.log({
            actorUid: request.user.uid,
            actorEmail: request.user.email,
            action,
            resourceType,
            resourceId,
            before,
            after
        });
    }
    resourceHref(resourceType) {
        const explicit = {
            repairTickets: "/admin/repairs",
            repairParts: "/admin/repair-parts",
            repairTechnicians: "/admin/repair-technicians",
            recycling: "/admin/recycling"
        };
        if (explicit[resourceType])
            return explicit[resourceType];
        const match = searchableCollections.find((item) => item.label.toLowerCase().replace(" ", "") === resourceType.toLowerCase());
        if (match)
            return match.href;
        return `/admin/${resourceType.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}`;
    }
    notificationCategory(resourceType) {
        if (/deployment/i.test(resourceType))
            return "Deployment";
        if (/recycling|donation/i.test(resourceType))
            return "Donation";
        if (/support/i.test(resourceType))
            return "Support";
        if (/sustainability/i.test(resourceType))
            return "Sustainability";
        return "System";
    }
    async safeList(collection, limit) {
        try {
            return await this.repository.list(collection, limit);
        }
        catch (error) {
            console.error(`Failed to list ${collection}`, error);
            return [];
        }
    }
    repairSummary(tickets, technicians) {
        const active = tickets.filter((ticket) => this.activeRepairTicket(ticket));
        const awaitingApproval = tickets.filter((ticket) => ["AWAITING_APPROVAL", "ESTIMATE_SENT"].includes(this.repairStatus(ticket.status)));
        const overdue = active.filter((ticket) => {
            const due = this.repairDueAt(ticket);
            return Boolean(due && due.getTime() < Date.now());
        });
        const dueWithin24Hours = active.filter((ticket) => {
            const due = this.repairDueAt(ticket);
            if (!due)
                return false;
            const diff = due.getTime() - Date.now();
            return diff >= 0 && diff <= 24 * 60 * 60 * 1000;
        });
        const blockedByParts = active.filter((ticket) => this.repairStatus(ticket.status) === "WAITING_FOR_PARTS" ||
            this.asArray(ticket.partsRequired).length > 0 ||
            this.asArray(ticket.requiredPartIds).length > 0);
        const techniciansAvailable = technicians.filter((technician) => String(technician.status ?? "AVAILABLE").toUpperCase() === "AVAILABLE");
        return {
            active: active.length,
            awaitingApproval: awaitingApproval.length,
            slaRisk: overdue.length + dueWithin24Hours.length,
            techniciansAvailable: techniciansAvailable.length,
            overdue: overdue.length,
            dueWithin24Hours: dueWithin24Hours.length,
            blockedByParts: blockedByParts.length,
            unassigned: active.filter((ticket) => !this.safeString(ticket.assignedTechnicianId)).length
        };
    }
    repairStatus(value) {
        const normalised = String(value ?? "NEW").toUpperCase().replaceAll(" ", "_");
        const mapped = {
            DIAGNOSING: "DIAGNOSTICS",
            IN_REPAIR: "REPAIR_IN_PROGRESS",
            QA_CHECK: "QUALITY_CHECK",
            READY_FOR_COLLECTION: "READY_FOR_PICKUP",
            READY_FOR_DISPATCH: "READY_FOR_RETURN"
        };
        const candidate = mapped[normalised] ?? normalised;
        return repairStatuses.includes(candidate) ? candidate : "NEW";
    }
    activeRepairTicket(ticket) {
        return !["COMPLETED", "CANCELLED", "UNREPAIRABLE"].includes(this.repairStatus(ticket.status));
    }
    repairDueAt(ticket) {
        const createdAt = this.safeString(ticket.createdAt);
        const slaTargetHours = this.safeNumber(ticket.slaTargetHours);
        if (!createdAt || !slaTargetHours)
            return null;
        const created = new Date(createdAt);
        if (Number.isNaN(created.getTime()))
            return null;
        return new Date(created.getTime() + slaTargetHours * 60 * 60 * 1000);
    }
    repairReference() {
        const year = new Date().getFullYear();
        const number = String((0, crypto_1.randomBytes)(2).readUInt16BE(0) % 10000).padStart(4, "0");
        return `SIT-REP-${year}-${number}`;
    }
    timelineEntry(type, title, request, metadata = {}) {
        return {
            id: (0, crypto_1.randomBytes)(8).toString("hex"),
            type,
            title,
            metadata,
            createdAt: new Date().toISOString(),
            actorUid: request.user.uid,
            actorEmail: request.user.email ?? null
        };
    }
    timelineForUpdate(before, dto, request) {
        const entries = [];
        if (dto.status && this.repairStatus(before.status) !== this.repairStatus(dto.status)) {
            entries.push(this.timelineEntry("status", `Status changed to ${this.repairStatus(dto.status).replaceAll("_", " ")}`, request, {
                from: this.repairStatus(before.status),
                to: this.repairStatus(dto.status)
            }));
        }
        if ("assignedTechnicianId" in dto && before.assignedTechnicianId !== dto.assignedTechnicianId) {
            entries.push(this.timelineEntry("assignment", "Technician assignment updated", request, {
                from: before.assignedTechnicianId ?? null,
                to: dto.assignedTechnicianId ?? null
            }));
        }
        if ("partsRequired" in dto || "requiredPartIds" in dto) {
            entries.push(this.timelineEntry("parts", "Parts requirement updated", request, {
                partsRequired: dto.partsRequired ?? before.partsRequired ?? [],
                requiredPartIds: dto.requiredPartIds ?? before.requiredPartIds ?? []
            }));
        }
        if (dto.internalNotes) {
            entries.push(this.timelineEntry("note", "Internal note added", request, {
                note: dto.internalNotes
            }));
        }
        if (dto.customerCommunication) {
            entries.push(this.timelineEntry("customer-communication", "Customer communication logged", request, {
                communication: dto.customerCommunication
            }));
        }
        if (dto.reuseDecision || dto.warrantyDecision) {
            entries.push(this.timelineEntry("decision", "Warranty or reuse decision updated", request, {
                warrantyDecision: dto.warrantyDecision ?? before.warrantyDecision ?? null,
                reuseDecision: dto.reuseDecision ?? before.reuseDecision ?? null
            }));
        }
        return entries;
    }
    safeFilename(value) {
        const cleaned = value
            .replace(/[/\\?%*:|"<>]/g, "-")
            .replace(/\s+/g, "-")
            .replace(/[^a-zA-Z0-9._-]/g, "")
            .slice(0, 120);
        return cleaned || "repair-attachment";
    }
    async attachmentUrl(file, bucketName, storagePath) {
        try {
            const [url] = await file.getSignedUrl({
                action: "read",
                expires: Date.now() + 365 * 24 * 60 * 60 * 1000
            });
            return url;
        }
        catch {
            return `gs://${bucketName}/${storagePath}`;
        }
    }
    async generateRepairTriage(ticket) {
        const fallback = this.heuristicRepairTriage(ticket);
        const apiKey = this.config.get("OPENAI_API_KEY");
        if (!apiKey)
            return fallback;
        try {
            const model = this.config.get("OPENAI_REPAIR_TRIAGE_MODEL") ?? "gpt-5-mini";
            const response = await fetch("https://api.openai.com/v1/responses", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model,
                    input: [
                        {
                            role: "system",
                            content: "You are a repair operations triage assistant. Return only compact JSON with keys summary, likelyFault, recommendedAction, partsSuggestion, riskFlags, confidence."
                        },
                        {
                            role: "user",
                            content: JSON.stringify({
                                repairReference: ticket.repairReference,
                                status: ticket.status,
                                route: ticket.repairRoute,
                                category: ticket.repairCategory ?? ticket.category,
                                deviceType: ticket.deviceType,
                                symptoms: ticket.issueDescription ?? ticket.summary ?? ticket.message,
                                diagnostics: ticket.diagnostics,
                                warrantyReference: ticket.warrantyReference,
                                partsRequired: ticket.partsRequired
                            })
                        }
                    ],
                    max_output_tokens: 700
                })
            });
            if (!response.ok) {
                throw new Error(`OpenAI triage failed with ${response.status}`);
            }
            const payload = await response.json();
            const text = this.openAiText(payload);
            if (!text)
                return fallback;
            const parsed = JSON.parse(text);
            return (0, sanitize_1.sanitizePayload)({
                summary: this.safeString(parsed.summary) ?? fallback.summary,
                likelyFault: this.safeString(parsed.likelyFault) ?? fallback.likelyFault,
                recommendedAction: this.safeString(parsed.recommendedAction) ?? fallback.recommendedAction,
                partsSuggestion: this.safeString(parsed.partsSuggestion) ?? fallback.partsSuggestion,
                riskFlags: Array.isArray(parsed.riskFlags) ? parsed.riskFlags : fallback.riskFlags,
                confidence: this.safeNumber(parsed.confidence) ?? fallback.confidence,
                provider: "openai",
                model,
                generatedAt: new Date().toISOString()
            });
        }
        catch (error) {
            return {
                ...fallback,
                provider: "heuristic",
                fallbackReason: error instanceof Error ? error.message : "AI triage unavailable"
            };
        }
    }
    heuristicRepairTriage(ticket) {
        const text = `${ticket.repairCategory ?? ""} ${ticket.category ?? ""} ${ticket.issueDescription ?? ""} ${ticket.summary ?? ""} ${ticket.message ?? ""}`.toLowerCase();
        const riskFlags = [];
        if (/data recovery|drive|ssd|storage/.test(text))
            riskFlags.push("Data handling risk");
        if (/liquid|motherboard|logic board|burn|smoke/.test(text))
            riskFlags.push("High complexity repair");
        if (this.repairStatus(ticket.status) === "WAITING_FOR_PARTS")
            riskFlags.push("Blocked by missing parts");
        if (this.repairDueAt(ticket) && this.repairDueAt(ticket).getTime() <= Date.now() + 24 * 60 * 60 * 1000)
            riskFlags.push("SLA risk");
        const likelyFault = /screen|display|panel/.test(text)
            ? "Display assembly or cable fault"
            : /battery|power|charging|adapter/.test(text)
                ? "Power delivery, battery or charger fault"
                : /keyboard|touchpad/.test(text)
                    ? "Input device fault"
                    : /virus|malware|os|windows|software/.test(text)
                        ? "Operating system or software health issue"
                        : /slow|ram|ssd|storage/.test(text)
                            ? "Performance bottleneck or storage health issue"
                            : "General diagnostics required";
        const partsSuggestion = /screen|display|panel/.test(text)
            ? "Check compatible panel, display cable and hinges."
            : /battery|charging/.test(text)
                ? "Check charger, battery, DC jack and board-level power path."
                : /keyboard|touchpad/.test(text)
                    ? "Check replacement keyboard, palmrest or touchpad assembly."
                    : /ram|ssd|slow|storage/.test(text)
                        ? "Check SSD/RAM availability and backup requirements."
                        : "No part reservation recommended until diagnostics confirms fault.";
        return {
            summary: "Heuristic triage prepared from ticket category, symptoms, route and SLA state.",
            likelyFault,
            recommendedAction: riskFlags.includes("Blocked by missing parts")
                ? "Confirm part availability, reserve stock or request purchase before repair work continues."
                : "Run diagnostic checklist, confirm warranty/reuse decision, then prepare estimate or repair action.",
            partsSuggestion,
            riskFlags,
            confidence: 0.62,
            provider: "heuristic",
            generatedAt: new Date().toISOString()
        };
    }
    openAiText(payload) {
        if (typeof payload.output_text === "string")
            return payload.output_text;
        for (const outputItem of this.asArray(payload.output)) {
            const output = this.asObject(outputItem);
            for (const contentItem of this.asArray(output.content)) {
                const content = this.asObject(contentItem);
                if (typeof content.text === "string")
                    return content.text;
            }
        }
        return null;
    }
    estimateReadiness(source) {
        let score = 55;
        if (source.deploymentLocation)
            score += 10;
        if (source.country)
            score += 10;
        if (source.quantity)
            score += 10;
        if (source.requiredBy)
            score += 5;
        if (/lab|africa|school/i.test(`${source.deviceCategory ?? ""} ${source.intendedUse ?? ""}`))
            score += 10;
        return Math.min(95, score);
    }
    estimateRepairSla(source) {
        const text = `${source.category ?? ""} ${source.repairCategory ?? ""} ${source.message ?? ""} ${source.notes ?? ""}`.toLowerCase();
        if (/data recovery|motherboard|liquid|logic board/.test(text))
            return 120;
        if (/screen|battery|keyboard|ssd|ram/.test(text))
            return 72;
        if (/virus|os|software|setup/.test(text))
            return 48;
        return 96;
    }
    priorityFromUrgency(value) {
        const urgency = String(value ?? "").toUpperCase().replaceAll(" ", "_");
        if (urgency === "SCHOOL_LAB_CRITICAL" || urgency === "URGENT")
            return "HIGH";
        return "MEDIUM";
    }
    publicStatusToken() {
        return (0, crypto_1.randomBytes)(6).toString("hex").toUpperCase();
    }
    hashStatusToken(token) {
        return (0, crypto_1.createHash)("sha256").update(token.trim().toUpperCase()).digest("hex");
    }
    matchesStatusToken(ticket, token) {
        const hash = this.safeString(ticket.statusTokenHash);
        if (hash)
            return hash === this.hashStatusToken(token);
        const legacyToken = this.safeString(ticket.customerPortalToken);
        return legacyToken?.toUpperCase() === token.toUpperCase();
    }
    asRepairStatus(value) {
        const status = String(value ?? "NEW").toUpperCase().replaceAll(" ", "_");
        if (status === "DIAGNOSING")
            return "DIAGNOSTICS";
        if (status === "READY_FOR_DISPATCH")
            return "READY_FOR_RETURN";
        return repairStatuses.includes(status) ? status : "NEW";
    }
    publicRepairTimeline(status, ticket) {
        const activeIndex = repairStatuses.indexOf(status);
        const publicUpdates = Array.isArray(ticket.publicUpdates) ? ticket.publicUpdates : [];
        return repairStatuses.map((step, index) => ({
            label: repairStatusMeta[step].label,
            status: step,
            completed: status === "COMPLETED" ? index <= activeIndex : index < activeIndex,
            active: step === status,
            timestamp: this.publicUpdateTimestamp(publicUpdates, step) ?? (step === status ? this.safeString(ticket.updatedAt ?? ticket.createdAt) : null),
            publicNote: this.publicUpdateNote(publicUpdates, step) ?? this.publicRepairStepDescription(step),
            date: this.publicUpdateTimestamp(publicUpdates, step) ?? (step === status ? this.safeString(ticket.updatedAt ?? ticket.createdAt) : null),
            description: this.publicUpdateNote(publicUpdates, step) ?? this.publicRepairStepDescription(step)
        }));
    }
    publicRepairStepDescription(status) {
        const descriptions = {
            NEW: "Your booking has been received and is waiting for triage.",
            TRIAGE: "The repair team is checking the intake details, route and urgency.",
            DIAGNOSTICS: "A technician is checking symptoms, warranty details and likely repair route.",
            ESTIMATE_SENT: "An estimate or warranty route has been prepared for review.",
            AWAITING_APPROVAL: "The repair is paused until approval, parts confirmation or warranty decision.",
            REPAIR_IN_PROGRESS: "The approved repair work is underway.",
            WAITING_FOR_PARTS: "The repair is waiting for parts, compatibility checks or supplier confirmation.",
            QUALITY_CHECK: "The device is being tested before collection, return or deployment.",
            READY_FOR_PICKUP: "The device is ready for pickup or return dispatch.",
            READY_FOR_RETURN: "The device is ready for return dispatch or arranged handover.",
            COMPLETED: "The repair has been completed and closed.",
            CANCELLED: "The repair has been cancelled and no further work is scheduled.",
            UNREPAIRABLE: "The device is not practical to repair and the team will advise reuse, parts or recycling options."
        };
        return descriptions[status];
    }
    publicRepairNextStep(status, category) {
        if (status === "NEW")
            return "The repair team will review your booking and confirm diagnostics.";
        if (status === "TRIAGE")
            return "Triage is underway. We will confirm whether diagnostics, warranty handling or collection planning is next.";
        if (status === "DIAGNOSTICS")
            return "Diagnostics are in progress. We will confirm the estimate or warranty route next.";
        if (status === "ESTIMATE_SENT")
            return "Review the estimate or warranty recommendation before paid work begins.";
        if (status === "AWAITING_APPROVAL")
            return "We are waiting for approval, part confirmation or warranty decision before continuing.";
        if (status === "REPAIR_IN_PROGRESS")
            return "The repair is underway. Quality checks follow once work is complete.";
        if (status === "WAITING_FOR_PARTS")
            return "We will update the ticket when the required part or compatibility decision is confirmed.";
        if (status === "QUALITY_CHECK")
            return "Testing is underway before the device is released.";
        if (status === "READY_FOR_PICKUP")
            return "Arrange pickup, return shipping or handover with the repair team.";
        if (status === "READY_FOR_RETURN")
            return "The device is ready for return dispatch or arranged handover.";
        if (status === "COMPLETED")
            return "No further action is required unless you need aftercare support.";
        if (status === "CANCELLED")
            return "This repair has been cancelled. Submit a new booking if support is still needed.";
        return category ? `We will advise the best next route for this ${category.toLowerCase()} case.` : "We will advise the best next reuse, parts or recycling route.";
    }
    publicRepairRequiresAction(status) {
        return status === "ESTIMATE_SENT" || status === "AWAITING_APPROVAL" || status === "READY_FOR_PICKUP" || status === "READY_FOR_RETURN";
    }
    publicRepairTurnaround(status, category) {
        if (status === "COMPLETED" || status === "CANCELLED" || status === "UNREPAIRABLE")
            return "Closed";
        if (status === "READY_FOR_PICKUP" || status === "READY_FOR_RETURN")
            return "Ready now";
        if (status === "WAITING_FOR_PARTS")
            return "Depends on parts availability";
        if (category && /data recovery/i.test(category))
            return "Assessment-led";
        if (category && /screen|battery|keyboard/i.test(category))
            return "Typically 3-5 working days after parts confirmation";
        if (category && /os|virus|ssd|ram|slow/i.test(category))
            return "Typically 1-3 working days after diagnostics";
        return "Confirmed after diagnostics";
    }
    publicRepairCustomerActions(status) {
        const actions = [
            {
                type: "CONTACT_REPAIR_OPERATIONS",
                label: "Contact repair operations",
                enabled: true,
                href: "/contact",
                description: "Ask for help with this repair ticket."
            },
            {
                type: "BOOK_ANOTHER_REPAIR",
                label: "Book another repair",
                enabled: true,
                href: "/book-repair",
                description: "Create a new tracked repair booking."
            },
            {
                type: "DOWNLOAD_SUMMARY",
                label: "Download repair summary",
                enabled: false,
                href: null,
                description: "Summary downloads will be available when reporting is enabled."
            }
        ];
        if (status === "ESTIMATE_SENT" || status === "AWAITING_APPROVAL") {
            return [
                {
                    type: "APPROVE_ESTIMATE",
                    label: "Approve estimate",
                    enabled: false,
                    href: null,
                    description: "Estimate approval is recorded by repair operations in this version."
                },
                {
                    type: "UPLOAD_INFORMATION",
                    label: "Upload extra information",
                    enabled: false,
                    href: null,
                    description: "Extra upload support is planned for a future customer portal release."
                },
                ...actions
            ];
        }
        return actions;
    }
    publicUpdateTimestamp(updates, status) {
        const match = updates.find((update) => this.asObject(update).status === status);
        return match ? this.safeString(this.asObject(match).createdAt ?? this.asObject(match).timestamp) : null;
    }
    publicUpdateNote(updates, status) {
        const match = updates.find((update) => this.asObject(update).status === status);
        return match ? this.safeString(this.asObject(match).message ?? this.asObject(match).publicNote ?? this.asObject(match).title) : null;
    }
    safeString(value) {
        return typeof value === "string" && value.trim() ? value : null;
    }
    safeNumber(value) {
        if (typeof value === "number" && Number.isFinite(value))
            return value;
        if (typeof value === "string" && value.trim()) {
            const parsed = Number(value);
            return Number.isFinite(parsed) ? parsed : null;
        }
        return null;
    }
    asObject(value) {
        return typeof value === "object" && value !== null && !Array.isArray(value)
            ? value
            : {};
    }
    asArray(value) {
        return Array.isArray(value) ? value : [];
    }
};
exports.EcosystemService = EcosystemService;
exports.EcosystemService = EcosystemService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [firestore_repository_1.FirestoreRepository,
        audit_service_1.AuditService,
        integrations_service_1.EcosystemIntegrationsService,
        firebase_admin_service_1.FirebaseAdminService,
        config_1.ConfigService])
], EcosystemService);
//# sourceMappingURL=ecosystem.service.js.map