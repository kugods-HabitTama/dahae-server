import { BadRequestException, Injectable } from '@nestjs/common';
import { HabitRepository } from './habit.repository';
import { CreateHabitPayload } from './payload/create.habit.payload';
import { HabitDto, HabitListDto } from './dto/habit.dto';
import { ChangeProgressPayload } from './payload/change.progress.payload';
import { HabitRecordDto, HabitRecordListDto } from './dto/habit.record.dto';
import { convertDayBitToString, getDayStringFromDate } from 'src/utils/date';
import { HabitRecordDay } from '@prisma/client';
import { UpdateHabitPayload } from './payload/update.habit.payload';

@Injectable()
export class HabitService {
  constructor(private readonly habitRepository: HabitRepository) {}

  async createHabit(
    userId: string,
    payload: CreateHabitPayload,
  ): Promise<void> {
    await this.habitRepository.create(userId, payload);
  }

  async getHabitList(userId: string): Promise<HabitListDto> {
    const habits = await this.habitRepository.getHabits(userId);

    const getHabitDtos = habits.map((habit) => {
      return HabitDto.of(habit);
    });

    return { habits: getHabitDtos };
  }

  async getHabitRecords(
    userId: string,
    date: string,
  ): Promise<HabitRecordListDto> {
    //진행된 habit record 구하기
    const habitWithRecords = await this.habitRepository.getHabitRecords(
      userId,
      new Date(date),
    );

    const progressedHabitIds = [];
    const progressedDtos = [];

    habitWithRecords.forEach((habit) => {
      progressedHabitIds.push(habit.id);
      progressedDtos.push(HabitRecordDto.of(habit));
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

  async updateHabit(
    userId: string,
    habitId: number,
    payload: UpdateHabitPayload,
  ): Promise<void> {
    this.habitRepository.update(userId, habitId, payload);
  }

  getUnprogressedHabits(
    habits: HabitDto[],
    day: HabitRecordDay,
    progressedHabitIds: number[],
  ): HabitRecordDto[] {
    const arr = [];

    habits.forEach((habit) => {
      if (!progressedHabitIds.includes(habit.id) && habit.days.includes(day)) {
        arr.push(HabitRecordDto.ofHabit(habit, day));
      }
    });

    return arr;
  }
}
