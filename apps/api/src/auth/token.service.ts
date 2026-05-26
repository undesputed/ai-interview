import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { createHash, randomBytes } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';

export interface AccessTokenPayload {
  sub: string;
  email: string;
}

export const ACCESS_COOKIE = 'mv_access';
export const REFRESH_COOKIE = 'mv_refresh';

const ACCESS_TTL = '15m';
const REFRESH_TTL_DAYS = 30;

/**
 * Token strategy:
 *  - Access JWT (15 min) — signed, carried in `mv_access` httpOnly cookie.
 *  - Refresh token (30 days) — opaque random string, carried in `mv_refresh`
 *    httpOnly cookie. SHA-256 hashed at rest. Rotated on every refresh; the
 *    previous row is marked replacedBy → new token id. Reuse of a revoked
 *    token signals theft and cascades a family revocation.
 */
@Injectable()
export class TokenService {
  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  // ── Access JWT ────────────────────────────────────────────────────────

  signAccess(payload: AccessTokenPayload): string {
    return this.jwt.sign(payload, {
      secret: this.config.getOrThrow<string>('JWT_SECRET'),
      expiresIn: ACCESS_TTL,
    });
  }

  verifyAccess(token: string): AccessTokenPayload {
    try {
      return this.jwt.verify<AccessTokenPayload>(token, {
        secret: this.config.getOrThrow<string>('JWT_SECRET'),
      });
    } catch {
      throw new UnauthorizedException();
    }
  }

  // ── Refresh token ─────────────────────────────────────────────────────

  /** Mint a brand-new refresh-token row (used on login / register). */
  async issueRefresh(
    userId: string,
    meta: { userAgent?: string; ip?: string } = {},
  ) {
    const familyId = randomBytes(16).toString('hex');
    const raw = randomBytes(48).toString('hex');
    const row = await this.prisma.refreshToken.create({
      data: {
        userId,
        familyId,
        tokenHash: TokenService.sha256(raw),
        userAgent: meta.userAgent?.slice(0, 255),
        ipAddress: meta.ip?.slice(0, 64),
        expiresAt: TokenService.refreshExpiry(),
      },
    });
    return { raw, row };
  }

  /** Rotate: validate the raw token, revoke it, mint a sibling in the same family. */
  async rotateRefresh(
    raw: string,
    meta: { userAgent?: string; ip?: string } = {},
  ) {
    const tokenHash = TokenService.sha256(raw);
    const current = await this.prisma.refreshToken.findUnique({ where: { tokenHash } });

    if (!current || current.expiresAt < new Date()) {
      throw new UnauthorizedException();
    }

    // Reuse detection: a revoked token was presented → kill the whole family.
    if (current.revokedAt) {
      await this.prisma.refreshToken.updateMany({
        where: { familyId: current.familyId, revokedAt: null },
        data: { revokedAt: new Date() },
      });
      throw new UnauthorizedException();
    }

    const nextRaw = randomBytes(48).toString('hex');
    const next = await this.prisma.refreshToken.create({
      data: {
        userId: current.userId,
        familyId: current.familyId,
        tokenHash: TokenService.sha256(nextRaw),
        userAgent: meta.userAgent?.slice(0, 255),
        ipAddress: meta.ip?.slice(0, 64),
        expiresAt: TokenService.refreshExpiry(),
      },
    });

    await this.prisma.refreshToken.update({
      where: { id: current.id },
      data: { revokedAt: new Date(), replacedBy: next.id },
    });

    return { raw: nextRaw, row: next };
  }

  /** Revoke a specific refresh token (logout). */
  async revokeRefresh(raw: string | undefined) {
    if (!raw) return;
    const tokenHash = TokenService.sha256(raw);
    await this.prisma.refreshToken.updateMany({
      where: { tokenHash, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  // ── helpers ───────────────────────────────────────────────────────────

  static sha256(input: string): string {
    return createHash('sha256').update(input).digest('hex');
  }

  static refreshExpiry(): Date {
    const d = new Date();
    d.setDate(d.getDate() + REFRESH_TTL_DAYS);
    return d;
  }

  static refreshTtlSeconds(): number {
    return REFRESH_TTL_DAYS * 24 * 60 * 60;
  }

  static accessTtlSeconds(): number {
    // 15m — keep in sync with ACCESS_TTL above.
    return 15 * 60;
  }
}
