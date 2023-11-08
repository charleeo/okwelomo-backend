import {
  Injectable,
  NestMiddleware,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { verifyToken } from 'src/common/helpers/jwt';
import { responseStructure } from 'src/common/helpers/response.structure';

@Injectable()
export class IsNotAdminMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const error = false;
    let message = '';
    const kyc = req.body;
    const authorization = req.get('authorization');
    const jwtPayload = authorization.replace('Bearer', '').trim();
    const verifiedToken = verifyToken(jwtPayload).payload;
    const isAdmin = verifiedToken.is_admin;
    let statusCode = HttpStatus.BAD_REQUEST;
    const url = req.url;
    if (isAdmin) {
      message = 'You are not authorized to perform this action';
      statusCode = HttpStatus.UNAUTHORIZED;
      throw new UnauthorizedException(
        responseStructure(false, message, {}, HttpStatus.BAD_REQUEST),
      );
    }
    next();
  }
}
