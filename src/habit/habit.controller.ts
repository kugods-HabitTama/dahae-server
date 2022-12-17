import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  Query,
  Put,
  Delete,
  Param,
  Patch,
} from '@nestjs/common';
import { HabitService } from './habit.service';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
  ApiParam,
} from '@nestjs/swagger';
import { CreateHabitPayload } from './payload/create.habit.payload';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
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

  @ApiBearerAuth()
  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'delete habit' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'habit id',
    type: Number,
  })
  async deleteHabit(@Param('id') id): Promise<void> {
    return this.habitService.deleteHabit(Number(id));
  }

  @ApiBearerAuth()
  @Patch('/')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'update habit' })
  async updateHabit(
    @CurrentUser() user: UserInfoType,
    @Body()
    updateHabitPayload: UpdateHabitPayload,
  ): Promise<void> {
    const { id } = user;
    return this.habitService.updateHabit(id, updateHabitPayload);
  }
}
