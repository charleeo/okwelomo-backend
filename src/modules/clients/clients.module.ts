import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { KycController } from './kyc/kyc.controller';
import { LoansController } from './loans/loans.controller';
import { LoansService } from './loans/loans.service';
import { KycService } from './kyc/kyc.service';
import { KYCRepository } from './kyc/repositories/kyc.repository';
import { Users } from '../user/entities/user.entity';
import { ValidateField } from './kyc/Validations/ValidateField';
import { KycMiddleware } from 'src/middleware/kyc/kyc.middleware';
import { ValidateKYCId } from './kyc/Validations/ValidateKYCId';

@Module({
  controllers: [KycController, LoansController],
  providers: [
    LoansService,
    KycService,
    KYCRepository,
    Users,
    ValidateField,
    ValidateKYCId,
  ],
  imports: [],
})
export class ClientsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(KycMiddleware)
      .forRoutes({ path: '/kyc/create', method: RequestMethod.POST });
  }
}
