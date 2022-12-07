import {
  ArrayNotEmpty,
  IsDateString,
  IsDefined,
  IsEnum,
  IsMilitaryTime,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { HabitRecordDay } from '@prisma/client';

export class CreateHabitPayload {
  @IsDefined()
  @IsUUID()
  @ApiProperty({
    type: String,
    description: '사용자 id',
  })
  userId!: string;

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
  @IsPositive()
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
