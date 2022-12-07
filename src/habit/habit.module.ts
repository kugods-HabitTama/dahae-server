import { Module } from '@nestjs/common';
import { HabitController } from './habit.controller';
import { HabitService } from './habit.service';
import { HabitRepository } from './habit.repository';

@Module({
  controllers: [HabitController],
  providers: [HabitService, HabitRepository],
})
export class HabitModule {}
