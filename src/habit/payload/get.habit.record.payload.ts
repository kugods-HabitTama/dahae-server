import { IsDateString, IsDefined } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetHabitRecordPayload {
  @IsDefined()
  @IsDateString({ strict: true })
  @ApiProperty({
    type: String,
    description: '날짜',
    example: '2022-12-11',
  })
  date!: string;
}
