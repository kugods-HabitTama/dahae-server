import { HabitRecordDay } from '@prisma/client';

export const HabitRecordDayConst: Record<HabitRecordDay, number> = {
  Mon: 1 << 0,
  Tue: 1 << 1,
  Wed: 1 << 2,
  Thu: 1 << 3,
  Fri: 1 << 4,
  Sat: 1 << 5,
  Sun: 1 << 6,
} as const;
