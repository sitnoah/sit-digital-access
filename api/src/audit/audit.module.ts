import { Module } from "@nestjs/common";
import { FirebaseAdminModule } from "../firebase/firebase-admin.module";
import { AuditController } from "./audit.controller";
import { AuditService } from "./audit.service";

@Module({
  imports: [FirebaseAdminModule],
  controllers: [AuditController],
  providers: [AuditService],
  exports: [AuditService]
})
export class AuditModule {}
