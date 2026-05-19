import { ConfigService } from "@nestjs/config";
import { FirestoreRepository } from "../common/firestore/firestore.repository";
export type OutboxEventInput = {
    type: "EMAIL" | "WEBHOOK" | "NOTIFICATION" | "REPORT";
    provider?: string;
    resourceType: string;
    resourceId: string;
    payload: Record<string, unknown>;
};
export declare class EcosystemIntegrationsService {
    private readonly repository;
    private readonly config;
    private readonly logger;
    constructor(repository: FirestoreRepository, config: ConfigService);
    enqueue(input: OutboxEventInput): Promise<Record<string, unknown> & {
        id: string;
    }>;
    private providerFor;
}
