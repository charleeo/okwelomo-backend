import {
  HttpStatus,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request } from 'express';
import { verifyToken } from 'src/common/helpers/jwt';
import { responseStructure } from 'src/common/helpers/response.structure';

@Injectable()
export class VerifyKycMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    let message = '';
    const authorization = req.get('authorization');
    const jwtPayload = authorization.replace('Bearer', '').trim();
    const verifiedToken = verifyToken(jwtPayload);
    const isAdmin = verifiedToken.payload.is_admin;
    if (!isAdmin) {
      message = 'You must be an admin to verify KYC';
      throw new UnauthorizedException(
        responseStructure(false, message, {}, HttpStatus.UNAUTHORIZED),
      );
    }
    next();
  }
}
