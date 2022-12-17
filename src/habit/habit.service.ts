import { BadRequestException, Injectable } from '@nestjs/common';
import { HabitRepository } from './habit.repository';
import { CreateHabitPayload } from './payload/create.habit.payload';
import { GetHabitDto } from './dto/get.habit.dto';
import { ChangeProgressPayload } from './payload/change.progress.payload';
import { GetHabitRecordPayload } from './payload/get.habit.record.payload';
import { GetHabitRecordDto } from './dto/get.habit.record.dto';
import { convertDayBitToString, getDayStringFromDate } from 'src/utils/date';
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

    //진행된 habit record 구하기
    const habitWithRecords = await this.habitRepository.getHabitRecords(
      userId,
      new Date(date),
    );

    const progressedHabitIds = [];
    const progressedDtos = [];

    habitWithRecords.forEach((habit) => {
      progressedHabitIds.push(habit.id);
      progressedDtos.push(GetHabitRecordDto.of(habit));
    });

    //진행되지 않은 habit 구하기
    const habits = (await this.getHabitList(userId)).habits;
    const dayString = getDayStringFromDate(new Date(date));

    const unprogrssedDtos = this.getUnprogressedHabits(
      habits,
      dayString,
      progressedHabitIds,
    );

    return {
      habitRecords: progressedDtos.concat(unprogrssedDtos),
    };
  }

  async changeProgress(payload: ChangeProgressPayload): Promise<void> {
    const habit = await this.habitRepository.getHabit(payload.habitId);
    const habitDays = convertDayBitToString(habit.days);

    const requestedDay = getDayStringFromDate(new Date(payload.date));

    if (!habitDays.includes(requestedDay))
      throw new BadRequestException('inappropriate date request');

    await this.habitRepository.changeProgress(payload);
  }

  async deleteHabit(id: number): Promise<void> {
    await this.habitRepository.delete(id);
  }

  getUnprogressedHabits(
    habits: GetHabitDto[],
    day: HabitRecordDay,
    progressedHabitIds: number[],
  ): GetHabitRecordDto[] {
    const arr = [];

    habits.forEach((habit) => {
      if (!progressedHabitIds.includes(habit.id) && habit.days.includes(day)) {
        arr.push(GetHabitRecordDto.ofHabit(habit, day));
      }
    });

    return arr;
  }
}
