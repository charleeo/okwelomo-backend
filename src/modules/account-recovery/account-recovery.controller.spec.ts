import { Test, TestingModule } from '@nestjs/testing';
import { AccountRecoveryController } from './account-recovery.controller';

describe('AccountRecoveryController', () => {
  let controller: AccountRecoveryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountRecoveryController],
    }).compile();

    controller = module.get<AccountRecoveryController>(AccountRecoveryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
