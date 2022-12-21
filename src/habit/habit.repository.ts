import { convertDayBitToString } from './../utils/date';
import { HabitData } from './type/habit.data.type';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import { Habit, HabitRecord, HabitRecordDay } from '@prisma/client';
import { CreateHabitPayload } from './payload/create.habit.payload';
import { HabitRecordDayConst } from './const/habitRecordDay.const';
import { ChangeProgressPayload } from './payload/change.progress.payload';
import { HabitWithRecordData } from './type/habit.with.records.type';
import { UpdateHabitPayload } from './payload/update.habit.payload';

@Injectable()
export class HabitRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    userId: string,
    payload: CreateHabitPayload,
  ): Promise<HabitData> {
    const { title, action, unit, value, time, startDate, endDate, days } =
      payload;

    // 요일을 bit 합으로 변환
    const dayBit = days.reduce((acc, cur) => acc + HabitRecordDayConst[cur], 0);

    // time 을 Date 타입으로 변환
    let habitTime = null;
    if (time) {
      const [hh, mm] = time.split(':');
      habitTime = new Date();
      habitTime.setUTCHours(+hh, +mm, 0, 0);
    }

    const habit = await this.prisma.habit.create({
      data: {
        userId,
        title,
        action,
        unit,
        value,
        time: habitTime,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        days: dayBit,
      },
    });

    return this.toHabitData(habit);
  }

  async getHabits(userId: string): Promise<HabitData[]> {
    const habits = await this.prisma.habit.findMany({
      where: {
        userId,
        isActive: true,
        user: {
          deletedAt: null,
        },
      },
    });

    return habits.map((habit) => this.toHabitData(habit));
  }

  async getHabitRecords(
    userId: string,
    date: Date,
  ): Promise<HabitWithRecordData[]> {
    const habitRecords = await this.prisma.habitRecord.findMany({
      where: {
        habit: {
          userId,
          isActive: true,
        },
        date,
      },
      include: {
        habit: true,
      },
    });

    return habitRecords.map((habitRecord) => ({
      id: habitRecord.id,
      progress: habitRecord.progress,
      date: habitRecord.date,
      accomplished: habitRecord.accomplished,
      day: habitRecord.day,
      habit: this.toHabitData(habitRecord.habit),
    }));
  }

  async getHabit(habitId: number): Promise<HabitData> {
    const habit = await this.prisma.habit.findUnique({
      where: {
        id: habitId,
      },
    });

    return this.toHabitData(habit);
  }

  async changeProgress(
    payload: ChangeProgressPayload,
    day: HabitRecordDay,
  ): Promise<void> {
    const { habitId, date: dateString, progress } = payload;

    const date = new Date(dateString);

    await this.prisma.habitRecord.upsert({
      where: {
        habitId_date: {
          habitId,
          date,
        },
      },
      create: {
        habitId,
        date,
        progress,
        day,
      },
      update: {
        progress,
      },
    });
  }

  async delete(id: number): Promise<HabitData> {
    const habit = await this.prisma.habit.update({
      where: {
        id,
      },
      data: {
        isActive: false,
      },
    });

    return this.toHabitData(habit);
  }

  async update(
    userId: string,
    habitId: number,
    payload: UpdateHabitPayload,
  ): Promise<HabitData> {
    const { title, action, unit, value, time, startDate, endDate, days } =
      payload;

    const habit = await this.prisma.habit.findUnique({
      where: {
        id: habitId,
      },
    });

    //날짜 검증
    if (startDate && endDate) {
      if (startDate > endDate) throw new BadRequestException('invalid date');
    } else if (startDate) {
      if (new Date(startDate) > habit.endDate)
        throw new BadRequestException('invalid startDate');
    } else if (endDate) {
      if (habit.startDate > new Date(endDate))
        throw new BadRequestException('invalid endDate');
    }

    const dayBit = days
      ? days.reduce((acc, cur) => acc + HabitRecordDayConst[cur], 0)
      : undefined;

    const newStartDate = startDate ? new Date(startDate) : habit.startDate;
    const newEndDate = endDate
      ? new Date(endDate)
      : endDate === null
      ? null
      : habit.endDate;
    const newDays = dayBit || habit.days;

    if (title || action || unit || value || time || time === null) {
      //soft delete 후 새로운 habit 생성
      await this.delete(habitId);

      let habitTime = null;
      if (time) {
        const [hh, mm] = time.split(':');
        habitTime = new Date();
        habitTime.setUTCHours(+hh, +mm, 0, 0);
      }

      const createdHabit = await this.prisma.habit.create({
        data: {
          userId,
          title: title || habit.title,
          action: action || habit.action,
          unit: unit || habit.unit,
          value: value || habit.value,
          time: time || time === null ? habitTime : habit.time,
          startDate: newStartDate,
          endDate: newEndDate,
          days: newDays,
        },
      });

      return this.toHabitData(createdHabit);
    } else {
      //기존 habit 업데이트
      const updatedHabit = await this.prisma.habit.update({
        where: {
          id: habitId,
        },
        data: {
          startDate: newStartDate,
          endDate: newEndDate,
          days: newDays,
        },
      });

      return this.toHabitData(updatedHabit);
    }
  }

  private toHabitData(habit: Habit): HabitData {
    return {
      id: habit.id,
      title: habit.title,
      action: habit.action,
      unit: habit.unit,
      value: habit.value,
      time: habit.time,
      startDate: habit.startDate,
      endDate: habit.endDate,
      days: convertDayBitToString(habit.days),
      isActive: habit.isActive,
    };
  }
}
