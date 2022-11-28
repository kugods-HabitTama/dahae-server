import { Controller, Body, Post, Res, Get, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login.user.dto';
import { TokenResponseDto } from './dto/token.response.dto';
import { CreateUserDto } from './dto/create.user.dto';
import { RegisterResponseDto } from './dto/register.response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) res,
  ): Promise<TokenResponseDto> {
    return this.authService.login(loginUserDto, res);
  }

  @Post('register')
  async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<RegisterResponseDto> {
    return this.authService.register(createUserDto);
  }

  @Get('email/duplicate/:email')
  async checkEmailExist(@Param('email') email): Promise<boolean> {
    return this.authService.checkEmailExist(email);
  }

  @Get('name/duplicate/:name')
  async checkNameExist(@Param('name') name): Promise<boolean> {
    return this.authService.checkNameExist(name);
  }
}
