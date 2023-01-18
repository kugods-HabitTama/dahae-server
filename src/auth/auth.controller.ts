import { AuthNameQuery } from './query/auth-name.query';
import { AuthEmailQuery } from './query/auth-email.query';
import { LoginDto } from './dto/login.dto';
import {
  Controller,
  Body,
  Post,
  Get,
  Put,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserPayload } from './payload/create.user.payload';
import { LoginUserPayload } from './payload/login.user.payload';
import { CreateUserDto } from './dto/create.user.dto';
import { AuthenticateEmailPayload } from './payload/authenticate.email.payload';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { UpdatePasswordPayload } from '../user/payload/update.password.payload';
import { CurrentUser } from './decorator/user.decorator';
import { UserInfoType } from '../user/types/userInfo.type';

@ApiTags('Auth API')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'user login' })
  async login(@Body() loginUserPayload: LoginUserPayload): Promise<LoginDto> {
    return this.authService.login(loginUserPayload);
  }

  @Post('register')
  @ApiOperation({ summary: 'user register' })
  @ApiOkResponse({ type: CreateUserDto })
  async register(
    @Body() createUserPayload: CreateUserPayload,
  ): Promise<CreateUserDto> {
    return this.authService.register(createUserPayload);
  }

  @Post('refresh')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '토큰이 만료된 경우 refresh합니다.' })
  @ApiOkResponse({ type: LoginDto })
  async refresh(@CurrentUser() user: UserInfoType): Promise<LoginDto> {
    return this.authService.refresh(user.id);
  }

  @Get('email/duplicate')
  @ApiOperation({ summary: 'check whether an email exists' })
  @ApiOkResponse({ type: Boolean, description: 'true: 중복, false: 중복아님' })
  async checkEmailExist(@Query() query: AuthEmailQuery): Promise<boolean> {
    return this.authService.checkEmailExist(query.email);
  }

  @Get('name/duplicate')
  @ApiOperation({ summary: 'check whether a name exists' })
  @ApiOkResponse({ type: Boolean, description: 'true: 중복, false: 중복아님' })
  async checkNameExist(@Query() query: AuthNameQuery): Promise<boolean> {
    return this.authService.checkNameExist(query.name);
  }

  @Post('/authenticate-email')
  @ApiOperation({ summary: 'send authentication email' })
  @ApiOkResponse({ type: String, description: '6자리 정수 인증번호' })
  async authenticateEmail(
    @Body() authenticateEmailPayload: AuthenticateEmailPayload,
  ): Promise<string> {
    return this.authService.authenticateEmail(authenticateEmailPayload.email);
  }

  @ApiBearerAuth()
  @Put('password')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'update user password' })
  async updatePassword(
    @Body() payload: UpdatePasswordPayload,
    @CurrentUser() user: UserInfoType,
  ): Promise<void> {
    return this.authService.updateUserPassword(user.id, payload);
  }
}
