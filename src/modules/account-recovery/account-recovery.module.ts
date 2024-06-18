import { Module } from '@nestjs/common';
import { AccountRecoveryController } from './account-recovery.controller';
import { AccountRecoveryService } from './services/account.recovery.service';
import { UserModule } from '../user/user.module';
import { ForgotPasswordRepository } from './repository/forgot.password.repository';
import { UserRepository } from '../user/user.repository';

@Module({
  controllers: [AccountRecoveryController],
  providers:[AccountRecoveryService, ForgotPasswordRepository, UserRepository],
  imports:[UserModule]
})
export class AccountRecoveryModule {}
