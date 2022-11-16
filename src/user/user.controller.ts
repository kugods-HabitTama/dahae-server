import { Body, Controller, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { TestDto } from './dto/test.dto';
import { TestPayload } from './payload/test.payload';

@ApiTags('User API')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  //예시입니다.
  @Post('test')
  @ApiOperation({ summary: 'test합니다.' })
  @ApiOkResponse({ type: TestDto })
  async test(@Body() payload: TestPayload): Promise<TestDto> {
    return this.userService.test(payload);
  }
}
