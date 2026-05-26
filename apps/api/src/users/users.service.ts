import { Injectable } from '@nestjs/common';
import type { User } from '@prisma/client';
import type { PublicUser } from '@ai-interview/shared';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  }

  create(input: {
    email: string;
    firstName: string;
    lastName: string;
    company?: string;
    passwordHash: string;
  }) {
    return this.prisma.user.create({
      data: {
        email: input.email.toLowerCase(),
        firstName: input.firstName,
        lastName: input.lastName,
        company: input.company,
        passwordHash: input.passwordHash,
      },
    });
  }

  /** Strip server-only fields. Never return passwordHash. */
  static toPublic(user: User): PublicUser {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      company: user.company,
      locale: user.locale,
      createdAt: user.createdAt.toISOString(),
    };
  }
}
