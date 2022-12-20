import { HabitRecordDay } from '@prisma/client';

export type HabitData = {
  id: number;
  title: string;
  action: string;
  value: number;
  unit: string;
  time: Date | null;
  startDate: Date;
  endDate: Date | null;
  days: HabitRecordDay[];
  isActive: boolean;
};
