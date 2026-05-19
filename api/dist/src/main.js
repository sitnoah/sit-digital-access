"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const helmet_1 = __importDefault(require("helmet"));
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
function parseOrigins(value) {
    return (value ?? "")
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean);
}
function localDevOrigins() {
    if (process.env.NODE_ENV === "production")
        return [];
    return [3000, 3001, 3002, 3003, 3004].flatMap((port) => [
        `http://localhost:${port}`,
        `http://127.0.0.1:${port}`
    ]);
}
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const config = app.get(config_1.ConfigService);
    const allowedOrigins = Array.from(new Set([
        ...parseOrigins(config.get("ADMIN_WEB_ORIGINS")),
        ...localDevOrigins()
    ]));
    app.use((0, helmet_1.default)());
    app.enableCors({
        origin(origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
                return;
            }
            callback(new Error(`Origin ${origin} is not allowed by CORS`), false);
        },
        credentials: true,
        methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"]
    });
    app.setGlobalPrefix("api/v1");
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true }
    }));
    const port = config.get("PORT") ?? 8080;
    await app.listen(port, "0.0.0.0");
}
void bootstrap();
//# sourceMappingURL=main.js.map