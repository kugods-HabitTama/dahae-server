import { HabitRecordDay } from '@prisma/client';

export type UpdateHabitInput = {
  title?: string;
  action?: string;
  value?: number;
  unit?: string;
  time?: string | null;
  startDate?: Date;
  endDate?: Date | null;
  days?: HabitRecordDay[];
};

export interface A {
  a?: string | null;
  b: number;
}
