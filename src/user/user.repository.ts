import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import { User } from '@prisma/client';
import { CreateUserPayload } from 'src/auth/payload/create.user.payload';
import { UpdateUserInputType } from './types/update.user.input.type';

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

  async updatePassword(id: string, password: string): Promise<User> {
    return this.prisma.user.update({
      where: {
        id,
      },
      data: {
        password,
      },
    });
  }

  async updateProfile(
    id: string,
    updateInput: UpdateUserInputType,
  ): Promise<User> {
    const { name, photo } = updateInput;
    return this.prisma.user.update({
      where: {
        id,
      },
      data: {
        name,
        photo,
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

  async deleteUser(id: string): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        email: id,
        password: '',
        name: '',
        photo: '',
        refreshToken: '',
      },
    });
  }
}
