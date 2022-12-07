import { Test, TestingModule } from '@nestjs/testing';
import { HabitController } from './habit.controller';

describe('HabitController', () => {
  let controller: HabitController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HabitController],
    }).compile();

    controller = module.get<HabitController>(HabitController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
