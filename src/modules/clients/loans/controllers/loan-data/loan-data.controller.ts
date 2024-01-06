import { Response } from 'express';

import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { LoanRepaymentDto } from '../../dto/loan.repayment.dto';
import { LoanRepaymentConfirmationDto } from '../../dto/repayment.confirmation.dto';
import { LoanDataService } from '../../services/loan-data/loan-data.service';

@Controller('repayment')
@UseGuards(AuthGuard('jwt'))
export class LoanDataController {
  constructor(private loanDataService: LoanDataService) {}

  @Post('repay')
  async create(
    @Body() loan: LoanRepaymentDto,
    @Res() res: Response,
  ): Promise<any> {
    return await this.loanDataService.processRepayment(loan, res);
  }

  @Post('confirm')
  async confirmRepayment(
    @Body() loan: LoanRepaymentConfirmationDto,
    @Res() res: Response,
  ): Promise<any> {
    return await this.loanDataService.confirmRepayment(loan, res);
  }
}
