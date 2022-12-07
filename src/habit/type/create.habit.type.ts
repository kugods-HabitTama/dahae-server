export type CreateHabitType = {
  userId: string;
  title: string;
  action: string;
  value: number;
  unit: string;
  time?: Date;
  startDate: Date;
  endDate?: Date;
  days: number;
};
