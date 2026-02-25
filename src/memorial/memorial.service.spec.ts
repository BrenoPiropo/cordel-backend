import { Test, TestingModule } from '@nestjs/testing';
import { MemorialService } from './memorial.service';

describe('MemorialService', () => {
  let service: MemorialService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MemorialService],
    }).compile();

    service = module.get<MemorialService>(MemorialService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
