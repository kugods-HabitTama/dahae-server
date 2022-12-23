import {
  ArrayNotEmpty,
  IsDate,
  IsEnum,
  IsInt,
  IsMilitaryTime,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { HabitRecordDay } from '@prisma/client';
import { IsAfter } from '../../common/validators/isAfterConstraint';
import { Transform } from 'class-transformer';

export class UpdateHabitPayload {
  @IsNotEmpty()
  @IsString()
  @ApiPropertyOptional({
    type: String,
    description: '제목',
  })
  title?: string;

  @IsNotEmpty()
  @IsString()
  @ApiPropertyOptional({
    type: String,
    description: '습관',
  })
  action?: string;

  @IsInt()
  @Min(0)
  @ApiPropertyOptional({
    type: Number,
    description: '목표치',
  })
  value?: number;

  @IsNotEmpty()
  @IsString()
  @ApiPropertyOptional({
    type: String,
    description: '단위',
  })
  unit?: string;

  @IsOptional()
  @IsMilitaryTime()
  @ApiPropertyOptional({
    type: String,
    description: '수행 시간',
    example: '10:10',
    nullable: true,
  })
  time?: string | null;

  @IsAfter()
  @IsDate()
  @Transform(({ value }) => {
    if (!value) return value;
    return new Date(value).toJSON() ? new Date(value) : 'Invalid Date';
  })
  @ApiPropertyOptional({
    type: String,
    description: '시작 날짜',
    example: '2022-12-11',
  })
  startDate?: Date;

  @IsAfter('startDate')
  @IsDate()
  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return value;
    return new Date(value).toJSON() ? new Date(value) : 'Invalid Date';
  })
  @ApiPropertyOptional({
    type: String,
    description: '종료 날짜',
    example: '2022-12-11',
    nullable: true,
  })
  endDate?: Date | null;

  @ArrayNotEmpty()
  @IsEnum(HabitRecordDay, { each: true })
  @ApiPropertyOptional({
    description: '수행 요일',
    isArray: true,
    enum: HabitRecordDay,
    enumName: 'HabitRecordDay',
  })
  days?: HabitRecordDay[];
}
