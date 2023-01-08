import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import { Habit, HabitRecordDay, Prisma } from '@prisma/client';
import { CreateHabitPayload } from './payload/create.habit.payload';
import { HabitRecordDayConst } from './const/habitRecordDay.const';
import { ChangeProgressPayload } from './payload/change.progress.payload';
import { HabitWithRecordData } from './type/habit.with.records.type';
import { HabitData } from './type/habit.data.type';
import { UpdateHabitInput } from './type/update-habit-input.type';

@Injectable()
export class HabitRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    userId: string,
    payload: CreateHabitPayload,
  ): Promise<HabitData> {
    const { title, action, unit, value, time, startDate, endDate, days } =
      payload;

    const habit = await this.prisma.habit.create({
      data: {
        userId,
        title,
        action,
        unit,
        value,
        time,
        startDate,
        endDate,
        days: this.convertDayStringToBit(days),
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
    const { habitId, date, progress } = payload;

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
    data: UpdateHabitInput,
  ): Promise<HabitData> {
    const { title, action, unit, value, time, startDate, endDate, days } = data;

    const dayBit = data.days ? this.convertDayStringToBit(days) : undefined;

    if (this.isUpdateNeedSoftDelete(data)) {
      // 삭제 후 생성을 한 트랜잭션으로 처리합니다.
      return this.prisma.$transaction(
        async (tx: Prisma.TransactionClient): Promise<HabitData> => {
          const habit: Habit = await tx.habit.update({
            where: {
              id: habitId,
            },
            data: {
              isActive: false,
            },
          });

          const createdHabit = await tx.habit.create({
            data: {
              userId,
              title: title ?? habit.title,
              action: action ?? habit.action,
              unit: unit ?? habit.unit,
              value: value ?? habit.value,
              time: time === undefined ? habit.time : time,
              startDate: startDate ?? habit.startDate,
              endDate: endDate ?? habit.endDate,
              days: dayBit ?? habit.days,
            },
          });

          return this.toHabitData(createdHabit);
        },
      );
    } else {
      //기존 habit 업데이트
      const updatedHabit = await this.prisma.habit.update({
        where: {
          id: habitId,
        },
        data: {
          startDate,
          endDate,
          days: dayBit,
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
      days: this.convertDayBitToString(habit.days),
      isActive: habit.isActive,
    };
  }

  private convertDayBitToString(days: number): HabitRecordDay[] {
    const dayArr = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    const habitDayArr = [];

    for (let i = 0; i < 7; i++) {
      const dayBit = days >> i;

      if (dayBit & 1) habitDayArr.push(dayArr[i]);
    }

    return habitDayArr;
  }

  private convertDayStringToBit(days: HabitRecordDay[]): number {
    return days.reduce((acc, cur) => acc + HabitRecordDayConst[cur], 0);
  }

  private isUpdateNeedSoftDelete(data: UpdateHabitInput): boolean {
    const { title, action, unit, value, time } = data;

    if (title || action || unit || value || time !== undefined) return true;

    return false;
  }
}
