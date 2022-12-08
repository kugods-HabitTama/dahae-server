import { BadRequestException, Injectable } from '@nestjs/common';
import { HabitRepository } from './habit.repository';
import { CreateHabitPayload } from './payload/create.habit.payload';
import { CreateHabitType } from './type/create.habit.type';
import { HabitRecordDayConst } from './const/habitRecordDay.const';

@Injectable()
export class HabitService {
  constructor(private readonly habitRepository: HabitRepository) {}

  async createHabit(createHabitPayload: CreateHabitPayload): Promise<void> {
    const { time, startDate, endDate, days } = createHabitPayload;

    // startDate 검증
    const today = new Date().toJSON().slice(0, 10);
    if (startDate < today) {
      throw new BadRequestException('invalid startDate');
    }

    // endDate 검증
    if (endDate || endDate < startDate) {
      throw new BadRequestException('invalid endDate');
    }

    // 요일을 bit 합으로 변환
    const dayBit = days.reduce((acc, cur) => acc + HabitRecordDayConst[cur], 0);

    // time 을 Date 타입으로 변환
    const [hh, mm] = time.split(':');
    const habitTime = new Date();
    habitTime.setUTCHours(+hh, +mm);

    const habitData: CreateHabitType = {
      ...createHabitPayload,
      time: habitTime,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      days: dayBit,
    };

    await this.habitRepository.create(habitData);
  }
}
