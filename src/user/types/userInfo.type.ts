import { UserOS, UserRole } from '@prisma/client';

export type UserInfoType = {
  id: string;

  createdAt: Date;

  email: string;

  name: string;

  role: UserRole;

  photo: string;

  os: UserOS;

  streak: number;

  marketingAgreement: boolean;
};
