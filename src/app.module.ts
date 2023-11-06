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
import { BullModule } from '@nestjs/bull';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MailsModule } from './modules/mails/mails.module';

import { EventModule } from './modules/event/event.module';
import { AdminModule } from './modules/admin/admin.module';
import { AccountModule } from './modules/account/account.module';
import { ClientsModule } from './modules/clients/clients.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(datasourceOption),
    ScheduleModule.forRoot(),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    EventEmitterModule.forRoot(),
    UserModule,
    AuthModule,
    CommonConfig,
    MailsModule,
    EventModule,
    AdminModule,
    AccountModule,
    ClientsModule,
  ],
  controllers: [],
  providers: [MailsModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude('/auth/login', '/auth/signup', '/config')
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
