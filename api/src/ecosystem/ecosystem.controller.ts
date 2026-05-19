import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { AdminRoleGuard } from "../auth/admin-role.guard";
import { AdminRoles } from "../auth/admin-roles.decorator";
import { FirebaseAuthGuard } from "../auth/firebase-auth.guard";
import type { AuthenticatedRequest } from "../common/types";
import { EcosystemRecordDto } from "./dto/ecosystem-record.dto";
import { EcosystemService } from "./ecosystem.service";

type UploadedRepairFile = {
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
    return { data: await this.ecosystemService.list("recycling") };
  }

  @Post("admin/recycling")
  @UseGuards(FirebaseAuthGuard, AdminRoleGuard)
  @AdminRoles(...adminRoles)
  async createRecycling(@Body() dto: EcosystemRecordDto, @Req() request: AuthenticatedRequest) {
    return { data: await this.ecosystemService.create("recycling", dto, request) };
  }

  @Patch("admin/recycling/:id")
  @UseGuards(FirebaseAuthGuard, AdminRoleGuard)
  @AdminRoles(...adminRoles)
  async updateRecycling(@Param("id") id: string, @Body() dto: EcosystemRecordDto, @Req() request: AuthenticatedRequest) {
    return { data: await this.ecosystemService.update("recycling", id, dto, request) };
  }

  @Post("admin/donations/:id/schedule-collection")
  @UseGuards(FirebaseAuthGuard, AdminRoleGuard)
  @AdminRoles(...adminRoles)
  async scheduleCollection(@Param("id") id: string, @Body() dto: EcosystemRecordDto, @Req() request: AuthenticatedRequest) {
    return { data: await this.ecosystemService.scheduleCollection(id, dto, request) };
  }

  @Get("admin/support-tickets")
  @UseGuards(FirebaseAuthGuard, AdminRoleGuard)
  @AdminRoles(...adminRoles)
  async listSupportTickets() {
    return { data: await this.ecosystemService.list("supportTickets") };
  }

  @Post("admin/support-tickets")
  @UseGuards(FirebaseAuthGuard, AdminRoleGuard)
  @AdminRoles(...adminRoles)
  async createSupportTicket(@Body() dto: EcosystemRecordDto, @Req() request: AuthenticatedRequest) {
    return { data: await this.ecosystemService.create("supportTickets", dto, request) };
  }

  @Patch("admin/support-tickets/:id")
  @UseGuards(FirebaseAuthGuard, AdminRoleGuard)
  @AdminRoles(...adminRoles)
  async updateSupportTicket(@Param("id") id: string, @Body() dto: EcosystemRecordDto, @Req() request: AuthenticatedRequest) {
    return { data: await this.ecosystemService.update("supportTickets", id, dto, request) };
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
  async uploadRepairAttachment(@Param("id") id: string, @UploadedFile() file: UploadedRepairFile, @Req() request: AuthenticatedRequest) {
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
    return { data: await this.ecosystemService.list("successStories") };
  }

  @Post("admin/success-stories")
  @UseGuards(FirebaseAuthGuard, AdminRoleGuard)
  @AdminRoles(...adminRoles)
  async createSuccessStory(@Body() dto: EcosystemRecordDto, @Req() request: AuthenticatedRequest) {
    return { data: await this.ecosystemService.create("successStories", dto, request) };
  }

  @Post("admin/success-stories/seed")
  @UseGuards(FirebaseAuthGuard, AdminRoleGuard)
  @AdminRoles(...adminRoles)
  async seedSuccessStories(@Req() request: AuthenticatedRequest) {
    return { data: await this.ecosystemService.seedDefaultStories(request) };
  }

  @Patch("admin/success-stories/:id")
  @UseGuards(FirebaseAuthGuard, AdminRoleGuard)
  @AdminRoles(...adminRoles)
  async updateSuccessStory(@Param("id") id: string, @Body() dto: EcosystemRecordDto, @Req() request: AuthenticatedRequest) {
    return { data: await this.ecosystemService.update("successStories", id, dto, request) };
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

  @Get("admin/training-cohorts")
  @UseGuards(FirebaseAuthGuard, AdminRoleGuard)
  @AdminRoles(...adminRoles)
  async listTrainingCohorts() {
    return { data: await this.ecosystemService.list("trainingCohorts") };
  }

  @Post("admin/training-cohorts")
  @UseGuards(FirebaseAuthGuard, AdminRoleGuard)
  @AdminRoles(...adminRoles)
  async createTrainingCohort(@Body() dto: EcosystemRecordDto, @Req() request: AuthenticatedRequest) {
    return { data: await this.ecosystemService.create("trainingCohorts", dto, request) };
  }

  @Patch("admin/training-cohorts/:id")
  @UseGuards(FirebaseAuthGuard, AdminRoleGuard)
  @AdminRoles(...adminRoles)
  async updateTrainingCohort(@Param("id") id: string, @Body() dto: EcosystemRecordDto, @Req() request: AuthenticatedRequest) {
    return { data: await this.ecosystemService.update("trainingCohorts", id, dto, request) };
  }

  @Get("admin/sustainability-reports")
  @UseGuards(FirebaseAuthGuard, AdminRoleGuard)
  @AdminRoles(...adminRoles)
  async listSustainabilityReports() {
    return { data: await this.ecosystemService.list("sustainabilityReports") };
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
}
