import { Module } from "@nestjs/common";
import { AuditModule } from "../audit/audit.module";
import { FirebaseAdminModule } from "../firebase/firebase-admin.module";
import { EcosystemController } from "./ecosystem.controller";
import { EcosystemService } from "./ecosystem.service";
import { EcosystemIntegrationsService } from "./integrations.service";

@Module({
  imports: [AuditModule, FirebaseAdminModule],
  controllers: [EcosystemController],
  providers: [EcosystemService, EcosystemIntegrationsService],
  exports: [EcosystemService, EcosystemIntegrationsService]
})
export class EcosystemModule {}
