import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { TestPayload } from './payload/test.payload';
import { TestDto } from './dto/test.dto';
import { TestType } from './types/test.type';
import { UserInfoType } from './types/userInfo.type';

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
}
