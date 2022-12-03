import { Controller, Body, Post, Res, Get, Param } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserPayload } from './payload/create.user.payload';
import { LoginUserPayload } from './payload/login.user.payload';
import { CreateUserDto } from './dto/create.user.dto';
import { boolean } from 'joi';

@ApiTags('Auth API')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'user login' })
  async login(
    @Body() loginUserPayload: LoginUserPayload,
    @Res({ passthrough: true }) res,
  ): Promise<void> {
    const { accessToken, refreshToken } = await this.authService.login(
      loginUserPayload,
    );

    res.cookie('refresh_token', refreshToken, {
      path: '/auth',
      httpOnly: true,
    });

    res.cookie('access_token', accessToken, {
      path: '/auth',
      httpOnly: true,
    });
  }

  @Post('register')
  @ApiOperation({ summary: 'user register' })
  @ApiOkResponse({ type: CreateUserDto })
  async register(
    @Body() createUserPayload: CreateUserPayload,
  ): Promise<CreateUserDto> {
    return this.authService.register(createUserPayload);
  }

  @Get('email/duplicate/:email')
  @ApiOperation({ summary: 'check whether an email exists' })
  @ApiOkResponse({ type: Boolean })
  @ApiParam({
    name: 'email',
    required: true,
    description: 'email',
    type: String,
  })
  async checkEmailExist(@Param('email') email): Promise<boolean> {
    return this.authService.checkEmailExist(email);
  }

  @Get('name/duplicate/:name')
  @ApiOperation({ summary: 'check whether a name exists' })
  @ApiOkResponse({ type: Boolean })
  @ApiParam({
    name: 'name',
    required: true,
    description: 'name',
    type: String,
  })
  async checkNameExist(@Param('name') name): Promise<boolean> {
    return this.authService.checkNameExist(name);
  }
}
