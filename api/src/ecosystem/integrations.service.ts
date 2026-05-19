import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { COLLECTIONS } from "../common/constants";
import { FirestoreRepository } from "../common/firestore/firestore.repository";
import { sanitizePayload } from "../common/sanitize";

export type OutboxEventInput = {
  type: "EMAIL" | "WEBHOOK" | "NOTIFICATION" | "REPORT";
  provider?: string;
  resourceType: string;
  resourceId: string;
  payload: Record<string, unknown>;
};

@Injectable()
export class EcosystemIntegrationsService {
  private readonly logger = new Logger(EcosystemIntegrationsService.name);

  constructor(
    private readonly repository: FirestoreRepository,
    private readonly config: ConfigService
  ) {}

  async enqueue(input: OutboxEventInput) {
    const provider = input.provider ?? this.providerFor(input.type);
    const deliveryStatus = provider === "noop" ? "LOGGED" : "QUEUED";
    const record = await this.repository.create(COLLECTIONS.outboxEvents, sanitizePayload({
      ...input,
      provider,
      deliveryStatus,
      attempts: 0,
      lastError: null
    }));

    if (provider === "noop") {
      this.logger.log(`No-op ${input.type.toLowerCase()} event logged for ${input.resourceType}/${input.resourceId}`);
    }

    return record;
  }

  private providerFor(type: OutboxEventInput["type"]) {
    const configured = this.config.get<string>(`SIT_${type}_PROVIDER`);
    return configured?.trim() || "noop";
  }
}
