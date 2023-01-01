import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import { User } from '@prisma/client';
import { CreateUserPayload } from 'src/auth/payload/create.user.payload';
@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserPayload: CreateUserPayload): Promise<User> {
    const { email, password, name, os } = createUserPayload;

    return this.prisma.user.create({
      data: {
        email,
        password,
        name,
        os,
        marketingAgreement: false,
      },
    });
  }

  async updateRefreshToken(id: string, refreshToken: string): Promise<User> {
    const update = await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        refreshToken,
      },
    });

    return update;
  }

  async updatePasswordById(id: string, password: string): Promise<User> {
    return this.prisma.user.update({
      where: {
        id,
      },
      data: {
        password,
      },
    });
  }

  async getUserByEmail(email: string): Promise<User> {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async getUserByName(name: string): Promise<User> {
    return this.prisma.user.findFirst({
      where: {
        name,
      },
    });
  }

  async getUserById(id: string): Promise<User> {
    return this.prisma.user.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });
  }

  async getDefaultUser(): Promise<User> {
    return this.prisma.user.findFirst({});
  }
}
