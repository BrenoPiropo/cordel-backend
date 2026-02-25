import { Test, TestingModule } from '@nestjs/testing';
import { MemorialController } from './memorial.controller';
import { MemorialService } from './memorial.service';

describe('MemorialController', () => {
  let controller: MemorialController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MemorialController],
      providers: [MemorialService],
    }).compile();

    controller = module.get<MemorialController>(MemorialController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
