import { Module } from "@nestjs/common";
import { AuditModule } from "../audit/audit.module";
import { FirebaseAdminModule } from "../firebase/firebase-admin.module";
import { AdminUsersController } from "./admin-users.controller";
import { AdminUsersService } from "./admin-users.service";

@Module({
  imports: [FirebaseAdminModule, AuditModule],
  controllers: [AdminUsersController],
  providers: [AdminUsersService]
})
export class AdminUsersModule {}
