import { LoginDto } from './dto/login.dto';
import {
  Controller,
  Body,
  Post,
  Res,
  Get,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
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

  @Post('/authenticate-email')
  @ApiOperation({ summary: 'send authentication email' })
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
