import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from 'src/user/user.repository';
import { TokenResponseDto } from './dto/token.response.dto';
import { LoginUserDto } from './dto/login.user.dto';
import { CreateUserDto } from 'src/auth/dto/create.user.dto';
import { User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginUserDto: LoginUserDto, res): Promise<TokenResponseDto> {
    const user = await this.userRepository.getUserByEmail(loginUserDto.email);

    if (!user) throw new Error('Email does not exist');

    const passwordMatch = await bcrypt.compare(
      loginUserDto.password,
      user.password,
    );

    if (!passwordMatch) throw new Error('Password mismatch');

    if (!user.refreshToken) {
      const refreshToken = await this.generateRefreshToken(user.id);
      await this.userRepository.updateRefreshToken(user.id, refreshToken);
    }

    const accessToken = await this.generateAccessToken(user.id);

    return { accessToken };
  }

  async register(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.userRepository.getUserByEmail(createUserDto.email);

    if (user) throw new Error('Email alreay exists');

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    return await this.userRepository.create({
      email: createUserDto.email,
      password: hashedPassword,
      name: createUserDto.name,
      os: createUserDto.os,
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
