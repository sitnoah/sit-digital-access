import "reflect-metadata";
import helmet from "helmet";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

function parseOrigins(value?: string): string[] {
  return (value ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

function localDevOrigins() {
  if (process.env.NODE_ENV === "production") return [];
  return [3000, 3001, 3002, 3003, 3004].flatMap((port) => [
    `http://localhost:${port}`,
    `http://127.0.0.1:${port}`
  ]);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const allowedOrigins = Array.from(new Set([
    ...parseOrigins(config.get<string>("ADMIN_WEB_ORIGINS")),
    ...localDevOrigins()
  ]));

  app.use(helmet());
  app.enableCors({
    origin(origin: string | undefined, callback: (error: Error | null, allow?: boolean) => void) {
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
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true }
    })
  );

  const port = config.get<number>("PORT") ?? 8080;
  await app.listen(port, "0.0.0.0");
}

void bootstrap();
