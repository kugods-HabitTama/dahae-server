import { Prisma } from '@prisma/client';

export type HabitWithRecordsT = Prisma.HabitGetPayload<{
  include: {
    habitRecords: true;
  };
}>;
