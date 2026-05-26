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
  completeInterviewSchema,
  createInterviewSchema,
  listInterviewsFilterSchema,
  updateInterviewSchema,
  type CompleteInterviewInput,
  type CreateInterviewInput,
  type ListInterviewsFilter,
  type UpdateInterviewInput,
} from '@ai-interview/shared';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AccessTokenPayload } from '../auth/token.service';
import { InterviewsService } from './interviews.service';

@Controller('interviews')
@UseGuards(JwtAuthGuard)
export class InterviewsController {
  constructor(private readonly interviews: InterviewsService) {}

  // ── List ────────────────────────────────────────────────────────────

  @Get()
  list(
    @Query(new ZodValidationPipe(listInterviewsFilterSchema))
    filter: ListInterviewsFilter,
  ) {
    return this.interviews.list(filter);
  }

  // ── Get one ─────────────────────────────────────────────────────────

  @Get(':id')
  get(@Param('id') id: string) {
    return this.interviews.getById(id);
  }

  // ── Create ──────────────────────────────────────────────────────────

  @Post()
  create(
    @Body(new ZodValidationPipe(createInterviewSchema))
    body: CreateInterviewInput,
    @CurrentUser() user: AccessTokenPayload,
  ) {
    return this.interviews.create(body, user.sub);
  }

  // ── Update ──────────────────────────────────────────────────────────

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateInterviewSchema))
    body: UpdateInterviewInput,
    @CurrentUser() user: AccessTokenPayload,
  ) {
    return this.interviews.update(id, body, user.sub);
  }

  // ── Complete (post-interview evaluation) ────────────────────────────

  @Post(':id/complete')
  complete(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(completeInterviewSchema))
    body: CompleteInterviewInput,
  ) {
    return this.interviews.complete(id, body);
  }

  // ── Cancel ──────────────────────────────────────────────────────────

  @Post(':id/cancel')
  @HttpCode(200)
  cancel(@Param('id') id: string) {
    return this.interviews.cancel(id);
  }

  // ── Delete ──────────────────────────────────────────────────────────

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string) {
    return this.interviews.remove(id);
  }
}
