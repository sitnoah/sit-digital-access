import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { AdminRoleGuard } from "../auth/admin-role.guard";
import { AdminRoles } from "../auth/admin-roles.decorator";
import { FirebaseAuthGuard } from "../auth/firebase-auth.guard";
import type { AuthenticatedRequest } from "../common/types";
import { EcosystemRecordDto } from "./dto/ecosystem-record.dto";
import { EcosystemService } from "./ecosystem.service";

type UploadedAdminFile = {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  size: number;
};

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
] as const;

@Controller()
export class EcosystemController {
  constructor(private readonly ecosystemService: EcosystemService) {}

  @Get("success-stories")
  async publicStories() {
    return { data: await this.ecosystemService.listPublishedStories() };
  }

  @Get("sustainability/summary")
  async publicSustainabilitySummary() {
    return { data: await this.ecosystemService.sustainabilitySummary() };
  }

  @Post("repairs/book")
  async bookRepair(@Body() dto: EcosystemRecordDto) {
    return { data: await this.ecosystemService.bookPublicRepair(dto) };
  }

  @Post("repairs")
  async createPublicRepair(@Body() dto: EcosystemRecordDto) {
    return { data: await this.ecosystemService.bookPublicRepair(dto) };
  }

  @Get("repairs/status")
  async repairStatus(@Query("ticketId") ticketId = "", @Query("token") token = "") {
    return { data: await this.ecosystemService.publicRepairStatus(ticketId, token) };
  }

  @Get("admin/search")
  @UseGuards(FirebaseAuthGuard, AdminRoleGuard)
  @AdminRoles(...adminRoles)
  async search(@Query("q") query = "") {
    return { data: await this.ecosystemService.search(query) };
  }

  @Get("admin/deployments")
  @UseGuards(FirebaseAuthGuard, AdminRoleGuard)
  @AdminRoles(...adminRoles)
  async listDeployments() {
    return { data: await this.ecosystemService.list("deployments") };
  }

  @Post("admin/deployments")
  @UseGuards(FirebaseAuthGuard, AdminRoleGuard)
  @AdminRoles(...adminRoles)
  async createDeployment(@Body() dto: EcosystemRecordDto, @Req() request: AuthenticatedRequest) {
    return { data: await this.ecosystemService.create("deployments", dto, request) };
  }

  @Patch("admin/deployments/:id")
  @UseGuards(FirebaseAuthGuard, AdminRoleGuard)
  @AdminRoles(...adminRoles)
  async updateDeployment(@Param("id") id: string, @Body() dto: EcosystemRecordDto, @Req() request: AuthenticatedRequest) {
    return { data: await this.ecosystemService.update("deployments", id, dto, request) };
  }

  @Post("admin/device-requests/:id/quote")
  @UseGuards(FirebaseAuthGuard, AdminRoleGuard)
  @AdminRoles(...adminRoles)
  async createQuote(@Param("id") id: string, @Body() dto: EcosystemRecordDto, @Req() request: AuthenticatedRequest) {
    return { data: await this.ecosystemService.createQuoteDraft(id, dto, request) };
  }

  @Post("admin/device-requests/:id/reserve")
  @UseGuards(FirebaseAuthGuard, AdminRoleGuard)
  @AdminRoles(...adminRoles)
  async reserveInventory(@Param("id") id: string, @Body() dto: EcosystemRecordDto, @Req() request: AuthenticatedRequest) {
    return { data: await this.ecosystemService.reserveInventory(id, dto, request) };
  }

  @Post("admin/device-requests/:id/convert-deployment")
  @UseGuards(FirebaseAuthGuard, AdminRoleGuard)
  @AdminRoles(...adminRoles)
  async convertDeployment(@Param("id") id: string, @Body() dto: EcosystemRecordDto, @Req() request: AuthenticatedRequest) {
    return { data: await this.ecosystemService.createDeploymentFromDeviceRequest(id, dto, request) };
  }

  @Get("admin/recycling")
  @UseGuards(FirebaseAuthGuard, AdminRoleGuard)
  @AdminRoles(...adminRoles)
  async listRecycling() {
    return { data: await this.ecosystemService.listRecyclingOperations() };
  }

  @Post("admin/recycling")
  @UseGuards(FirebaseAuthGuard, AdminRoleGuard)
  @AdminRoles(...adminRoles)
  async createRecycling(@Body() dto: EcosystemRecordDto, @Req() request: AuthenticatedRequest) {
    return { data: await this.ecosystemService.createRecyclingRecord(dto, request) };
  }

  @Patch("admin/recycling/:id")
  @UseGuards(FirebaseAuthGuard, AdminRoleGuard)
  @AdminRoles(...adminRoles)
  async updateRecycling(@Param("id") id: string, @Body() dto: EcosystemRecordDto, @Req() request: AuthenticatedRequest) {
    return { data: await this.ecosystemService.updateRecyclingRecord(id, dto, request) };
  }

  @Post("admin/recycling/:id/attachments")
  @UseGuards(FirebaseAuthGuard, AdminRoleGuard)
  @AdminRoles(...adminRoles)
  @UseInterceptors(FileInterceptor("file"))
  async uploadRecyclingAttachment(@Param("id") id: string, @UploadedFile() file: UploadedAdminFile, @Body() dto: EcosystemRecordDto, @Req() request: AuthenticatedRequest) {
    return { data: await this.ecosystemService.uploadRecyclingAttachment(id, file, dto, request) };
  }

  @Post("admin/recycling/:id/recommendation")
  @UseGuards(FirebaseAuthGuard, AdminRoleGuard)
  @AdminRoles(...adminRoles)
  async recommendRecyclingRoute(@Param("id") id: string, @Req() request: AuthenticatedRequest) {
    return { data: await this.ecosystemService.recommendRecyclingRoute(id, request) };
  }

  @Post("admin/recycling/:id/report-pack")
  @UseGuards(FirebaseAuthGuard, AdminRoleGuard)
  @AdminRoles(...adminRoles)
  async generateRecyclingReportPack(@Param("id") id: string, @Body() dto: EcosystemRecordDto, @Req() request: AuthenticatedRequest) {
    return { data: await this.ecosystemService.generateRecyclingReportPack(id, dto, request) };
  }

  @Get("admin/recycling-partners")
  @UseGuards(FirebaseAuthGuard, AdminRoleGuard)
  @AdminRoles(...adminRoles)
  async listRecyclingPartners() {
    return { data: await this.ecosystemService.list("recyclingPartners") };
  }

  @Post("admin/recycling-partners")
  @UseGuards(FirebaseAuthGuard, AdminRoleGuard)
  @AdminRoles(...adminRoles)
  async createRecyclingPartner(@Body() dto: EcosystemRecordDto, @Req() request: AuthenticatedRequest) {
    return { data: await this.ecosystemService.create("recyclingPartners", dto, request) };
  }

  @Patch("admin/recycling-partners/:id")
  @UseGuards(FirebaseAuthGuard, AdminRoleGuard)
  @AdminRoles(...adminRoles)
  async updateRecyclingPartner(@Param("id") id: string, @Body() dto: EcosystemRecordDto, @Req() request: AuthenticatedRequest) {
    return { data: await this.ecosystemService.update("recyclingPartners", id, dto, request) };
  }

  @Post("admin/donations/:id/schedule-collection")
  @UseGuards(FirebaseAuthGuard, AdminRoleGuard)
  @AdminRoles(...adminRoles)
  async scheduleCollection(@Param("id") id: string, @Body() dto: EcosystemRecordDto, @Req() request: AuthenticatedRequest) {
    return { data: await this.ecosystemService.scheduleCollection(id, dto, request) };
  }

  @Get("admin/support")
  @UseGuards(FirebaseAuthGuard, AdminRoleGuard)
  @AdminRoles(...adminRoles)
  async listSupport() {
    return { data: await this.ecosystemService.listSupportOperations() };
  }

  @Post("admin/support")
  @UseGuards(FirebaseAuthGuard, AdminRoleGuard)
  @AdminRoles(...adminRoles)
  async createSupport(@Body() dto: EcosystemRecordDto, @Req() request: AuthenticatedRequest) {
    return { data: await this.ecosystemService.createSupportTicketRecord(dto, request) };
  }

  @Get("admin/support/:id")
  @UseGuards(FirebaseAuthGuard, AdminRoleGuard)
  @AdminRoles(...adminRoles)
  async getSupport(@Param("id") id: string) {
    return { data: await this.ecosystemService.getSupportTicket(id) };
  }

  @Patch("admin/support/:id")
  @UseGuards(FirebaseAuthGuard, AdminRoleGuard)
  @AdminRoles(...adminRoles)
  async updateSupport(@Param("id") id: string, @Body() dto: EcosystemRecordDto, @Req() request: AuthenticatedRequest) {
    return { data: await this.ecosystemService.updateSupportTicketRecord(id, dto, request) };
  }

  @Post("admin/support/:id/assign")
  @UseGuards(FirebaseAuthGuard, AdminRoleGuard)
  @AdminRoles(...adminRoles)
  async assignSupport(@Param("id") id: string, @Body() dto: EcosystemRecordDto, @Req() request: AuthenticatedRequest) {
    return { data: await this.ecosystemService.assignSupportTicket(id, dto, request) };
  }

  @Post("admin/support/:id/escalate")
  @UseGuards(FirebaseAuthGuard, AdminRoleGuard)
  @AdminRoles(...adminRoles)
  async escalateSupport(@Param("id") id: string, @Body() dto: EcosystemRecordDto, @Req() request: AuthenticatedRequest) {
    return { data: await this.ecosystemService.escalateSupportTicket(id, dto, request) };
  }

  @Post("admin/support/:id/close")
  @UseGuards(FirebaseAuthGuard, AdminRoleGuard)
  @AdminRoles(...adminRoles)
  async closeSupport(@Param("id") id: string, @Body() dto: EcosystemRecordDto, @Req() request: AuthenticatedRequest) {
    return { data: await this.ecosystemService.closeSupportTicket(id, dto, request) };
  }

  @Post("admin/support/:id/link-record")
  @UseGuards(FirebaseAuthGuard, AdminRoleGuard)
  @AdminRoles(...adminRoles)
  async linkSupportRecord(@Param("id") id: string, @Body() dto: EcosystemRecordDto, @Req() request: AuthenticatedRequest) {
    return { data: await this.ecosystemService.linkSupportRecord(id, dto, request) };
  }

  @Get("admin/support-tickets")
  @UseGuards(FirebaseAuthGuard, AdminRoleGuard)
  @AdminRoles(...adminRoles)
  async listSupportTickets() {
    return { data: await this.ecosystemService.listSupportOperations() };
  }

  @Post("admin/support-tickets")
  @UseGuards(FirebaseAuthGuard, AdminRoleGuard)
  @AdminRoles(...adminRoles)
  async createSupportTicket(@Body() dto: EcosystemRecordDto, @Req() request: AuthenticatedRequest) {
    return { data: await this.ecosystemService.createSupportTicketRecord(dto, request) };
  }

  @Get("admin/support-tickets/:id")
  @UseGuards(FirebaseAuthGuard, AdminRoleGuard)
  @AdminRoles(...adminRoles)
  async getSupportTicket(@Param("id") id: string) {
    return { data: await this.ecosystemService.getSupportTicket(id) };
  }

  @Patch("admin/support-tickets/:id")
  @UseGuards(FirebaseAuthGuard, AdminRoleGuard)
  @AdminRoles(...adminRoles)
  async updateSupportTicket(@Param("id") id: string, @Body() dto: EcosystemRecordDto, @Req() request: AuthenticatedRequest) {
    return { data: await this.ecosystemService.updateSupportTicketRecord(id, dto, request) };
  }

  @Post("admin/inventory/:id/support-ticket")
  @UseGuards(FirebaseAuthGuard, AdminRoleGuard)
  @AdminRoles(...adminRoles)
  async createSupportTicketFromInventory(@Param("id") id: string, @Body() dto: EcosystemRecordDto, @Req() request: AuthenticatedRequest) {
    return { data: await this.ecosystemService.createSupportTicketFromInventory(id, dto, request) };
  }

  @Get("admin/repairs")
  @UseGuards(FirebaseAuthGuard, AdminRoleGuard)
  @AdminRoles(...adminRoles)
  async listRepairTickets() {
    return { data: await this.ecosystemService.listRepairOperations() };
  }

  @Post("admin/repairs")
  @UseGuards(FirebaseAuthGuard, AdminRoleGuard)
  @AdminRoles(...adminRoles)
  async createRepairTicket(@Body() dto: EcosystemRecordDto, @Req() request: AuthenticatedRequest) {
    return { data: await this.ecosystemService.createRepairTicket(dto, request) };
  }

  @Patch("admin/repairs/:id")
  @UseGuards(FirebaseAuthGuard, AdminRoleGuard)
  @AdminRoles(...adminRoles)
  async updateRepairTicket(@Param("id") id: string, @Body() dto: EcosystemRecordDto, @Req() request: AuthenticatedRequest) {
    return { data: await this.ecosystemService.updateRepairTicket(id, dto, request) };
  }

  @Post("admin/repairs/:id/attachments")
  @UseGuards(FirebaseAuthGuard, AdminRoleGuard)
  @AdminRoles(...adminRoles)
  @UseInterceptors(FileInterceptor("file"))
  async uploadRepairAttachment(@Param("id") id: string, @UploadedFile() file: UploadedAdminFile, @Req() request: AuthenticatedRequest) {
    return { data: await this.ecosystemService.uploadRepairAttachment(id, file, request) };
  }

  @Post("admin/repairs/:id/triage")
  @UseGuards(FirebaseAuthGuard, AdminRoleGuard)
  @AdminRoles(...adminRoles)
  async triageRepairTicket(@Param("id") id: string, @Req() request: AuthenticatedRequest) {
    return { data: await this.ecosystemService.triageRepairTicket(id, request) };
  }

  @Post("admin/inventory/:id/repair-ticket")
  @UseGuards(FirebaseAuthGuard, AdminRoleGuard)
  @AdminRoles(...adminRoles)
  async createRepairTicketFromInventory(@Param("id") id: string, @Body() dto: EcosystemRecordDto, @Req() request: AuthenticatedRequest) {
    return { data: await this.ecosystemService.createRepairTicketFromInventory(id, dto, request) };
  }

  @Get("admin/repair-parts")
  @UseGuards(FirebaseAuthGuard, AdminRoleGuard)
  @AdminRoles(...adminRoles)
  async listRepairParts() {
    return { data: await this.ecosystemService.list("repairParts") };
  }

  @Post("admin/repair-parts")
  @UseGuards(FirebaseAuthGuard, AdminRoleGuard)
  @AdminRoles(...adminRoles)
  async createRepairPart(@Body() dto: EcosystemRecordDto, @Req() request: AuthenticatedRequest) {
    return { data: await this.ecosystemService.create("repairParts", dto, request) };
  }

  @Patch("admin/repair-parts/:id")
  @UseGuards(FirebaseAuthGuard, AdminRoleGuard)
  @AdminRoles(...adminRoles)
  async updateRepairPart(@Param("id") id: string, @Body() dto: EcosystemRecordDto, @Req() request: AuthenticatedRequest) {
    return { data: await this.ecosystemService.update("repairParts", id, dto, request) };
  }

  @Get("admin/repair-technicians")
  @UseGuards(FirebaseAuthGuard, AdminRoleGuard)
  @AdminRoles(...adminRoles)
  async listRepairTechnicians() {
    return { data: await this.ecosystemService.list("repairTechnicians") };
  }

  @Post("admin/repair-technicians")
  @UseGuards(FirebaseAuthGuard, AdminRoleGuard)
  @AdminRoles(...adminRoles)
  async createRepairTechnician(@Body() dto: EcosystemRecordDto, @Req() request: AuthenticatedRequest) {
    return { data: await this.ecosystemService.create("repairTechnicians", dto, request) };
  }

  @Patch("admin/repair-technicians/:id")
  @UseGuards(FirebaseAuthGuard, AdminRoleGuard)
  @AdminRoles(...adminRoles)
  async updateRepairTechnician(@Param("id") id: string, @Body() dto: EcosystemRecordDto, @Req() request: AuthenticatedRequest) {
    return { data: await this.ecosystemService.update("repairTechnicians", id, dto, request) };
  }

  @Get("admin/notifications")
  @UseGuards(FirebaseAuthGuard, AdminRoleGuard)
  @AdminRoles(...adminRoles)
  async listNotifications() {
    return { data: await this.ecosystemService.list("notifications") };
  }

  @Post("admin/notifications")
  @UseGuards(FirebaseAuthGuard, AdminRoleGuard)
  @AdminRoles(...adminRoles)
  async createNotification(@Body() dto: EcosystemRecordDto, @Req() request: AuthenticatedRequest) {
    return { data: await this.ecosystemService.createNotification(dto, request) };
  }

  @Post("admin/notifications/:id/read")
  @UseGuards(FirebaseAuthGuard, AdminRoleGuard)
  @AdminRoles(...adminRoles)
  async markNotificationRead(@Param("id") id: string, @Req() request: AuthenticatedRequest) {
    return { data: await this.ecosystemService.markNotification(id, true, request) };
  }

  @Post("admin/notifications/:id/unread")
  @UseGuards(FirebaseAuthGuard, AdminRoleGuard)
  @AdminRoles(...adminRoles)
  async markNotificationUnread(@Param("id") id: string, @Req() request: AuthenticatedRequest) {
    return { data: await this.ecosystemService.markNotification(id, false, request) };
  }

  @Post("admin/notifications/:id/retry")
  @UseGuards(FirebaseAuthGuard, AdminRoleGuard)
  @AdminRoles(...adminRoles)
  async retryNotification(@Param("id") id: string, @Req() request: AuthenticatedRequest) {
    return { data: await this.ecosystemService.retryNotification(id, request) };
  }

  @Get("admin/saved-views")
  @UseGuards(FirebaseAuthGuard, AdminRoleGuard)
  @AdminRoles(...adminRoles)
  async listSavedViews(@Query("workspace") workspace: string | undefined, @Req() request: AuthenticatedRequest) {
    return { data: await this.ecosystemService.listSavedViews(workspace, request) };
  }

  @Post("admin/saved-views")
  @UseGuards(FirebaseAuthGuard, AdminRoleGuard)
  @AdminRoles(...adminRoles)
  async createSavedView(@Body() dto: EcosystemRecordDto, @Req() request: AuthenticatedRequest) {
    return { data: await this.ecosystemService.create("savedViews", dto, request) };
  }

  @Patch("admin/saved-views/:id")
  @UseGuards(FirebaseAuthGuard, AdminRoleGuard)
  @AdminRoles(...adminRoles)
  async updateSavedView(@Param("id") id: string, @Body() dto: EcosystemRecordDto, @Req() request: AuthenticatedRequest) {
    return { data: await this.ecosystemService.update("savedViews", id, dto, request) };
  }

  @Delete("admin/saved-views/:id")
  @UseGuards(FirebaseAuthGuard, AdminRoleGuard)
  @AdminRoles(...adminRoles)
  async deleteSavedView(@Param("id") id: string, @Req() request: AuthenticatedRequest) {
    return { data: await this.ecosystemService.deleteSavedView(id, request) };
  }

  @Get("admin/success-stories")
  @UseGuards(FirebaseAuthGuard, AdminRoleGuard)
  @AdminRoles(...adminRoles)
  async listSuccessStories() {
    return { data: await this.ecosystemService.listSuccessStoryOperations() };
  }

  @Post("admin/success-stories")
  @UseGuards(FirebaseAuthGuard, AdminRoleGuard)
  @AdminRoles(...adminRoles)
  async createSuccessStory(@Body() dto: EcosystemRecordDto, @Req() request: AuthenticatedRequest) {
    return { data: await this.ecosystemService.createSuccessStoryRecord(dto, request) };
  }

  @Post("admin/success-stories/seed")
  @UseGuards(FirebaseAuthGuard, AdminRoleGuard)
  @AdminRoles(...adminRoles)
  async seedSuccessStories(@Req() request: AuthenticatedRequest) {
    return { data: await this.ecosystemService.seedDefaultStories(request) };
  }

  @Post("admin/success-stories/ai-draft")
  @UseGuards(FirebaseAuthGuard, AdminRoleGuard)
  @AdminRoles(...adminRoles)
  async generateSuccessStoryDraft(@Body() dto: EcosystemRecordDto, @Req() request: AuthenticatedRequest) {
    return { data: await this.ecosystemService.generateSuccessStoryDraft(dto, request) };
  }

  @Patch("admin/success-stories/:id")
  @UseGuards(FirebaseAuthGuard, AdminRoleGuard)
  @AdminRoles(...adminRoles)
  async updateSuccessStory(@Param("id") id: string, @Body() dto: EcosystemRecordDto, @Req() request: AuthenticatedRequest) {
    return { data: await this.ecosystemService.updateSuccessStoryRecord(id, dto, request) };
  }

  @Delete("admin/success-stories/:id")
  @UseGuards(FirebaseAuthGuard, AdminRoleGuard)
  @AdminRoles(...adminRoles)
  async deleteSuccessStory(@Param("id") id: string, @Req() request: AuthenticatedRequest) {
    return { data: await this.ecosystemService.deleteSuccessStory(id, request) };
  }

  @Post("admin/success-stories/:id/publish")
  @UseGuards(FirebaseAuthGuard, AdminRoleGuard)
  @AdminRoles(...adminRoles)
  async publishSuccessStory(@Param("id") id: string, @Req() request: AuthenticatedRequest) {
    return { data: await this.ecosystemService.publishStory(id, true, request) };
  }

  @Post("admin/success-stories/:id/unpublish")
  @UseGuards(FirebaseAuthGuard, AdminRoleGuard)
  @AdminRoles(...adminRoles)
  async unpublishSuccessStory(@Param("id") id: string, @Req() request: AuthenticatedRequest) {
    return { data: await this.ecosystemService.publishStory(id, false, request) };
  }

  @Post("admin/success-stories/:id/feature")
  @UseGuards(FirebaseAuthGuard, AdminRoleGuard)
  @AdminRoles(...adminRoles)
  async featureSuccessStory(@Param("id") id: string, @Req() request: AuthenticatedRequest) {
    return { data: await this.ecosystemService.featureStory(id, true, request) };
  }

  @Get("admin/training-cohorts")
  @UseGuards(FirebaseAuthGuard, AdminRoleGuard)
  @AdminRoles(...adminRoles)
  async listTrainingCohorts() {
    return { data: await this.ecosystemService.listTrainingCohortOperations() };
  }

  @Post("admin/training-cohorts")
  @UseGuards(FirebaseAuthGuard, AdminRoleGuard)
  @AdminRoles(...adminRoles)
  async createTrainingCohort(@Body() dto: EcosystemRecordDto, @Req() request: AuthenticatedRequest) {
    return { data: await this.ecosystemService.createTrainingCohortRecord(dto, request) };
  }

  @Post("admin/training-cohorts/:id/import-learners")
  @UseGuards(FirebaseAuthGuard, AdminRoleGuard)
  @AdminRoles(...adminRoles)
  @UseInterceptors(FileInterceptor("file"))
  async importTrainingLearners(@Param("id") id: string, @UploadedFile() file: UploadedAdminFile, @Req() request: AuthenticatedRequest) {
    return { data: await this.ecosystemService.importTrainingLearners(id, file, request) };
  }

  @Post("admin/training-cohorts/:id/generate-certificates")
  @UseGuards(FirebaseAuthGuard, AdminRoleGuard)
  @AdminRoles(...adminRoles)
  async generateTrainingCertificates(@Param("id") id: string, @Req() request: AuthenticatedRequest) {
    return { data: await this.ecosystemService.generateTrainingCertificates(id, request) };
  }

  @Post("admin/training-cohorts/:id/mark-active")
  @UseGuards(FirebaseAuthGuard, AdminRoleGuard)
  @AdminRoles(...adminRoles)
  async markTrainingCohortActive(@Param("id") id: string, @Req() request: AuthenticatedRequest) {
    return { data: await this.ecosystemService.markTrainingCohortActive(id, request) };
  }

  @Post("admin/training-cohorts/:id/complete")
  @UseGuards(FirebaseAuthGuard, AdminRoleGuard)
  @AdminRoles(...adminRoles)
  async completeTrainingCohort(@Param("id") id: string, @Req() request: AuthenticatedRequest) {
    return { data: await this.ecosystemService.completeTrainingCohort(id, request) };
  }

  @Get("admin/training-cohorts/:id/export-register")
  @UseGuards(FirebaseAuthGuard, AdminRoleGuard)
  @AdminRoles(...adminRoles)
  async exportTrainingRegister(@Param("id") id: string) {
    return { data: await this.ecosystemService.exportTrainingRegister(id) };
  }

  @Get("admin/training-cohorts/:id")
  @UseGuards(FirebaseAuthGuard, AdminRoleGuard)
  @AdminRoles(...adminRoles)
  async getTrainingCohort(@Param("id") id: string) {
    return { data: await this.ecosystemService.getTrainingCohort(id) };
  }

  @Patch("admin/training-cohorts/:id")
  @UseGuards(FirebaseAuthGuard, AdminRoleGuard)
  @AdminRoles(...adminRoles)
  async updateTrainingCohort(@Param("id") id: string, @Body() dto: EcosystemRecordDto, @Req() request: AuthenticatedRequest) {
    return { data: await this.ecosystemService.updateTrainingCohortRecord(id, dto, request) };
  }

  @Get("admin/sustainability-reports")
  @UseGuards(FirebaseAuthGuard, AdminRoleGuard)
  @AdminRoles(...adminRoles)
  async listSustainabilityReports() {
    return { data: await this.ecosystemService.listSustainabilityReportOperations() };
  }

  @Post("admin/sustainability-reports")
  @UseGuards(FirebaseAuthGuard, AdminRoleGuard)
  @AdminRoles(...adminRoles)
  async createSustainabilityReport(@Body() dto: EcosystemRecordDto, @Req() request: AuthenticatedRequest) {
    return { data: await this.ecosystemService.create("sustainabilityReports", dto, request) };
  }

  @Post("admin/sustainability-reports/generate")
  @UseGuards(FirebaseAuthGuard, AdminRoleGuard)
  @AdminRoles(...adminRoles)
  async generateSustainabilityReport(@Body() dto: EcosystemRecordDto, @Req() request: AuthenticatedRequest) {
    return { data: await this.ecosystemService.generateSustainabilityReport(dto, request) };
  }

  @Get("admin/sustainability-reports/:id/export/pdf")
  @UseGuards(FirebaseAuthGuard, AdminRoleGuard)
  @AdminRoles(...adminRoles)
  async exportSustainabilityReportPdf(@Param("id") id: string) {
    return { data: await this.ecosystemService.exportSustainabilityReport(id, "pdf") };
  }

  @Get("admin/sustainability-reports/:id/export/csv")
  @UseGuards(FirebaseAuthGuard, AdminRoleGuard)
  @AdminRoles(...adminRoles)
  async exportSustainabilityReportCsv(@Param("id") id: string) {
    return { data: await this.ecosystemService.exportSustainabilityReport(id, "csv") };
  }

  @Get("admin/sustainability-reports/:id")
  @UseGuards(FirebaseAuthGuard, AdminRoleGuard)
  @AdminRoles(...adminRoles)
  async getSustainabilityReport(@Param("id") id: string) {
    return { data: await this.ecosystemService.getSustainabilityReport(id) };
  }
}
