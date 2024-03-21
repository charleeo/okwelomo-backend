import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidateInputPipe } from './config/pipes/validation.pipe';
import { useContainer } from 'class-validator';
import cookieParser from 'cookie-parser';

import { ExceptionHandler } from './interceptors/filters/ExceptionHandler';
import { LoggerInterceptor } from './interceptors/logger/logger.interceptor';
async function bootstrap() {
  const port = process.env.PORT || 4550;
  const app = await NestFactory.create(AppModule);
  const httpAdapter = app.get(HttpAdapterHost);
  app.setGlobalPrefix('api/v1',{
    exclude: [
       'social/google',
    ],
  });
  app.useGlobalPipes(new ValidateInputPipe());
  app.useGlobalInterceptors(new LoggerInterceptor());
  app.useGlobalFilters(new ExceptionHandler(httpAdapter));
  app.use(cookieParser());
  app.enableCors({
    origin:['https://accounts.google.com/o/oauth2/v2/auth', 'http://localhost:4500']
  });
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  await app.listen(port);
}
bootstrap();
