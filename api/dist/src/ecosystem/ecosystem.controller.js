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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EcosystemController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const admin_role_guard_1 = require("../auth/admin-role.guard");
const admin_roles_decorator_1 = require("../auth/admin-roles.decorator");
const firebase_auth_guard_1 = require("../auth/firebase-auth.guard");
const ecosystem_record_dto_1 = require("./dto/ecosystem-record.dto");
const ecosystem_service_1 = require("./ecosystem.service");
const adminRoles = [
    "admin",
    "operationsManager",
    "deviceManager",
    "donationsManager",
    "supportAgent",
    "deploymentCoordinator",
    "countryManager",
    "inventoryManager",
    "analyticsManager"
];
let EcosystemController = class EcosystemController {
    ecosystemService;
    constructor(ecosystemService) {
        this.ecosystemService = ecosystemService;
    }
    async publicStories() {
        return { data: await this.ecosystemService.listPublishedStories() };
    }
    async publicSustainabilitySummary() {
        return { data: await this.ecosystemService.sustainabilitySummary() };
    }
    async bookRepair(dto) {
        return { data: await this.ecosystemService.bookPublicRepair(dto) };
    }
    async createPublicRepair(dto) {
        return { data: await this.ecosystemService.bookPublicRepair(dto) };
    }
    async repairStatus(ticketId = "", token = "") {
        return { data: await this.ecosystemService.publicRepairStatus(ticketId, token) };
    }
    async search(query = "") {
        return { data: await this.ecosystemService.search(query) };
    }
    async listDeployments() {
        return { data: await this.ecosystemService.list("deployments") };
    }
    async createDeployment(dto, request) {
        return { data: await this.ecosystemService.create("deployments", dto, request) };
    }
    async updateDeployment(id, dto, request) {
        return { data: await this.ecosystemService.update("deployments", id, dto, request) };
    }
    async createQuote(id, dto, request) {
        return { data: await this.ecosystemService.createQuoteDraft(id, dto, request) };
    }
    async reserveInventory(id, dto, request) {
        return { data: await this.ecosystemService.reserveInventory(id, dto, request) };
    }
    async convertDeployment(id, dto, request) {
        return { data: await this.ecosystemService.createDeploymentFromDeviceRequest(id, dto, request) };
    }
    async listRecycling() {
        return { data: await this.ecosystemService.listRecyclingOperations() };
    }
    async createRecycling(dto, request) {
        return { data: await this.ecosystemService.createRecyclingRecord(dto, request) };
    }
    async updateRecycling(id, dto, request) {
        return { data: await this.ecosystemService.updateRecyclingRecord(id, dto, request) };
    }
    async uploadRecyclingAttachment(id, file, dto, request) {
        return { data: await this.ecosystemService.uploadRecyclingAttachment(id, file, dto, request) };
    }
    async recommendRecyclingRoute(id, request) {
        return { data: await this.ecosystemService.recommendRecyclingRoute(id, request) };
    }
    async generateRecyclingReportPack(id, dto, request) {
        return { data: await this.ecosystemService.generateRecyclingReportPack(id, dto, request) };
    }
    async listRecyclingPartners() {
        return { data: await this.ecosystemService.list("recyclingPartners") };
    }
    async createRecyclingPartner(dto, request) {
        return { data: await this.ecosystemService.create("recyclingPartners", dto, request) };
    }
    async updateRecyclingPartner(id, dto, request) {
        return { data: await this.ecosystemService.update("recyclingPartners", id, dto, request) };
    }
    async scheduleCollection(id, dto, request) {
        return { data: await this.ecosystemService.scheduleCollection(id, dto, request) };
    }
    async listSupport() {
        return { data: await this.ecosystemService.listSupportOperations() };
    }
    async createSupport(dto, request) {
        return { data: await this.ecosystemService.createSupportTicketRecord(dto, request) };
    }
    async getSupport(id) {
        return { data: await this.ecosystemService.getSupportTicket(id) };
    }
    async updateSupport(id, dto, request) {
        return { data: await this.ecosystemService.updateSupportTicketRecord(id, dto, request) };
    }
    async assignSupport(id, dto, request) {
        return { data: await this.ecosystemService.assignSupportTicket(id, dto, request) };
    }
    async escalateSupport(id, dto, request) {
        return { data: await this.ecosystemService.escalateSupportTicket(id, dto, request) };
    }
    async closeSupport(id, dto, request) {
        return { data: await this.ecosystemService.closeSupportTicket(id, dto, request) };
    }
    async linkSupportRecord(id, dto, request) {
        return { data: await this.ecosystemService.linkSupportRecord(id, dto, request) };
    }
    async listSupportTickets() {
        return { data: await this.ecosystemService.listSupportOperations() };
    }
    async createSupportTicket(dto, request) {
        return { data: await this.ecosystemService.createSupportTicketRecord(dto, request) };
    }
    async getSupportTicket(id) {
        return { data: await this.ecosystemService.getSupportTicket(id) };
    }
    async updateSupportTicket(id, dto, request) {
        return { data: await this.ecosystemService.updateSupportTicketRecord(id, dto, request) };
    }
    async createSupportTicketFromInventory(id, dto, request) {
        return { data: await this.ecosystemService.createSupportTicketFromInventory(id, dto, request) };
    }
    async listRepairTickets() {
        return { data: await this.ecosystemService.listRepairOperations() };
    }
    async createRepairTicket(dto, request) {
        return { data: await this.ecosystemService.createRepairTicket(dto, request) };
    }
    async updateRepairTicket(id, dto, request) {
        return { data: await this.ecosystemService.updateRepairTicket(id, dto, request) };
    }
    async uploadRepairAttachment(id, file, request) {
        return { data: await this.ecosystemService.uploadRepairAttachment(id, file, request) };
    }
    async triageRepairTicket(id, request) {
        return { data: await this.ecosystemService.triageRepairTicket(id, request) };
    }
    async createRepairTicketFromInventory(id, dto, request) {
        return { data: await this.ecosystemService.createRepairTicketFromInventory(id, dto, request) };
    }
    async listRepairParts() {
        return { data: await this.ecosystemService.list("repairParts") };
    }
    async createRepairPart(dto, request) {
        return { data: await this.ecosystemService.create("repairParts", dto, request) };
    }
    async updateRepairPart(id, dto, request) {
        return { data: await this.ecosystemService.update("repairParts", id, dto, request) };
    }
    async listRepairTechnicians() {
        return { data: await this.ecosystemService.list("repairTechnicians") };
    }
    async createRepairTechnician(dto, request) {
        return { data: await this.ecosystemService.create("repairTechnicians", dto, request) };
    }
    async updateRepairTechnician(id, dto, request) {
        return { data: await this.ecosystemService.update("repairTechnicians", id, dto, request) };
    }
    async listNotifications() {
        return { data: await this.ecosystemService.list("notifications") };
    }
    async createNotification(dto, request) {
        return { data: await this.ecosystemService.createNotification(dto, request) };
    }
    async markNotificationRead(id, request) {
        return { data: await this.ecosystemService.markNotification(id, true, request) };
    }
    async markNotificationUnread(id, request) {
        return { data: await this.ecosystemService.markNotification(id, false, request) };
    }
    async retryNotification(id, request) {
        return { data: await this.ecosystemService.retryNotification(id, request) };
    }
    async listSavedViews(workspace, request) {
        return { data: await this.ecosystemService.listSavedViews(workspace, request) };
    }
    async createSavedView(dto, request) {
        return { data: await this.ecosystemService.create("savedViews", dto, request) };
    }
    async updateSavedView(id, dto, request) {
        return { data: await this.ecosystemService.update("savedViews", id, dto, request) };
    }
    async deleteSavedView(id, request) {
        return { data: await this.ecosystemService.deleteSavedView(id, request) };
    }
    async listSuccessStories() {
        return { data: await this.ecosystemService.listSuccessStoryOperations() };
    }
    async createSuccessStory(dto, request) {
        return { data: await this.ecosystemService.createSuccessStoryRecord(dto, request) };
    }
    async seedSuccessStories(request) {
        return { data: await this.ecosystemService.seedDefaultStories(request) };
    }
    async generateSuccessStoryDraft(dto, request) {
        return { data: await this.ecosystemService.generateSuccessStoryDraft(dto, request) };
    }
    async updateSuccessStory(id, dto, request) {
        return { data: await this.ecosystemService.updateSuccessStoryRecord(id, dto, request) };
    }
    async deleteSuccessStory(id, request) {
        return { data: await this.ecosystemService.deleteSuccessStory(id, request) };
    }
    async publishSuccessStory(id, request) {
        return { data: await this.ecosystemService.publishStory(id, true, request) };
    }
    async unpublishSuccessStory(id, request) {
        return { data: await this.ecosystemService.publishStory(id, false, request) };
    }
    async featureSuccessStory(id, request) {
        return { data: await this.ecosystemService.featureStory(id, true, request) };
    }
    async listTrainingCohorts() {
        return { data: await this.ecosystemService.listTrainingCohortOperations() };
    }
    async createTrainingCohort(dto, request) {
        return { data: await this.ecosystemService.createTrainingCohortRecord(dto, request) };
    }
    async importTrainingLearners(id, file, request) {
        return { data: await this.ecosystemService.importTrainingLearners(id, file, request) };
    }
    async generateTrainingCertificates(id, request) {
        return { data: await this.ecosystemService.generateTrainingCertificates(id, request) };
    }
    async markTrainingCohortActive(id, request) {
        return { data: await this.ecosystemService.markTrainingCohortActive(id, request) };
    }
    async completeTrainingCohort(id, request) {
        return { data: await this.ecosystemService.completeTrainingCohort(id, request) };
    }
    async exportTrainingRegister(id) {
        return { data: await this.ecosystemService.exportTrainingRegister(id) };
    }
    async getTrainingCohort(id) {
        return { data: await this.ecosystemService.getTrainingCohort(id) };
    }
    async updateTrainingCohort(id, dto, request) {
        return { data: await this.ecosystemService.updateTrainingCohortRecord(id, dto, request) };
    }
    async listSustainabilityReports() {
        return { data: await this.ecosystemService.listSustainabilityReportOperations() };
    }
    async createSustainabilityReport(dto, request) {
        return { data: await this.ecosystemService.create("sustainabilityReports", dto, request) };
    }
    async generateSustainabilityReport(dto, request) {
        return { data: await this.ecosystemService.generateSustainabilityReport(dto, request) };
    }
    async exportSustainabilityReportPdf(id) {
        return { data: await this.ecosystemService.exportSustainabilityReport(id, "pdf") };
    }
    async exportSustainabilityReportCsv(id) {
        return { data: await this.ecosystemService.exportSustainabilityReport(id, "csv") };
    }
    async getSustainabilityReport(id) {
        return { data: await this.ecosystemService.getSustainabilityReport(id) };
    }
};
exports.EcosystemController = EcosystemController;
__decorate([
    (0, common_1.Get)("success-stories"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EcosystemController.prototype, "publicStories", null);
__decorate([
    (0, common_1.Get)("sustainability/summary"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EcosystemController.prototype, "publicSustainabilitySummary", null);
__decorate([
    (0, common_1.Post)("repairs/book"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ecosystem_record_dto_1.EcosystemRecordDto]),
    __metadata("design:returntype", Promise)
], EcosystemController.prototype, "bookRepair", null);
__decorate([
    (0, common_1.Post)("repairs"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ecosystem_record_dto_1.EcosystemRecordDto]),
    __metadata("design:returntype", Promise)
], EcosystemController.prototype, "createPublicRepair", null);
__decorate([
    (0, common_1.Get)("repairs/status"),
    __param(0, (0, common_1.Query)("ticketId")),
    __param(1, (0, common_1.Query)("token")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EcosystemController.prototype, "repairStatus", null);
__decorate([
    (0, common_1.Get)("admin/search"),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, admin_roles_decorator_1.AdminRoles)(...adminRoles),
    __param(0, (0, common_1.Query)("q")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EcosystemController.prototype, "search", null);
__decorate([
    (0, common_1.Get)("admin/deployments"),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, admin_roles_decorator_1.AdminRoles)(...adminRoles),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EcosystemController.prototype, "listDeployments", null);
__decorate([
    (0, common_1.Post)("admin/deployments"),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, admin_roles_decorator_1.AdminRoles)(...adminRoles),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ecosystem_record_dto_1.EcosystemRecordDto, Object]),
    __metadata("design:returntype", Promise)
], EcosystemController.prototype, "createDeployment", null);
__decorate([
    (0, common_1.Patch)("admin/deployments/:id"),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, admin_roles_decorator_1.AdminRoles)(...adminRoles),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, ecosystem_record_dto_1.EcosystemRecordDto, Object]),
    __metadata("design:returntype", Promise)
], EcosystemController.prototype, "updateDeployment", null);
__decorate([
    (0, common_1.Post)("admin/device-requests/:id/quote"),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, admin_roles_decorator_1.AdminRoles)(...adminRoles),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, ecosystem_record_dto_1.EcosystemRecordDto, Object]),
    __metadata("design:returntype", Promise)
], EcosystemController.prototype, "createQuote", null);
__decorate([
    (0, common_1.Post)("admin/device-requests/:id/reserve"),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, admin_roles_decorator_1.AdminRoles)(...adminRoles),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, ecosystem_record_dto_1.EcosystemRecordDto, Object]),
    __metadata("design:returntype", Promise)
], EcosystemController.prototype, "reserveInventory", null);
__decorate([
    (0, common_1.Post)("admin/device-requests/:id/convert-deployment"),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, admin_roles_decorator_1.AdminRoles)(...adminRoles),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, ecosystem_record_dto_1.EcosystemRecordDto, Object]),
    __metadata("design:returntype", Promise)
], EcosystemController.prototype, "convertDeployment", null);
__decorate([
    (0, common_1.Get)("admin/recycling"),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, admin_roles_decorator_1.AdminRoles)(...adminRoles),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EcosystemController.prototype, "listRecycling", null);
__decorate([
    (0, common_1.Post)("admin/recycling"),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, admin_roles_decorator_1.AdminRoles)(...adminRoles),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ecosystem_record_dto_1.EcosystemRecordDto, Object]),
    __metadata("design:returntype", Promise)
], EcosystemController.prototype, "createRecycling", null);
__decorate([
    (0, common_1.Patch)("admin/recycling/:id"),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, admin_roles_decorator_1.AdminRoles)(...adminRoles),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, ecosystem_record_dto_1.EcosystemRecordDto, Object]),
    __metadata("design:returntype", Promise)
], EcosystemController.prototype, "updateRecycling", null);
__decorate([
    (0, common_1.Post)("admin/recycling/:id/attachments"),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, admin_roles_decorator_1.AdminRoles)(...adminRoles),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("file")),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, ecosystem_record_dto_1.EcosystemRecordDto, Object]),
    __metadata("design:returntype", Promise)
], EcosystemController.prototype, "uploadRecyclingAttachment", null);
__decorate([
    (0, common_1.Post)("admin/recycling/:id/recommendation"),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, admin_roles_decorator_1.AdminRoles)(...adminRoles),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], EcosystemController.prototype, "recommendRecyclingRoute", null);
__decorate([
    (0, common_1.Post)("admin/recycling/:id/report-pack"),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, admin_roles_decorator_1.AdminRoles)(...adminRoles),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, ecosystem_record_dto_1.EcosystemRecordDto, Object]),
    __metadata("design:returntype", Promise)
], EcosystemController.prototype, "generateRecyclingReportPack", null);
__decorate([
    (0, common_1.Get)("admin/recycling-partners"),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, admin_roles_decorator_1.AdminRoles)(...adminRoles),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EcosystemController.prototype, "listRecyclingPartners", null);
__decorate([
    (0, common_1.Post)("admin/recycling-partners"),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, admin_roles_decorator_1.AdminRoles)(...adminRoles),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ecosystem_record_dto_1.EcosystemRecordDto, Object]),
    __metadata("design:returntype", Promise)
], EcosystemController.prototype, "createRecyclingPartner", null);
__decorate([
    (0, common_1.Patch)("admin/recycling-partners/:id"),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, admin_roles_decorator_1.AdminRoles)(...adminRoles),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, ecosystem_record_dto_1.EcosystemRecordDto, Object]),
    __metadata("design:returntype", Promise)
], EcosystemController.prototype, "updateRecyclingPartner", null);
__decorate([
    (0, common_1.Post)("admin/donations/:id/schedule-collection"),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, admin_roles_decorator_1.AdminRoles)(...adminRoles),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, ecosystem_record_dto_1.EcosystemRecordDto, Object]),
    __metadata("design:returntype", Promise)
], EcosystemController.prototype, "scheduleCollection", null);
__decorate([
    (0, common_1.Get)("admin/support"),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, admin_roles_decorator_1.AdminRoles)(...adminRoles),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EcosystemController.prototype, "listSupport", null);
__decorate([
    (0, common_1.Post)("admin/support"),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, admin_roles_decorator_1.AdminRoles)(...adminRoles),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ecosystem_record_dto_1.EcosystemRecordDto, Object]),
    __metadata("design:returntype", Promise)
], EcosystemController.prototype, "createSupport", null);
__decorate([
    (0, common_1.Get)("admin/support/:id"),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, admin_roles_decorator_1.AdminRoles)(...adminRoles),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EcosystemController.prototype, "getSupport", null);
__decorate([
    (0, common_1.Patch)("admin/support/:id"),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, admin_roles_decorator_1.AdminRoles)(...adminRoles),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, ecosystem_record_dto_1.EcosystemRecordDto, Object]),
    __metadata("design:returntype", Promise)
], EcosystemController.prototype, "updateSupport", null);
__decorate([
    (0, common_1.Post)("admin/support/:id/assign"),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, admin_roles_decorator_1.AdminRoles)(...adminRoles),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, ecosystem_record_dto_1.EcosystemRecordDto, Object]),
    __metadata("design:returntype", Promise)
], EcosystemController.prototype, "assignSupport", null);
__decorate([
    (0, common_1.Post)("admin/support/:id/escalate"),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, admin_roles_decorator_1.AdminRoles)(...adminRoles),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, ecosystem_record_dto_1.EcosystemRecordDto, Object]),
    __metadata("design:returntype", Promise)
], EcosystemController.prototype, "escalateSupport", null);
__decorate([
    (0, common_1.Post)("admin/support/:id/close"),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, admin_roles_decorator_1.AdminRoles)(...adminRoles),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, ecosystem_record_dto_1.EcosystemRecordDto, Object]),
    __metadata("design:returntype", Promise)
], EcosystemController.prototype, "closeSupport", null);
__decorate([
    (0, common_1.Post)("admin/support/:id/link-record"),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, admin_roles_decorator_1.AdminRoles)(...adminRoles),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, ecosystem_record_dto_1.EcosystemRecordDto, Object]),
    __metadata("design:returntype", Promise)
], EcosystemController.prototype, "linkSupportRecord", null);
__decorate([
    (0, common_1.Get)("admin/support-tickets"),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, admin_roles_decorator_1.AdminRoles)(...adminRoles),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EcosystemController.prototype, "listSupportTickets", null);
__decorate([
    (0, common_1.Post)("admin/support-tickets"),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, admin_roles_decorator_1.AdminRoles)(...adminRoles),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ecosystem_record_dto_1.EcosystemRecordDto, Object]),
    __metadata("design:returntype", Promise)
], EcosystemController.prototype, "createSupportTicket", null);
__decorate([
    (0, common_1.Get)("admin/support-tickets/:id"),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, admin_roles_decorator_1.AdminRoles)(...adminRoles),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EcosystemController.prototype, "getSupportTicket", null);
__decorate([
    (0, common_1.Patch)("admin/support-tickets/:id"),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, admin_roles_decorator_1.AdminRoles)(...adminRoles),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, ecosystem_record_dto_1.EcosystemRecordDto, Object]),
    __metadata("design:returntype", Promise)
], EcosystemController.prototype, "updateSupportTicket", null);
__decorate([
    (0, common_1.Post)("admin/inventory/:id/support-ticket"),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, admin_roles_decorator_1.AdminRoles)(...adminRoles),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, ecosystem_record_dto_1.EcosystemRecordDto, Object]),
    __metadata("design:returntype", Promise)
], EcosystemController.prototype, "createSupportTicketFromInventory", null);
__decorate([
    (0, common_1.Get)("admin/repairs"),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, admin_roles_decorator_1.AdminRoles)(...adminRoles),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EcosystemController.prototype, "listRepairTickets", null);
__decorate([
    (0, common_1.Post)("admin/repairs"),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, admin_roles_decorator_1.AdminRoles)(...adminRoles),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ecosystem_record_dto_1.EcosystemRecordDto, Object]),
    __metadata("design:returntype", Promise)
], EcosystemController.prototype, "createRepairTicket", null);
__decorate([
    (0, common_1.Patch)("admin/repairs/:id"),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, admin_roles_decorator_1.AdminRoles)(...adminRoles),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, ecosystem_record_dto_1.EcosystemRecordDto, Object]),
    __metadata("design:returntype", Promise)
], EcosystemController.prototype, "updateRepairTicket", null);
__decorate([
    (0, common_1.Post)("admin/repairs/:id/attachments"),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, admin_roles_decorator_1.AdminRoles)(...adminRoles),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("file")),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], EcosystemController.prototype, "uploadRepairAttachment", null);
__decorate([
    (0, common_1.Post)("admin/repairs/:id/triage"),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, admin_roles_decorator_1.AdminRoles)(...adminRoles),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], EcosystemController.prototype, "triageRepairTicket", null);
__decorate([
    (0, common_1.Post)("admin/inventory/:id/repair-ticket"),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, admin_roles_decorator_1.AdminRoles)(...adminRoles),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, ecosystem_record_dto_1.EcosystemRecordDto, Object]),
    __metadata("design:returntype", Promise)
], EcosystemController.prototype, "createRepairTicketFromInventory", null);
__decorate([
    (0, common_1.Get)("admin/repair-parts"),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, admin_roles_decorator_1.AdminRoles)(...adminRoles),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EcosystemController.prototype, "listRepairParts", null);
__decorate([
    (0, common_1.Post)("admin/repair-parts"),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, admin_roles_decorator_1.AdminRoles)(...adminRoles),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ecosystem_record_dto_1.EcosystemRecordDto, Object]),
    __metadata("design:returntype", Promise)
], EcosystemController.prototype, "createRepairPart", null);
__decorate([
    (0, common_1.Patch)("admin/repair-parts/:id"),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, admin_roles_decorator_1.AdminRoles)(...adminRoles),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, ecosystem_record_dto_1.EcosystemRecordDto, Object]),
    __metadata("design:returntype", Promise)
], EcosystemController.prototype, "updateRepairPart", null);
__decorate([
    (0, common_1.Get)("admin/repair-technicians"),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, admin_roles_decorator_1.AdminRoles)(...adminRoles),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EcosystemController.prototype, "listRepairTechnicians", null);
__decorate([
    (0, common_1.Post)("admin/repair-technicians"),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, admin_roles_decorator_1.AdminRoles)(...adminRoles),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ecosystem_record_dto_1.EcosystemRecordDto, Object]),
    __metadata("design:returntype", Promise)
], EcosystemController.prototype, "createRepairTechnician", null);
__decorate([
    (0, common_1.Patch)("admin/repair-technicians/:id"),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, admin_roles_decorator_1.AdminRoles)(...adminRoles),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, ecosystem_record_dto_1.EcosystemRecordDto, Object]),
    __metadata("design:returntype", Promise)
], EcosystemController.prototype, "updateRepairTechnician", null);
__decorate([
    (0, common_1.Get)("admin/notifications"),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, admin_roles_decorator_1.AdminRoles)(...adminRoles),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EcosystemController.prototype, "listNotifications", null);
__decorate([
    (0, common_1.Post)("admin/notifications"),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, admin_roles_decorator_1.AdminRoles)(...adminRoles),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ecosystem_record_dto_1.EcosystemRecordDto, Object]),
    __metadata("design:returntype", Promise)
], EcosystemController.prototype, "createNotification", null);
__decorate([
    (0, common_1.Post)("admin/notifications/:id/read"),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, admin_roles_decorator_1.AdminRoles)(...adminRoles),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], EcosystemController.prototype, "markNotificationRead", null);
__decorate([
    (0, common_1.Post)("admin/notifications/:id/unread"),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, admin_roles_decorator_1.AdminRoles)(...adminRoles),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], EcosystemController.prototype, "markNotificationUnread", null);
__decorate([
    (0, common_1.Post)("admin/notifications/:id/retry"),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, admin_roles_decorator_1.AdminRoles)(...adminRoles),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], EcosystemController.prototype, "retryNotification", null);
__decorate([
    (0, common_1.Get)("admin/saved-views"),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, admin_roles_decorator_1.AdminRoles)(...adminRoles),
    __param(0, (0, common_1.Query)("workspace")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EcosystemController.prototype, "listSavedViews", null);
__decorate([
    (0, common_1.Post)("admin/saved-views"),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, admin_roles_decorator_1.AdminRoles)(...adminRoles),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ecosystem_record_dto_1.EcosystemRecordDto, Object]),
    __metadata("design:returntype", Promise)
], EcosystemController.prototype, "createSavedView", null);
__decorate([
    (0, common_1.Patch)("admin/saved-views/:id"),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, admin_roles_decorator_1.AdminRoles)(...adminRoles),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, ecosystem_record_dto_1.EcosystemRecordDto, Object]),
    __metadata("design:returntype", Promise)
], EcosystemController.prototype, "updateSavedView", null);
__decorate([
    (0, common_1.Delete)("admin/saved-views/:id"),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, admin_roles_decorator_1.AdminRoles)(...adminRoles),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], EcosystemController.prototype, "deleteSavedView", null);
__decorate([
    (0, common_1.Get)("admin/success-stories"),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, admin_roles_decorator_1.AdminRoles)(...adminRoles),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EcosystemController.prototype, "listSuccessStories", null);
__decorate([
    (0, common_1.Post)("admin/success-stories"),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, admin_roles_decorator_1.AdminRoles)(...adminRoles),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ecosystem_record_dto_1.EcosystemRecordDto, Object]),
    __metadata("design:returntype", Promise)
], EcosystemController.prototype, "createSuccessStory", null);
__decorate([
    (0, common_1.Post)("admin/success-stories/seed"),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, admin_roles_decorator_1.AdminRoles)(...adminRoles),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EcosystemController.prototype, "seedSuccessStories", null);
__decorate([
    (0, common_1.Post)("admin/success-stories/ai-draft"),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, admin_roles_decorator_1.AdminRoles)(...adminRoles),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ecosystem_record_dto_1.EcosystemRecordDto, Object]),
    __metadata("design:returntype", Promise)
], EcosystemController.prototype, "generateSuccessStoryDraft", null);
__decorate([
    (0, common_1.Patch)("admin/success-stories/:id"),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, admin_roles_decorator_1.AdminRoles)(...adminRoles),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, ecosystem_record_dto_1.EcosystemRecordDto, Object]),
    __metadata("design:returntype", Promise)
], EcosystemController.prototype, "updateSuccessStory", null);
__decorate([
    (0, common_1.Delete)("admin/success-stories/:id"),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, admin_roles_decorator_1.AdminRoles)(...adminRoles),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], EcosystemController.prototype, "deleteSuccessStory", null);
__decorate([
    (0, common_1.Post)("admin/success-stories/:id/publish"),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, admin_roles_decorator_1.AdminRoles)(...adminRoles),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], EcosystemController.prototype, "publishSuccessStory", null);
__decorate([
    (0, common_1.Post)("admin/success-stories/:id/unpublish"),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, admin_roles_decorator_1.AdminRoles)(...adminRoles),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], EcosystemController.prototype, "unpublishSuccessStory", null);
__decorate([
    (0, common_1.Post)("admin/success-stories/:id/feature"),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, admin_roles_decorator_1.AdminRoles)(...adminRoles),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], EcosystemController.prototype, "featureSuccessStory", null);
__decorate([
    (0, common_1.Get)("admin/training-cohorts"),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, admin_roles_decorator_1.AdminRoles)(...adminRoles),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EcosystemController.prototype, "listTrainingCohorts", null);
__decorate([
    (0, common_1.Post)("admin/training-cohorts"),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, admin_roles_decorator_1.AdminRoles)(...adminRoles),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ecosystem_record_dto_1.EcosystemRecordDto, Object]),
    __metadata("design:returntype", Promise)
], EcosystemController.prototype, "createTrainingCohort", null);
__decorate([
    (0, common_1.Post)("admin/training-cohorts/:id/import-learners"),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, admin_roles_decorator_1.AdminRoles)(...adminRoles),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("file")),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], EcosystemController.prototype, "importTrainingLearners", null);
__decorate([
    (0, common_1.Post)("admin/training-cohorts/:id/generate-certificates"),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, admin_roles_decorator_1.AdminRoles)(...adminRoles),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], EcosystemController.prototype, "generateTrainingCertificates", null);
__decorate([
    (0, common_1.Post)("admin/training-cohorts/:id/mark-active"),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, admin_roles_decorator_1.AdminRoles)(...adminRoles),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], EcosystemController.prototype, "markTrainingCohortActive", null);
__decorate([
    (0, common_1.Post)("admin/training-cohorts/:id/complete"),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, admin_roles_decorator_1.AdminRoles)(...adminRoles),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], EcosystemController.prototype, "completeTrainingCohort", null);
__decorate([
    (0, common_1.Get)("admin/training-cohorts/:id/export-register"),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, admin_roles_decorator_1.AdminRoles)(...adminRoles),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EcosystemController.prototype, "exportTrainingRegister", null);
__decorate([
    (0, common_1.Get)("admin/training-cohorts/:id"),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, admin_roles_decorator_1.AdminRoles)(...adminRoles),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EcosystemController.prototype, "getTrainingCohort", null);
__decorate([
    (0, common_1.Patch)("admin/training-cohorts/:id"),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, admin_roles_decorator_1.AdminRoles)(...adminRoles),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, ecosystem_record_dto_1.EcosystemRecordDto, Object]),
    __metadata("design:returntype", Promise)
], EcosystemController.prototype, "updateTrainingCohort", null);
__decorate([
    (0, common_1.Get)("admin/sustainability-reports"),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, admin_roles_decorator_1.AdminRoles)(...adminRoles),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EcosystemController.prototype, "listSustainabilityReports", null);
__decorate([
    (0, common_1.Post)("admin/sustainability-reports"),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, admin_roles_decorator_1.AdminRoles)(...adminRoles),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ecosystem_record_dto_1.EcosystemRecordDto, Object]),
    __metadata("design:returntype", Promise)
], EcosystemController.prototype, "createSustainabilityReport", null);
__decorate([
    (0, common_1.Post)("admin/sustainability-reports/generate"),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, admin_roles_decorator_1.AdminRoles)(...adminRoles),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ecosystem_record_dto_1.EcosystemRecordDto, Object]),
    __metadata("design:returntype", Promise)
], EcosystemController.prototype, "generateSustainabilityReport", null);
__decorate([
    (0, common_1.Get)("admin/sustainability-reports/:id/export/pdf"),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, admin_roles_decorator_1.AdminRoles)(...adminRoles),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EcosystemController.prototype, "exportSustainabilityReportPdf", null);
__decorate([
    (0, common_1.Get)("admin/sustainability-reports/:id/export/csv"),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, admin_roles_decorator_1.AdminRoles)(...adminRoles),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EcosystemController.prototype, "exportSustainabilityReportCsv", null);
__decorate([
    (0, common_1.Get)("admin/sustainability-reports/:id"),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard, admin_role_guard_1.AdminRoleGuard),
    (0, admin_roles_decorator_1.AdminRoles)(...adminRoles),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EcosystemController.prototype, "getSustainabilityReport", null);
exports.EcosystemController = EcosystemController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [ecosystem_service_1.EcosystemService])
], EcosystemController);
//# sourceMappingURL=ecosystem.controller.js.map