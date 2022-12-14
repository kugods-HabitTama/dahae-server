import { DateQuery } from './query/date.query';
import { DefaultUserInterceptor } from '../common/interceptor/default.user.interceptor';
import {
  Body,
  Controller,
  Get,
  Post,
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
import { UpdateHabitPayload } from './payload/update.habit.payload';
import { HabitListDto } from './dto/habit.dto';
import { HabitRecordListDto } from './dto/habit.record.dto';

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
    type: HabitListDto,
  })
  async getHabitList(@CurrentUser() user: UserInfoType): Promise<HabitListDto> {
    return this.habitService.getHabitList(user.id);
  }

  @Get('/record')
  @UseInterceptors(DefaultUserInterceptor)
  @ApiOperation({ summary: 'get habit records' })
  @ApiCreatedResponse({
    type: HabitRecordListDto,
  })
  async getHabitRecords(
    @CurrentUser() user: UserInfoType,
    @Query() query: DateQuery,
  ): Promise<HabitRecordListDto> {
    return this.habitService.getHabitRecords(user.id, query.date);
  }

  @Put('/')
  @ApiOperation({ summary: 'change habit progress' })
  async changeProgress(
    @Body() changeProgressPayload: ChangeProgressPayload,
  ): Promise<void> {
    return this.habitService.changeProgress(changeProgressPayload);
  }

  @Patch('/:id')
  @UseInterceptors(DefaultUserInterceptor)
  @ApiOperation({ summary: 'update habit' })
  async updateHabit(
    @CurrentUser() user: UserInfoType,
    @Body() updateHabitPayload: UpdateHabitPayload,
    @Param('id', ParseIntPipe) habitId: number,
  ): Promise<void> {
    const userId = user.id;
    return this.habitService.updateHabit(userId, habitId, updateHabitPayload);
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
}
