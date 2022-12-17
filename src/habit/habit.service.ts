import { BadRequestException, Injectable } from '@nestjs/common';
import { HabitRepository } from './habit.repository';
import { CreateHabitPayload } from './payload/create.habit.payload';
import { GetHabitDto } from './dto/get.habit.dto';
import { ChangeProgressPayload } from './payload/change.progress.payload';
import { GetHabitRecordPayload } from './payload/get.habit.record.payload';
import { GetHabitRecordDto } from './dto/get.habit.record.dto';
import { convertDayBitToString } from 'src/utils/date';
import { HabitRecordDay } from '@prisma/client';
import { GetHabitListDto } from './dto/get.habit.list.dto';
import { GetHabitRecordListDto } from './dto/get.habit.record.list.dto';

@Injectable()
export class HabitService {
  constructor(private readonly habitRepository: HabitRepository) {}

  async createHabit(
    userId: string,
    payload: CreateHabitPayload,
  ): Promise<void> {
    await this.habitRepository.create(userId, payload);
  }

  async getHabitList(userId: string): Promise<GetHabitListDto> {
    const habits = await this.habitRepository.getHabits(userId);

    const getHabitDtos = habits.map((habit) => {
      return GetHabitDto.of(habit);
    });

    return { habits: getHabitDtos };
  }

  async getHabitRecords(
    userId: string,
    payload: GetHabitRecordPayload,
  ): Promise<GetHabitRecordListDto> {
    const { date } = payload;

    const habitWithRecords = await this.habitRepository.getHabitRecords(
      userId,
      new Date(date),
    );

    const habitRecords = habitWithRecords.map((habit) => {
      return GetHabitRecordDto.of(habit);
    });

    return {
      habitRecords,
    };
  }

  async changeProgress(payload: ChangeProgressPayload): Promise<void> {
    const habit = await this.habitRepository.getHabit(payload.habitId);
    const habitDays = convertDayBitToString(habit.days);

    const dayArr = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const requestedDate = new Date(payload.date);
    const dayIdx = requestedDate.getDay();
    const requestedDay = dayArr[dayIdx] as HabitRecordDay;

    if (!habitDays.includes(requestedDay))
      throw new BadRequestException('inappropriate date request');

    await this.habitRepository.changeProgress(payload);
  }
}
