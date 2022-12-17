import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';
import { HabitService } from './habit.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateHabitPayload } from './payload/create.habit.payload';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { GetHabitDto } from './dto/get.habit.dto';
import { CurrentUser } from 'src/auth/decorator/user.decorator';
import { UserInfoType } from 'src/user/types/userInfo.type';
import { ChangeProgressPayload } from './payload/change.progress.payload';
import { GetHabitRecordDto } from './dto/get.habit.record.dto';
import { GetHabitRecordPayload } from './payload/get.habit.record.payload';

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
  async getHabitList(
    @CurrentUser() user: UserInfoType,
  ): Promise<GetHabitDto[]> {
    const { id } = user;
    return this.habitService.getHabitList(id);
  }

  @ApiBearerAuth()
  @Get('/record')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'get habit records' })
  async getHabitRecords(
    @CurrentUser() user: UserInfoType,
    @Query() query: GetHabitRecordPayload,
  ): Promise<GetHabitRecordDto[]> {
    const { id } = user;
    return this.habitService.getHabitRecords(id, query);
  }

  @ApiBearerAuth()
  @Patch('/')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'change habit progress' })
  async changeProgress(
    @Body() changeProgressPayload: ChangeProgressPayload,
  ): Promise<void> {
    return this.habitService.changeProgress(changeProgressPayload);
  }
}
