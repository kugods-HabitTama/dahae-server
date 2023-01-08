import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { TestDto } from './dto/test.dto';
import { TestPayload } from './payload/test.payload';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { CurrentUser } from '../auth/decorator/user.decorator';
import { UserInfoType } from './types/userInfo.type';
import { UserProfileDto } from './dto/user.profile.dto';
import { UpdatePasswordPayload } from './payload/update.password.payload';
import { UpdateProfilePayload } from './payload/update.profile.payload';

@ApiTags('User API')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // jwt guard 예시입니다.
  @ApiBearerAuth()
  @Post('guard-test')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'jwt guard test 합니다.' })
  @ApiOkResponse({ type: TestDto })
  async test(
    @Body() payload: TestPayload,
    @CurrentUser() user: UserInfoType,
  ): Promise<TestDto> {
    console.log(user);
    return this.userService.test(payload);
  }

  @ApiBearerAuth()
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'get user profile ' })
  @ApiOkResponse({ type: UserProfileDto })
  async getProfile(@CurrentUser() user: UserInfoType): Promise<UserProfileDto> {
    return this.userService.getUserProfile(user);
  }

  @ApiBearerAuth()
  @Put('password')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'update user password' })
  async updatePassword(
    @Body() payload: UpdatePasswordPayload,
    @CurrentUser() user: UserInfoType,
  ): Promise<void> {
    return this.userService.updateUserPassword(user.id, payload);
  }

  @ApiBearerAuth()
  @Put('profile')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'update user profile' })
  async updateProfile(
    @Body() payload: UpdateProfilePayload,
    @CurrentUser() user: UserInfoType,
  ): Promise<void> {
    return this.userService.updateUserProfile(user.id, payload);
  }

  @ApiBearerAuth()
  @Delete()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'delete user' })
  async deleteUser(@CurrentUser() user: UserInfoType): Promise<void> {
    return this.userService.deleteUser(user.id);
  }
}
