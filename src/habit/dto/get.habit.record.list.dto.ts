import { ApiProperty } from '@nestjs/swagger';
import { GetHabitRecordDto } from './get.habit.record.dto';

export class GetHabitRecordListDto {
  @ApiProperty({ type: [GetHabitRecordDto] })
  habitRecords: GetHabitRecordDto[];
}
