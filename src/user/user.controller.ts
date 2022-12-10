import { Body, Controller, Post, UseGuards } from '@nestjs/common';
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
}
