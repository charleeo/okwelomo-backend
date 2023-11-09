import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class PreventDupplicatesMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    next();
  }
}
