import {
  ArrayNotEmpty,
  IsDateString,
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { HabitRecordDay } from '@prisma/client';

export class CreateHabitPayload {
  @IsUUID()
  @ApiProperty({
    type: String,
    description: '사용자 id',
  })
  userId!: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: String,
    description: '제목',
  })
  title!: string;

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

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: String,
    description: '단위',
  })
  unit!: string;

  @IsOptional()
  @IsDateString()
  @ApiProperty({
    type: String,
    description: '수행 시간',
  })
  time?: Date;

  @IsDateString()
  @ApiProperty({
    type: String,
    description: '시작 날짜',
  })
  startDate!: Date;

  @IsOptional()
  @IsDateString()
  @ApiProperty({
    type: String,
    description: '종료 날짜',
  })
  endDate?: Date;

  @ArrayNotEmpty()
  @IsEnum(HabitRecordDay, { each: true })
  @ApiProperty({
    type: Array,
    description: '수행 요일',
  })
  days: HabitRecordDay[];
}
