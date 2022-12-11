import { BadRequestException, Injectable } from '@nestjs/common';
import { HabitRepository } from './habit.repository';
import { CreateHabitPayload } from './payload/create.habit.payload';

@Injectable()
export class HabitService {
  constructor(private readonly habitRepository: HabitRepository) {}

  async createHabit(
    userId: string,
    payload: CreateHabitPayload,
  ): Promise<void> {
    const { startDate, endDate } = payload;

    // startDate 검증
    const date = new Date();
    if (startDate < date.toJSON().slice(0, 10)) {
      throw new BadRequestException('invalid startDate');
    }

    // endDate 검증
    if (endDate && endDate < startDate) {
      throw new BadRequestException('invalid endDate');
    }

    await this.habitRepository.create(userId, payload);
  }
}
