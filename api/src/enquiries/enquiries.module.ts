import { Module } from "@nestjs/common";
import { AuditModule } from "../audit/audit.module";
import { FirebaseAdminModule } from "../firebase/firebase-admin.module";
import { EnquiriesController } from "./enquiries.controller";
import { EnquiriesService } from "./enquiries.service";

@Module({
  imports: [FirebaseAdminModule, AuditModule],
  controllers: [EnquiriesController],
  providers: [EnquiriesService]
})
export class EnquiriesModule {}
