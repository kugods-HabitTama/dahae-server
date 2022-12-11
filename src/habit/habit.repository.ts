import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import { Habit } from '@prisma/client';
import { CreateHabitPayload } from './payload/create.habit.payload';
import { HabitRecordDayConst } from './const/habitRecordDay.const';

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
}
