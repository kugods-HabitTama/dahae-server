import {
  ArrayNotEmpty,
  IsDateString,
  IsDefined,
  IsEnum,
  IsInt,
  IsMilitaryTime,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { HabitRecordDay } from '@prisma/client';

export class CreateHabitPayload {
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: String,
    description: '제목',
  })
  title!: string;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: String,
    description: '습관',
  })
  action!: string;

  @IsDefined()
  @IsInt()
  @Min(0)
  @ApiProperty({
    type: Number,
    description: '목표치',
  })
  value!: number;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: String,
    description: '단위',
  })
  unit!: string;

  @IsOptional()
  @IsMilitaryTime()
  @ApiProperty({
    type: String,
    description: '수행 시간',
  })
  time?: string;

  @IsDefined()
  @IsDateString({ strict: true })
  @ApiProperty({
    type: String,
    description: '시작 날짜',
  })
  startDate!: string;

  @IsOptional()
  @IsDateString({ strict: true })
  @ApiProperty({
    type: String,
    description: '종료 날짜',
  })
  endDate?: string;

  @IsDefined()
  @ArrayNotEmpty()
  @IsEnum(HabitRecordDay, { each: true })
  @ApiProperty({
    type: Array,
    description: '수행 요일',
  })
  days: HabitRecordDay[];
}
