import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import { Habit, HabitRecord, HabitRecordDay } from '@prisma/client';
import { CreateHabitPayload } from './payload/create.habit.payload';
import { HabitRecordDayConst } from './const/habitRecordDay.const';
import { ChangeProgressPayload } from './payload/change.progress.payload';
import { HabitWithRecordsT } from './type/habit.with.records.type';

@Injectable()
export class HabitRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(userId: string, payload: CreateHabitPayload): Promise<Habit> {
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

    return this.prisma.habit.create({
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
  }

  async getHabits(userId: string): Promise<Habit[]> {
    return this.prisma.habit.findMany({
      where: {
        userId,
        isActive: true,
        user: {
          deletedAt: null,
        },
      },
    });
  }

  async getHabitRecords(
    userId: string,
    date: Date,
  ): Promise<HabitWithRecordsT[]> {
    return this.prisma.habit.findMany({
      where: {
        userId,
        user: {
          deletedAt: null,
        },
        habitRecords: {
          some: {
            date,
          },
        },
      },
      include: {
        habitRecords: {
          where: { date },
        },
      },
    });
  }

  async getHabit(habitId: number): Promise<Habit> {
    return this.prisma.habit.findUnique({
      where: {
        id: habitId,
      },
    });
  }

  async changeProgress(payload: ChangeProgressPayload): Promise<HabitRecord> {
    const { habitId, date, progress } = payload;
    const habit = await this.prisma.habit.findUnique({
      where: {
        id: habitId,
      },
      include: {
        habitRecords: {
          where: { date: new Date(date) },
        },
      },
    });

    const habitRecords = habit.habitRecords;

    if (habitRecords.length > 0) {
      //record가 존재할 경우 기존 record의 progress 변경
      const record = habitRecords[0];

      return this.prisma.habitRecord.update({
        where: {
          id: record.id,
        },
        data: {
          progress,
        },
      });
    } else {
      //record가 존재하지 않을 경우 record 생성
      const recordDate = new Date(date);
      const dayIdx = recordDate.getDay();

      const dayArr = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

      return this.prisma.habitRecord.create({
        data: {
          habitId,
          progress,
          date: new Date(date),
          day: dayArr[dayIdx] as HabitRecordDay,
        },
      });
    }
  }
}
