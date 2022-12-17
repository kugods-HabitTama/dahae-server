import { ApiProperty } from '@nestjs/swagger';
import { convertHabitTimeToString } from 'src/utils/date';
import { HabitWithRecordsT } from '../type/habit.with.records.type';
import { GetHabitDto } from './get.habit.dto';

export class GetHabitRecordDto extends GetHabitDto {
  @ApiProperty({
    type: Number,
    description: '진행도',
  })
  progress: number;

  @ApiProperty({
    type: Boolean,
    description: '달성여부',
  })
  accomplished: boolean;

  static of(habit: HabitWithRecordsT): GetHabitRecordDto {
    return {
      id: habit.id,
      title: habit.title,
      action: habit.action,
      value: habit.value,
      unit: habit.unit,
      startDate: habit.startDate,
      endDate: habit.endDate,
      time: convertHabitTimeToString(habit.time),
      days: [habit.habitRecords[0].day],
      progress: habit.habitRecords[0].progress,
      accomplished: habit.habitRecords[0].accomplished,
    };
  }
}
