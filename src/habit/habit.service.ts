import { HabitWithRecordData } from './type/habit.with.records.type';
import { HabitData } from './type/habit.data.type';
import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { HabitRepository } from './habit.repository';
import { CreateHabitPayload } from './payload/create.habit.payload';
import { HabitListDto } from './dto/habit.dto';
import { ChangeProgressPayload } from './payload/change.progress.payload';
import { HabitRecordListDto } from './dto/habit.record.dto';
import { getDayStringFromDate } from 'src/utils/date';
import { UpdateHabitPayload } from './payload/update.habit.payload';
import { HabitRecordDay } from '@prisma/client';

@Injectable()
export class HabitService {
  constructor(private readonly habitRepository: HabitRepository) {}

  async createHabit(
    userId: string,
    payload: CreateHabitPayload,
  ): Promise<void> {
    await this.habitRepository.create(userId, payload);
  }

  async getHabitList(userId: string): Promise<HabitListDto> {
    const habits: HabitData[] = await this.habitRepository.getHabits(userId);

    return HabitListDto.of(habits);
  }

  async getHabitRecords(
    userId: string,
    dateString: string,
  ): Promise<HabitRecordListDto> {
    const date = new Date(dateString);
    const day = getDayStringFromDate(date);

    // habit과 이미 진행된 habitRecord 정보를 조회
    const habits: HabitData[] = await this.habitRepository.getHabits(userId);
    const progressedRecordsData: HabitWithRecordData[] =
      await this.habitRepository.getHabitRecords(userId, date);

    const habitRecords: HabitWithRecordData[] = habits
      // 요일에 맞는 habit만 필터링
      .filter((habit) => habit.days.includes(day))
      .map(
        (habit) =>
          // habitRecord에 있는 habit이면 habitRecord를 반환하고 없으면 0과 관련한 값으로 채워서 리턴
          progressedRecordsData.find(
            (habitWithRecord) => habitWithRecord.id === habit.id,
          ) ?? {
            progress: 0,
            accomplished: false,
            day,
            date,
            habit,
          },
      );

    return HabitRecordListDto.of(habitRecords);
  }

  async changeProgress(payload: ChangeProgressPayload): Promise<void> {
    const habit: HabitData = await this.habitRepository.getHabit(
      payload.habitId,
    );

    const day = this.getDay(payload.date);

    if (!habit.days.includes(day)) {
      throw new ConflictException('inappropriate date request');
    }

    await this.habitRepository.changeProgress(payload, day);
  }

  async deleteHabit(id: number): Promise<void> {
    await this.habitRepository.delete(id);
  }

  async updateHabit(
    userId: string,
    habitId: number,
    payload: UpdateHabitPayload,
  ): Promise<void> {
    await this.habitRepository.update(userId, habitId, payload);
  }

  private getDay(date: Date): HabitRecordDay {
    const dayArr: HabitRecordDay[] = [
      'Sun',
      'Mon',
      'Tue',
      'Wed',
      'Thu',
      'Fri',
      'Sat',
    ];

    return dayArr[date.getDay()];
  }
}
