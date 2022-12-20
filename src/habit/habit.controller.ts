import { DefaultUserInterceptor } from '../common/interceptor/default.user.interceptor';
import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Query,
  Put,
  Delete,
  Param,
  Patch,
  ParseIntPipe,
  UseInterceptors,
} from '@nestjs/common';
import { HabitService } from './habit.service';
import {
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
  ApiParam,
} from '@nestjs/swagger';
import { CreateHabitPayload } from './payload/create.habit.payload';
import { CurrentUser } from 'src/auth/decorator/user.decorator';
import { UserInfoType } from 'src/user/types/userInfo.type';
import { ChangeProgressPayload } from './payload/change.progress.payload';
import { GetHabitRecordPayload } from './payload/get.habit.record.payload';
import { GetHabitListDto } from './dto/get.habit.list.dto';
import { GetHabitRecordListDto } from './dto/get.habit.record.list.dto';
import { UpdateHabitPayload } from './payload/update.habit.payload';

@ApiTags('Habit API')
@Controller('habit')
export class HabitController {
  constructor(private readonly habitService: HabitService) {}

  @Post('/')
  @UseInterceptors(DefaultUserInterceptor)
  @ApiOperation({ summary: 'create habit' })
  async createHabit(
    @CurrentUser() user: UserInfoType,
    @Body() createHabitPayload: CreateHabitPayload,
  ): Promise<void> {
    return this.habitService.createHabit(user.id, createHabitPayload);
  }

  @Get('/')
  @UseInterceptors(DefaultUserInterceptor)
  @ApiOperation({ summary: 'get habit list' })
  @ApiCreatedResponse({
    type: GetHabitListDto,
  })
  async getHabitList(
    @CurrentUser() user: UserInfoType,
  ): Promise<GetHabitListDto> {
    const { id } = user;
    return this.habitService.getHabitList(id);
  }

  @Get('/record')
  @ApiOperation({ summary: 'get habit records' })
  @ApiCreatedResponse({
    type: GetHabitRecordListDto,
  })
  async getHabitRecords(
    @CurrentUser() user: UserInfoType,
    @Query() query: GetHabitRecordPayload,
  ): Promise<GetHabitRecordListDto> {
    const { id } = user;
    return this.habitService.getHabitRecords(id, query);
  }

  @Put('/')
  @ApiOperation({ summary: 'change habit progress' })
  async changeProgress(
    @Body() changeProgressPayload: ChangeProgressPayload,
  ): Promise<void> {
    return this.habitService.changeProgress(changeProgressPayload);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'delete habit' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'habit id',
    type: Number,
  })
  async deleteHabit(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.habitService.deleteHabit(id);
  }

  @Patch('/:id')
  @ApiOperation({ summary: 'update habit' })
  async updateHabit(
    @CurrentUser() user: UserInfoType,
    @Body() updateHabitPayload: UpdateHabitPayload,
    @Param('id', ParseIntPipe) habitId: number,
  ): Promise<void> {
    const userId = user.id;
    return this.habitService.updateHabit(userId, habitId, updateHabitPayload);
  }
}
