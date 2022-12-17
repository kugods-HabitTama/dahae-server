import { ApiProperty } from '@nestjs/swagger';
import { GetHabitRecordDto } from './get.habit.record.dto';

export class GetHabitRecordListDto {
  @ApiProperty({ isArray: true, type: GetHabitRecordDto })
  habitRecords: GetHabitRecordDto[];
}
