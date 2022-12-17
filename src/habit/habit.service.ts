import { Injectable } from '@nestjs/common';
import { HabitRepository } from './habit.repository';
import { CreateHabitPayload } from './payload/create.habit.payload';
import { GetHabitDto } from './dto/get.habit.dto';
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

    return habits.map((habit) => {
      return GetHabitDto.of(habit);
    });
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
      return GetHabitRecordDto.of(habit);
    });

    return habitRecords;
  }

  async changeProgress(payload: ChangeProgressPayload): Promise<void> {
    await this.habitRepository.changeProgress(payload);
  }
}
