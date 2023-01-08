import { UpdateHabitInput } from './type/update-habit-input.type';
import { HabitWithRecordData } from './type/habit.with.records.type';
import { HabitData } from './type/habit.data.type';
import { ConflictException, Injectable } from '@nestjs/common';
import { HabitRepository } from './habit.repository';
import { CreateHabitPayload } from './payload/create.habit.payload';
import { HabitListDto } from './dto/habit.dto';
import { ChangeProgressPayload } from './payload/change.progress.payload';
import { HabitRecordListDto } from './dto/habit.record.dto';
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
    const day = this.getDay(date);

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
            (habitWithRecord) => habitWithRecord.habit.id === habit.id,
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
    const habit: HabitData = await this.habitRepository.getHabit(habitId);

    // startDate와 endDate의 선후관계는 최상단의 비즈니스 로직이므로, 이를 검증하는 로직은 서비스에 위치
    // InputType의 validation은 DTO에서 하고, 서비스에서는 DB에 저장된 데이터와 비교하는 로직을 작성
    const newStartDate = payload.startDate ?? habit.startDate;
    const newEndDate =
      payload.endDate === undefined ? habit.endDate : payload.endDate;

    if (newStartDate > newEndDate) {
      throw new ConflictException(
        '서버에 등록된 startDate, endDate와 선후관계가 맞지 않습니다.',
      );
    }

    const updateInput: UpdateHabitInput = {
      ...payload,
      startDate: newStartDate,
      endDate: newEndDate,
    };

    await this.habitRepository.update(userId, habitId, updateInput);
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
