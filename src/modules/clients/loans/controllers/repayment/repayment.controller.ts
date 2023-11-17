import {
  Body,
  Controller,
  Post,
  Res,
  UseGuards,
  Request as NestRequest,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { RepaymentService } from '../../services/repayment/repayment.service';
import { LoanRepaymentDto } from '../../dto/loan.repayment.dto';

@Controller('repayment')
@UseGuards(AuthGuard('jwt'))
export class RepaymentController {
  constructor(private repaymentService: RepaymentService) {}

  @Post('repay')
  async create(
    @Body() loan: LoanRepaymentDto,
    @Res() res: Response,
    @NestRequest() req: Request,
  ): Promise<any> {
    return await this.repaymentService.processRepayment(loan, res);
  }
}
