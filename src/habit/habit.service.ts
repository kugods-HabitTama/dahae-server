import { Injectable } from '@nestjs/common';
import { HabitRepository } from './habit.repository';
import { CreateHabitPayload } from './payload/create.habit.payload';

@Injectable()
export class HabitService {
  constructor(private readonly habitRepository: HabitRepository) {}

  async createHabit(
    userId: string,
    payload: CreateHabitPayload,
  ): Promise<void> {
    await this.habitRepository.create(userId, payload);
  }
}
