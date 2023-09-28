import {
  Injectable,
  NestMiddleware,
  BadRequestException,
  UnauthorizedException,
  HttpStatus,
} from '@nestjs/common';

import { Request, Response, NextFunction } from 'express';
import { responseStructure } from 'src/common/helpers/response.structure';
import { verifyToken } from 'src/common/helpers/jwt';

@Injectable()
export class KycMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    let error = false;
    let message = '';
    const kyc = req.body;
    if ('nin' in kyc === false && 'bvn' in kyc === false) {
      error = true;
      message = 'nin or bvn is required';
    } else if ('nin' in kyc === true && kyc.nin === '') {
      error = true;
      message = 'nin can not be empty when provided';
    } else if ('bvn' in kyc === true && kyc.bvn === '') {
      error = true;
      message = 'bvn can not be empty when provided';
    }

    if (error) {
      throw new BadRequestException(
        responseStructure(false, message, {}, HttpStatus.BAD_REQUEST),
      );
    }
    next();
  }
}
