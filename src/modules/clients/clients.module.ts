import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { KycController } from './kyc/kyc.controller';
import { LoansController } from './loans/controllers/loans.controller';

import { KycService } from './kyc/kyc.service';
import { KYCRepository } from './kyc/repositories/kyc.repository';
import { Users } from '../user/entities/user.entity';
import { ValidateField } from './kyc/Validations/ValidateField';
import { KYCInputVaidtion } from 'src/middleware/kyc/kyc.input.validation.middleware';
import { ValidateKYCId } from './kyc/Validations/ValidateKYCId';

import { LoanRepository } from './loans/repositories/loan.repository';
import { LoanSettingRepository } from './loans/repositories/loan.setting.repository';
import { LoanSettingService } from './loans/services/loan.settings.service';
import { LoanSettingController } from './loans/controllers/loan-setting.controller';
import { IsAdminMiddleware } from 'src/middleware/is-admin/is-admin.middleware';
import { IsNotAdminMiddleware } from 'src/middleware/is-not-admin/is-not-admin.middleware';
import { LoanCategoryRepository } from '../config/repository/loan.category.repository';
import { PreventDupplicatesMiddleware } from 'src/middleware/loan/prevent-dupplicates/prevent-dupplicates.middleware';
import { MustVerifyKycMiddleware } from 'src/middleware/loan/must-verify-kyc/must-verify-kyc.middleware';
import { KycMustExistsMiddleware } from 'src/middleware/loan/kyc-must-exists/kyc-must-exists.middleware';
import { ConfigHelperService } from '../config/services/helpers.config';
import { ConfigMiddlewareHelperService } from '../config/services/helpers.middleware.config';

import { RepaymentService } from './loans/services/repayment/repayment.service';
import { ApplicationService } from './loans/services/application/application.service';

@Module({
  controllers: [KycController, LoansController, LoanSettingController],
  providers: [
    LoanSettingService,
    KycService,
    KYCRepository,
    Users,
    ValidateField,
    ValidateKYCId,
    LoanRepository,
    LoanSettingRepository,
    LoanCategoryRepository,
    ConfigHelperService,
    ConfigMiddlewareHelperService,
    RepaymentService,
    ApplicationService,
  ],
  imports: [],
  exports: [LoanSettingRepository],
})
export class ClientsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(IsNotAdminMiddleware, KYCInputVaidtion)
      .forRoutes({ path: '/kyc/create', method: RequestMethod.POST });

    consumer
      .apply(
        IsNotAdminMiddleware,
        KycMustExistsMiddleware,
        MustVerifyKycMiddleware,
      )
      .forRoutes(
        { path: 'loan-setting', method: RequestMethod.POST },
        { path: 'loans/apply', method: RequestMethod.POST },
      );

    consumer
      .apply(PreventDupplicatesMiddleware)
      .forRoutes({ path: 'loans/apply', method: RequestMethod.POST });

    consumer
      .apply(IsAdminMiddleware)
      .forRoutes(
        { path: '/kyc/update/status', method: RequestMethod.POST },
        { path: '/loans/approve', method: RequestMethod.POST },
      );
  }
}
