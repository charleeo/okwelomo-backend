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
import { ApplyForLoanDTO } from '../dto/apply.for.loan.dto';
import { LoansService } from '../services/loans.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('loans')
@UseGuards(AuthGuard('jwt'))
export class LoansController {
  constructor(private loanService: LoansService) {}

  @Post('apply')
  async create(loan: ApplyForLoanDTO, @Res() res: Response): Promise<any> {
    return await this.loanService.applayForLoan(loan, res);
  }
}
