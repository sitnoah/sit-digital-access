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
const pdf_lib_1 = require("pdf-lib");
const audit_service_1 = require("../audit/audit.service");
const constants_1 = require("../common/constants");
const firestore_repository_1 = require("../common/firestore/firestore.repository");
const sanitize_1 = require("../common/sanitize");
const firebase_admin_service_1 = require("../firebase/firebase-admin.service");
const integrations_service_1 = require("./integrations.service");
const configs = {
    deployments: { collection: constants_1.COLLECTIONS.deployments, resourceType: "deployments", defaultStatus: "PLANNING", defaultPriority: "MEDIUM" },
    recycling: { collection: constants_1.COLLECTIONS.recycling, resourceType: "recycling", defaultStatus: "INTAKE", defaultPriority: "MEDIUM" },
    recyclingPartners: { collection: constants_1.COLLECTIONS.recyclingPartners, resourceType: "recyclingPartners", defaultStatus: "ACTIVE", defaultPriority: "MEDIUM" },
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
    { label: "Recycling partner", href: "/admin/recycling", collection: constants_1.COLLECTIONS.recyclingPartners },
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
const recyclingStatuses = [
    "INTAKE_CREATED",
    "COLLECTION_SCHEDULED",
    "COLLECTED",
    "SECURE_WIPE_PENDING",
    "SECURE_WIPE_COMPLETE",
    "ASSESSMENT",
    "REFURBISH_APPROVED",
    "RECYCLE_APPROVED",
    "ESG_EVIDENCE_READY",
    "COMPLETED"
];
const supportStatuses = [
    "NEW",
    "OPEN",
    "AWAITING_CUSTOMER",
    "AWAITING_INTERNAL",
    "ESCALATED",
    "RESOLVED",
    "CLOSED"
];
const supportPriorities = ["LOW", "MEDIUM", "HIGH", "URGENT"];
const supportCategories = [
    "GENERAL_ENQUIRY",
    "DEVICE_REQUEST",
    "DONATION_SUPPORT",
    "INVENTORY_ISSUE",
    "REPAIR_SUPPORT",
    "RECYCLING_SUPPORT",
    "DEPLOYMENT_SUPPORT",
    "TRAINING_SUPPORT",
    "ACCOUNT_ACCESS"
];
const trainingStatuses = [
    "DRAFT",
    "RECRUITING",
    "ACTIVE",
    "CERTIFICATION_READY",
    "COMPLETED",
    "ARCHIVED",
    "AT_RISK"
];
const trainingProgrammeTypes = [
    "DIGITAL_LITERACY",
    "AI_LITERACY",
    "CYBERSECURITY_AWARENESS",
    "TEACHER_ENABLEMENT",
    "DEVICE_READINESS",
    "EMPLOYABILITY_SKILLS",
    "REPAIR_TECHNICIAN_TRAINING",
    "COMMUNITY_HUB_TRAINING"
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
    async listRecyclingOperations() {
        const [records, partners] = await Promise.all([
            this.safeList(constants_1.COLLECTIONS.recycling, 500),
            this.safeList(constants_1.COLLECTIONS.recyclingPartners, 200)
        ]);
        return {
            records,
            summary: this.recyclingSummary(records, partners)
        };
    }
    async createRecyclingRecord(dto, request) {
        const status = this.recyclingStatus(dto.status);
        const deviceCount = this.safeNumber(dto.deviceQuantity ?? dto.deviceCount ?? dto.devicesDiverted) ?? 0;
        const estimatedCo2KgAvoided = this.safeNumber(dto.estimatedCo2KgAvoided ?? dto.estimatedCo2SavedKg) ?? Math.round(deviceCount * 50);
        const recyclingReference = this.safeString(dto.recyclingReference) ?? this.recyclingReference();
        const organisation = this.safeString(dto.donorOrganisation ?? dto.organisation ?? dto.customerName) ?? "Corporate donor";
        const timeline = [
            this.timelineEntry("created", "Recycling intake created", request, {
                status,
                recyclingReference,
                source: dto.sourceType ?? "adminRecyclingCommandCentre"
            })
        ];
        return this.create("recycling", {
            ...dto,
            recyclingReference,
            title: dto.title ?? `${organisation} recycling intake`,
            summary: dto.summary ?? `Circular technology intake for ${deviceCount || "multiple"} device(s).`,
            organisation,
            donorOrganisation: dto.donorOrganisation ?? organisation,
            contactPerson: dto.contactPerson ?? dto.customerName ?? null,
            status,
            priority: dto.priority ?? "MEDIUM",
            deviceCount,
            deviceQuantity: deviceCount,
            devicesDiverted: dto.devicesDiverted ?? deviceCount,
            estimatedCo2KgAvoided,
            estimatedCo2SavedKg: dto.estimatedCo2SavedKg ?? estimatedCo2KgAvoided,
            pickupLocation: dto.pickupLocation ?? dto.pickupAddress ?? null,
            collectionRoute: dto.collectionRoute ?? "Corporate pickup",
            processingStage: dto.processingStage ?? this.recyclingStatusLabel(status),
            secureWipeStatus: dto.secureWipeStatus ?? (dto.secureWipeRequired ? "Required" : "Not required"),
            chainOfCustodyLog: dto.chainOfCustodyLog ?? (dto.chainOfCustodyRequired ? [
                this.timelineEntry("chain-of-custody", "Chain of custody required", request, {
                    recyclingReference
                })
            ] : []),
            secureWipeChecklist: dto.secureWipeChecklist ?? this.defaultSecureWipeChecklist(dto),
            timeline,
            sourceType: dto.sourceType ?? "adminRecyclingCommandCentre",
            channel: dto.channel ?? "ADMIN_FORM"
        }, request);
    }
    async updateRecyclingRecord(id, dto, request) {
        const before = await this.repository.findById(constants_1.COLLECTIONS.recycling, id);
        const nextStatus = dto.status ? this.recyclingStatus(dto.status) : undefined;
        const timeline = this.recyclingTimelineForUpdate(before, {
            ...dto,
            ...(nextStatus ? { status: nextStatus } : {})
        }, request);
        const updatePayload = {
            ...dto,
            ...(nextStatus ? {
                status: nextStatus,
                processingStage: dto.processingStage ?? this.recyclingStatusLabel(nextStatus)
            } : {}),
            ...(timeline.length ? { timeline: [...this.asArray(before.timeline), ...timeline] } : {})
        };
        const after = await this.repository.update(constants_1.COLLECTIONS.recycling, id, (0, sanitize_1.sanitizePayload)(updatePayload));
        await this.log(request, "UPDATE_RECYCLING", "recycling", id, before, after);
        return after;
    }
    async uploadRecyclingAttachment(id, file, dto, request) {
        if (!file?.buffer?.length) {
            throw new common_1.BadRequestException("A recycling evidence file is required.");
        }
        const before = await this.repository.findById(constants_1.COLLECTIONS.recycling, id);
        const bucket = this.firebaseAdmin.storage.bucket();
        const filename = this.safeFilename(file.originalname);
        const storagePath = `recycling-evidence/${id}/${Date.now()}-${filename}`;
        const storageFile = bucket.file(storagePath);
        await storageFile.save(file.buffer, {
            resumable: false,
            metadata: {
                contentType: file.mimetype,
                metadata: {
                    evidenceType: this.safeString(dto.evidenceType) ?? "ESG_EVIDENCE",
                    uploadedByUid: request.user.uid,
                    uploadedByEmail: request.user.email ?? ""
                }
            }
        });
        const downloadUrl = await this.attachmentUrl(storageFile, bucket.name, storagePath);
        const attachment = (0, sanitize_1.sanitizePayload)({
            id: (0, crypto_1.randomBytes)(8).toString("hex"),
            evidenceType: this.safeString(dto.evidenceType) ?? "ESG_EVIDENCE",
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
        const after = await this.repository.update(constants_1.COLLECTIONS.recycling, id, (0, sanitize_1.sanitizePayload)({
            attachments: [...this.asArray(before.attachments), attachment],
            timeline: [
                ...this.asArray(before.timeline),
                this.timelineEntry("evidence", "ESG evidence uploaded", request, {
                    filename,
                    evidenceType: attachment.evidenceType
                })
            ]
        }));
        await this.log(request, "UPLOAD_RECYCLING_EVIDENCE", "recycling", id, before, after);
        return after;
    }
    async recommendRecyclingRoute(id, request) {
        const before = await this.repository.findById(constants_1.COLLECTIONS.recycling, id);
        const recommendation = await this.generateRecyclingRecommendation(before);
        const after = await this.repository.update(constants_1.COLLECTIONS.recycling, id, (0, sanitize_1.sanitizePayload)({
            aiRecommendation: recommendation,
            reuseRecycleDecision: recommendation.recommendation,
            refurbishmentCostEstimate: recommendation.refurbishmentCostEstimate,
            partsValueEstimate: recommendation.partsValueEstimate,
            africaDeploymentSuitability: recommendation.africaDeploymentSuitability,
            timeline: [
                ...this.asArray(before.timeline),
                this.timelineEntry("reuse-recycle-recommendation", recommendation.provider === "heuristic" ? "Heuristic reuse/recycle recommendation generated" : "AI reuse/recycle recommendation generated", request, {
                    provider: recommendation.provider,
                    recommendation: recommendation.recommendation,
                    confidence: recommendation.confidence
                })
            ]
        }));
        await this.log(request, "RECOMMEND_RECYCLING_ROUTE", "recycling", id, before, after);
        return after;
    }
    async generateRecyclingReportPack(id, dto, request) {
        const before = await this.repository.findById(constants_1.COLLECTIONS.recycling, id);
        const csv = this.recyclingReportCsv(before);
        const pdfBytes = await this.recyclingReportPdf(before);
        const bucket = this.firebaseAdmin.storage.bucket();
        const stamp = Date.now();
        const reference = this.safeString(before.recyclingReference) ?? id;
        const pdfPath = `recycling-report-packs/${id}/${stamp}-${reference}.pdf`;
        const csvPath = `recycling-report-packs/${id}/${stamp}-${reference}.csv`;
        const pdfFile = bucket.file(pdfPath);
        const csvFile = bucket.file(csvPath);
        await pdfFile.save(Buffer.from(pdfBytes), {
            resumable: false,
            metadata: {
                contentType: "application/pdf",
                metadata: {
                    generatedByUid: request.user.uid,
                    generatedByEmail: request.user.email ?? ""
                }
            }
        });
        await csvFile.save(Buffer.from(csv, "utf8"), {
            resumable: false,
            metadata: {
                contentType: "text/csv",
                metadata: {
                    generatedByUid: request.user.uid,
                    generatedByEmail: request.user.email ?? ""
                }
            }
        });
        const pdfUrl = await this.attachmentUrl(pdfFile, bucket.name, pdfPath);
        const csvUrl = await this.attachmentUrl(csvFile, bucket.name, csvPath);
        const generatedAt = new Date().toISOString();
        const reportPack = (0, sanitize_1.sanitizePayload)({
            id: (0, crypto_1.randomBytes)(8).toString("hex"),
            title: dto.title ?? `${reference} donor ESG report pack`,
            generatedAt,
            generatedByUid: request.user.uid,
            generatedByEmail: request.user.email ?? null,
            pdf: {
                filename: `${reference}.pdf`,
                contentType: "application/pdf",
                storagePath: pdfPath,
                downloadUrl: pdfUrl
            },
            csv: {
                filename: `${reference}.csv`,
                contentType: "text/csv",
                storagePath: csvPath,
                downloadUrl: csvUrl
            }
        });
        const sustainabilityReport = await this.create("sustainabilityReports", {
            title: dto.title ?? `${reference} donor ESG report pack`,
            reportType: "RECYCLING_DONOR_PACK",
            reportData: {
                recyclingRecordId: id,
                recyclingReference: before.recyclingReference ?? null,
                organisation: before.organisation ?? before.donorOrganisation ?? null,
                devicesDiverted: before.devicesDiverted ?? before.deviceCount ?? 0,
                estimatedCo2KgAvoided: before.estimatedCo2KgAvoided ?? before.estimatedCo2SavedKg ?? 0,
                status: before.status ?? null
            },
            reportPack,
            recyclingId: id,
            status: "GENERATED",
            estimatedCo2SavedKg: before.estimatedCo2KgAvoided ?? before.estimatedCo2SavedKg ?? 0,
            devicesDiverted: before.devicesDiverted ?? before.deviceCount ?? 0
        }, request);
        const after = await this.repository.update(constants_1.COLLECTIONS.recycling, id, (0, sanitize_1.sanitizePayload)({
            reportPacks: [...this.asArray(before.reportPacks), reportPack],
            sustainabilityReportId: sustainabilityReport.id,
            status: this.recyclingStatus(before.status) === "COMPLETED" ? "COMPLETED" : "ESG_EVIDENCE_READY",
            processingStage: "ESG evidence ready",
            timeline: [
                ...this.asArray(before.timeline),
                this.timelineEntry("report-pack", "Donor ESG report pack generated", request, {
                    reportPackId: reportPack.id,
                    sustainabilityReportId: sustainabilityReport.id,
                    pdfPath,
                    csvPath
                })
            ]
        }));
        await this.log(request, "GENERATE_RECYCLING_REPORT_PACK", "recycling", id, before, after);
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
        return stories
            .filter((story) => this.successStoryStatus(story.status, story.published) === "PUBLISHED")
            .map((story) => this.enrichSuccessStory(story));
    }
    async listSuccessStoryOperations() {
        const stories = (await this.safeList(constants_1.COLLECTIONS.successStories, 500))
            .map((story) => this.enrichSuccessStory(story));
        return {
            stories,
            summary: this.successStorySummary(stories)
        };
    }
    async createSuccessStoryRecord(dto, request) {
        const title = this.safeString(dto.title ?? dto.name) ?? "Untitled success story";
        const storyType = this.successStoryType(dto.type ?? dto.storyType ?? dto.category);
        const status = this.successStoryStatus(dto.status, dto.published);
        const mediaUrls = this.storyMediaUrls(dto);
        const body = this.safeString(dto.body ?? dto.fullStory ?? dto.message ?? dto.description ?? dto.summary) ?? "";
        const devicesProvided = this.safeNumber(dto.devicesProvided ?? dto.deviceCount ?? dto.devicesDelivered) ?? 0;
        const payload = {
            ...dto,
            title,
            name: title,
            slug: this.safeString(dto.slug) ?? this.storySlug(title),
            type: storyType,
            storyType,
            category: dto.category ?? this.successStoryTypeLabel(storyType),
            status,
            published: status === "PUBLISHED",
            featured: dto.featured === true,
            consentConfirmed: dto.consentConfirmed === true,
            summary: dto.summary ?? body.slice(0, 240),
            body,
            fullStory: dto.fullStory ?? body,
            devicesProvided,
            deviceCount: dto.deviceCount ?? devicesProvided,
            mediaUrls,
            visualAsset: dto.visualAsset ?? mediaUrls[0] ?? null,
            tags: this.asArray(dto.tags).map(String),
            skillsGained: this.asArray(dto.skillsGained).map(String),
            timeline: [
                this.timelineEntry("created", "Success story created", request, {
                    status,
                    storyType,
                    source: dto.sourceType ?? "impactStoryPublishingStudio"
                })
            ]
        };
        const story = await this.create("successStories", payload, request);
        return this.enrichSuccessStory(story);
    }
    async updateSuccessStoryRecord(id, dto, request) {
        const before = await this.repository.findById(constants_1.COLLECTIONS.successStories, id);
        const storyType = "type" in dto || "storyType" in dto || "category" in dto
            ? this.successStoryType(dto.type ?? dto.storyType ?? dto.category)
            : undefined;
        const status = "status" in dto || "published" in dto
            ? this.successStoryStatus(dto.status ?? before.status, dto.published ?? before.published)
            : undefined;
        const timeline = [
            ...this.asArray(before.timeline),
            ...this.successStoryTimelineForUpdate(before, dto, request)
        ];
        const mediaUrls = "mediaUrls" in dto || "visualAsset" in dto ? this.storyMediaUrls({ ...before, ...dto }) : undefined;
        const title = this.safeString(dto.title ?? dto.name);
        const body = this.safeString(dto.body ?? dto.fullStory ?? dto.message ?? dto.description);
        const devicesProvided = this.safeNumber(dto.devicesProvided ?? dto.deviceCount ?? dto.devicesDelivered);
        const payload = (0, sanitize_1.sanitizePayload)({
            ...dto,
            ...(title ? { title, name: title, slug: this.safeString(dto.slug) ?? before.slug ?? this.storySlug(title) } : {}),
            ...(storyType ? { type: storyType, storyType, category: dto.category ?? this.successStoryTypeLabel(storyType) } : {}),
            ...(status ? { status, published: status === "PUBLISHED", publishedAt: status === "PUBLISHED" ? before.publishedAt ?? new Date().toISOString() : null } : {}),
            ...(body ? { body, fullStory: dto.fullStory ?? body } : {}),
            ...(devicesProvided !== null ? { devicesProvided, deviceCount: dto.deviceCount ?? devicesProvided } : {}),
            ...(mediaUrls ? { mediaUrls, visualAsset: dto.visualAsset ?? mediaUrls[0] ?? before.visualAsset ?? null } : {}),
            ...(dto.tags ? { tags: this.asArray(dto.tags).map(String) } : {}),
            ...(dto.skillsGained ? { skillsGained: this.asArray(dto.skillsGained).map(String) } : {}),
            timeline
        });
        const after = await this.repository.update(constants_1.COLLECTIONS.successStories, id, payload);
        await this.log(request, "UPDATE_SUCCESSSTORIES", "successStories", id, before, after);
        return this.enrichSuccessStory(after);
    }
    async deleteSuccessStory(id, request) {
        const before = await this.repository.findById(constants_1.COLLECTIONS.successStories, id);
        await this.repository.delete(constants_1.COLLECTIONS.successStories, id);
        await this.log(request, "DELETE_SUCCESSSTORIES", "successStories", id, before, null);
        return { id, deleted: true };
    }
    async featureStory(id, featured, request) {
        const before = await this.repository.findById(constants_1.COLLECTIONS.successStories, id);
        const timeline = [
            ...this.asArray(before.timeline),
            this.timelineEntry(featured ? "featured" : "unfeatured", featured ? "Story featured" : "Story removed from featured set", request)
        ];
        const after = await this.repository.update(constants_1.COLLECTIONS.successStories, id, (0, sanitize_1.sanitizePayload)({ featured, timeline }));
        await this.log(request, featured ? "FEATURE_SUCCESSSTORY" : "UNFEATURE_SUCCESSSTORY", "successStories", id, before, after);
        return this.enrichSuccessStory(after);
    }
    async generateSuccessStoryDraft(dto, request) {
        const fallback = this.heuristicSuccessStoryDraft(dto);
        const apiKey = this.config.get("OPENAI_API_KEY");
        if (!apiKey)
            return fallback;
        try {
            const model = this.config.get("OPENAI_SUCCESS_STORY_MODEL")
                ?? this.config.get("OPENAI_REPAIR_TRIAGE_MODEL")
                ?? "gpt-5-mini";
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
                            content: "You are an impact storytelling editor for a digital inclusion charity. Return only compact JSON with keys title, summary, body, quote, socialPost, tags."
                        },
                        {
                            role: "user",
                            content: JSON.stringify({
                                deploymentId: dto.deploymentId,
                                donationId: dto.donationId ?? dto.deviceDonationId,
                                trainingCohortId: dto.trainingCohortId,
                                beneficiaryType: dto.beneficiaryType,
                                tone: dto.tone,
                                region: dto.region,
                                country: dto.country,
                                devicesProvided: dto.devicesProvided,
                                outcome: dto.outcome,
                                notes: dto.notes ?? dto.summary
                            })
                        }
                    ],
                    max_output_tokens: 900
                })
            });
            if (!response.ok) {
                throw new Error(`OpenAI story draft failed with ${response.status}`);
            }
            const payload = await response.json();
            const text = this.openAiText(payload);
            if (!text)
                return fallback;
            const parsed = JSON.parse(text);
            return (0, sanitize_1.sanitizePayload)({
                title: this.safeString(parsed.title) ?? fallback.title,
                summary: this.safeString(parsed.summary) ?? fallback.summary,
                body: this.safeString(parsed.body) ?? fallback.body,
                quote: this.safeString(parsed.quote) ?? fallback.quote,
                socialPost: this.safeString(parsed.socialPost) ?? fallback.socialPost,
                tags: Array.isArray(parsed.tags) ? parsed.tags.map(String) : fallback.tags,
                tone: this.safeString(dto.tone) ?? fallback.tone,
                provider: "openai",
                model,
                generatedAt: new Date().toISOString(),
                actorEmail: request.user.email ?? null
            });
        }
        catch (error) {
            return {
                ...fallback,
                provider: "heuristic",
                fallbackReason: error instanceof Error ? error.message : "AI story draft unavailable"
            };
        }
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
        return this.updateSuccessStoryRecord(id, {
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
        const ticket = await this.createSupportTicketRecord({
            ...dto,
            title: dto.title ?? `Support for ${source.assetTag ?? source.brand ?? "inventory asset"}`,
            subject: dto.subject ?? dto.title ?? `Support for ${source.assetTag ?? source.brand ?? "inventory asset"}`,
            summary: dto.summary ?? dto.message ?? source.notes ?? "Support ticket created from inventory record.",
            description: dto.description ?? dto.message ?? source.notes ?? "Support ticket created from inventory record.",
            sourceType: "inventory",
            sourceId: id,
            inventoryId: id,
            linkedInventoryId: id,
            status: dto.status ?? "OPEN",
            priority: dto.priority ?? (source.status === "REPAIR" ? "HIGH" : "MEDIUM"),
            assignedOwner: dto.assignedOwner ?? request.user.email ?? null,
            assignedTo: dto.assignedTo ?? dto.assignedOwner ?? request.user.email ?? null,
            category: dto.category ?? "INVENTORY_ISSUE",
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
    async listSupportOperations() {
        const settled = await Promise.allSettled([
            this.repository.list(constants_1.COLLECTIONS.supportTickets, 500),
            this.repository.list(constants_1.COLLECTIONS.inventory, 500),
            this.repository.list(constants_1.COLLECTIONS.repairTickets, 500),
            this.repository.list(constants_1.COLLECTIONS.deployments, 500)
        ]);
        const value = (index, fallback) => settled[index].status === "fulfilled" ? settled[index].value : fallback;
        const tickets = value(0, []).map((ticket) => this.enrichSupportTicket(ticket));
        return {
            tickets,
            summary: this.supportSummary(tickets, value(1, []), value(2, []), value(3, []))
        };
    }
    async getSupportTicket(id) {
        return this.enrichSupportTicket(await this.repository.findById(constants_1.COLLECTIONS.supportTickets, id));
    }
    async createSupportTicketRecord(dto, request) {
        const reference = this.safeString(dto.reference ?? dto.supportReference) ?? this.supportReference();
        const subject = this.safeString(dto.subject ?? dto.title ?? dto.name) ?? "Support ticket";
        const description = this.safeString(dto.description ?? dto.message ?? dto.summary ?? dto.notes) ?? "";
        const status = this.supportStatus(dto.status);
        const priority = this.supportPriority(dto.priority);
        const category = this.supportCategory(dto.category);
        const requesterName = this.safeString(dto.requesterName ?? dto.customerName ?? dto.name) ?? "Unknown requester";
        const requesterEmail = this.safeString(dto.requesterEmail ?? dto.email);
        const requesterPhone = this.safeString(dto.requesterPhone ?? dto.phone);
        const assignedTo = this.safeString(dto.assignedTo ?? dto.assignedOwner ?? dto.owner);
        const internalNotes = this.supportNoteLog([], dto.internalNote ?? dto.internalNotes, request);
        const now = new Date().toISOString();
        return this.enrichSupportTicket(await this.create("supportTickets", {
            ...dto,
            reference,
            supportReference: reference,
            title: subject,
            subject,
            name: subject,
            requesterName,
            customerName: dto.customerName ?? requesterName,
            requesterEmail,
            email: dto.email ?? requesterEmail,
            requesterPhone,
            phone: dto.phone ?? requesterPhone,
            category,
            priority,
            status,
            channel: this.safeString(dto.channel) ?? "ADMIN",
            description,
            summary: dto.summary ?? description.slice(0, 240),
            message: dto.message ?? description,
            assignedTo,
            assignedOwner: dto.assignedOwner ?? assignedTo ?? null,
            linkedInventoryId: dto.linkedInventoryId ?? dto.inventoryId ?? null,
            linkedRepairTicketId: dto.linkedRepairTicketId ?? dto.repairTicketId ?? null,
            linkedDonationId: dto.linkedDonationId ?? dto.donationId ?? null,
            linkedDeploymentId: dto.linkedDeploymentId ?? dto.deploymentId ?? null,
            slaDueAt: dto.slaDueAt ?? this.supportSlaDueAt(dto),
            lastActivityAt: dto.lastActivityAt ?? now,
            internalNoteLog: internalNotes,
            timeline: [
                this.timelineEntry("created", "Support ticket created", request, {
                    reference,
                    status,
                    priority,
                    category
                }),
                ...(internalNotes.length ? [this.timelineEntry("internal-note", "Internal note added", request)] : [])
            ]
        }, request));
    }
    async updateSupportTicketRecord(id, dto, request) {
        const before = await this.repository.findById(constants_1.COLLECTIONS.supportTickets, id);
        const timeline = [
            ...this.asArray(before.timeline),
            ...this.supportTimelineForUpdate(before, dto, request)
        ];
        const internalNoteLog = this.supportNoteLog(this.asArray(before.internalNoteLog ?? before.internalNotes), dto.internalNote, request);
        const subject = this.safeString(dto.subject ?? dto.title);
        const description = this.safeString(dto.description ?? dto.message ?? dto.summary);
        const status = "status" in dto ? this.supportStatus(dto.status) : undefined;
        const priority = "priority" in dto ? this.supportPriority(dto.priority) : undefined;
        const category = "category" in dto ? this.supportCategory(dto.category) : undefined;
        const assignedTo = this.safeString(dto.assignedTo ?? dto.assignedOwner ?? dto.owner);
        const after = await this.repository.update(constants_1.COLLECTIONS.supportTickets, id, (0, sanitize_1.sanitizePayload)({
            ...dto,
            ...(subject ? { subject, title: subject, name: subject } : {}),
            ...(description ? { description, message: dto.message ?? description, summary: dto.summary ?? description.slice(0, 240) } : {}),
            ...(status ? { status } : {}),
            ...(priority ? { priority } : {}),
            ...(category ? { category } : {}),
            ...(assignedTo ? { assignedTo, assignedOwner: dto.assignedOwner ?? assignedTo } : {}),
            ...(dto.requesterName ? { customerName: dto.requesterName } : {}),
            ...(dto.requesterEmail ? { email: dto.requesterEmail } : {}),
            ...(dto.requesterPhone ? { phone: dto.requesterPhone } : {}),
            ...(dto.linkedInventoryId || dto.inventoryId ? { linkedInventoryId: dto.linkedInventoryId ?? dto.inventoryId } : {}),
            ...(dto.linkedRepairTicketId || dto.repairTicketId ? { linkedRepairTicketId: dto.linkedRepairTicketId ?? dto.repairTicketId } : {}),
            ...(dto.linkedDonationId || dto.donationId ? { linkedDonationId: dto.linkedDonationId ?? dto.donationId } : {}),
            ...(dto.linkedDeploymentId || dto.deploymentId ? { linkedDeploymentId: dto.linkedDeploymentId ?? dto.deploymentId } : {}),
            lastActivityAt: new Date().toISOString(),
            internalNoteLog,
            timeline
        }));
        await this.log(request, "UPDATE_SUPPORTTICKETS", "supportTickets", id, before, after);
        return this.enrichSupportTicket(after);
    }
    async assignSupportTicket(id, dto, request) {
        const assignedTo = this.safeString(dto.assignedTo ?? dto.assignedOwner ?? dto.owner);
        if (!assignedTo)
            throw new common_1.BadRequestException("An assignee is required.");
        return this.updateSupportTicketRecord(id, {
            assignedTo,
            assignedOwner: assignedTo,
            status: dto.status ?? "OPEN",
            internalNote: dto.internalNote ?? `Assigned to ${assignedTo}.`
        }, request);
    }
    async escalateSupportTicket(id, dto, request) {
        return this.updateSupportTicketRecord(id, {
            ...dto,
            status: "ESCALATED",
            priority: dto.priority ?? "URGENT",
            internalNote: dto.internalNote ?? "Ticket escalated for operational review."
        }, request);
    }
    async closeSupportTicket(id, dto, request) {
        return this.updateSupportTicketRecord(id, {
            ...dto,
            status: "CLOSED",
            closedAt: new Date().toISOString(),
            internalNote: dto.internalNote ?? "Ticket closed."
        }, request);
    }
    async linkSupportRecord(id, dto, request) {
        const recordType = this.safeString(dto.linkRecordType ?? dto.linkedResourceType ?? dto.resourceType);
        const recordId = this.safeString(dto.linkRecordId ?? dto.linkedResourceId ?? dto.resourceId);
        if (!recordType || !recordId)
            throw new common_1.BadRequestException("A record type and record id are required.");
        const keyByType = {
            inventory: "linkedInventoryId",
            inventoryitem: "linkedInventoryId",
            repair: "linkedRepairTicketId",
            repairticket: "linkedRepairTicketId",
            donation: "linkedDonationId",
            deployment: "linkedDeploymentId"
        };
        const key = keyByType[recordType.toLowerCase().replace(/[^a-z]/g, "")];
        if (!key)
            throw new common_1.BadRequestException("Unsupported linked record type.");
        return this.updateSupportTicketRecord(id, {
            [key]: recordId,
            internalNote: dto.internalNote ?? `Linked ${recordType} record ${recordId}.`
        }, request);
    }
    async listTrainingCohortOperations() {
        const cohorts = (await this.safeList(constants_1.COLLECTIONS.trainingCohorts, 500))
            .map((cohort) => this.enrichTrainingCohort(cohort));
        return {
            cohorts,
            summary: this.trainingCohortSummary(cohorts)
        };
    }
    async getTrainingCohort(id) {
        return this.enrichTrainingCohort(await this.repository.findById(constants_1.COLLECTIONS.trainingCohorts, id));
    }
    async createTrainingCohortRecord(dto, request) {
        const name = this.safeString(dto.name ?? dto.title ?? dto.cohortName) ?? "Training cohort";
        const status = this.trainingStatus(dto.status);
        const programmeType = this.trainingProgrammeType(dto.programmeType ?? dto.trainingPathway);
        const learnerRegister = this.trainingLearners(this.asArray(dto.learnerRegister));
        const enrolledLearners = this.safeNumber(dto.enrolledLearners ?? dto.learnerCount) ?? learnerRegister.length;
        const targetLearners = this.safeNumber(dto.targetLearners ?? dto.learnerCount) ?? Math.max(enrolledLearners, 0);
        const attendanceRate = this.safeNumber(dto.attendanceRate) ?? this.averageLearnerMetric(learnerRegister, "attendanceRate");
        const completionRate = this.safeNumber(dto.completionRate) ?? this.averageLearnerMetric(learnerRegister, "completionRate");
        const readiness = this.trainingCertificationReadiness({
            ...dto,
            learnerRegister,
            enrolledLearners,
            attendanceRate,
            completionRate
        });
        return this.enrichTrainingCohort(await this.create("trainingCohorts", {
            ...dto,
            name,
            title: name,
            cohortName: name,
            programmeType,
            trainingPathway: dto.trainingPathway ?? this.trainingProgrammeTypeLabel(programmeType),
            audience: this.safeString(dto.audience) ?? "Students",
            deliveryMode: this.trainingDeliveryMode(dto.deliveryMode),
            status: status === "CERTIFICATION_READY" ? "CERTIFICATION_READY" : status,
            targetLearners,
            enrolledLearners,
            learnerCount: dto.learnerCount ?? enrolledLearners,
            learnerRegister,
            attendanceRate,
            completionRate,
            certificationEnabled: dto.certificationEnabled === true,
            attendanceTrackingEnabled: dto.attendanceTrackingEnabled === true,
            certificationReadiness: this.safeNumber(dto.certificationReadiness) ?? readiness.score,
            certificationChecklist: dto.certificationChecklist ?? readiness.checklist,
            owner: dto.owner ?? dto.assignedOwner ?? request.user.email ?? null,
            assignedOwner: dto.assignedOwner ?? dto.owner ?? request.user.email ?? null,
            timeline: [
                this.timelineEntry("created", "Training cohort created", request, {
                    status,
                    programmeType,
                    targetLearners
                })
            ]
        }, request));
    }
    async updateTrainingCohortRecord(id, dto, request) {
        const before = await this.repository.findById(constants_1.COLLECTIONS.trainingCohorts, id);
        const merged = { ...before, ...dto };
        const learnerRegister = "learnerRegister" in dto
            ? this.trainingLearners(this.asArray(dto.learnerRegister))
            : this.trainingLearners(this.asArray(before.learnerRegister));
        const attendanceRate = this.safeNumber(dto.attendanceRate) ?? this.safeNumber(before.attendanceRate) ?? this.averageLearnerMetric(learnerRegister, "attendanceRate");
        const completionRate = this.safeNumber(dto.completionRate) ?? this.safeNumber(before.completionRate) ?? this.averageLearnerMetric(learnerRegister, "completionRate");
        const readiness = this.trainingCertificationReadiness({
            ...merged,
            learnerRegister,
            attendanceRate,
            completionRate,
            enrolledLearners: dto.enrolledLearners ?? before.enrolledLearners ?? learnerRegister.length
        });
        const timeline = this.trainingTimelineForUpdate(before, dto, request);
        const name = this.safeString(dto.name ?? dto.title ?? dto.cohortName);
        const after = await this.repository.update(constants_1.COLLECTIONS.trainingCohorts, id, (0, sanitize_1.sanitizePayload)({
            ...dto,
            ...(name ? { name, title: name, cohortName: name } : {}),
            ...(dto.status ? { status: this.trainingStatus(dto.status) } : {}),
            ...(dto.programmeType || dto.trainingPathway ? {
                programmeType: this.trainingProgrammeType(dto.programmeType ?? dto.trainingPathway),
                trainingPathway: dto.trainingPathway ?? this.trainingProgrammeTypeLabel(this.trainingProgrammeType(dto.programmeType))
            } : {}),
            ...(dto.deliveryMode ? { deliveryMode: this.trainingDeliveryMode(dto.deliveryMode) } : {}),
            learnerRegister,
            enrolledLearners: this.safeNumber(dto.enrolledLearners) ?? this.safeNumber(before.enrolledLearners) ?? learnerRegister.length,
            learnerCount: dto.learnerCount ?? dto.enrolledLearners ?? before.learnerCount ?? learnerRegister.length,
            attendanceRate,
            completionRate,
            certificationReadiness: this.safeNumber(dto.certificationReadiness) ?? readiness.score,
            certificationChecklist: dto.certificationChecklist ?? readiness.checklist,
            ...(timeline.length ? { timeline: [...this.asArray(before.timeline), ...timeline] } : {})
        }));
        await this.log(request, "UPDATE_TRAININGCOHORTS", "trainingCohorts", id, before, after);
        return this.enrichTrainingCohort(after);
    }
    async importTrainingLearners(id, file, request) {
        if (!file?.buffer?.length) {
            throw new common_1.BadRequestException("A learner CSV file is required.");
        }
        const before = await this.repository.findById(constants_1.COLLECTIONS.trainingCohorts, id);
        const imported = this.parseTrainingLearnerCsv(file.buffer.toString("utf8"));
        if (!imported.length) {
            throw new common_1.BadRequestException("No learners were found in the CSV file.");
        }
        const learnerRegister = [
            ...this.trainingLearners(this.asArray(before.learnerRegister)),
            ...imported
        ];
        const attendanceRate = this.averageLearnerMetric(learnerRegister, "attendanceRate");
        const completionRate = this.averageLearnerMetric(learnerRegister, "completionRate");
        const readiness = this.trainingCertificationReadiness({
            ...before,
            learnerRegister,
            enrolledLearners: learnerRegister.length,
            attendanceRate,
            completionRate
        });
        const after = await this.repository.update(constants_1.COLLECTIONS.trainingCohorts, id, (0, sanitize_1.sanitizePayload)({
            learnerRegister,
            enrolledLearners: learnerRegister.length,
            learnerCount: learnerRegister.length,
            attendanceRate,
            completionRate,
            certificationReadiness: readiness.score,
            certificationChecklist: readiness.checklist,
            timeline: [
                ...this.asArray(before.timeline),
                this.timelineEntry("learner-import", "Learners imported", request, {
                    filename: file.originalname,
                    learnersImported: imported.length
                })
            ]
        }));
        await this.log(request, "IMPORT_TRAINING_LEARNERS", "trainingCohorts", id, before, after);
        return this.enrichTrainingCohort(after);
    }
    async generateTrainingCertificates(id, request) {
        const before = await this.repository.findById(constants_1.COLLECTIONS.trainingCohorts, id);
        const learners = this.trainingLearners(this.asArray(before.learnerRegister));
        if (!learners.length) {
            throw new common_1.BadRequestException("Learner register is required before certificates can be generated.");
        }
        const bucket = this.firebaseAdmin.storage.bucket();
        const stamp = Date.now();
        const safeName = this.safeFilename(String(before.name ?? before.title ?? before.cohortName ?? id));
        const pdfPath = `training-certificates/${id}/${stamp}-${safeName}.pdf`;
        const pdfFile = bucket.file(pdfPath);
        const pdfBytes = await this.trainingCertificatePdf(before, learners);
        await pdfFile.save(Buffer.from(pdfBytes), {
            resumable: false,
            metadata: {
                contentType: "application/pdf",
                metadata: {
                    generatedByUid: request.user.uid,
                    generatedByEmail: request.user.email ?? ""
                }
            }
        });
        const generatedAt = new Date().toISOString();
        const artifact = (0, sanitize_1.sanitizePayload)({
            pdf: {
                filename: `${safeName}-certificates.pdf`,
                contentType: "application/pdf",
                storagePath: pdfPath,
                downloadUrl: await this.attachmentUrl(pdfFile, bucket.name, pdfPath),
                generatedAt
            },
            generatedAt,
            learnerCount: learners.length
        });
        const readiness = this.trainingCertificationReadiness({
            ...before,
            certificateArtifacts: artifact,
            learnerRegister: learners
        });
        const after = await this.repository.update(constants_1.COLLECTIONS.trainingCohorts, id, (0, sanitize_1.sanitizePayload)({
            certificateArtifacts: artifact,
            certificationReadiness: readiness.score,
            certificationChecklist: readiness.checklist,
            status: readiness.score >= 100 ? "CERTIFICATION_READY" : this.trainingStatus(before.status),
            timeline: [
                ...this.asArray(before.timeline),
                this.timelineEntry("certificates", "Certificates generated", request, {
                    learnerCount: learners.length,
                    storagePath: pdfPath
                })
            ]
        }));
        await this.log(request, "GENERATE_TRAINING_CERTIFICATES", "trainingCohorts", id, before, after);
        return this.enrichTrainingCohort(after);
    }
    async markTrainingCohortActive(id, request) {
        return this.updateTrainingCohortRecord(id, { status: "ACTIVE" }, request);
    }
    async completeTrainingCohort(id, request) {
        return this.updateTrainingCohortRecord(id, { status: "COMPLETED", completionRate: 100 }, request);
    }
    async exportTrainingRegister(id) {
        const cohort = this.enrichTrainingCohort(await this.repository.findById(constants_1.COLLECTIONS.trainingCohorts, id));
        const rows = this.trainingLearners(this.asArray(cohort.learnerRegister));
        const csv = [
            ["Name", "Email", "Phone", "Attendance rate", "Completion rate", "Assessment status", "Certificate eligible"].map((cell) => this.csvCell(cell)).join(","),
            ...rows.map((learner) => [
                learner.name,
                learner.email,
                learner.phone,
                learner.attendanceRate,
                learner.completionRate,
                learner.assessmentStatus,
                learner.certificateEligible === true ? "Yes" : "No"
            ].map((cell) => this.csvCell(cell)).join(","))
        ].join("\n");
        return {
            filename: `${this.safeFilename(String(cohort.name ?? cohort.title ?? id))}-learner-register.csv`,
            contentType: "text/csv",
            content: csv
        };
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
    async listSustainabilityReportOperations() {
        const [reports, source] = await Promise.all([
            this.safeList(constants_1.COLLECTIONS.sustainabilityReports, 500),
            this.sustainabilitySourceSnapshot()
        ]);
        const enriched = reports.map((report) => this.enrichSustainabilityReport(report));
        return {
            reports: enriched,
            summary: this.sustainabilityReportSummary(enriched, source.summary)
        };
    }
    async getSustainabilityReport(id) {
        const report = await this.repository.findById(constants_1.COLLECTIONS.sustainabilityReports, id);
        return this.enrichSustainabilityReport(report);
    }
    async generateSustainabilityReport(dto, request) {
        const source = await this.sustainabilitySourceSnapshot();
        const reportType = this.sustainabilityReportType(dto.reportType);
        const periodStart = this.safeString(dto.periodStart) ?? new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
        const periodEnd = this.safeString(dto.periodEnd) ?? new Date().toISOString();
        const dataSources = this.asArray(dto.dataSources).length
            ? this.asArray(dto.dataSources).map(String)
            : ["Inventory", "Donations", "Repairs", "Recycling", "Deployments", "Success stories"];
        const outputFormats = this.asArray(dto.outputFormats).length
            ? this.asArray(dto.outputFormats).map(String)
            : ["PDF", "CSV", "Board summary"];
        const title = this.safeString(dto.title) ?? this.sustainabilityReportTitle(reportType, periodStart, periodEnd);
        const reportData = {
            ...source.summary,
            dataSources,
            outputFormats,
            includeEstimatedCo2Impact: dto.generateEstimatedCo2Impact !== false,
            includeReuseEvidence: dto.generateReuseEvidence !== false,
            includeDonorReadySummary: dto.generateDonorReadySummary !== false,
            sourceCounts: source.counts,
            generatedAt: new Date().toISOString()
        };
        const created = await this.create("sustainabilityReports", {
            title,
            name: title,
            reportType,
            type: reportType,
            periodStart,
            periodEnd,
            reportData,
            status: "READY",
            devicesIncluded: source.summary.devicesIncluded,
            devicesReused: source.summary.devicesReused,
            devicesRecycled: source.summary.devicesRecycled,
            devicesDiverted: source.summary.devicesDiverted,
            estimatedCo2SavedKg: source.summary.co2EstimatedKg,
            co2EstimatedKg: source.summary.co2EstimatedKg,
            co2AvoidedKg: source.summary.co2EstimatedKg,
            reuseRate: source.summary.reuseRate,
            recyclingRate: source.summary.recyclingRate,
            evidenceReadiness: source.summary.evidenceReadiness,
            createdBy: request.user.email ?? request.user.uid,
            createdByEmail: request.user.email ?? null,
            dataSources,
            outputFormats,
            timeline: [
                this.timelineEntry("generated", "Sustainability report generated", request, {
                    reportType,
                    periodStart,
                    periodEnd,
                    dataSources,
                    outputFormats
                })
            ],
            metadata: dto.metadata ?? null
        }, request);
        const artifacts = await this.generateSustainabilityArtifacts(created.id, this.enrichSustainabilityReport(created));
        const updated = await this.repository.update(constants_1.COLLECTIONS.sustainabilityReports, created.id, (0, sanitize_1.sanitizePayload)({
            artifacts,
            timeline: [
                ...this.asArray(created.timeline),
                this.timelineEntry("artifacts", "PDF and CSV artifacts generated", request, {
                    pdfPath: this.asObject(artifacts.pdf).storagePath ?? null,
                    csvPath: this.asObject(artifacts.csv).storagePath ?? null
                })
            ]
        }));
        await this.log(request, "GENERATE_SUSTAINABILITY_ARTIFACTS", "sustainabilityReports", created.id, created, updated);
        return this.enrichSustainabilityReport(updated);
    }
    async exportSustainabilityReport(id, format) {
        const report = await this.getSustainabilityReport(id);
        const artifacts = this.asObject(report.artifacts);
        const artifact = this.asObject(artifacts[format]);
        return {
            available: Boolean(artifact.downloadUrl || artifact.storagePath),
            format,
            filename: artifact.filename ?? `${report.id}.${format}`,
            contentType: artifact.contentType ?? (format === "pdf" ? "application/pdf" : "text/csv"),
            storagePath: artifact.storagePath ?? null,
            downloadUrl: artifact.downloadUrl ?? null,
            message: artifact.downloadUrl || artifact.storagePath ? "Export is ready." : "This report does not have a stored export artifact yet."
        };
    }
    async sustainabilitySummary() {
        const { summary } = await this.sustainabilitySourceSnapshot();
        return {
            devicesReused: summary.devicesReused,
            devicesOffered: summary.devicesOffered,
            devicesDiverted: summary.devicesDiverted,
            repairQueue: summary.repairQueue,
            completedRepairs: summary.completedRepairs,
            retiredAssets: summary.retiredAssets,
            estimatedCo2SavedKg: summary.co2EstimatedKg,
            circularityScore: summary.reuseRate,
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
            return existing.map((story) => this.enrichSuccessStory(story));
        const defaults = [
            {
                title: "Learner device access pathway",
                type: "LEARNER",
                category: "Learner",
                region: "UK and Africa",
                country: "United Kingdom",
                beneficiaryName: "Sponsored learner",
                organisation: "SIT Digital Access",
                summary: "A sponsored refurbished laptop helps a learner move from phone-only access to reliable study, practice and portfolio work.",
                body: "A refurbished laptop, prepared through SIT Digital Access repair and reuse workflows, gives a learner dependable access to study, digital practice and portfolio work. The story links donor support, device reuse and practical skills development into one measurable impact pathway.",
                quote: "The laptop gave me a proper place to learn, practise and build confidence.",
                beforeSituation: "The learner relied on a shared phone and inconsistent access to digital tools.",
                afterImpact: "The learner can now study, complete portfolio work and prepare for digital skills progression.",
                devicesProvided: 1,
                trainingLinked: "Digital skills pathway",
                skillsGained: ["Online learning", "Portfolio building", "Digital confidence"],
                outcome: "Study access improved and a skills pathway is ready.",
                metrics: ["1 device reused", "40+ study hours enabled", "Digital skills pathway ready"],
                mediaUrls: ["/stories/learner-access.svg"],
                visualAsset: "/stories/learner-access.svg",
                featured: true,
                consentConfirmed: true,
                tags: ["learner", "reuse", "digital inclusion"],
                published: true,
                status: "PUBLISHED"
            },
            {
                title: "Community hub launch",
                type: "COMMUNITY",
                category: "Community",
                region: "Community access",
                country: "Ghana",
                beneficiaryName: "Community hub learners",
                organisation: "Partner community hub",
                summary: "A local hub offers digital inclusion sessions, job-search support and guided learning with prepared devices and accessories.",
                body: "A community access hub combines refurbished devices, accessories and guided learning sessions so local residents can search for work, build digital confidence and access online services. The deployment demonstrates how reuse and training can turn donated technology into shared community infrastructure.",
                quote: "The hub means people can learn together and access opportunities they could not reach before.",
                beforeSituation: "Residents had limited shared access to reliable computers and structured digital support.",
                afterImpact: "The hub now provides shared digital access, job-search support and guided learning sessions.",
                devicesProvided: 24,
                trainingLinked: "Community digital inclusion sessions",
                skillsGained: ["Job search", "Online services", "Foundational digital skills"],
                outcome: "A shared community technology hub is operational.",
                metrics: ["24 shared seats", "Remote support route", "Reuse-first equipment"],
                mediaUrls: ["/stories/community-hub.svg"],
                visualAsset: "/stories/community-hub.svg",
                featured: true,
                consentConfirmed: true,
                tags: ["community", "hub", "deployment"],
                published: true,
                status: "PUBLISHED"
            }
        ];
        const created = [];
        for (const story of defaults) {
            created.push(await this.createSuccessStoryRecord(story, request));
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
            recycling: "/admin/recycling",
            recyclingPartners: "/admin/recycling"
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
    async sustainabilitySourceSnapshot() {
        const settled = await Promise.allSettled([
            this.repository.list(constants_1.COLLECTIONS.inventory, 500),
            this.repository.list(constants_1.COLLECTIONS.donations, 500),
            this.repository.list(constants_1.COLLECTIONS.recycling, 500),
            this.repository.list(constants_1.COLLECTIONS.repairTickets, 500),
            this.repository.list(constants_1.COLLECTIONS.deployments, 500),
            this.repository.list(constants_1.COLLECTIONS.successStories, 200),
            this.repository.getSingleton(constants_1.COLLECTIONS.impactStats, "current", {})
        ]);
        const value = (index, fallback) => settled[index].status === "fulfilled" ? settled[index].value : fallback;
        const inventory = value(0, []);
        const donations = value(1, []);
        const recycling = value(2, []);
        const repairs = value(3, []);
        const deployments = value(4, []);
        const successStories = value(5, []);
        const impact = value(6, {});
        const deployed = inventory.filter((item) => item.status === "DEPLOYED").length + deployments.filter((item) => item.status === "COMPLETED" || item.status === "ACTIVE").length;
        const repaired = inventory.filter((item) => item.status === "REPAIR").length;
        const retiredAssets = inventory.filter((item) => item.status === "RETIRED").length;
        const donatedDevices = donations.reduce((sum, item) => sum + (this.safeNumber(item.deviceCount ?? item.quantity) ?? 0), 0);
        const completedRepairs = repairs.filter((item) => item.status === "COMPLETED").length;
        const devicesRecycled = recycling.reduce((sum, item) => sum + (this.safeNumber(item.devicesRecycled ?? item.devicesDiverted ?? item.deviceCount ?? item.deviceQuantity) ?? 0), 0);
        const devicesReused = deployed + completedRepairs;
        const devicesDiverted = Math.max(devicesRecycled, donatedDevices + retiredAssets);
        const devicesIncluded = Math.max(0, inventory.length + donatedDevices + completedRepairs + devicesRecycled);
        const co2EstimatedKg = Math.max(this.safeNumber(impact.co2SavedKg) ?? 0, devicesReused * 75 + devicesRecycled * 50 + completedRepairs * 45 + recycling.reduce((sum, item) => sum + (this.safeNumber(item.estimatedCo2KgAvoided ?? item.estimatedCo2SavedKg) ?? 0), 0));
        const totalRouted = Math.max(1, devicesReused + devicesRecycled);
        const evidenceSignals = recycling.filter((item) => this.asArray(item.attachments).length || this.asArray(item.reportPacks).length || item.sustainabilityReportId).length +
            successStories.length +
            deployments.length;
        return {
            inventory,
            donations,
            recycling,
            repairs,
            deployments,
            successStories,
            impact,
            counts: {
                inventory: inventory.length,
                donations: donations.length,
                recycling: recycling.length,
                repairs: repairs.length,
                deployments: deployments.length,
                successStories: successStories.length
            },
            summary: {
                devicesIncluded,
                devicesReused,
                devicesRecycled,
                devicesOffered: donatedDevices,
                devicesDiverted,
                repairQueue: repaired,
                completedRepairs,
                retiredAssets,
                co2EstimatedKg,
                reuseRate: Math.round((devicesReused / totalRouted) * 100),
                recyclingRate: Math.round((devicesRecycled / totalRouted) * 100),
                evidenceReadiness: Math.min(100, Math.round((evidenceSignals / Math.max(1, recycling.length + deployments.length + 1)) * 100))
            }
        };
    }
    sustainabilityReportSummary(reports, sourceSummary) {
        const latest = reports[0] ? this.enrichSustainabilityReport(reports[0]) : null;
        return {
            totalReports: reports.length,
            co2EstimatedKg: reports.reduce((sum, report) => sum + (this.safeNumber(report.co2EstimatedKg ?? report.co2AvoidedKg ?? report.estimatedCo2SavedKg) ?? 0), 0) || this.safeNumber(sourceSummary.co2EstimatedKg) || 0,
            devicesDiverted: reports.reduce((sum, report) => sum + (this.safeNumber(report.devicesDiverted) ?? 0), 0) || this.safeNumber(sourceSummary.devicesDiverted) || 0,
            latestReport: latest ? {
                id: latest.id,
                name: latest.name ?? latest.title ?? "Sustainability report",
                createdAt: latest.createdAt ?? null,
                status: latest.status ?? null
            } : null,
            reuseRate: reports.length ? Math.round(reports.reduce((sum, report) => sum + (this.safeNumber(report.reuseRate) ?? 0), 0) / reports.length) : this.safeNumber(sourceSummary.reuseRate) || 0,
            recyclingRate: reports.length ? Math.round(reports.reduce((sum, report) => sum + (this.safeNumber(report.recyclingRate) ?? 0), 0) / reports.length) : this.safeNumber(sourceSummary.recyclingRate) || 0,
            devicesReused: reports.reduce((sum, report) => sum + (this.safeNumber(report.devicesReused) ?? 0), 0) || this.safeNumber(sourceSummary.devicesReused) || 0,
            devicesRecycled: reports.reduce((sum, report) => sum + (this.safeNumber(report.devicesRecycled) ?? 0), 0) || this.safeNumber(sourceSummary.devicesRecycled) || 0,
            evidenceReadiness: reports.length ? Math.round(reports.reduce((sum, report) => sum + (this.safeNumber(report.evidenceReadiness) ?? 0), 0) / reports.length) : this.safeNumber(sourceSummary.evidenceReadiness) || 0
        };
    }
    enrichSustainabilityReport(report) {
        const data = this.asObject(report.reportData);
        const status = this.sustainabilityReportStatus(report.status);
        return (0, sanitize_1.sanitizePayload)({
            ...report,
            name: report.name ?? report.title ?? "Sustainability report",
            title: report.title ?? report.name ?? "Sustainability report",
            type: this.sustainabilityReportType(report.type ?? report.reportType),
            reportType: this.sustainabilityReportType(report.reportType ?? report.type),
            status,
            devicesIncluded: report.devicesIncluded ?? data.devicesIncluded ?? data.devicesDiverted ?? report.devicesDiverted ?? 0,
            devicesReused: report.devicesReused ?? data.devicesReused ?? 0,
            devicesRecycled: report.devicesRecycled ?? data.devicesRecycled ?? 0,
            devicesDiverted: report.devicesDiverted ?? data.devicesDiverted ?? 0,
            co2AvoidedKg: report.co2AvoidedKg ?? report.co2EstimatedKg ?? report.estimatedCo2SavedKg ?? data.co2EstimatedKg ?? data.estimatedCo2SavedKg ?? 0,
            co2EstimatedKg: report.co2EstimatedKg ?? report.co2AvoidedKg ?? report.estimatedCo2SavedKg ?? data.co2EstimatedKg ?? data.estimatedCo2SavedKg ?? 0,
            reuseRate: report.reuseRate ?? data.reuseRate ?? data.circularityScore ?? 0,
            recyclingRate: report.recyclingRate ?? data.recyclingRate ?? 0,
            evidenceReadiness: report.evidenceReadiness ?? data.evidenceReadiness ?? (this.asObject(report.artifacts).pdf ? 75 : 0),
            createdBy: report.createdBy ?? report.createdByEmail ?? "System",
            artifacts: report.artifacts ?? {},
            timeline: this.asArray(report.timeline)
        });
    }
    sustainabilityReportStatus(value) {
        const status = String(value ?? "READY").toUpperCase().replace(/[\s-]+/g, "_");
        if (status === "GENERATED")
            return "READY";
        return ["DRAFT", "GENERATING", "READY", "FAILED", "ARCHIVED"].includes(status) ? status : "READY";
    }
    sustainabilityReportType(value) {
        const type = String(value ?? "MONTHLY_ESG").toUpperCase().replace(/[\s-]+/g, "_");
        const mapped = {
            ESTIMATED_REUSE_IMPACT: "MONTHLY_ESG",
            RECYCLING_DONOR_PACK: "CORPORATE_RECYCLING",
            DONOR_REPORT: "DONOR_IMPACT"
        };
        const candidate = mapped[type] ?? type;
        return ["MONTHLY_ESG", "DONOR_IMPACT", "CORPORATE_RECYCLING", "AFRICA_DEPLOYMENT", "BOARD_SUMMARY"].includes(candidate) ? candidate : "MONTHLY_ESG";
    }
    sustainabilityReportTitle(type, periodStart, periodEnd) {
        const label = type.toLowerCase().split("_").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
        return `${label} ${this.shortDate(periodStart)}-${this.shortDate(periodEnd)}`;
    }
    shortDate(value) {
        const date = new Date(value);
        if (Number.isNaN(date.getTime()))
            return "current";
        return new Intl.DateTimeFormat("en-GB", { month: "short", year: "numeric" }).format(date);
    }
    async generateSustainabilityArtifacts(reportId, report) {
        const bucket = this.firebaseAdmin.storage.bucket();
        const stamp = Date.now();
        const safeTitle = this.safeFilename(String(report.name ?? report.title ?? reportId));
        const pdfPath = `sustainability-report-packs/${reportId}/${stamp}-${safeTitle}.pdf`;
        const csvPath = `sustainability-report-packs/${reportId}/${stamp}-${safeTitle}.csv`;
        const pdfFile = bucket.file(pdfPath);
        const csvFile = bucket.file(csvPath);
        const pdfBytes = await this.sustainabilityReportPdf(report);
        const csv = this.sustainabilityReportCsv(report);
        await pdfFile.save(Buffer.from(pdfBytes), {
            resumable: false,
            metadata: { contentType: "application/pdf" }
        });
        await csvFile.save(Buffer.from(csv, "utf8"), {
            resumable: false,
            metadata: { contentType: "text/csv" }
        });
        return (0, sanitize_1.sanitizePayload)({
            pdf: {
                filename: `${safeTitle}.pdf`,
                contentType: "application/pdf",
                storagePath: pdfPath,
                downloadUrl: await this.attachmentUrl(pdfFile, bucket.name, pdfPath)
            },
            csv: {
                filename: `${safeTitle}.csv`,
                contentType: "text/csv",
                storagePath: csvPath,
                downloadUrl: await this.attachmentUrl(csvFile, bucket.name, csvPath)
            },
            generatedAt: new Date().toISOString()
        });
    }
    sustainabilityReportCsv(report) {
        const rows = [
            ["Report name", report.name ?? report.title],
            ["Type", report.reportType ?? report.type],
            ["Status", report.status],
            ["Period start", report.periodStart],
            ["Period end", report.periodEnd],
            ["Devices included", report.devicesIncluded],
            ["Devices reused", report.devicesReused],
            ["Devices recycled", report.devicesRecycled],
            ["Devices diverted", report.devicesDiverted],
            ["CO2 avoided kg", report.co2AvoidedKg ?? report.co2EstimatedKg],
            ["Reuse rate", report.reuseRate],
            ["Recycling rate", report.recyclingRate],
            ["Evidence readiness", report.evidenceReadiness],
            ["Created by", report.createdBy ?? report.createdByEmail]
        ];
        return ["Metric,Value", ...rows.map(([label, value]) => `${this.csvCell(label)},${this.csvCell(value)}`)].join("\n");
    }
    async sustainabilityReportPdf(report) {
        const pdf = await pdf_lib_1.PDFDocument.create();
        const page = pdf.addPage([595, 842]);
        const regular = await pdf.embedFont(pdf_lib_1.StandardFonts.Helvetica);
        const bold = await pdf.embedFont(pdf_lib_1.StandardFonts.HelveticaBold);
        const title = String(report.name ?? report.title ?? "Sustainability report");
        const rows = [
            ["Report type", String(report.reportType ?? report.type ?? "MONTHLY_ESG")],
            ["Period", `${report.periodStart ?? "Not set"} to ${report.periodEnd ?? "Not set"}`],
            ["Devices included", String(report.devicesIncluded ?? 0)],
            ["Devices reused", String(report.devicesReused ?? 0)],
            ["Devices recycled", String(report.devicesRecycled ?? 0)],
            ["CO2 avoided", `${report.co2AvoidedKg ?? report.co2EstimatedKg ?? 0} kg`],
            ["Reuse rate", `${report.reuseRate ?? 0}%`],
            ["Evidence readiness", `${report.evidenceReadiness ?? 0}%`],
            ["Created by", String(report.createdBy ?? report.createdByEmail ?? "System")]
        ];
        page.drawRectangle({ x: 0, y: 760, width: 595, height: 82, color: (0, pdf_lib_1.rgb)(0.08, 0.08, 0.08) });
        page.drawText("SIT Digital Access", { x: 48, y: 802, size: 14, font: bold, color: (0, pdf_lib_1.rgb)(1, 1, 1) });
        page.drawText("Sustainability & ESG Reporting Pack", { x: 48, y: 778, size: 20, font: bold, color: (0, pdf_lib_1.rgb)(1, 1, 1) });
        page.drawText(new Date().toLocaleDateString("en-GB"), { x: 460, y: 806, size: 9, font: regular, color: (0, pdf_lib_1.rgb)(1, 0.82, 0.68) });
        page.drawText(title.slice(0, 82), { x: 48, y: 724, size: 16, font: bold, color: (0, pdf_lib_1.rgb)(0.08, 0.08, 0.08) });
        let y = 690;
        for (const [label, value] of rows) {
            page.drawText(label, { x: 48, y, size: 10, font: bold, color: (0, pdf_lib_1.rgb)(0.24, 0.24, 0.24) });
            page.drawText(value.slice(0, 76), { x: 230, y, size: 10, font: regular, color: (0, pdf_lib_1.rgb)(0.1, 0.1, 0.1) });
            y -= 26;
        }
        page.drawText("Audit-ready summary generated from SIT Digital Access inventory, donation, repair, recycling and deployment records.", {
            x: 48,
            y: 110,
            size: 10,
            font: regular,
            color: (0, pdf_lib_1.rgb)(0.32, 0.32, 0.32),
            maxWidth: 480
        });
        return pdf.save();
    }
    recyclingSummary(records, partners) {
        const active = records.filter((record) => this.recyclingStatus(record.status) !== "COMPLETED");
        const processingStatuses = [
            "SECURE_WIPE_PENDING",
            "SECURE_WIPE_COMPLETE",
            "ASSESSMENT",
            "REFURBISH_APPROVED",
            "RECYCLE_APPROVED",
            "ESG_EVIDENCE_READY"
        ];
        return {
            totalRecords: records.length,
            devicesDiverted: records.reduce((sum, record) => sum + (this.safeNumber(record.devicesDiverted ?? record.deviceQuantity ?? record.deviceCount) ?? 0), 0),
            estimatedCo2KgAvoided: records.reduce((sum, record) => sum + (this.safeNumber(record.estimatedCo2KgAvoided ?? record.estimatedCo2SavedKg) ?? 0), 0),
            processing: records.filter((record) => processingStatuses.includes(this.recyclingStatus(record.status))).length,
            secureWipePending: records.filter((record) => this.recyclingStatus(record.status) === "SECURE_WIPE_PENDING" || record.secureWipeRequired === true).length,
            esgEvidenceReady: records.filter((record) => this.recyclingStatus(record.status) === "ESG_EVIDENCE_READY" || this.asArray(record.reportPacks).length > 0).length,
            overdueCollections: active.filter((record) => {
                const due = this.recyclingCollectionDueAt(record);
                return Boolean(due && due.getTime() < Date.now() && !["COLLECTED", "SECURE_WIPE_PENDING", "SECURE_WIPE_COMPLETE", "ASSESSMENT", "REFURBISH_APPROVED", "RECYCLE_APPROVED", "ESG_EVIDENCE_READY"].includes(this.recyclingStatus(record.status)));
            }).length,
            partnersActive: partners.filter((partner) => String(partner.status ?? "ACTIVE").toUpperCase() === "ACTIVE").length
        };
    }
    recyclingStatus(value) {
        const normalised = String(value ?? "INTAKE_CREATED").toUpperCase().replace(/[\s-]+/g, "_");
        const mapped = {
            INTAKE: "INTAKE_CREATED",
            NEW: "INTAKE_CREATED",
            COLLECTION_ARRANGED: "COLLECTION_SCHEDULED",
            COLLECTION_NEEDED: "COLLECTION_SCHEDULED",
            RECEIVED: "COLLECTED",
            PROCESSING: "SECURE_WIPE_PENDING",
            WIPE_PENDING: "SECURE_WIPE_PENDING",
            WIPE_COMPLETE: "SECURE_WIPE_COMPLETE",
            REFURBISH: "REFURBISH_APPROVED",
            REFURBISHMENT: "REFURBISH_APPROVED",
            RECYCLE: "RECYCLE_APPROVED",
            ESG_READY: "ESG_EVIDENCE_READY",
            CLOSED: "COMPLETED"
        };
        const candidate = mapped[normalised] ?? normalised;
        return recyclingStatuses.includes(candidate) ? candidate : "INTAKE_CREATED";
    }
    recyclingStatusLabel(status) {
        return status
            .toLowerCase()
            .split("_")
            .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
            .join(" ");
    }
    recyclingCollectionDueAt(record) {
        const value = this.safeString(record.collectionDate ?? record.dueDate);
        if (!value)
            return null;
        const date = new Date(value);
        return Number.isNaN(date.getTime()) ? null : date;
    }
    recyclingReference() {
        const year = new Date().getFullYear();
        const number = String((0, crypto_1.randomBytes)(2).readUInt16BE(0) % 10000).padStart(4, "0");
        return `SIT-REC-${year}-${number}`;
    }
    defaultSecureWipeChecklist(dto) {
        const required = dto.secureWipeRequired === true || (this.safeNumber(dto.dataBearingDevicesCount ?? dto.dataBearingDeviceCount) ?? 0) > 0;
        return [
            { id: "identify-assets", label: "Identify data-bearing assets", completed: !required },
            { id: "log-chain-of-custody", label: "Log chain of custody", completed: dto.chainOfCustodyRequired !== true },
            { id: "perform-wipe", label: "Perform secure wipe", completed: false },
            { id: "verify-wipe", label: "Verify wipe result", completed: false },
            { id: "generate-certificate", label: "Generate wipe certificate", completed: false }
        ];
    }
    recyclingTimelineForUpdate(before, dto, request) {
        const entries = [];
        if (dto.status && this.recyclingStatus(before.status) !== this.recyclingStatus(dto.status)) {
            entries.push(this.timelineEntry("status", `Status changed to ${this.recyclingStatusLabel(this.recyclingStatus(dto.status))}`, request, {
                from: this.recyclingStatus(before.status),
                to: this.recyclingStatus(dto.status)
            }));
        }
        if ("recyclingPartnerId" in dto && before.recyclingPartnerId !== dto.recyclingPartnerId) {
            entries.push(this.timelineEntry("partner", "Recycling partner updated", request, {
                from: before.recyclingPartnerId ?? null,
                to: dto.recyclingPartnerId ?? null
            }));
        }
        if ("collectionDate" in dto || "driverStatus" in dto || "logisticsStatus" in dto) {
            entries.push(this.timelineEntry("collection", "Collection details updated", request, {
                collectionDate: dto.collectionDate ?? before.collectionDate ?? null,
                driverStatus: dto.driverStatus ?? before.driverStatus ?? null,
                logisticsStatus: dto.logisticsStatus ?? before.logisticsStatus ?? null
            }));
        }
        if ("secureWipeStatus" in dto || "secureWipeChecklist" in dto) {
            entries.push(this.timelineEntry("secure-wipe", "Secure wipe details updated", request, {
                secureWipeStatus: dto.secureWipeStatus ?? before.secureWipeStatus ?? null
            }));
        }
        if (dto.reuseRecycleDecision || dto.reuseDecision || dto.aiRecommendation) {
            entries.push(this.timelineEntry("decision", "Reuse/recycle decision updated", request, {
                reuseRecycleDecision: dto.reuseRecycleDecision ?? dto.reuseDecision ?? before.reuseRecycleDecision ?? null
            }));
        }
        if (dto.internalNotes || dto.notes) {
            entries.push(this.timelineEntry("note", "Internal note added", request, {
                note: dto.internalNotes ?? dto.notes
            }));
        }
        return entries;
    }
    async generateRecyclingRecommendation(record) {
        const fallback = this.heuristicRecyclingRecommendation(record);
        const apiKey = this.config.get("OPENAI_API_KEY");
        if (!apiKey)
            return fallback;
        try {
            const model = this.config.get("OPENAI_RECYCLING_RECOMMENDATION_MODEL")
                ?? this.config.get("OPENAI_REPAIR_TRIAGE_MODEL")
                ?? "gpt-5-mini";
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
                            content: "You are a circular technology operations assistant. Return only compact JSON with keys summary, recommendation, reason, refurbishmentCostEstimate, partsValueEstimate, africaDeploymentSuitability, riskFlags, confidence."
                        },
                        {
                            role: "user",
                            content: JSON.stringify({
                                recyclingReference: record.recyclingReference,
                                status: record.status,
                                deviceCount: record.deviceCount ?? record.deviceQuantity,
                                assetTypes: record.assetTypes,
                                deviceCondition: record.deviceCondition,
                                dataBearingDevicesCount: record.dataBearingDevicesCount ?? record.dataBearingDeviceCount,
                                estimatedWeightKg: record.estimatedWeightKg,
                                secureWipeRequired: record.secureWipeRequired,
                                notes: record.notes ?? record.summary,
                                linkedRepair: record.repairId ?? record.recyclingId
                            })
                        }
                    ],
                    max_output_tokens: 700
                })
            });
            if (!response.ok) {
                throw new Error(`OpenAI recommendation failed with ${response.status}`);
            }
            const payload = await response.json();
            const text = this.openAiText(payload);
            if (!text)
                return fallback;
            const parsed = JSON.parse(text);
            return (0, sanitize_1.sanitizePayload)({
                summary: this.safeString(parsed.summary) ?? fallback.summary,
                recommendation: this.safeString(parsed.recommendation) ?? fallback.recommendation,
                reason: this.safeString(parsed.reason) ?? fallback.reason,
                refurbishmentCostEstimate: this.safeNumber(parsed.refurbishmentCostEstimate) ?? fallback.refurbishmentCostEstimate,
                partsValueEstimate: this.safeNumber(parsed.partsValueEstimate) ?? fallback.partsValueEstimate,
                africaDeploymentSuitability: this.safeString(parsed.africaDeploymentSuitability) ?? fallback.africaDeploymentSuitability,
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
                fallbackReason: error instanceof Error ? error.message : "AI recommendation unavailable"
            };
        }
    }
    heuristicRecyclingRecommendation(record) {
        const text = `${record.assetTypes ?? ""} ${record.deviceCondition ?? ""} ${record.notes ?? ""} ${record.summary ?? ""}`.toLowerCase();
        const deviceCount = this.safeNumber(record.deviceCount ?? record.deviceQuantity ?? record.devicesDiverted) ?? 1;
        const dataBearingCount = this.safeNumber(record.dataBearingDevicesCount ?? record.dataBearingDeviceCount) ?? 0;
        const riskFlags = [];
        if (dataBearingCount > 0 || record.secureWipeRequired === true)
            riskFlags.push("Secure wipe required");
        if (record.chainOfCustodyRequired === true)
            riskFlags.push("Chain of custody required");
        if (/broken|scrap|e[- ]?waste|liquid|damaged|parts/.test(text))
            riskFlags.push("Likely end-of-life assets");
        const recommendation = /good|working|grade a|grade b|laptop|desktop|mini pc/.test(text) && !/scrap|e[- ]?waste|liquid/.test(text)
            ? "Refurbish for reuse"
            : /parts|screen|battery|ram|ssd/.test(text)
                ? "Harvest parts before recycling"
                : "Recycle responsibly";
        return {
            summary: "Heuristic recommendation prepared from asset type, condition, data risk and ESG requirements.",
            recommendation,
            reason: recommendation === "Refurbish for reuse"
                ? "The described assets appear suitable for diagnostics, refurbishment and potential reuse."
                : recommendation === "Harvest parts before recycling"
                    ? "Some value may remain in reusable components before compliant recycling."
                    : "The described condition suggests responsible recycling is the likely route.",
            refurbishmentCostEstimate: recommendation === "Refurbish for reuse" ? deviceCount * 45 : deviceCount * 15,
            partsValueEstimate: recommendation === "Harvest parts before recycling" ? deviceCount * 25 : deviceCount * 10,
            africaDeploymentSuitability: recommendation === "Refurbish for reuse" ? "Potentially suitable after diagnostics" : "Low until assessment confirms reusable units",
            riskFlags,
            confidence: 0.64,
            provider: "heuristic",
            generatedAt: new Date().toISOString()
        };
    }
    recyclingReportCsv(record) {
        const rows = [
            ["Recycling reference", record.recyclingReference ?? record.id],
            ["Organisation", record.organisation ?? record.donorOrganisation ?? ""],
            ["Contact", record.contactPerson ?? record.customerName ?? ""],
            ["Status", this.recyclingStatusLabel(this.recyclingStatus(record.status))],
            ["Devices diverted", record.devicesDiverted ?? record.deviceQuantity ?? record.deviceCount ?? 0],
            ["Estimated CO2 kg avoided", record.estimatedCo2KgAvoided ?? record.estimatedCo2SavedKg ?? 0],
            ["Estimated weight kg", record.estimatedWeightKg ?? ""],
            ["Secure wipe required", record.secureWipeRequired === true ? "Yes" : "No"],
            ["Chain of custody required", record.chainOfCustodyRequired === true ? "Yes" : "No"],
            ["Reuse/recycle decision", record.reuseRecycleDecision ?? record.reuseDecision ?? ""],
            ["Africa deployment suitability", record.africaDeploymentSuitability ?? ""]
        ];
        return [
            "Metric,Value",
            ...rows.map(([label, value]) => `${this.csvCell(label)},${this.csvCell(value)}`)
        ].join("\n");
    }
    async recyclingReportPdf(record) {
        const pdf = await pdf_lib_1.PDFDocument.create();
        const page = pdf.addPage([595, 842]);
        const regular = await pdf.embedFont(pdf_lib_1.StandardFonts.Helvetica);
        const bold = await pdf.embedFont(pdf_lib_1.StandardFonts.HelveticaBold);
        const reference = this.safeString(record.recyclingReference) ?? record.id;
        const organisation = this.safeString(record.organisation ?? record.donorOrganisation) ?? "Corporate donor";
        const rows = [
            ["Reference", reference],
            ["Organisation", organisation],
            ["Status", this.recyclingStatusLabel(this.recyclingStatus(record.status))],
            ["Devices diverted", String(record.devicesDiverted ?? record.deviceQuantity ?? record.deviceCount ?? 0)],
            ["Estimated CO2 avoided", `${record.estimatedCo2KgAvoided ?? record.estimatedCo2SavedKg ?? 0} kg`],
            ["Secure wipe", record.secureWipeRequired === true ? "Required" : "Not required"],
            ["Chain of custody", record.chainOfCustodyRequired === true ? "Required" : "Not required"],
            ["Reuse/recycle decision", String(record.reuseRecycleDecision ?? record.reuseDecision ?? "Pending")],
            ["Africa readiness", String(record.africaDeploymentSuitability ?? "Assessment pending")]
        ];
        page.drawRectangle({ x: 0, y: 760, width: 595, height: 82, color: (0, pdf_lib_1.rgb)(0.08, 0.08, 0.08) });
        page.drawText("SIT Digital Access", { x: 48, y: 802, size: 14, font: bold, color: (0, pdf_lib_1.rgb)(1, 1, 1) });
        page.drawText("Recycling & Circular Technology ESG Pack", { x: 48, y: 778, size: 20, font: bold, color: (0, pdf_lib_1.rgb)(1, 1, 1) });
        page.drawText(`Generated ${new Date().toLocaleDateString("en-GB")}`, { x: 420, y: 806, size: 9, font: regular, color: (0, pdf_lib_1.rgb)(1, 0.82, 0.68) });
        page.drawText("Donor evidence summary", { x: 48, y: 724, size: 16, font: bold, color: (0, pdf_lib_1.rgb)(0.08, 0.08, 0.08) });
        let y = 690;
        for (const [label, value] of rows) {
            page.drawText(label, { x: 48, y, size: 10, font: bold, color: (0, pdf_lib_1.rgb)(0.24, 0.24, 0.24) });
            page.drawText(value.slice(0, 72), { x: 230, y, size: 10, font: regular, color: (0, pdf_lib_1.rgb)(0.1, 0.1, 0.1) });
            y -= 26;
        }
        page.drawText("This pack summarises circular technology intake, secure data handling and ESG evidence for audit-ready donor reporting.", {
            x: 48,
            y: 110,
            size: 10,
            font: regular,
            color: (0, pdf_lib_1.rgb)(0.32, 0.32, 0.32),
            maxWidth: 480
        });
        return pdf.save();
    }
    csvCell(value) {
        const text = String(value ?? "").replace(/"/g, "\"\"");
        return /[",\n]/.test(text) ? `"${text}"` : text;
    }
    enrichSuccessStory(story) {
        const title = this.safeString(story.title ?? story.name) ?? "Untitled success story";
        const status = this.successStoryStatus(story.status, story.published);
        const storyType = this.successStoryType(story.type ?? story.storyType ?? story.category);
        const body = this.safeString(story.body ?? story.fullStory ?? story.message ?? story.description ?? story.summary) ?? "";
        const devicesProvided = this.safeNumber(story.devicesProvided ?? story.deviceCount ?? story.devicesDelivered) ?? 0;
        const mediaUrls = this.storyMediaUrls(story);
        return {
            ...story,
            title,
            name: title,
            slug: this.safeString(story.slug) ?? this.storySlug(title),
            type: storyType,
            storyType,
            category: story.category ?? this.successStoryTypeLabel(storyType),
            status,
            published: status === "PUBLISHED" || story.published === true,
            summary: story.summary ?? body.slice(0, 240),
            body,
            fullStory: story.fullStory ?? body,
            devicesProvided,
            deviceCount: story.deviceCount ?? devicesProvided,
            mediaUrls,
            visualAsset: story.visualAsset ?? mediaUrls[0] ?? null,
            tags: this.asArray(story.tags).map(String),
            skillsGained: this.asArray(story.skillsGained).map(String),
            featured: story.featured === true,
            consentConfirmed: story.consentConfirmed === true,
            updatedAt: story.updatedAt ?? story.createdAt ?? null
        };
    }
    successStorySummary(stories) {
        const regions = new Set(stories
            .map((story) => this.safeString(story.region ?? story.country))
            .filter((value) => Boolean(value)));
        const status = (story) => this.successStoryStatus(story.status, story.published);
        return {
            totalStories: stories.length,
            published: stories.filter((story) => status(story) === "PUBLISHED").length,
            drafts: stories.filter((story) => status(story) === "DRAFT").length,
            awaitingReview: stories.filter((story) => status(story) === "IN_REVIEW").length,
            regionsRepresented: regions.size,
            featured: stories.filter((story) => story.featured === true).length,
            storiesWithMedia: stories.filter((story) => this.storyMediaUrls(story).length > 0).length,
            impactMetricsAttached: stories.filter((story) => this.asArray(story.metrics).length > 0 ||
                (this.safeNumber(story.devicesProvided ?? story.deviceCount) ?? 0) > 0 ||
                Boolean(this.safeString(story.outcome ?? story.trainingLinked))).length
        };
    }
    successStoryStatus(value, published) {
        const status = String(value ?? "").trim().toUpperCase().replace(/[\s-]+/g, "_");
        if (status === "PUBLISHED" || status === "LIVE" || published === true)
            return "PUBLISHED";
        if (status === "IN_REVIEW" || status === "REVIEW" || status === "AWAITING_REVIEW")
            return "IN_REVIEW";
        if (status === "ARCHIVED" || status === "CLOSED")
            return "ARCHIVED";
        return "DRAFT";
    }
    successStoryType(value) {
        const type = String(value ?? "").trim().toUpperCase().replace(/[\s-]+/g, "_");
        const mapped = {
            LEARNER_STORY: "LEARNER",
            SCHOOL_STORY: "SCHOOL",
            NON_PROFIT: "NGO",
            NONPROFIT: "NGO",
            AFRICA: "AFRICA_DEPLOYMENT",
            AFRICA_DEPLOYMENT_STORY: "AFRICA_DEPLOYMENT",
            DEPLOYMENT: "AFRICA_DEPLOYMENT"
        };
        const candidate = mapped[type] ?? type;
        return ["LEARNER", "SCHOOL", "NGO", "COMMUNITY", "BUSINESS", "DONOR", "AFRICA_DEPLOYMENT"].includes(candidate)
            ? candidate
            : "COMMUNITY";
    }
    successStoryTypeLabel(value) {
        const labels = {
            LEARNER: "Learner",
            SCHOOL: "School",
            NGO: "NGO",
            COMMUNITY: "Community",
            BUSINESS: "Business",
            DONOR: "Donor",
            AFRICA_DEPLOYMENT: "Africa deployment"
        };
        return labels[value] ?? "Community";
    }
    storyMediaUrls(story) {
        const urls = this.asArray(story.mediaUrls)
            .map(String)
            .filter((value) => value.trim().length > 0);
        const visualAsset = this.safeString(story.visualAsset);
        if (visualAsset && !urls.includes(visualAsset))
            urls.unshift(visualAsset);
        return urls;
    }
    storySlug(value) {
        const slug = value
            .toLowerCase()
            .replace(/['"]/g, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "")
            .slice(0, 80);
        return slug || `story-${(0, crypto_1.randomBytes)(3).toString("hex")}`;
    }
    successStoryTimelineForUpdate(before, dto, request) {
        const entries = [];
        if ("status" in dto || "published" in dto) {
            const previous = this.successStoryStatus(before.status, before.published);
            const next = this.successStoryStatus(dto.status ?? before.status, dto.published ?? before.published);
            if (previous !== next) {
                entries.push(this.timelineEntry("status", `Story moved to ${next.replaceAll("_", " ").toLowerCase()}`, request, {
                    from: previous,
                    to: next
                }));
            }
        }
        if ("featured" in dto && before.featured !== dto.featured) {
            entries.push(this.timelineEntry(dto.featured ? "featured" : "unfeatured", dto.featured ? "Story featured" : "Story unfeatured", request));
        }
        if ("type" in dto || "storyType" in dto || "category" in dto) {
            entries.push(this.timelineEntry("story-type", "Story type updated", request, {
                from: this.successStoryType(before.type ?? before.storyType ?? before.category),
                to: this.successStoryType(dto.type ?? dto.storyType ?? dto.category)
            }));
        }
        if (dto.body || dto.fullStory || dto.summary || dto.quote) {
            entries.push(this.timelineEntry("content", "Story content updated", request));
        }
        return entries;
    }
    heuristicSuccessStoryDraft(dto) {
        const beneficiaryType = this.safeString(dto.beneficiaryType ?? dto.type ?? dto.storyType) ?? "community";
        const tone = this.safeString(dto.tone) ?? "Donor-ready";
        const region = this.safeString(dto.region ?? dto.country) ?? "a partner region";
        const devices = this.safeNumber(dto.devicesProvided ?? dto.deviceCount) ?? 1;
        const outcome = this.safeString(dto.outcome) ?? "improved access to learning, opportunity and digital confidence";
        const title = `${beneficiaryType.replaceAll("_", " ")} impact in ${region}`.replace(/\b\w/g, (char) => char.toUpperCase());
        const summary = `${devices} refurbished device${devices === 1 ? "" : "s"} helped ${beneficiaryType.toLowerCase()} beneficiaries in ${region} move closer to ${outcome}.`;
        const body = [
            `SIT Digital Access connected refurbished technology, training support and local delivery evidence to create measurable impact for ${beneficiaryType.toLowerCase()} beneficiaries in ${region}.`,
            `Before the intervention, access to dependable digital tools was limited. Through reuse-first preparation and operational tracking, ${devices} device${devices === 1 ? " was" : "s were"} made available for learning, work and community participation.`,
            `The result is ${outcome}. This draft can be edited with local names, consent-approved quotes, photos and linked deployment evidence before publishing.`
        ].join("\n\n");
        return {
            title,
            summary,
            body,
            quote: "Access to the right technology changed what felt possible.",
            socialPost: `${summary} Read the latest SIT Digital Access impact story.`,
            tags: ["impact", "reuse", beneficiaryType.toLowerCase().replaceAll(" ", "-")],
            tone,
            provider: "heuristic",
            generatedAt: new Date().toISOString()
        };
    }
    enrichSupportTicket(ticket) {
        const reference = this.safeString(ticket.reference ?? ticket.supportReference) ?? ticket.id;
        const subject = this.safeString(ticket.subject ?? ticket.title ?? ticket.name) ?? "Support ticket";
        const description = this.safeString(ticket.description ?? ticket.message ?? ticket.summary ?? ticket.notes) ?? "";
        const status = this.supportStatus(ticket.status);
        const priority = this.supportPriority(ticket.priority);
        const category = this.supportCategory(ticket.category);
        const requesterName = this.safeString(ticket.requesterName ?? ticket.customerName ?? ticket.name) ?? "Unknown requester";
        const requesterEmail = this.safeString(ticket.requesterEmail ?? ticket.email);
        const requesterPhone = this.safeString(ticket.requesterPhone ?? ticket.phone);
        const assignedTo = this.safeString(ticket.assignedTo ?? ticket.assignedOwner ?? ticket.owner);
        const internalNoteLog = this.asArray(ticket.internalNoteLog ?? ticket.internalNotes)
            .map((note, index) => {
            const item = this.asObject(note);
            return {
                id: this.safeString(item.id) ?? `note-${index}`,
                note: this.safeString(item.note ?? item.message ?? item.title) ?? String(note),
                createdAt: this.safeString(item.createdAt) ?? this.safeString(ticket.createdAt) ?? new Date().toISOString(),
                author: this.safeString(item.author ?? item.actorEmail) ?? null
            };
        });
        return {
            ...ticket,
            reference,
            supportReference: reference,
            subject,
            title: subject,
            name: subject,
            requesterName,
            customerName: ticket.customerName ?? requesterName,
            requesterEmail,
            email: ticket.email ?? requesterEmail,
            requesterPhone,
            phone: ticket.phone ?? requesterPhone,
            category,
            priority,
            status,
            channel: this.safeString(ticket.channel) ?? "ADMIN",
            description,
            summary: ticket.summary ?? description.slice(0, 240),
            message: ticket.message ?? description,
            internalNotes: internalNoteLog,
            internalNoteLog,
            assignedTo,
            assignedOwner: ticket.assignedOwner ?? assignedTo ?? null,
            linkedInventoryId: ticket.linkedInventoryId ?? ticket.inventoryId ?? null,
            linkedRepairTicketId: ticket.linkedRepairTicketId ?? ticket.repairTicketId ?? null,
            linkedDonationId: ticket.linkedDonationId ?? ticket.donationId ?? null,
            linkedDeploymentId: ticket.linkedDeploymentId ?? ticket.deploymentId ?? null,
            slaDueAt: ticket.slaDueAt ?? this.supportSlaDueAt(ticket),
            lastActivityAt: ticket.lastActivityAt ?? ticket.updatedAt ?? ticket.createdAt ?? null,
            timeline: this.asArray(ticket.timeline),
            attachments: this.asArray(ticket.attachments)
        };
    }
    supportSummary(tickets, _inventory, _repairs, _deployments) {
        const active = tickets.filter((ticket) => !["CLOSED", "RESOLVED"].includes(this.supportStatus(ticket.status)));
        const now = Date.now();
        const dueSoon = active.filter((ticket) => {
            const due = this.supportDueAt(ticket);
            return Boolean(due && due.getTime() <= now + 24 * 60 * 60 * 1000);
        });
        return {
            openTickets: active.length,
            highPriority: active.filter((ticket) => ["HIGH", "URGENT"].includes(this.supportPriority(ticket.priority))).length,
            inventoryLinked: tickets.filter((ticket) => this.safeString(ticket.linkedInventoryId ?? ticket.inventoryId)).length,
            repairLinked: tickets.filter((ticket) => this.safeString(ticket.linkedRepairTicketId ?? ticket.repairTicketId)).length,
            closedTickets: tickets.filter((ticket) => ["CLOSED", "RESOLVED"].includes(this.supportStatus(ticket.status))).length,
            slaRisk: dueSoon.length,
            awaitingCustomer: tickets.filter((ticket) => this.supportStatus(ticket.status) === "AWAITING_CUSTOMER").length,
            escalated: tickets.filter((ticket) => this.supportStatus(ticket.status) === "ESCALATED").length
        };
    }
    supportStatus(value) {
        const status = String(value ?? "NEW").toUpperCase().replace(/[\s-]+/g, "_");
        const mapped = {
            WAITING_CUSTOMER: "AWAITING_CUSTOMER",
            WAITING_INTERNAL: "AWAITING_INTERNAL",
            RESOLVED_CLOSED: "CLOSED"
        };
        const candidate = mapped[status] ?? status;
        return supportStatuses.includes(candidate) ? candidate : "NEW";
    }
    supportPriority(value) {
        const priority = String(value ?? "MEDIUM").toUpperCase().replace(/[\s-]+/g, "_");
        return supportPriorities.includes(priority) ? priority : "MEDIUM";
    }
    supportCategory(value) {
        const category = String(value ?? "GENERAL_ENQUIRY").toUpperCase().replace(/[\s-/]+/g, "_");
        const mapped = {
            GENERAL: "GENERAL_ENQUIRY",
            ENQUIRY: "GENERAL_ENQUIRY",
            DEVICE_REQUEST_SUPPORT: "DEVICE_REQUEST",
            INVENTORY_SUPPORT: "INVENTORY_ISSUE",
            REPAIR: "REPAIR_SUPPORT",
            RECYCLING: "RECYCLING_SUPPORT",
            DEPLOYMENT: "DEPLOYMENT_SUPPORT",
            TRAINING: "TRAINING_SUPPORT",
            ACCOUNT: "ACCOUNT_ACCESS",
            ACCESS: "ACCOUNT_ACCESS"
        };
        const candidate = mapped[category] ?? category;
        return supportCategories.includes(candidate) ? candidate : "GENERAL_ENQUIRY";
    }
    supportReference() {
        const year = new Date().getFullYear();
        const number = String((0, crypto_1.randomBytes)(2).readUInt16BE(0) % 10000).padStart(4, "0");
        return `SIT-SUP-${year}-${number}`;
    }
    supportSlaDueAt(source) {
        const explicit = this.safeString(source.slaDueAt);
        if (explicit)
            return explicit;
        const createdAt = this.safeString(source.createdAt);
        const created = createdAt ? new Date(createdAt) : new Date();
        const target = this.safeNumber(source.slaTargetHours) ?? this.supportSlaHours(source.priority ?? source.slaTarget);
        return new Date(created.getTime() + target * 60 * 60 * 1000).toISOString();
    }
    supportSlaHours(value) {
        const priority = this.supportPriority(value);
        if (priority === "URGENT")
            return 8;
        if (priority === "HIGH")
            return 24;
        if (priority === "LOW")
            return 120;
        return 72;
    }
    supportDueAt(ticket) {
        const value = this.safeString(ticket.slaDueAt ?? this.supportSlaDueAt(ticket));
        if (!value)
            return null;
        const date = new Date(value);
        return Number.isNaN(date.getTime()) ? null : date;
    }
    supportNoteLog(existing, note, request) {
        const notes = existing
            .map((item, index) => {
            const object = this.asObject(item);
            const text = this.safeString(object.note ?? object.message ?? object.title ?? item);
            return text ? {
                id: this.safeString(object.id) ?? `note-${index}`,
                note: text,
                createdAt: this.safeString(object.createdAt) ?? new Date().toISOString(),
                author: this.safeString(object.author ?? object.actorEmail) ?? null
            } : null;
        })
            .filter(Boolean);
        const text = this.safeString(note);
        if (text) {
            notes.push({
                id: (0, crypto_1.randomBytes)(8).toString("hex"),
                note: text,
                createdAt: new Date().toISOString(),
                author: request.user.email ?? request.user.uid
            });
        }
        return notes;
    }
    supportTimelineForUpdate(before, dto, request) {
        const entries = [];
        if ("status" in dto && this.supportStatus(before.status) !== this.supportStatus(dto.status)) {
            entries.push(this.timelineEntry("status", `Status changed to ${this.supportStatus(dto.status).replaceAll("_", " ")}`, request, {
                from: this.supportStatus(before.status),
                to: this.supportStatus(dto.status)
            }));
        }
        if ("assignedTo" in dto || "assignedOwner" in dto || "owner" in dto) {
            entries.push(this.timelineEntry("assignment", "Support owner updated", request, {
                from: before.assignedTo ?? before.assignedOwner ?? null,
                to: dto.assignedTo ?? dto.assignedOwner ?? dto.owner ?? null
            }));
        }
        if ("linkedInventoryId" in dto || "linkedRepairTicketId" in dto || "linkedDonationId" in dto || "linkedDeploymentId" in dto) {
            entries.push(this.timelineEntry("linked-record", "Linked support record updated", request, {
                linkedInventoryId: dto.linkedInventoryId ?? before.linkedInventoryId ?? null,
                linkedRepairTicketId: dto.linkedRepairTicketId ?? before.linkedRepairTicketId ?? null,
                linkedDonationId: dto.linkedDonationId ?? before.linkedDonationId ?? null,
                linkedDeploymentId: dto.linkedDeploymentId ?? before.linkedDeploymentId ?? null
            }));
        }
        if (dto.internalNote || dto.internalNotes) {
            entries.push(this.timelineEntry("internal-note", "Internal note added", request));
        }
        return entries;
    }
    enrichTrainingCohort(cohort) {
        const name = this.safeString(cohort.name ?? cohort.title ?? cohort.cohortName) ?? "Training cohort";
        const programmeType = this.trainingProgrammeType(cohort.programmeType ?? cohort.trainingPathway);
        const learnerRegister = this.trainingLearners(this.asArray(cohort.learnerRegister));
        const enrolledLearners = this.safeNumber(cohort.enrolledLearners ?? cohort.learnerCount) ?? learnerRegister.length;
        const targetLearners = this.safeNumber(cohort.targetLearners ?? cohort.learnerCount) ?? enrolledLearners;
        const attendanceRate = this.safeNumber(cohort.attendanceRate) ?? this.averageLearnerMetric(learnerRegister, "attendanceRate");
        const completionRate = this.safeNumber(cohort.completionRate) ?? this.averageLearnerMetric(learnerRegister, "completionRate");
        const readiness = this.trainingCertificationReadiness({
            ...cohort,
            learnerRegister,
            enrolledLearners,
            attendanceRate,
            completionRate
        });
        return {
            ...cohort,
            name,
            title: name,
            cohortName: name,
            programmeType,
            trainingPathway: cohort.trainingPathway ?? this.trainingProgrammeTypeLabel(programmeType),
            deliveryMode: this.trainingDeliveryMode(cohort.deliveryMode),
            status: this.trainingStatus(cohort.status),
            targetLearners,
            enrolledLearners,
            learnerCount: cohort.learnerCount ?? enrolledLearners,
            attendanceRate,
            completionRate,
            certificationReadiness: this.safeNumber(cohort.certificationReadiness) ?? readiness.score,
            certificationChecklist: cohort.certificationChecklist ?? readiness.checklist,
            learnerRegister,
            certificationEnabled: cohort.certificationEnabled === true,
            attendanceTrackingEnabled: cohort.attendanceTrackingEnabled === true,
            owner: cohort.owner ?? cohort.assignedOwner ?? null,
            assignedOwner: cohort.assignedOwner ?? cohort.owner ?? null,
            timeline: this.asArray(cohort.timeline)
        };
    }
    trainingCohortSummary(cohorts) {
        const totalLearners = cohorts.reduce((sum, cohort) => sum + (this.safeNumber(cohort.enrolledLearners ?? cohort.learnerCount) ?? this.asArray(cohort.learnerRegister).length), 0);
        const average = (key) => {
            const values = cohorts.map((cohort) => this.safeNumber(cohort[key])).filter((value) => value !== null);
            return values.length ? Math.round(values.reduce((sum, value) => sum + value, 0) / values.length) : 0;
        };
        return {
            totalCohorts: cohorts.length,
            totalLearners,
            activeCohorts: cohorts.filter((cohort) => this.trainingStatus(cohort.status) === "ACTIVE").length,
            certificationReady: cohorts.filter((cohort) => this.trainingStatus(cohort.status) === "CERTIFICATION_READY" ||
                (this.safeNumber(cohort.certificationReadiness) ?? 0) >= 80).length,
            sponsorFunded: cohorts.filter((cohort) => Boolean(this.safeString(cohort.sponsor))).length,
            schoolsLinked: cohorts.filter((cohort) => Boolean(this.safeString(cohort.hubOrSchool ?? cohort.organisation))).length,
            completionRate: average("completionRate"),
            attendanceRisk: cohorts.filter((cohort) => this.trainingStatus(cohort.status) === "AT_RISK" ||
                (this.safeNumber(cohort.attendanceRate) ?? 100) < 70).length
        };
    }
    trainingStatus(value) {
        const status = String(value ?? "DRAFT").toUpperCase().replace(/[\s-]+/g, "_");
        const mapped = {
            PLANNING: "DRAFT",
            PLANNED: "DRAFT",
            OPEN: "RECRUITING",
            RUNNING: "ACTIVE",
            LIVE: "ACTIVE",
            CERTIFICATION: "CERTIFICATION_READY",
            READY_FOR_CERTIFICATION: "CERTIFICATION_READY",
            DONE: "COMPLETED",
            CLOSED: "ARCHIVED",
            RISK: "AT_RISK"
        };
        const candidate = mapped[status] ?? status;
        return trainingStatuses.includes(candidate) ? candidate : "DRAFT";
    }
    trainingProgrammeType(value) {
        const type = String(value ?? "DIGITAL_LITERACY").toUpperCase().replace(/[\s-/]+/g, "_");
        const mapped = {
            AI: "AI_LITERACY",
            AI_LITERACY_COHORT: "AI_LITERACY",
            CYBERSECURITY: "CYBERSECURITY_AWARENESS",
            TEACHER_TRAINING: "TEACHER_ENABLEMENT",
            DEVICE_SETUP: "DEVICE_READINESS",
            EMPLOYABILITY: "EMPLOYABILITY_SKILLS",
            REPAIR_TRAINING: "REPAIR_TECHNICIAN_TRAINING",
            COMMUNITY: "COMMUNITY_HUB_TRAINING"
        };
        const candidate = mapped[type] ?? type;
        return trainingProgrammeTypes.includes(candidate) ? candidate : "DIGITAL_LITERACY";
    }
    trainingProgrammeTypeLabel(value) {
        const labels = {
            DIGITAL_LITERACY: "Digital literacy",
            AI_LITERACY: "AI literacy",
            CYBERSECURITY_AWARENESS: "Cybersecurity awareness",
            TEACHER_ENABLEMENT: "Teacher enablement",
            DEVICE_READINESS: "Device readiness",
            EMPLOYABILITY_SKILLS: "Employability skills",
            REPAIR_TECHNICIAN_TRAINING: "Repair technician training",
            COMMUNITY_HUB_TRAINING: "Community hub training"
        };
        return labels[value];
    }
    trainingDeliveryMode(value) {
        const mode = String(value ?? "IN_PERSON").toUpperCase().replace(/[\s-]+/g, "_");
        if (mode === "IN_PERSON" || mode === "ONLINE" || mode === "HYBRID")
            return mode;
        return "IN_PERSON";
    }
    trainingLearners(values) {
        return values
            .map((value, index) => {
            const item = this.asObject(value);
            const name = this.safeString(item.name ?? item.learnerName ?? item.fullName);
            if (!name)
                return null;
            return (0, sanitize_1.sanitizePayload)({
                id: this.safeString(item.id) ?? (0, crypto_1.randomBytes)(6).toString("hex"),
                name,
                email: this.safeString(item.email) ?? null,
                phone: this.safeString(item.phone) ?? null,
                attendanceRate: this.safeNumber(item.attendanceRate ?? item.attendance) ?? 0,
                completionRate: this.safeNumber(item.completionRate ?? item.completion) ?? 0,
                assessmentStatus: this.safeString(item.assessmentStatus ?? item.assessment) ?? null,
                certificateEligible: item.certificateEligible === true || String(item.certificateEligible ?? "").toLowerCase() === "yes",
                importedAt: this.safeString(item.importedAt) ?? new Date(Date.now() + index).toISOString()
            });
        })
            .filter((item) => Boolean(item));
    }
    averageLearnerMetric(learners, key) {
        const values = learners.map((learner) => this.safeNumber(learner[key])).filter((value) => value !== null);
        return values.length ? Math.round(values.reduce((sum, value) => sum + value, 0) / values.length) : 0;
    }
    trainingCertificationReadiness(source) {
        const learners = this.trainingLearners(this.asArray(source.learnerRegister));
        const attendanceRate = this.safeNumber(source.attendanceRate) ?? this.averageLearnerMetric(learners, "attendanceRate");
        const completionRate = this.safeNumber(source.completionRate) ?? this.averageLearnerMetric(learners, "completionRate");
        const checklist = [
            { id: "learner-register", label: "Learner register complete", completed: learners.length > 0 },
            { id: "attendance", label: "Minimum attendance reached", completed: attendanceRate >= 75 },
            { id: "assessment", label: "Assessment completed", completed: completionRate >= 80 || learners.some((learner) => /complete|passed/i.test(String(learner.assessmentStatus ?? ""))) },
            { id: "trainer-approval", label: "Trainer approval complete", completed: source.trainerApprovalComplete === true || Boolean(this.safeString(source.trainerNotes)) },
            { id: "sponsor-report", label: "Sponsor report ready", completed: source.sponsorReportReady === true || !this.safeString(source.sponsor) },
            { id: "template", label: "Certificate template selected", completed: source.certificateTemplateSelected === true || source.certificationEnabled === true },
            { id: "generated", label: "Certificates generated", completed: Boolean(this.asObject(source.certificateArtifacts).pdf) }
        ];
        const score = Math.round((checklist.filter((item) => item.completed).length / checklist.length) * 100);
        return { checklist, score };
    }
    trainingTimelineForUpdate(before, dto, request) {
        const entries = [];
        if ("status" in dto && this.trainingStatus(before.status) !== this.trainingStatus(dto.status)) {
            entries.push(this.timelineEntry("status", `Status changed to ${this.trainingStatus(dto.status).replaceAll("_", " ")}`, request, {
                from: this.trainingStatus(before.status),
                to: this.trainingStatus(dto.status)
            }));
        }
        if ("trainer" in dto || "owner" in dto || "assignedOwner" in dto) {
            entries.push(this.timelineEntry("assignment", "Cohort ownership updated", request, {
                trainer: dto.trainer ?? before.trainer ?? null,
                owner: dto.owner ?? dto.assignedOwner ?? before.owner ?? before.assignedOwner ?? null
            }));
        }
        if ("linkedDeploymentId" in dto || "linkedDeviceBatchId" in dto) {
            entries.push(this.timelineEntry("linked-record", "Linked cohort records updated", request, {
                linkedDeploymentId: dto.linkedDeploymentId ?? before.linkedDeploymentId ?? null,
                linkedDeviceBatchId: dto.linkedDeviceBatchId ?? before.linkedDeviceBatchId ?? null
            }));
        }
        if (dto.notes || dto.trainerNotes) {
            entries.push(this.timelineEntry("note", "Training note added", request));
        }
        return entries;
    }
    parseTrainingLearnerCsv(csv) {
        const rows = this.parseCsv(csv);
        if (rows.length <= 1)
            return [];
        const headers = rows[0].map((header) => header.trim().toLowerCase().replace(/[^a-z0-9]+/g, ""));
        const index = (names) => names.map((name) => headers.indexOf(name)).find((item) => item >= 0) ?? -1;
        const nameIndex = index(["name", "learnername", "fullname"]);
        const emailIndex = index(["email", "emailaddress"]);
        const phoneIndex = index(["phone", "phonenumber", "mobile"]);
        const attendanceIndex = index(["attendancerate", "attendance"]);
        const completionIndex = index(["completionrate", "completion"]);
        const assessmentIndex = index(["assessmentstatus", "assessment"]);
        const eligibleIndex = index(["certificateeligible", "eligible"]);
        return rows.slice(1).map((row) => ({
            name: row[nameIndex] ?? row[0] ?? "",
            email: emailIndex >= 0 ? row[emailIndex] : null,
            phone: phoneIndex >= 0 ? row[phoneIndex] : null,
            attendanceRate: attendanceIndex >= 0 ? this.safeNumber(row[attendanceIndex]) ?? 0 : 0,
            completionRate: completionIndex >= 0 ? this.safeNumber(row[completionIndex]) ?? 0 : 0,
            assessmentStatus: assessmentIndex >= 0 ? row[assessmentIndex] : null,
            certificateEligible: eligibleIndex >= 0 ? /yes|true|1/i.test(row[eligibleIndex]) : false,
            importedAt: new Date().toISOString()
        })).filter((learner) => this.safeString(learner.name));
    }
    parseCsv(csv) {
        const rows = [];
        let row = [];
        let cell = "";
        let quoted = false;
        for (let index = 0; index < csv.length; index += 1) {
            const char = csv[index];
            const next = csv[index + 1];
            if (char === "\"" && quoted && next === "\"") {
                cell += "\"";
                index += 1;
            }
            else if (char === "\"") {
                quoted = !quoted;
            }
            else if (char === "," && !quoted) {
                row.push(cell.trim());
                cell = "";
            }
            else if ((char === "\n" || char === "\r") && !quoted) {
                if (char === "\r" && next === "\n")
                    index += 1;
                row.push(cell.trim());
                if (row.some((value) => value.length > 0))
                    rows.push(row);
                row = [];
                cell = "";
            }
            else {
                cell += char;
            }
        }
        row.push(cell.trim());
        if (row.some((value) => value.length > 0))
            rows.push(row);
        return rows;
    }
    async trainingCertificatePdf(cohort, learners) {
        const pdf = await pdf_lib_1.PDFDocument.create();
        const regular = await pdf.embedFont(pdf_lib_1.StandardFonts.Helvetica);
        const bold = await pdf.embedFont(pdf_lib_1.StandardFonts.HelveticaBold);
        const cohortName = this.safeString(cohort.name ?? cohort.title ?? cohort.cohortName) ?? "Training cohort";
        const programme = this.trainingProgrammeTypeLabel(this.trainingProgrammeType(cohort.programmeType ?? cohort.trainingPathway));
        for (const learner of learners) {
            const page = pdf.addPage([842, 595]);
            page.drawRectangle({ x: 0, y: 515, width: 842, height: 80, color: (0, pdf_lib_1.rgb)(0.08, 0.08, 0.08) });
            page.drawText("SIT Digital Access", { x: 58, y: 555, size: 14, font: bold, color: (0, pdf_lib_1.rgb)(1, 1, 1) });
            page.drawText("Certificate of Completion", { x: 58, y: 525, size: 28, font: bold, color: (0, pdf_lib_1.rgb)(1, 0.82, 0.68) });
            page.drawText("This certifies that", { x: 58, y: 430, size: 16, font: regular, color: (0, pdf_lib_1.rgb)(0.25, 0.25, 0.25) });
            page.drawText(String(learner.name ?? "Learner").slice(0, 64), { x: 58, y: 385, size: 30, font: bold, color: (0, pdf_lib_1.rgb)(0.08, 0.08, 0.08) });
            page.drawText(`completed ${programme} as part of ${cohortName}.`, { x: 58, y: 340, size: 15, font: regular, color: (0, pdf_lib_1.rgb)(0.22, 0.22, 0.22), maxWidth: 720 });
            page.drawText(`Attendance: ${learner.attendanceRate ?? cohort.attendanceRate ?? 0}%`, { x: 58, y: 285, size: 12, font: regular, color: (0, pdf_lib_1.rgb)(0.3, 0.3, 0.3) });
            page.drawText(`Completion: ${learner.completionRate ?? cohort.completionRate ?? 0}%`, { x: 58, y: 260, size: 12, font: regular, color: (0, pdf_lib_1.rgb)(0.3, 0.3, 0.3) });
            page.drawText(`Issued ${new Date().toLocaleDateString("en-GB")}`, { x: 58, y: 150, size: 11, font: regular, color: (0, pdf_lib_1.rgb)(0.35, 0.35, 0.35) });
            page.drawText("Training Operations & Certification Centre", { x: 58, y: 118, size: 11, font: bold, color: (0, pdf_lib_1.rgb)(0.08, 0.08, 0.08) });
            page.drawRectangle({ x: 58, y: 82, width: 210, height: 2, color: (0, pdf_lib_1.rgb)(0.95, 0.42, 0.13) });
        }
        return pdf.save();
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