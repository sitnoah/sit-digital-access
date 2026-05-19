export type AuditLogInput = {
  actorUid: string;
  actorEmail?: string;
  action: string;
  resourceType: string;
  resourceId: string;
  before?: unknown;
  after?: unknown;
};
