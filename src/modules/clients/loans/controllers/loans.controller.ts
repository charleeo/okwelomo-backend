import {
  Body,
  Controller,
  Post,
  Request as NestRequest,
  UseGuards,
  Res,
  Get,
  Query,
  Param,
  Delete,
} from '@nestjs/common';
import { Response } from 'express';
import { LoanApplicationDto } from '../dto/apply.for.loan.dto';
import { LoansService } from '../services/loans.service';
import { AuthGuard } from '@nestjs/passport';
import { ApproveLoanDto } from '../dto/verify.loan.dto';

@Controller('loans')
@UseGuards(AuthGuard('jwt'))
export class LoansController {
  constructor(private loanService: LoansService) {}

  @Post('apply')
  async create(
    @Body() loan: LoanApplicationDto,
    @Res() res: Response,
    @NestRequest() req: Request,
  ): Promise<any> {
    return await this.loanService.applayForLoan(loan, res, req);
  }
  @Post('approve')
  async approve(
    @Body() loan: ApproveLoanDto,
    @Res() res: Response,
  ): Promise<any> {
    return await this.loanService.approveLoan(loan, res);
  }
}
