import { Injectable } from '@nestjs/common';
import { HabitRepository } from './habit.repository';
import { CreateHabitPayload } from './payload/create.habit.payload';
import { CreateHabitType } from './type/create.habit.type';

@Injectable()
export class HabitService {
  constructor(private readonly habitRepository: HabitRepository) {}

  async createHabit(createHabitPayload: CreateHabitPayload): Promise<void> {
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

    const habitTime = new Date();
    const [hh, mm] = time.split(':');
    habitTime.setUTCHours(Number(hh), Number(mm));

    const habitData: CreateHabitType = {
      userId,
      title,
      action,
      value,
      unit,
      time: habitTime,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      days: dayBit,
    };

    await this.habitRepository.create(habitData);
  }
}
