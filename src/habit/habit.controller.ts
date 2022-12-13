import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { HabitService } from './habit.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateHabitPayload } from './payload/create.habit.payload';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { GetHabitDto } from './dto/get.habit.dto';
import { CurrentUser } from 'src/auth/decorator/user.decorator';
import { UserInfoType } from 'src/user/types/userInfo.type';

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
}
