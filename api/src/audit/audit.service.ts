import { Injectable } from "@nestjs/common";
import { COLLECTIONS } from "../common/constants";
import { FirestoreRepository } from "../common/firestore/firestore.repository";
import type { AuditLogInput } from "./audit.types";

@Injectable()
export class AuditService {
  constructor(private readonly repository: FirestoreRepository) {}

  async log(input: AuditLogInput): Promise<void> {
    await this.repository.create(COLLECTIONS.auditLogs, {
      actorUid: input.actorUid,
      actorEmail: input.actorEmail ?? null,
      action: input.action,
      resourceType: input.resourceType,
      resourceId: input.resourceId,
      before: input.before ?? null,
      after: input.after ?? null
    });
  }

  async listForResource(resourceType?: string, resourceId?: string) {
    let query = this.repository.collection(COLLECTIONS.auditLogs).orderBy("createdAt", "desc").limit(50);

    if (resourceType) {
      query = query.where("resourceType", "==", resourceType);
    }

    if (resourceId) {
      query = query.where("resourceId", "==", resourceId);
    }

    const snapshot = await query.get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }
}
