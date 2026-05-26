import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  InterviewAIRole as PrismaAIRole,
  InterviewConductedBy as PrismaConductedBy,
  InterviewPersonaMode as PrismaPersonaMode,
  InterviewRecommendation as PrismaRecommendation,
  InterviewStatus as PrismaStatus,
  Prisma,
  type Candidate,
  type Interview,
  type QuestionSet,
  type User,
} from '@prisma/client';
import type {
  CandidatePayload,
  CompleteInterviewInput,
  CreateInterviewInput,
  InterviewAIMode,
  InterviewAIRole,
  InterviewConductedBy,
  InterviewPersonaMode,
  InterviewRecommendation,
  InterviewStatus,
  ListInterviewsFilter,
  Locale,
  PublicCandidate,
  PublicInterview,
  UpdateInterviewInput,
} from '@ai-interview/shared';
import { PrismaService } from '../prisma/prisma.service';

// ─── Enum bridges between Prisma (UPPERCASE) and wire (lowercase) ─────

const CONDUCTED_TO: Record<InterviewConductedBy, PrismaConductedBy> = {
  ai: PrismaConductedBy.AI,
  human: PrismaConductedBy.HUMAN,
};
const CONDUCTED_FROM: Record<PrismaConductedBy, InterviewConductedBy> = {
  AI: 'ai',
  HUMAN: 'human',
};

const AI_ROLE_TO: Record<InterviewAIRole, PrismaAIRole> = {
  copilot: PrismaAIRole.COPILOT,
  spectator: PrismaAIRole.SPECTATOR,
};
const AI_ROLE_FROM: Record<PrismaAIRole, InterviewAIRole> = {
  COPILOT: 'copilot',
  SPECTATOR: 'spectator',
};

const PERSONA_TO: Record<InterviewPersonaMode, PrismaPersonaMode> = {
  voice: PrismaPersonaMode.VOICE,
  video: PrismaPersonaMode.VIDEO,
};
const PERSONA_FROM: Record<PrismaPersonaMode, InterviewPersonaMode> = {
  VOICE: 'voice',
  VIDEO: 'video',
};

const REC_TO: Record<InterviewRecommendation, PrismaRecommendation> = {
  advance: PrismaRecommendation.ADVANCE,
  hold: PrismaRecommendation.HOLD,
  pass: PrismaRecommendation.PASS,
};
const REC_FROM: Record<PrismaRecommendation, InterviewRecommendation> = {
  ADVANCE: 'advance',
  HOLD: 'hold',
  PASS: 'pass',
};

const STATUS_TO_STORED: Record<
  'draft' | 'scheduled' | 'live' | 'completed' | 'cancelled',
  PrismaStatus
> = {
  draft: PrismaStatus.DRAFT,
  scheduled: PrismaStatus.SCHEDULED,
  live: PrismaStatus.LIVE,
  completed: PrismaStatus.COMPLETED,
  cancelled: PrismaStatus.CANCELLED,
};

// ─── Time helpers for status derivation ──────────────────────────────

const QUEUED_WINDOW_MS = 30 * 60 * 1000; // 30 min before scheduledAt
const UPCOMING_WINDOW_MS = 24 * 60 * 60 * 1000; // 24h before scheduledAt

type InterviewWithRelations = Interview & {
  candidate: Candidate;
  createdBy: Pick<User, 'id' | 'firstName' | 'lastName'>;
  questionSet: Pick<QuestionSet, 'id' | 'name'> | null;
};

@Injectable()
export class InterviewsService {
  constructor(private readonly prisma: PrismaService) {}

  // ── List ────────────────────────────────────────────────────────────

  async list(filter: ListInterviewsFilter): Promise<PublicInterview[]> {
    const where: Prisma.InterviewWhereInput = {};

    // Map UI-only "upcoming" / "queued" segments back to SCHEDULED rows;
    // the time discriminator is applied below in the response mapper.
    if (filter.status) {
      const s = filter.status;
      if (s === 'upcoming' || s === 'queued') {
        where.status = PrismaStatus.SCHEDULED;
      } else if (s in STATUS_TO_STORED) {
        where.status = STATUS_TO_STORED[s as keyof typeof STATUS_TO_STORED];
      }
    }

    if (filter.conductedBy) where.conductedBy = CONDUCTED_TO[filter.conductedBy];
    if (filter.language) where.language = filter.language;

    if (filter.on) {
      // YYYY-MM-DD in Manila → covers the 24-hour window for that calendar day.
      const dayStart = new Date(`${filter.on}T00:00:00+08:00`);
      const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);
      where.scheduledAt = { gte: dayStart, lt: dayEnd };
    }

    if (filter.q) {
      const q = filter.q;
      where.OR = [
        { candidate: { name: { contains: q, mode: 'insensitive' } } },
        { candidate: { email: { contains: q, mode: 'insensitive' } } },
        { roleTitle: { contains: q, mode: 'insensitive' } },
        { roleLocation: { contains: q, mode: 'insensitive' } },
      ];
    }

    const rows = await this.prisma.interview.findMany({
      where,
      orderBy: [{ scheduledAt: 'asc' }, { createdAt: 'desc' }],
      include: {
        candidate: true,
        createdBy: { select: { id: true, firstName: true, lastName: true } },
        questionSet: { select: { id: true, name: true } },
      },
    });

    let mapped = rows.map(InterviewsService.toPublic);

    // The "upcoming" / "queued" filters narrow further by time window.
    if (filter.status === 'upcoming') {
      mapped = mapped.filter((r) => r.status === 'upcoming');
    } else if (filter.status === 'queued') {
      mapped = mapped.filter((r) => r.status === 'queued');
    }

    return mapped;
  }

  // ── Get one ─────────────────────────────────────────────────────────

  async getById(id: string): Promise<PublicInterview> {
    const row = await this.prisma.interview.findUnique({
      where: { id },
      include: {
        candidate: true,
        createdBy: { select: { id: true, firstName: true, lastName: true } },
        questionSet: { select: { id: true, name: true } },
      },
    });
    if (!row) throw new NotFoundException('Interview not found.');
    return InterviewsService.toPublic(row);
  }

  // ── Create ──────────────────────────────────────────────────────────

  async create(input: CreateInterviewInput, userId: string): Promise<PublicInterview> {
    if (input.questionSetId) {
      await this.assertQuestionSetExists(input.questionSetId);
    }

    const candidate = await this.upsertCandidate(input.candidate);

    // Normalize aiRole based on conductedBy.
    const aiRoleStored: PrismaAIRole | null =
      input.conductedBy === 'human'
        ? AI_ROLE_TO[input.aiRole ?? 'copilot']
        : null;

    const created = await this.prisma.interview.create({
      data: {
        candidateId: candidate.id,
        roleTitle: input.roleTitle,
        roleLocation: input.roleLocation ?? '',
        scheduledAt: new Date(input.scheduledAt),
        durationMin: input.durationMin ?? 45,
        language: input.language ?? 'en-PH',
        conductedBy: CONDUCTED_TO[input.conductedBy ?? 'human'],
        aiRole: aiRoleStored,
        personaMode: PERSONA_TO[input.personaMode ?? 'video'],
        personaStyle: input.personaStyle ?? 'warm',
        questionSetId: input.questionSetId ?? null,
        followUps: input.followUps ?? 2,
        status: STATUS_TO_STORED[input.status ?? 'scheduled'],
        createdById: userId,
      },
      include: {
        candidate: true,
        createdBy: { select: { id: true, firstName: true, lastName: true } },
        questionSet: { select: { id: true, name: true } },
      },
    });

    // Maintain the QuestionSet usage counter when linked at create time.
    if (input.questionSetId) {
      await this.prisma.questionSet.update({
        where: { id: input.questionSetId },
        data: { usedInInterviews: { increment: 1 } },
      });
    }

    return InterviewsService.toPublic(created);
  }

  // ── Update ──────────────────────────────────────────────────────────

  async update(
    id: string,
    input: UpdateInterviewInput,
    _userId: string,
  ): Promise<PublicInterview> {
    const existing = await this.prisma.interview.findUnique({
      where: { id },
      select: { id: true, questionSetId: true, conductedBy: true },
    });
    if (!existing) throw new NotFoundException('Interview not found.');

    const data: Prisma.InterviewUpdateInput = {};

    if (input.candidate) {
      const c = await this.upsertCandidate(input.candidate);
      data.candidate = { connect: { id: c.id } };
    }
    if (input.roleTitle !== undefined) data.roleTitle = input.roleTitle;
    if (input.roleLocation !== undefined) data.roleLocation = input.roleLocation;
    if (input.scheduledAt !== undefined)
      data.scheduledAt = new Date(input.scheduledAt);
    if (input.durationMin !== undefined) data.durationMin = input.durationMin;
    if (input.language !== undefined) data.language = input.language;
    if (input.conductedBy !== undefined) {
      data.conductedBy = CONDUCTED_TO[input.conductedBy];
      // When switching to AI, clear aiRole. When switching to human, ensure
      // a default of copilot (unless caller also passed aiRole).
      if (input.conductedBy === 'ai') {
        data.aiRole = null;
      } else if (input.aiRole === undefined) {
        data.aiRole = AI_ROLE_TO['copilot'];
      }
    }
    if (input.aiRole !== undefined) {
      data.aiRole =
        input.aiRole === null ? null : AI_ROLE_TO[input.aiRole];
    }
    if (input.personaMode !== undefined)
      data.personaMode = PERSONA_TO[input.personaMode];
    if (input.personaStyle !== undefined) data.personaStyle = input.personaStyle;
    if (input.questionSetId !== undefined) {
      if (input.questionSetId === null) {
        data.questionSet = { disconnect: true };
      } else {
        await this.assertQuestionSetExists(input.questionSetId);
        data.questionSet = { connect: { id: input.questionSetId } };
      }
    }
    if (input.followUps !== undefined) data.followUps = input.followUps;
    if (input.status !== undefined)
      data.status = STATUS_TO_STORED[input.status];

    const updated = await this.prisma.interview.update({
      where: { id },
      data,
      include: {
        candidate: true,
        createdBy: { select: { id: true, firstName: true, lastName: true } },
        questionSet: { select: { id: true, name: true } },
      },
    });

    // Adjust QuestionSet counters when the link changed.
    if (input.questionSetId !== undefined) {
      const oldId = existing.questionSetId;
      const newId = input.questionSetId;
      if (oldId !== newId) {
        if (oldId) {
          await this.prisma.questionSet.update({
            where: { id: oldId },
            data: { usedInInterviews: { decrement: 1 } },
          });
        }
        if (newId) {
          await this.prisma.questionSet.update({
            where: { id: newId },
            data: { usedInInterviews: { increment: 1 } },
          });
        }
      }
    }

    return InterviewsService.toPublic(updated);
  }

  // ── Complete ────────────────────────────────────────────────────────

  async complete(
    id: string,
    input: CompleteInterviewInput,
  ): Promise<PublicInterview> {
    const existing = await this.prisma.interview.findUnique({
      where: { id },
      select: { id: true, status: true },
    });
    if (!existing) throw new NotFoundException('Interview not found.');
    if (
      existing.status !== PrismaStatus.LIVE &&
      existing.status !== PrismaStatus.SCHEDULED
    ) {
      throw new BadRequestException(
        'Only scheduled or live interviews can be completed.',
      );
    }

    const updated = await this.prisma.interview.update({
      where: { id },
      data: {
        status: PrismaStatus.COMPLETED,
        score: input.score,
        recommendation: REC_TO[input.recommendation],
        pullQuote: input.pullQuote ?? null,
      },
      include: {
        candidate: true,
        createdBy: { select: { id: true, firstName: true, lastName: true } },
        questionSet: { select: { id: true, name: true } },
      },
    });
    return InterviewsService.toPublic(updated);
  }

  // ── Cancel ──────────────────────────────────────────────────────────

  async cancel(id: string): Promise<PublicInterview> {
    const existing = await this.prisma.interview.findUnique({
      where: { id },
      select: { id: true, status: true },
    });
    if (!existing) throw new NotFoundException('Interview not found.');
    if (existing.status === PrismaStatus.COMPLETED) {
      throw new BadRequestException('Completed interviews cannot be cancelled.');
    }

    const updated = await this.prisma.interview.update({
      where: { id },
      data: { status: PrismaStatus.CANCELLED },
      include: {
        candidate: true,
        createdBy: { select: { id: true, firstName: true, lastName: true } },
        questionSet: { select: { id: true, name: true } },
      },
    });
    return InterviewsService.toPublic(updated);
  }

  // ── Delete ──────────────────────────────────────────────────────────

  async remove(id: string): Promise<void> {
    const existing = await this.prisma.interview.findUnique({
      where: { id },
      select: { id: true, questionSetId: true },
    });
    if (!existing) throw new NotFoundException('Interview not found.');

    await this.prisma.interview.delete({ where: { id } });

    if (existing.questionSetId) {
      await this.prisma.questionSet.update({
        where: { id: existing.questionSetId },
        data: { usedInInterviews: { decrement: 1 } },
      });
    }
  }

  // ── helpers ─────────────────────────────────────────────────────────

  private async upsertCandidate(payload: CandidatePayload): Promise<Candidate> {
    return this.prisma.candidate.upsert({
      where: { email: payload.email },
      create: {
        name: payload.name,
        email: payload.email,
        preferredLocale: payload.preferredLocale ?? null,
      },
      update: {
        name: payload.name,
        ...(payload.preferredLocale !== undefined
          ? { preferredLocale: payload.preferredLocale }
          : {}),
      },
    });
  }

  private async assertQuestionSetExists(id: string): Promise<void> {
    const exists = await this.prisma.questionSet.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!exists) throw new BadRequestException(`Unknown questionSetId: ${id}`);
  }

  static initialsOf(name: string): string {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return '—';
    if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
    return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase();
  }

  static toPublicCandidate(c: Candidate): PublicCandidate {
    return {
      id: c.id,
      name: c.name,
      email: c.email,
      initials: InterviewsService.initialsOf(c.name),
      preferredLocale: (c.preferredLocale as Locale | null) ?? null,
    };
  }

  static deriveAIMode(
    conductedBy: PrismaConductedBy,
    aiRole: PrismaAIRole | null,
  ): InterviewAIMode {
    if (conductedBy === PrismaConductedBy.AI) return 'active';
    if (aiRole === PrismaAIRole.SPECTATOR) return 'spectator';
    return 'copilot';
  }

  static deriveDisplayStatus(row: Interview, nowMs = Date.now()): InterviewStatus {
    if (row.status !== PrismaStatus.SCHEDULED) {
      switch (row.status) {
        case PrismaStatus.DRAFT:
          return 'draft';
        case PrismaStatus.LIVE:
          return 'live';
        case PrismaStatus.COMPLETED:
          return 'completed';
        case PrismaStatus.CANCELLED:
          return 'cancelled';
      }
    }
    const startMs = row.scheduledAt.getTime();
    const diff = startMs - nowMs;
    if (diff <= QUEUED_WINDOW_MS && diff > -row.durationMin * 60 * 1000) {
      return 'queued';
    }
    if (diff <= UPCOMING_WINDOW_MS && diff > 0) {
      return 'upcoming';
    }
    return 'scheduled';
  }

  static toPublic(row: InterviewWithRelations): PublicInterview {
    const status = InterviewsService.deriveDisplayStatus(row);
    const out: PublicInterview = {
      id: row.id,
      candidate: InterviewsService.toPublicCandidate(row.candidate),
      roleTitle: row.roleTitle,
      roleLocation: row.roleLocation,
      scheduledAt: row.scheduledAt.toISOString(),
      durationMin: row.durationMin,
      language: row.language as Locale,
      conductedBy: CONDUCTED_FROM[row.conductedBy],
      aiRole: row.aiRole ? AI_ROLE_FROM[row.aiRole] : null,
      aiMode: InterviewsService.deriveAIMode(row.conductedBy, row.aiRole),
      personaMode: PERSONA_FROM[row.personaMode],
      personaStyle: row.personaStyle,
      questionSet: row.questionSet
        ? { id: row.questionSet.id, name: row.questionSet.name }
        : null,
      followUps: row.followUps,
      status,
      score: row.score ?? null,
      recommendation: row.recommendation ? REC_FROM[row.recommendation] : null,
      pullQuote: row.pullQuote ?? null,
      createdBy: row.createdBy,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
    if (status === 'live') {
      const elapsedMs = Date.now() - row.scheduledAt.getTime();
      out.remainingMin = Math.max(
        0,
        Math.round(row.durationMin - elapsedMs / 60000),
      );
    }
    return out;
  }
}
