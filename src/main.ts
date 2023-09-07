import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidateInputPipe } from './config/pipes/validation.pipe';
import { LoggerInterceptor } from './interceptors/logger/logger.interceptor';
import { useContainer } from 'class-validator';
import cookieParser from 'cookie-parser';
import * as compression from 'compression'
async function bootstrap() {
  const port = process.env.PORT || 4550
  const app = await NestFactory.create(AppModule)
  app.setGlobalPrefix("api/v1")
  app.useGlobalPipes(new ValidateInputPipe)
  app.useGlobalInterceptors(new LoggerInterceptor())
  app.use(cookieParser())
  app.enableCors()
  // app.use(compression())
  useContainer(app.select(AppModule), { fallbackOnErrors: true })
  await app.listen(port)
}
bootstrap()
