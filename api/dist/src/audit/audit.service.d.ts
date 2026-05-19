import { FirestoreRepository } from "../common/firestore/firestore.repository";
import type { AuditLogInput } from "./audit.types";
export declare class AuditService {
    private readonly repository;
    constructor(repository: FirestoreRepository);
    log(input: AuditLogInput): Promise<void>;
    listForResource(resourceType?: string, resourceId?: string): Promise<{
        id: string;
    }[]>;
}
