import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import { Habit, HabitRecord, HabitRecordDay } from '@prisma/client';
import { CreateHabitPayload } from './payload/create.habit.payload';
import { HabitRecordDayConst } from './const/habitRecordDay.const';
import { ChangeProgressPayload } from './payload/change.progress.payload';
import { HabitWithRecordsT } from './type/habit.with.records.type';
import { UpdateHabitPayload } from './payload/update.habit.payload';

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

  delete(id: number): Promise<Habit> {
    return this.prisma.habit.update({
      where: {
        id,
      },
      data: {
        isActive: false,
      },
    });
  }

  async update(userId: string, payload: UpdateHabitPayload): Promise<Habit> {
    const { id, title, action, unit, value, time, startDate, endDate, days } =
      payload;

    if (title || action || unit || value || time) {
      //soft delete 후 새로운 habit 생성
      const habit = await this.delete(id);

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

      let habitTime = null;
      if (time) {
        const [hh, mm] = time.split(':');
        habitTime = new Date();
        habitTime.setUTCHours(+hh, +mm, 0, 0);
      }

      return this.prisma.habit.create({
        data: {
          userId,
          title: title || habit.title,
          action: action || habit.action,
          unit: unit || habit.unit,
          value: value === undefined ? habit.value : value,
          time: habitTime || habit.time,
          startDate: startDate ? new Date(startDate) : habit.startDate,
          endDate: endDate ? new Date(endDate) : habit.endDate,
          days: dayBit || habit.days,
        },
      });
    } else {
      const habit = await this.prisma.habit.findUnique({
        where: {
          id,
        },
      });

      const dayBit = days
        ? days.reduce((acc, cur) => acc + HabitRecordDayConst[cur], 0)
        : undefined;

      return this.prisma.habit.update({
        where: {
          id,
        },
        data: {
          startDate: startDate ? new Date(startDate) : habit.startDate,
          endDate: endDate ? new Date(endDate) : habit.endDate,
          days: dayBit || habit.days,
        },
      });
    }
  }
}
