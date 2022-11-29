import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from 'src/user/user.repository';
import { TokenResponseT } from './type/token.response.type';
import { CreateUserDto } from './dto/create.user.dto';
import { LoginUserPayload } from './payload/login.user.payload';
import { CreateUserPayload } from './payload/create.user.payload';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginUserPayload: LoginUserPayload): Promise<TokenResponseT> {
    const user = await this.userRepository.getUserByEmail(
      loginUserPayload.email,
    );

    if (!user) throw new NotFoundException('Email does not exist');

    const passwordMatch = await bcrypt.compare(
      loginUserPayload.password,
      user.password,
    );

    if (!passwordMatch) throw new Error('Password mismatch');

    let refreshToken;

    if (!user.refreshToken) {
      refreshToken = await this.generateRefreshToken(user.id);
      await this.userRepository.updateRefreshToken(user.id, refreshToken);
    } else {
      refreshToken = user.refreshToken;
    }

    const accessToken = await this.generateAccessToken(user.id);

    return { accessToken, refreshToken };
  }

  async register(createUserPayload: CreateUserPayload): Promise<CreateUserDto> {
    const user = await this.userRepository.getUserByEmail(
      createUserPayload.email,
    );

    if (user) throw new Error('Email alreay exists');

    const hashedPassword = await bcrypt.hash(createUserPayload.password, 10);

    return await this.userRepository.create({
      email: createUserPayload.email,
      password: hashedPassword,
      name: createUserPayload.name,
      os: createUserPayload.os,
    });
  }

  async checkEmailExist(email: string): Promise<boolean> {
    const user = await this.userRepository.getUserByEmail(email);

    return !!user;
  }

  async checkNameExist(name: string): Promise<boolean> {
    const user = await this.userRepository.getUserByName(name);

    return !!user;
  }

  protected async generateAccessToken(userId: string): Promise<string> {
    return this.jwtService.signAsync(
      { user_id: userId },
      {
        expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRE,
      },
    );
  }

  protected async generateRefreshToken(userId: string): Promise<string> {
    return this.jwtService.signAsync(
      { user_id: userId },
      {
        expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRE,
      },
    );
  }
}
