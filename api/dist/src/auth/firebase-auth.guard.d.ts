import { CanActivate, ExecutionContext } from "@nestjs/common";
import { FirebaseAdminService } from "../firebase/firebase-admin.service";
export declare class FirebaseAuthGuard implements CanActivate {
    private readonly firebaseAdmin;
    constructor(firebaseAdmin: FirebaseAdminService);
    canActivate(context: ExecutionContext): Promise<boolean>;
    private extractBearerToken;
}
