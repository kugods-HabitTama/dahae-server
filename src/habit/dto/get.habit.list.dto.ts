import { ApiProperty } from '@nestjs/swagger';
import { GetHabitDto } from './get.habit.dto';

export class GetHabitListDto {
  @ApiProperty({ type: [GetHabitDto] })
  habits: GetHabitDto[];
}
