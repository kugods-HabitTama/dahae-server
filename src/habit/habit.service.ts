import { Injectable } from '@nestjs/common';
import { HabitRepository } from './habit.repository';
import { CreateHabitPayload } from './payload/create.habit.payload';
import { GetHabitDto } from './dto/get.habit.dto';
import {
  convertHabitTimeToString,
  convertDayBitToString,
} from 'src/utils/date';
import { ChangeProgressPayload } from './payload/change.progress.payload';

@Injectable()
export class HabitService {
  constructor(private readonly habitRepository: HabitRepository) {}

  async createHabit(
    userId: string,
    payload: CreateHabitPayload,
  ): Promise<void> {
    await this.habitRepository.create(userId, payload);
  }

  async getHabitList(userId: string): Promise<GetHabitDto[]> {
    const habits = await this.habitRepository.getHabits(userId);

    const dayTransformedHabits = habits.map((habit) => {
      return {
        ...habit,
        time: convertHabitTimeToString(habit.time),
        days: convertDayBitToString(habit.days),
      };
    });

    return dayTransformedHabits;
  }

  async changeProgress(payload: ChangeProgressPayload): Promise<void> {
    await this.habitRepository.changeProgress(payload);
  }
}
