import { Injectable } from '@nestjs/common';
import { HabitRepository } from './habit.repository';
import { CreateHabitPayload } from './payload/create.habit.payload';
import { GetHabitDto } from './dto/get.habit.dto';
import {
  convertHabitTimeToString,
  convertDayBitToString,
} from 'src/utils/date';
import { ChangeProgressPayload } from './payload/change.progress.payload';
import { GetHabitRecordPayload } from './payload/get.habit.record.payload';
import { GetHabitRecordDto } from './dto/get.habit.record.dto';

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

  async getHabitRecords(
    userId: string,
    payload: GetHabitRecordPayload,
  ): Promise<GetHabitRecordDto[]> {
    const { date } = payload;

    const habitWithRecords = await this.habitRepository.getHabitRecords(
      userId,
      new Date(date),
    );

    const habitRecords = habitWithRecords.map((habit) => {
      return {
        id: habit.id,
        title: habit.title,
        action: habit.action,
        value: habit.value,
        unit: habit.unit,
        startDate: habit.startDate,
        endDate: habit.endDate,
        time: convertHabitTimeToString(habit.time),
        recordId: habit.habitRecords[0].id,
        days: [habit.habitRecords[0].day],
        progress: habit.habitRecords[0].progress,
        accomplished: habit.habitRecords[0].accomplished,
      };
    });

    return habitRecords;
  }

  async changeProgress(payload: ChangeProgressPayload): Promise<void> {
    await this.habitRepository.changeProgress(payload);
  }
}
