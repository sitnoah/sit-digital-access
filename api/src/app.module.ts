import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { AdminUsersModule } from "./admin-users/admin-users.module";
import { AuditModule } from "./audit/audit.module";
import { DeviceRequestsModule } from "./device-requests/device-requests.module";
import { DonationsModule } from "./donations/donations.module";
import { EnquiriesModule } from "./enquiries/enquiries.module";
import { EcosystemModule } from "./ecosystem/ecosystem.module";
import { FirebaseAdminModule } from "./firebase/firebase-admin.module";
import { HealthModule } from "./health/health.module";
import { ImpactModule } from "./impact/impact.module";
import { InventoryModule } from "./inventory/inventory.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([
      {
        ttl: 60_000,
        limit: 40
      }
    ]),
    FirebaseAdminModule,
    HealthModule,
    AuditModule,
    EnquiriesModule,
    DeviceRequestsModule,
    DonationsModule,
    InventoryModule,
    ImpactModule,
    AdminUsersModule,
    EcosystemModule
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
  ]
})
export class AppModule {}
