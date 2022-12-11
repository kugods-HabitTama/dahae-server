import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import { Habit } from '@prisma/client';
import { CreateHabitType } from './type/create.habit.type';

@Injectable()
export class HabitRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(habitData: CreateHabitType): Promise<Habit> {
    return this.prisma.habit.create({
      data: habitData,
    });
  }
}
