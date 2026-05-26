import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { RegisterInput, LoginInput } from '@ai-interview/shared';
import { UsersService } from '../users/users.service';
import { PasswordService } from './password.service';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly password: PasswordService,
    private readonly tokens: TokenService,
  ) {}

  async register(input: RegisterInput, meta: { userAgent?: string; ip?: string }) {
    const existing = await this.users.findByEmail(input.email);
    if (existing) {
      // Generic message so we don't confirm whether the email is taken.
      throw new ConflictException('Could not create account with those details.');
    }

    const passwordHash = await this.password.hash(input.password);
    const user = await this.users.create({
      email: input.email,
      firstName: input.firstName,
      lastName: input.lastName,
      company: input.company,
      passwordHash,
    });

    const access = this.tokens.signAccess({ sub: user.id, email: user.email });
    const { raw: refresh } = await this.tokens.issueRefresh(user.id, meta);

    return {
      user: UsersService.toPublic(user),
      tokens: { access, refresh },
    };
  }

  async login(input: LoginInput, meta: { userAgent?: string; ip?: string }) {
    const user = await this.users.findByEmail(input.email);
    // Always perform a verify (dummy if user missing) to keep timing equal.
    const ok = await this.password.verify(user?.passwordHash ?? null, input.password);
    if (!ok || !user) {
      throw new UnauthorizedException('Incorrect email or password.');
    }

    const access = this.tokens.signAccess({ sub: user.id, email: user.email });
    const { raw: refresh } = await this.tokens.issueRefresh(user.id, meta);

    return {
      user: UsersService.toPublic(user),
      tokens: { access, refresh },
    };
  }

  async refresh(raw: string, meta: { userAgent?: string; ip?: string }) {
    const { raw: nextRefresh, row } = await this.tokens.rotateRefresh(raw, meta);
    const user = await this.users.findById(row.userId);
    if (!user) throw new UnauthorizedException();
    const access = this.tokens.signAccess({ sub: user.id, email: user.email });
    return { access, refresh: nextRefresh, user: UsersService.toPublic(user) };
  }

  logout(refresh: string | undefined) {
    return this.tokens.revokeRefresh(refresh);
  }
}
