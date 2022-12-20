import { ApiProperty } from '@nestjs/swagger';
import { HabitRecordDay } from '@prisma/client';
import { convertHabitTimeToString } from 'src/utils/date';
import { HabitWithRecordsT } from '../type/habit.with.records.type';
import { HabitDto } from './habit.dto';

export class HabitRecordDto {
  @ApiProperty({ type: HabitDto })
  habit!: HabitDto;

  @ApiProperty({
    type: Number,
    description: '진행도',
  })
  progress!: number;

  @ApiProperty({
    type: Boolean,
    description: '달성여부',
  })
  accomplished!: boolean;

  static of(habit: HabitWithRecordsT): HabitRecordDto {
    return {
      habit: {
        id: habit.id,
        title: habit.title,
        action: habit.action,
        value: habit.value,
        unit: habit.unit,
        startDate: habit.startDate,
        endDate: habit.endDate,
        time: convertHabitTimeToString(habit.time),
        days: [habit.habitRecords[0].day],
      },
      progress: habit.habitRecords[0].progress,
      accomplished: habit.habitRecords[0].accomplished,
    };
  }

  static ofHabit(habit: HabitDto, day: HabitRecordDay): HabitRecordDto {
    return {
      habit: {
        id: habit.id,
        title: habit.title,
        action: habit.action,
        value: habit.value,
        unit: habit.unit,
        startDate: habit.startDate,
        endDate: habit.endDate,
        time: habit.time,
        days: [day],
      },
      progress: 0,
      accomplished: false,
    };
  }
}

export class HabitRecordListDto {
  @ApiProperty({ type: [HabitRecordDto] })
  habitRecords: HabitRecordDto[];
}
