import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { ConfigService } from './services/config.service';
import { ConfigController } from './config.controller';
import { ActionRepository } from './repository/actions.repository';
import { RoleRepository } from './repository/roles.repository';
import { DutyRepository } from './repository/duties.repository';
import { UserRoleRepository } from './repository/user_roles.repository';
import { AuthMiddleware } from 'src/middleware/auth/auth.middleware';
import { LocationRepository } from './repository/locations.repository';

import { UserRepository } from '../user/user.repository';
import { LoanCategoryRepository } from './repository/loan.category.repository';

@Module({
  providers: [
    ConfigService,
    ActionRepository,
    RoleRepository,
    DutyRepository,
    UserRoleRepository,
    LocationRepository,
    UserRepository,
    LoanCategoryRepository,
  ],
  controllers: [ConfigController],
  exports: [
    ConfigService,
    RoleRepository,
    ActionRepository,
    DutyRepository,
    UserRoleRepository,
    LocationRepository,
    LoanCategoryRepository,
  ],
})
export class ConfigModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)

      .forRoutes
      // ConfigController
      ();
  }
}
