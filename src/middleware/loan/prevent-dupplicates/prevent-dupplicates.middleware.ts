import {
  Injectable,
  NestMiddleware,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { responseStructure } from 'src/common/helpers/response.structure';

import { LoanDataService } from 'src/modules/clients/loans/services/loan-data/loan-data.service';

import { ConfigMiddlewareHelperService } from 'src/modules/config/services/helpers.middleware.config';
import { ApprovalStatus } from 'src/modules/entities/common.type';

@Injectable()
export class PreventDupplicatesMiddleware implements NestMiddleware {
  constructor(
    private readonly loanService: LoanDataService,
    private readonly configService: ConfigMiddlewareHelperService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const user = await this.configService.getUser(req);
    const pendingLoan = await this.loanService.getAloanForAUSer(
      user,
      ApprovalStatus.pending,
    );

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
