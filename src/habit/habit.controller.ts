import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { HabitService } from './habit.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateHabitPayload } from './payload/create.habit.payload';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

@ApiTags('Habit API')
@Controller('habit')
export class HabitController {
  constructor(private readonly habitService: HabitService) {}

  @ApiBearerAuth()
  @Post('/')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'create habit' })
  async createHabit(
    @Body() createHabitPayload: CreateHabitPayload,
  ): Promise<void> {
    return this.habitService.createHabit(createHabitPayload);
  }
}
