import { HabitWithRecordData } from './../type/habit.with.records.type';
import { ApiProperty } from '@nestjs/swagger';
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

  static of(habitRecord: HabitWithRecordData): HabitRecordDto {
    const habit = habitRecord.habit;
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
        days: habit.days,
      },
      progress: habitRecord.progress,
      accomplished: habitRecord.accomplished,
    };
  }
}

export class HabitRecordListDto {
  @ApiProperty({ type: [HabitRecordDto] })
  habitRecords: HabitRecordDto[];

  static of(habitRecords: HabitWithRecordData[]): HabitRecordListDto {
    return {
      habitRecords: habitRecords.map((habitRecord) =>
        HabitRecordDto.of(habitRecord),
      ),
    };
  }
}
