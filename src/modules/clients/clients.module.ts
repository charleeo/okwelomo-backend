import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { KycController } from './kyc/kyc.controller';
import { LoansController } from './loans/controllers/loans.controller';
import { LoansService } from './loans/services/loans.service';
import { KycService } from './kyc/kyc.service';
import { KYCRepository } from './kyc/repositories/kyc.repository';
import { Users } from '../user/entities/user.entity';
import { ValidateField } from './kyc/Validations/ValidateField';
import { KycMiddleware } from 'src/middleware/kyc/kyc.middleware';
import { ValidateKYCId } from './kyc/Validations/ValidateKYCId';
import { VerifyKycMiddleware } from 'src/middleware/kyc/verify-kyc/verify-kyc.middleware';
import { LoanRepository } from './loans/repositories/loan.repository';
import { LoanSettingRepository } from './loans/repositories/loan.setting.repository';
import { LoanSettingService } from './loans/services/loan.settings.service';
import { LoanSettingController } from './loans/controllers/loan-setting.controller';
import { IsAdminMiddleware } from 'src/middleware/is-admin/is-admin.middleware';
import { IsNotAdminMiddleware } from 'src/middleware/is-not-admin/is-not-admin.middleware';
import { LoanCategoryRepository } from '../config/repository/loan.category.repository';

@Module({
  controllers: [KycController, LoansController, LoanSettingController],
  providers: [
    LoansService,
    LoanSettingService,
    KycService,
    KYCRepository,
    Users,
    ValidateField,
    ValidateKYCId,
    LoanRepository,
    LoanSettingRepository,
    LoanCategoryRepository,
  ],
  imports: [],
  exports: [LoanSettingRepository],
})
export class ClientsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(KycMiddleware, IsNotAdminMiddleware)
      .forRoutes({ path: '/kyc/create', method: RequestMethod.POST });
    consumer
      .apply(IsNotAdminMiddleware)
      .forRoutes(
        { path: 'loan-setting', method: RequestMethod.POST },
        { path: 'loans/apply', method: RequestMethod.POST },
      );
    consumer
      .apply(IsAdminMiddleware)
      .forRoutes({ path: '/kyc/update/status', method: RequestMethod.POST });
  }
}
