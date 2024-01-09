import { Response } from 'express';

import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { LoanDataService } from '../../services/loan-data/loan-data.service';

@Controller('loan-data')
@UseGuards(AuthGuard('jwt'))
export class LoanDataController {
  constructor(private loanDataService: LoanDataService) {}

  @Get('user/loans')
  async getAloanForAUSer(@Req() user: any, @Res() res: Response): Promise<any> {
    return await this.loanDataService.userLoans(user.user, res);
  }
}
