import { HttpStatus, Injectable, Res, Query, Param } from '@nestjs/common';
import { LoanRepository } from '../repositories/loan.repository';
import { ApplyForLoanDTO } from '../dto/apply.for.loan.dto';
import { Users } from 'src/modules/user/entities/user.entity';
import { responseStructure } from 'src/common/helpers/response.structure';
import { logErrors } from 'src/common/helpers/logging';
import { Response } from 'express';

@Injectable()
export class LoansService {
  constructor(private loanRepo: LoanRepository) {}

  async applayForLoan(
    loan: ApplyForLoanDTO,
    @Res() response: Response,
  ): Promise<any> {
    const status = false;
    let statusCode: HttpStatus;
    let message = '';
    let responseData = null;

    try {
      statusCode = HttpStatus.OK;
      responseData = { amount: 3000, name: 'Adeola' };
    } catch (e) {
      logErrors(e);
      message = 'there was an error. please try again';
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    }
    return response
      .status(statusCode)
      .send(responseStructure(status, message, responseData, statusCode));
  }
}
