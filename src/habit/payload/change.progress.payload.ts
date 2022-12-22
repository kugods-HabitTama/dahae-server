import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDefined, IsInt, IsDate } from 'class-validator';

export class ChangeProgressPayload {
  @IsDefined()
  @IsInt()
  @ApiProperty({
    type: Number,
    description: '습관 id',
  })
  habitId!: number;

  @IsDefined()
  @IsDate()
  @Transform(({ value }) =>
    new Date(value).toJSON() ? new Date(value) : 'Invalid Date',
  )
  @ApiProperty({
    type: String,
    description: '날짜',
    example: '2022-12-15',
  })
  date!: Date;

  @IsDefined()
  @IsInt()
  @ApiProperty({
    type: Number,
    description: '진행도',
  })
  progress!: number;
}
