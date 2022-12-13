import { ApiProperty } from '@nestjs/swagger';
import { GetHabitDto } from './get.habit.dto';

export class GetHabitRecordDto extends GetHabitDto {
  @ApiProperty({ type: Number, description: '습관 기록 Id' })
  recordId!: number;

  @ApiProperty({
    type: Number,
    description: '진행도',
  })
  progress: number;

  @ApiProperty({
    type: Boolean,
    description: '달성여부',
  })
  accomplished: boolean;
}
