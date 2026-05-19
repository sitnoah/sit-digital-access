import { AuditService } from "./audit.service";
export declare class AuditController {
    private readonly auditService;
    constructor(auditService: AuditService);
    list(resourceType?: string, resourceId?: string): Promise<{
        data: {
            id: string;
        }[];
    }>;
}
