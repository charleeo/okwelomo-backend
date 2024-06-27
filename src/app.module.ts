import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { datasourceOption } from 'db/data-source';

import { ConfigModule } from '@nestjs/config';

import { ConfigModule as CommonConfig } from './modules/config/config.module';
import { AuthModule } from './modules/auth/auth.module';

import { AuthMiddleware } from './middleware/auth/auth.middleware';
import { ScheduleModule } from '@nestjs/schedule';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MailModule } from './modules/mails/mails.module';

import { EventModule } from './modules/event/event.module';
import { AdminModule } from './modules/admin/admin.module';
import { ClientsModule } from './modules/clients/clients.module';
import { excludedRoutes } from './routes/exclude.';
import { LoanConfigMustBeSetMiddleware } from './middleware/loan/loan-config-must-be-set/loan-config-must-be-set.middleware';
import { LoanSettingService } from './modules/clients/loans/services/loan.settings.service';
import { ConfigMiddlewareHelperService } from './modules/config/services/helpers.middleware.config';
import { ServeStaticModule } from '@nestjs/serve-static/dist/serve-static.module';
import { join } from 'path';
import { AccountRecoveryModule } from './modules/account-recovery/account-recovery.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(datasourceOption),
    ScheduleModule.forRoot(),
    
    EventEmitterModule.forRoot(),
    UserModule,
    AuthModule,
    CommonConfig,
    MailModule,
    EventModule,
    AdminModule,
    ClientsModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '../public'),
    }),
    AccountRecoveryModule,
  ],
  controllers: [],
  providers: [MailModule, LoanSettingService, ConfigMiddlewareHelperService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(...excludedRoutes)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
    consumer
      .apply(LoanConfigMustBeSetMiddleware)
      .forRoutes({ path: '/loans/apply', method: RequestMethod.POST });
  }
}
