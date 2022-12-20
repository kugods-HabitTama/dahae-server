import { HabitRecordDay } from '@prisma/client';
import { HabitData } from './habit.data.type';

export type HabitWithRecordData = {
  id: number;
  progress: number;
  accomplished: boolean;
  day: HabitRecordDay;
  date: Date;
  habit: HabitData;
};
