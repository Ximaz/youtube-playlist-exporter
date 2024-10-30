import { Test, TestingModule } from '@nestjs/testing';
import { OauthGoogleController } from './oauth-google.controller';

describe('OauthGoogleController', () => {
  let controller: OauthGoogleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OauthGoogleController],
    }).compile();

    controller = module.get<OauthGoogleController>(OauthGoogleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
