import { Module } from '@nestjs/common';
import { HabitController } from './habit.controller';
import { HabitService } from './habit.service';

@Module({
  controllers: [HabitController],
  providers: [HabitService]
})
export class HabitModule {}
