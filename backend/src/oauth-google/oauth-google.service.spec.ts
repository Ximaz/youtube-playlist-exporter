import { Test, TestingModule } from '@nestjs/testing';
import { OauthGoogleService } from './oauth-google.service';

describe('OauthGoogleService', () => {
  let service: OauthGoogleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OauthGoogleService],
    }).compile();

    service = module.get<OauthGoogleService>(OauthGoogleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
