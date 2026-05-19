import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import type { Request } from "express";
import type { AuthenticatedRequest } from "../common/types";
import { FirebaseAdminService } from "../firebase/firebase-admin.service";

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  constructor(private readonly firebaseAdmin: FirebaseAdminService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = this.extractBearerToken(request);

    if (!token) {
      throw new UnauthorizedException("Missing Firebase ID token");
    }

    try {
      request.user = await this.firebaseAdmin.verifyIdToken(token);
      return true;
    } catch {
      throw new UnauthorizedException("Invalid Firebase ID token");
    }
  }

  private extractBearerToken(request: Request): string | undefined {
    const header = request.headers.authorization;

    if (!header) {
      return undefined;
    }

    const [scheme, token] = header.split(" ");
    return scheme === "Bearer" ? token : undefined;
  }
}
