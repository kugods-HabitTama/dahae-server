import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import { User } from '@prisma/client';
import { CreateUserDto } from '../auth/dto/create.user.dto';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, password, name, os } = createUserDto;

    return await this.prisma.user.create({
      data: {
        email,
        password,
        name,
        os,
        marketingAgreement: false,
      },
    });
  }

  async getUserByEmail(email: string): Promise<User> {
    return await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async getUserByName(name: string): Promise<User> {
    return await this.prisma.user.findFirst({
      where: {
        name,
      },
    });
  }
}
