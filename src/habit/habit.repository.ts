import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import { CreateHabitPayload } from './payload/create.habit.payload';
import { Habit } from '@prisma/client';

@Injectable()
export class HabitRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(createHabitPayload: CreateHabitPayload): Promise<Habit> {
    const {
      userId,
      title,
      action,
      value,
      unit,
      time,
      startDate,
      endDate,
      days,
    } = createHabitPayload;

    let dayBit = 0;

    // days 배열을 bit 로 변환
    days.forEach((day) => {
      switch (day) {
        case 'Mon':
          dayBit += 1;
          break;
        case 'Tue':
          dayBit += 2;
          break;
        case 'Wed':
          dayBit += 4;
          break;
        case 'Thu':
          dayBit += 8;
          break;
        case 'Fri':
          dayBit += 16;
          break;
        case 'Sat':
          dayBit += 32;
          break;
        case 'Sun':
          dayBit += 64;
          break;
      }
    });

    return this.prisma.habit.create({
      data: {
        userId,
        title,
        action,
        value,
        unit,
        time,
        startDate,
        endDate,
        days: dayBit,
      },
    });
  }
}
