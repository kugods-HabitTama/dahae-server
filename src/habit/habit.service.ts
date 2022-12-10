import { BadRequestException, Injectable } from '@nestjs/common';
import { HabitRepository } from './habit.repository';
import { CreateHabitPayload } from './payload/create.habit.payload';
import { CreateHabitType } from './type/create.habit.type';
import { HabitRecordDayConst } from './const/habitRecordDay.const';

@Injectable()
export class HabitService {
  constructor(private readonly habitRepository: HabitRepository) {}

  async createHabit(
    userId: string,
    createHabitPayload: CreateHabitPayload,
  ): Promise<void> {
    const { time, startDate, endDate, days } = createHabitPayload;

    // startDate 검증
    const date = new Date();
    if (startDate < date.toJSON().slice(0, 10)) {
      throw new BadRequestException('invalid startDate');
    }

    // endDate 검증
    if (endDate && endDate < startDate) {
      throw new BadRequestException('invalid endDate');
    }

    // 요일을 bit 합으로 변환
    const dayBit = days.reduce((acc, cur) => acc + HabitRecordDayConst[cur], 0);

    // time 을 Date 타입으로 변환
    let habitTime = null;
    if (time) {
      const [hh, mm] = time.split(':');
      habitTime = date;
      habitTime.setUTCHours(+hh, +mm, 0, 0);
    }

    const habitData: CreateHabitType = {
      ...createHabitPayload,
      userId,
      time: habitTime,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null,
      days: dayBit,
    };

    await this.habitRepository.create(habitData);
  }
}
