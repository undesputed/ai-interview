import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  Prisma,
  QuestionSetAudience as PrismaAudience,
  QuestionSetStatus as PrismaStatus,
  type Question,
  type QuestionSet,
  type User,
} from '@prisma/client';
import type {
  CreateQuestionInput,
  CreateQuestionSetInput,
  ListQuestionSetsFilter,
  Locale,
  PublicQuestion,
  PublicQuestionSet,
  PublicQuestionSetSummary,
  QuestionSetAudience,
  QuestionSetStatus,
  ReorderQuestionsInput,
  UpdateQuestionInput,
  UpdateQuestionSetInput,
} from '@ai-interview/shared';
import { PrismaService } from '../prisma/prisma.service';

const AUDIENCE_TO_PRISMA: Record<QuestionSetAudience, PrismaAudience> = {
  ai: PrismaAudience.AI,
  human: PrismaAudience.HUMAN,
  both: PrismaAudience.BOTH,
};

const AUDIENCE_FROM_PRISMA: Record<PrismaAudience, QuestionSetAudience> = {
  AI: 'ai',
  HUMAN: 'human',
  BOTH: 'both',
};

const STATUS_TO_PRISMA: Record<QuestionSetStatus, PrismaStatus> = {
  draft: PrismaStatus.DRAFT,
  published: PrismaStatus.PUBLISHED,
};

const STATUS_FROM_PRISMA: Record<PrismaStatus, QuestionSetStatus> = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
};

type SetWithRelations = QuestionSet & {
  questions: Question[];
  createdBy: Pick<User, 'id' | 'firstName' | 'lastName'>;
  updatedBy: Pick<User, 'id' | 'firstName' | 'lastName'>;
};

@Injectable()
export class QuestionsService {
  constructor(private readonly prisma: PrismaService) {}

  // ── List ────────────────────────────────────────────────────────────

  async list(filter: ListQuestionSetsFilter): Promise<PublicQuestionSetSummary[]> {
    const where: Prisma.QuestionSetWhereInput = {};
    if (filter.audience) where.audience = AUDIENCE_TO_PRISMA[filter.audience];
    if (filter.status) where.status = STATUS_TO_PRISMA[filter.status];
    if (filter.locale) where.locale = filter.locale;
    if (filter.q) {
      const q = filter.q;
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { questions: { some: { text: { contains: q, mode: 'insensitive' } } } },
      ];
    }

    const rows = await this.prisma.questionSet.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      include: {
        createdBy: { select: { id: true, firstName: true, lastName: true } },
        updatedBy: { select: { id: true, firstName: true, lastName: true } },
        questions: {
          orderBy: { position: 'asc' },
          take: 1,
          select: { text: true },
        },
        _count: { select: { questions: true } },
      },
    });

    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      description: r.description,
      audience: AUDIENCE_FROM_PRISMA[r.audience],
      status: STATUS_FROM_PRISMA[r.status],
      locale: r.locale as Locale,
      attachedRoles: r.attachedRoles,
      usedInInterviews: r.usedInInterviews,
      questionCount: r._count.questions,
      firstQuestion: r.questions[0]?.text ?? null,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
      createdBy: r.createdBy,
      updatedBy: r.updatedBy,
    }));
  }

  // ── Get one ─────────────────────────────────────────────────────────

  async getById(id: string): Promise<PublicQuestionSet> {
    const set = await this.prisma.questionSet.findUnique({
      where: { id },
      include: {
        questions: { orderBy: { position: 'asc' } },
        createdBy: { select: { id: true, firstName: true, lastName: true } },
        updatedBy: { select: { id: true, firstName: true, lastName: true } },
      },
    });
    if (!set) throw new NotFoundException('Question set not found.');
    return QuestionsService.toPublicSet(set);
  }

  // ── Create ──────────────────────────────────────────────────────────

  async create(
    input: CreateQuestionSetInput,
    userId: string,
  ): Promise<PublicQuestionSet> {
    const set = await this.prisma.questionSet.create({
      data: {
        name: input.name,
        description: input.description ?? '',
        audience: AUDIENCE_TO_PRISMA[input.audience],
        status: STATUS_TO_PRISMA[input.status ?? 'draft'],
        locale: input.locale ?? 'en-PH',
        attachedRoles: input.attachedRoles ?? [],
        createdById: userId,
        updatedById: userId,
        questions: input.questions
          ? {
              create: input.questions.map((q, i) => ({
                text: q.text,
                signal: q.signal ?? null,
                maxFollowUps: q.maxFollowUps ?? null,
                position: i,
              })),
            }
          : undefined,
      },
      include: {
        questions: { orderBy: { position: 'asc' } },
        createdBy: { select: { id: true, firstName: true, lastName: true } },
        updatedBy: { select: { id: true, firstName: true, lastName: true } },
      },
    });
    return QuestionsService.toPublicSet(set);
  }

  // ── Update ──────────────────────────────────────────────────────────

  async update(
    id: string,
    input: UpdateQuestionSetInput,
    userId: string,
  ): Promise<PublicQuestionSet> {
    await this.ensureSetExists(id);
    const data: Prisma.QuestionSetUpdateInput = {
      updatedBy: { connect: { id: userId } },
    };
    if (input.name !== undefined) data.name = input.name;
    if (input.description !== undefined) data.description = input.description;
    if (input.audience !== undefined)
      data.audience = AUDIENCE_TO_PRISMA[input.audience];
    if (input.status !== undefined)
      data.status = STATUS_TO_PRISMA[input.status];
    if (input.locale !== undefined) data.locale = input.locale;
    if (input.attachedRoles !== undefined)
      data.attachedRoles = { set: input.attachedRoles };

    const set = await this.prisma.questionSet.update({
      where: { id },
      data,
      include: {
        questions: { orderBy: { position: 'asc' } },
        createdBy: { select: { id: true, firstName: true, lastName: true } },
        updatedBy: { select: { id: true, firstName: true, lastName: true } },
      },
    });
    return QuestionsService.toPublicSet(set);
  }

  // ── Delete ──────────────────────────────────────────────────────────

  async remove(id: string): Promise<void> {
    await this.ensureSetExists(id);
    // Cascade on the Question relation deletes child questions.
    await this.prisma.questionSet.delete({ where: { id } });
  }

  // ── Questions: add ──────────────────────────────────────────────────

  async addQuestion(
    setId: string,
    input: CreateQuestionInput,
    userId: string,
  ): Promise<PublicQuestion> {
    await this.ensureSetExists(setId);

    // Append: position = max(position) + 1, or 0 if empty.
    const last = await this.prisma.question.findFirst({
      where: { questionSetId: setId },
      orderBy: { position: 'desc' },
      select: { position: true },
    });
    const nextPosition = last ? last.position + 1 : 0;

    const [question] = await this.prisma.$transaction([
      this.prisma.question.create({
        data: {
          questionSetId: setId,
          text: input.text,
          signal: input.signal ?? null,
          maxFollowUps: input.maxFollowUps ?? null,
          position: nextPosition,
        },
      }),
      this.prisma.questionSet.update({
        where: { id: setId },
        data: { updatedById: userId },
      }),
    ]);

    return QuestionsService.toPublicQuestion(question);
  }

  // ── Questions: update ───────────────────────────────────────────────

  async updateQuestion(
    setId: string,
    questionId: string,
    input: UpdateQuestionInput,
    userId: string,
  ): Promise<PublicQuestion> {
    const existing = await this.prisma.question.findUnique({
      where: { id: questionId },
    });
    if (!existing || existing.questionSetId !== setId) {
      throw new NotFoundException('Question not found.');
    }

    const data: Prisma.QuestionUpdateInput = {};
    if (input.text !== undefined) data.text = input.text;
    if (input.signal !== undefined) data.signal = input.signal ?? null;
    if (input.maxFollowUps !== undefined)
      data.maxFollowUps = input.maxFollowUps ?? null;

    const [updated] = await this.prisma.$transaction([
      this.prisma.question.update({ where: { id: questionId }, data }),
      this.prisma.questionSet.update({
        where: { id: setId },
        data: { updatedById: userId },
      }),
    ]);

    return QuestionsService.toPublicQuestion(updated);
  }

  // ── Questions: remove ───────────────────────────────────────────────

  async removeQuestion(
    setId: string,
    questionId: string,
    userId: string,
  ): Promise<void> {
    const existing = await this.prisma.question.findUnique({
      where: { id: questionId },
      select: { questionSetId: true },
    });
    if (!existing || existing.questionSetId !== setId) {
      throw new NotFoundException('Question not found.');
    }
    await this.prisma.$transaction([
      this.prisma.question.delete({ where: { id: questionId } }),
      this.prisma.questionSet.update({
        where: { id: setId },
        data: { updatedById: userId },
      }),
    ]);
  }

  // ── Questions: reorder ──────────────────────────────────────────────

  async reorderQuestions(
    setId: string,
    input: ReorderQuestionsInput,
    userId: string,
  ): Promise<PublicQuestion[]> {
    await this.ensureSetExists(setId);

    const existing = await this.prisma.question.findMany({
      where: { questionSetId: setId },
      select: { id: true },
    });
    const existingIds = new Set(existing.map((q) => q.id));
    const givenIds = new Set(input.questionIds);
    if (existingIds.size !== givenIds.size) {
      throw new BadRequestException(
        'Reorder list must include every question in the set, exactly once.',
      );
    }
    for (const id of input.questionIds) {
      if (!existingIds.has(id)) {
        throw new BadRequestException(`Unknown question id: ${id}`);
      }
    }

    // Use a negative offset for the first pass so we don't run into the
    // partial unique constraint that would exist on (setId, position) if
    // someone later promotes that. Safe even without — keeps reorder atomic.
    const tempOffset = -input.questionIds.length;
    const operations = [
      // 1) Move every row to a unique negative position to clear collisions
      ...input.questionIds.map((id, index) =>
        this.prisma.question.update({
          where: { id },
          data: { position: tempOffset - index },
        }),
      ),
      // 2) Set the final positions
      ...input.questionIds.map((id, index) =>
        this.prisma.question.update({
          where: { id },
          data: { position: index },
        }),
      ),
      // 3) Bump the set's updatedBy
      this.prisma.questionSet.update({
        where: { id: setId },
        data: { updatedById: userId },
      }),
    ];
    await this.prisma.$transaction(operations);

    const rows = await this.prisma.question.findMany({
      where: { questionSetId: setId },
      orderBy: { position: 'asc' },
    });
    return rows.map(QuestionsService.toPublicQuestion);
  }

  // ── helpers ─────────────────────────────────────────────────────────

  private async ensureSetExists(id: string): Promise<void> {
    const exists = await this.prisma.questionSet.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!exists) throw new NotFoundException('Question set not found.');
  }

  static toPublicSet(set: SetWithRelations): PublicQuestionSet {
    return {
      id: set.id,
      name: set.name,
      description: set.description,
      audience: AUDIENCE_FROM_PRISMA[set.audience],
      status: STATUS_FROM_PRISMA[set.status],
      locale: set.locale as Locale,
      attachedRoles: set.attachedRoles,
      usedInInterviews: set.usedInInterviews,
      createdAt: set.createdAt.toISOString(),
      updatedAt: set.updatedAt.toISOString(),
      createdBy: set.createdBy,
      updatedBy: set.updatedBy,
      questions: set.questions.map(QuestionsService.toPublicQuestion),
    };
  }

  static toPublicQuestion(q: Question): PublicQuestion {
    return {
      id: q.id,
      text: q.text,
      signal: q.signal,
      maxFollowUps: q.maxFollowUps,
      position: q.position,
      createdAt: q.createdAt.toISOString(),
      updatedAt: q.updatedAt.toISOString(),
    };
  }
}
