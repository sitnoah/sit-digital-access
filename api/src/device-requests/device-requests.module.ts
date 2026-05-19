import { Module } from "@nestjs/common";
import { AuditModule } from "../audit/audit.module";
import { FirebaseAdminModule } from "../firebase/firebase-admin.module";
import { DeviceRequestsController } from "./device-requests.controller";
import { DeviceRequestsService } from "./device-requests.service";

@Module({
  imports: [FirebaseAdminModule, AuditModule],
  controllers: [DeviceRequestsController],
  providers: [DeviceRequestsService]
})
export class DeviceRequestsModule {}
