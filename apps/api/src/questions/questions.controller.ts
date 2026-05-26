import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  createQuestionSchema,
  createQuestionSetSchema,
  listQuestionSetsFilterSchema,
  reorderQuestionsSchema,
  updateQuestionSchema,
  updateQuestionSetSchema,
  type CreateQuestionInput,
  type CreateQuestionSetInput,
  type ListQuestionSetsFilter,
  type ReorderQuestionsInput,
  type UpdateQuestionInput,
  type UpdateQuestionSetInput,
} from '@ai-interview/shared';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AccessTokenPayload } from '../auth/token.service';
import { QuestionsService } from './questions.service';

/**
 * NOTE: Zod validation pipes are attached to the @Body / @Query parameter
 * directly (not @UsePipes at the method level). Method-level pipes run on
 * every parameter — including @CurrentUser() — and would reject the user
 * payload against the body schema.
 */
@Controller('question-sets')
@UseGuards(JwtAuthGuard)
export class QuestionsController {
  constructor(private readonly questions: QuestionsService) {}

  // ── List ────────────────────────────────────────────────────────────

  @Get()
  list(
    @Query(new ZodValidationPipe(listQuestionSetsFilterSchema))
    filter: ListQuestionSetsFilter,
  ) {
    return this.questions.list(filter);
  }

  // ── Get one ─────────────────────────────────────────────────────────

  @Get(':id')
  get(@Param('id') id: string) {
    return this.questions.getById(id);
  }

  // ── Create ──────────────────────────────────────────────────────────

  @Post()
  create(
    @Body(new ZodValidationPipe(createQuestionSetSchema))
    body: CreateQuestionSetInput,
    @CurrentUser() user: AccessTokenPayload,
  ) {
    return this.questions.create(body, user.sub);
  }

  // ── Update ──────────────────────────────────────────────────────────

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateQuestionSetSchema))
    body: UpdateQuestionSetInput,
    @CurrentUser() user: AccessTokenPayload,
  ) {
    return this.questions.update(id, body, user.sub);
  }

  // ── Delete ──────────────────────────────────────────────────────────

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string) {
    return this.questions.remove(id);
  }

  // ── Questions: add ──────────────────────────────────────────────────

  @Post(':id/questions')
  addQuestion(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(createQuestionSchema))
    body: CreateQuestionInput,
    @CurrentUser() user: AccessTokenPayload,
  ) {
    return this.questions.addQuestion(id, body, user.sub);
  }

  // ── Questions: update ───────────────────────────────────────────────

  @Patch(':id/questions/:questionId')
  updateQuestion(
    @Param('id') id: string,
    @Param('questionId') questionId: string,
    @Body(new ZodValidationPipe(updateQuestionSchema))
    body: UpdateQuestionInput,
    @CurrentUser() user: AccessTokenPayload,
  ) {
    return this.questions.updateQuestion(id, questionId, body, user.sub);
  }

  // ── Questions: remove ───────────────────────────────────────────────

  @Delete(':id/questions/:questionId')
  @HttpCode(204)
  removeQuestion(
    @Param('id') id: string,
    @Param('questionId') questionId: string,
    @CurrentUser() user: AccessTokenPayload,
  ) {
    return this.questions.removeQuestion(id, questionId, user.sub);
  }

  // ── Questions: reorder ──────────────────────────────────────────────

  @Post(':id/questions/reorder')
  reorder(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(reorderQuestionsSchema))
    body: ReorderQuestionsInput,
    @CurrentUser() user: AccessTokenPayload,
  ) {
    return this.questions.reorderQuestions(id, body, user.sub);
  }
}
