import { Controller, Get } from "@nestjs/common";

function configured(value: string | undefined) {
  return Boolean(value && value.trim().length > 0);
}

@Controller()
export class HealthController {
  @Get("health")
  getHealth() {
    return {
      data: {
        status: "ok",
        service: "sit-digital-access-api",
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV ?? "local",
        uptimeSeconds: Math.round(process.uptime()),
        backendConfig: {
          FIREBASE_PROJECT_ID: configured(process.env.FIREBASE_PROJECT_ID),
          FIREBASE_CLIENT_EMAIL: configured(process.env.FIREBASE_CLIENT_EMAIL),
          FIREBASE_PRIVATE_KEY: configured(process.env.FIREBASE_PRIVATE_KEY),
          ADMIN_WEB_ORIGINS: configured(process.env.ADMIN_WEB_ORIGINS),
          PORT: configured(process.env.PORT)
        }
      }
    };
  }
}
