import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';

import { LocalStrategy } from './local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { UserModule } from '../user/user.module';
import { AuthMiddleware } from 'src/middleware/auth/auth.middleware';
import { ConfigModule } from '../config/config.module';


@Module({
  imports: [
    PassportModule,
    UserModule,
    JwtModule.register({
        secret: process.env.JWTKEY,
        signOptions: { expiresIn: process.env.TOKEN_EXPIRATION },
    }),
    ConfigModule//for used in the auth service
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy
  ],
  controllers: [AuthController]
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
      consumer.apply(AuthMiddleware)
      .exclude("/auth/login","/auth/signup")
      .forRoutes(AuthController)
  }
}
