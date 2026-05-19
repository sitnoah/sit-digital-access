import { Module } from "@nestjs/common";
import { AuditModule } from "../audit/audit.module";
import { FirebaseAdminModule } from "../firebase/firebase-admin.module";
import { ImpactController } from "./impact.controller";
import { ImpactService } from "./impact.service";

@Module({
  imports: [FirebaseAdminModule, AuditModule],
  controllers: [ImpactController],
  providers: [ImpactService]
})
export class ImpactModule {}
