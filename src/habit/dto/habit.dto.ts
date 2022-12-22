import { HabitData } from './../type/habit.data.type';
import { ApiProperty } from '@nestjs/swagger';
import { HabitRecordDay } from '@prisma/client';

export class HabitDto {
  @ApiProperty({ type: Number, description: '습관 Id' })
  id!: number;

  @ApiProperty({ type: String, description: '제목' })
  title!: string;

  @ApiProperty({ type: String, description: '습관' })
  action!: string;

  @ApiProperty({ type: Number, description: '목표치' })
  value!: number;

  @ApiProperty({ description: '단위', type: String })
  unit!: string;

  @ApiProperty({
    type: Number,
    description: '수행 시간',
    example: '10:10',
    nullable: true,
  })
  time!: string | null;

  @ApiProperty({ type: Date, description: '시작 날짜', example: '2022-12-11' })
  startDate!: Date;

  @ApiProperty({
    type: Date,
    description: '종료 날짜',
    example: '2022-12-11',
    nullable: true,
  })
  endDate!: Date | null;

  @ApiProperty({
    description: '수행 요일',
    isArray: true,
    enum: HabitRecordDay,
    enumName: 'HabitRecordDay',
  })
  days!: HabitRecordDay[];

  static of(habit: HabitData): HabitDto {
    return {
      id: habit.id,
      title: habit.title,
      action: habit.action,
      value: habit.value,
      unit: habit.unit,
      time: habit.time,
      startDate: habit.startDate,
      endDate: habit.endDate,
      days: habit.days,
    };
  }
}

export class HabitListDto {
  @ApiProperty({ type: [HabitDto] })
  habits: HabitDto[];

  static of(habits: HabitData[]): HabitListDto {
    return {
      habits: habits.map((habit) => HabitDto.of(habit)),
    };
  }
}
