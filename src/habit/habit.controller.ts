import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  Query,
  Put,
} from '@nestjs/common';
import { HabitService } from './habit.service';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateHabitPayload } from './payload/create.habit.payload';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorator/user.decorator';
import { UserInfoType } from 'src/user/types/userInfo.type';
import { ChangeProgressPayload } from './payload/change.progress.payload';
import { GetHabitRecordPayload } from './payload/get.habit.record.payload';
import { GetHabitListDto } from './dto/get.habit.list.dto';
import { GetHabitRecordListDto } from './dto/get.habit.record.list.dto';

@ApiTags('Habit API')
@Controller('habit')
export class HabitController {
  constructor(private readonly habitService: HabitService) {}

  @ApiBearerAuth()
  @Post('/')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'create habit' })
  async createHabit(
    @Req() req,
    @Body()
    createHabitPayload: CreateHabitPayload,
  ): Promise<void> {
    const { id } = req.user;
    return this.habitService.createHabit(id, createHabitPayload);
  }

  @ApiBearerAuth()
  @Get('/')
  @UseGuards(JwtAuthGuard)
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

  @ApiBearerAuth()
  @Get('/record')
  @UseGuards(JwtAuthGuard)
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

  @ApiBearerAuth()
  @Put('/')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'change habit progress' })
  async changeProgress(
    @Body() changeProgressPayload: ChangeProgressPayload,
  ): Promise<void> {
    return this.habitService.changeProgress(changeProgressPayload);
  }
}
