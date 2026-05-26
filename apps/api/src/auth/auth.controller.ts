import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ConfigService } from '@nestjs/config';
import type { Request, Response, CookieOptions } from 'express';
import {
  loginSchema,
  registerSchema,
  type LoginInput,
  type RegisterInput,
} from '@ai-interview/shared';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { AuthService } from './auth.service';
import {
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  TokenService,
} from './token.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly users: UsersService,
    private readonly config: ConfigService,
  ) {}

  // ── REGISTER ─────────────────────────────────────────────────────────
  @Post('register')
  @Throttle({ default: { ttl: 60_000, limit: 5 } })
  @UsePipes(new ZodValidationPipe(registerSchema))
  async register(
    @Body() body: RegisterInput,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, tokens } = await this.auth.register(body, AuthController.meta(req));
    this.attachCookies(res, tokens.access, tokens.refresh);
    return { user };
  }

  // ── LOGIN ────────────────────────────────────────────────────────────
  @Post('login')
  @HttpCode(200)
  @Throttle({ default: { ttl: 60_000, limit: 10 } })
  @UsePipes(new ZodValidationPipe(loginSchema))
  async login(
    @Body() body: LoginInput,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, tokens } = await this.auth.login(body, AuthController.meta(req));
    this.attachCookies(res, tokens.access, tokens.refresh);
    return { user };
  }

  // ── REFRESH ──────────────────────────────────────────────────────────
  @Post('refresh')
  @HttpCode(200)
  @Throttle({ default: { ttl: 60_000, limit: 30 } })
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const raw = (req.cookies as Record<string, string> | undefined)?.[REFRESH_COOKIE];
    if (!raw) throw new UnauthorizedException();
    const { access, refresh, user } = await this.auth.refresh(
      raw,
      AuthController.meta(req),
    );
    this.attachCookies(res, access, refresh);
    return { user };
  }

  // ── LOGOUT ───────────────────────────────────────────────────────────
  @Post('logout')
  @HttpCode(204)
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const raw = (req.cookies as Record<string, string> | undefined)?.[REFRESH_COOKIE];
    await this.auth.logout(raw);
    res.clearCookie(ACCESS_COOKIE, this.cookieOpts(0));
    res.clearCookie(REFRESH_COOKIE, this.cookieOpts(0));
  }

  // ── ME ───────────────────────────────────────────────────────────────
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@CurrentUser() payload: { sub: string }) {
    const user = await this.users.findById(payload.sub);
    if (!user) throw new UnauthorizedException();
    return { user: UsersService.toPublic(user) };
  }

  // ── helpers ──────────────────────────────────────────────────────────

  private attachCookies(res: Response, access: string, refresh: string) {
    res.cookie(ACCESS_COOKIE, access, this.cookieOpts(TokenService.accessTtlSeconds()));
    res.cookie(REFRESH_COOKIE, refresh, this.cookieOpts(TokenService.refreshTtlSeconds()));
  }

  private cookieOpts(maxAgeSeconds: number): CookieOptions {
    const isProd = this.config.get<string>('NODE_ENV') === 'production';
    return {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      path: '/',
      maxAge: maxAgeSeconds * 1000,
    };
  }

  private static meta(req: Request) {
    return {
      userAgent: req.header('user-agent') ?? undefined,
      ip: req.ip ?? req.socket.remoteAddress ?? undefined,
    };
  }
}
