import { Body, Controller, Post } from '@nestjs/common';
import { HabitService } from './habit.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateHabitPayload } from './payload/create.habit.payload';

@ApiTags('Habit API')
@Controller('habit')
export class HabitController {
  constructor(private readonly habitService: HabitService) {}

  @Post('/')
  @ApiOperation({ summary: 'create habit' })
  async createHabit(
    @Body() createHabitPayload: CreateHabitPayload,
  ): Promise<void> {
    return this.habitService.createHabit(createHabitPayload);
  }
}
