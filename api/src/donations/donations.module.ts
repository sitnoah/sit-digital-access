import { Module } from "@nestjs/common";
import { AuditModule } from "../audit/audit.module";
import { FirebaseAdminModule } from "../firebase/firebase-admin.module";
import { DonationsController } from "./donations.controller";
import { DonationsService } from "./donations.service";

@Module({
  imports: [FirebaseAdminModule, AuditModule],
  controllers: [DonationsController],
  providers: [DonationsService]
})
export class DonationsModule {}
