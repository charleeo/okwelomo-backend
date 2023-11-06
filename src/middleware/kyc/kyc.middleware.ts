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
    const authorization = req.get('authorization');
    const jwtPayload = authorization.replace('Bearer', '').trim();
    const verifiedToken = verifyToken(jwtPayload).payload;
    const isAdmin = verifiedToken.is_admin;
    let statusCode = HttpStatus.BAD_REQUEST;
    const url = req.url;

    if (url === '/api/v1/kyc/create') {
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
    }

    if (isAdmin) {
      error = true;
      message = 'You are not authorized to perform this action';
      statusCode = HttpStatus.UNAUTHORIZED;
    }

    if (error) {
      throw new BadRequestException(
        responseStructure(false, message, {}, HttpStatus.BAD_REQUEST),
      );
    }
    next();
  }
}
