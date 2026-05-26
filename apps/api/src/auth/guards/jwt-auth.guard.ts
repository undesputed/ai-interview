import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { TokenService, ACCESS_COOKIE } from '../token.service';

/**
 * Reads the access JWT from the httpOnly cookie (preferred) or
 * the `Authorization: Bearer …` header. Attaches `req.user` with the payload.
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly tokens: TokenService) {}

  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest<Request & { user?: unknown }>();
    const cookieToken =
      (req.cookies as Record<string, string> | undefined)?.[ACCESS_COOKIE];
    const header = req.header('authorization');
    const bearer = header?.startsWith('Bearer ') ? header.slice(7) : undefined;
    const token = cookieToken ?? bearer;
    if (!token) throw new UnauthorizedException();

    req.user = this.tokens.verifyAccess(token);
    return true;
  }
}
