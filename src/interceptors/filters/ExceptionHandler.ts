import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { setExceptionFilters } from 'src/common/helpers/generals';
import { logErrors } from 'src/common/helpers/logging';
import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError';

@Catch()
export class ExceptionHandler implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: any, host: ArgumentsHost): void {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();
    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseBody = {
      statusCode: httpStatus,
      message: exception.message,
      status: false,
      data: null,
    };
    logErrors(exception);
    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
