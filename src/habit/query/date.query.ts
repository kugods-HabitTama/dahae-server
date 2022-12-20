import { ApiProperty } from '@nestjs/swagger';
import { IsDateString } from 'class-validator';

export class DateQuery {
  @IsDateString({ strict: true })
  @ApiProperty({
    type: String,
    description: '날짜',
    example: '2022-12-11',
  })
  date!: string;
}
