import { Module,NestModule,MiddlewareConsumer,RequestMethod} from '@nestjs/common';
import { ConfigService } from './config.service';
import { ConfigController } from './config.controller';
import { ActionRepository } from './repository/actions.repository';
import { RoleRepository } from './repository/roles.repository';
import { DutyRepository } from './repository/duties.repository';
import { UserRoleRepository } from './repository/user_roles.repository';
import { AuthMiddleware } from 'src/middleware/auth/auth.middleware';
import { LocationRepository } from './repository/locations.repository';
import { WarehouseCategoryRepository } from './repository/warehouse.category.repository';
import { MeasurementRepository } from './repository/measurement.repository';


@Module({
  providers: [ConfigService,ActionRepository,RoleRepository,DutyRepository,UserRoleRepository,LocationRepository,WarehouseCategoryRepository,MeasurementRepository],
  controllers: [ConfigController],
  exports:[ConfigService,RoleRepository,ActionRepository,DutyRepository,UserRoleRepository,LocationRepository]
})
export class ConfigModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware)

    .forRoutes(
      // ConfigController
    )
}
}
