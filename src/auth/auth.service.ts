import { LoginDto } from './dto/login.dto';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from 'src/user/user.repository';
import { CreateUserDto } from './dto/create.user.dto';
import { LoginUserPayload } from './payload/login.user.payload';
import { CreateUserPayload } from './payload/create.user.payload';
import { generateAuthenticationCode } from 'src/utils/email';
import * as bcrypt from 'bcryptjs';
import * as nodeMailer from 'nodemailer';
import { UpdatePasswordPayload } from '../user/payload/update.password.payload';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginUserPayload: LoginUserPayload): Promise<LoginDto> {
    const user = await this.userRepository.getUserByEmail(
      loginUserPayload.email,
    );

    if (!user) throw new NotFoundException('Email does not exist');

    const passwordMatch = await bcrypt.compare(
      loginUserPayload.password,
      user.password,
    );

    if (!passwordMatch) throw new BadRequestException('Password mismatch');

    const refreshToken =
      user.refreshToken || (await this.generateRefreshToken(user.id));

    const accessToken = await this.generateAccessToken(user.id);

    return { accessToken, refreshToken };
  }

  async register(createUserPayload: CreateUserPayload): Promise<CreateUserDto> {
    const user = await this.userRepository.getUserByEmail(
      createUserPayload.email,
    );

    if (user) throw new BadRequestException('Email already exists');

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

  async authenticateEmail(email: string): Promise<string> {
    const transporter = nodeMailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS,
      },
    });

    const authenticationCode = generateAuthenticationCode();

    const mailOptions = {
      from: process.env.NODEMAILER_USER,
      to: email,
      subject: '[DAHAE] 이메일 인증번호',
      html: `
      DAHAE 이메일 인증번호입니다.<br/>

      <b>인증번호</b>: ${authenticationCode}
      
      `,
    };

    await transporter.sendMail(mailOptions);

    return authenticationCode;
  }

  protected async generateAccessToken(userId: string): Promise<string> {
    return this.jwtService.signAsync(
      { userId: userId },
      {
        expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRE,
      },
    );
  }

  protected async generateRefreshToken(userId: string): Promise<string> {
    const refreshToken = await this.jwtService.signAsync(
      { userId: userId },
      {
        expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRE,
      },
    );
    await this.userRepository.updateRefreshToken(userId, refreshToken);

    return refreshToken;
  }

  async comparePasswordById(userId: string, compare: string): Promise<boolean> {
    const user = await this.userRepository.getUserById(userId);
    return bcrypt.compare(compare, user.password);
  }

  async updateUserPassword(
    userId: string,
    payload: UpdatePasswordPayload,
  ): Promise<void> {
    const { currentPassword, targetPassword } = payload;
    const passwordMatch = await this.comparePasswordById(
      userId,
      currentPassword,
    );
    if (!passwordMatch) throw new ConflictException('Password mismatch');

    const hashedPassword = await bcrypt.hash(targetPassword, 10);

    await this.userRepository.updatePassword(userId, hashedPassword);
  }
}
