import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsDateString } from 'class-validator';

export class ChangeProgressPayload {
  @IsDefined()
  @ApiProperty({
    type: Number,
    description: '습관 id',
  })
  habitId!: number;

  @IsDefined()
  @IsDateString({ strict: true })
  @ApiProperty({
    type: String,
    description: '날짜',
    example: '2022-12-15',
  })
  date!: string;

  @IsDefined()
  @ApiProperty({
    type: Number,
    description: '진행도',
  })
  progress!: number;
}
