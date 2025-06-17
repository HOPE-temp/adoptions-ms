import { Test, TestingModule } from '@nestjs/testing';
import { FollowupsService } from './followups.service';

describe('FollowupsService', () => {
  let service: FollowupsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FollowupsService],
    }).compile();

    service = module.get<FollowupsService>(FollowupsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
