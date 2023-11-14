import {
  Injectable,
  NestMiddleware,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { responseStructure } from 'src/common/helpers/response.structure';
import { ApplicationService } from 'src/modules/clients/loans/services/application/application.service';

import { ConfigMiddlewareHelperService } from 'src/modules/config/services/helpers.middleware.config';

@Injectable()
export class PreventDupplicatesMiddleware implements NestMiddleware {
  constructor(
    private readonly loanService: ApplicationService,
    private readonly configService: ConfigMiddlewareHelperService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const user = await this.configService.getUser(req);
    const pendingLoan = await this.loanService.getAloanForAUSer(user);

    if (pendingLoan) {
      const message =
        'You have un approved loan pendign. Please contact your laon officer to approve it before applying for a new loan';
      throw new UnauthorizedException(
        responseStructure(false, message, {}, HttpStatus.UNAUTHORIZED),
      );
    }
    next();
  }
}
