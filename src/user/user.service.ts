import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { TestPayload } from './payload/test.payload';
import { TestDto } from './dto/test.dto';
import { TestType } from './types/test.type';
import { UserInfoType } from './types/userInfo.type';
import { UserProfileDto } from './dto/user.profile.dto';
import { UpdatePasswordPayload } from './payload/update.password.payload';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async test(payload: TestPayload): Promise<TestDto> {
    // 필요한 경우 주입받은 userRepository를 사용하여 DB에 접근합니다.

    const data: TestType = {
      a: payload.a,
      b: payload.b ?? 'b',
      c: payload.c ?? 'c',
    };

    return TestDto.of(data);
  }

  async getUserInfoById(userId: string): Promise<UserInfoType> {
    const user = await this.userRepository.getUserById(userId);
    return {
      id: user.id,
      createdAt: user.createdAt,
      email: user.email,
      name: user.name,
      role: user.role,
      photo: user.photo,
      os: user.os,
      streak: user.streak,
      marketingAgreement: user.marketingAgreement,
    };
  }

  async getDefaultUser(): Promise<UserInfoType> {
    const user = await this.userRepository.getDefaultUser();
    return {
      id: user.id,
      createdAt: user.createdAt,
      email: user.email,
      name: user.name,
      role: user.role,
      photo: user.photo,
      os: user.os,
      streak: user.streak,
      marketingAgreement: user.marketingAgreement,
    };
  }

  async getUserProfile(userInfo: UserInfoType): Promise<UserProfileDto> {
    return UserProfileDto.of(userInfo);
  }

  async comparePasswordById(userId: string, compare: string): Promise<Boolean> {
    const user = await this.userRepository.getUserById(userId);
    return bcrypt.compare(compare, user.password);
  }

  async updateUserPassword(
    userInfo: UserInfoType,
    payload: UpdatePasswordPayload,
  ): Promise<void> {
    const { currentPassword, targetPassword } = payload;
    const passwordMatch = await this.comparePasswordById(
      userInfo.id,
      currentPassword,
    );
    if (!passwordMatch) throw new BadRequestException('Password mismatch');

    const hashedPassword = await bcrypt.hash(targetPassword, 10);

    await this.userRepository.updatePasswordById(userInfo.id, hashedPassword);
  }
}
