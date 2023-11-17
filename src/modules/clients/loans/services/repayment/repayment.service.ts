import { HttpStatus, Injectable, Res, Body, Request } from '@nestjs/common';
import { Response } from 'express';
import { LoanRepository } from '../../repositories/loan.repository';
import { LoanSettingService } from '../loan.settings.service';
import { LoanRepaymentRepository } from '../../repositories/loan.repayment.repository';
import { LoanRepaymentDto } from '../../dto/loan.repayment.dto';
import { responseStructure } from 'src/common/helpers/response.structure';
import { logErrors } from 'src/common/helpers/logging';
import { Loan } from '../../entities/loan.entity';
import { LoanRepayment } from '../../entities/loan.repayments.entity';

@Injectable()
export class RepaymentService {
  constructor(
    private readonly loanRepo: LoanRepository,
    private readonly loanRepaymentRepo: LoanRepaymentRepository,
    private readonly loanSettingService: LoanSettingService,
  ) {}

  /**
   * process loan repayment
   * @param dto
   * @param response
   * @returns
   */
  async processRepayment(
    @Body() dto: LoanRepaymentDto,
    @Res() response: Response,
  ) {
    const status = false;
    let statusCode: HttpStatus;
    let message = '';
    const responseData = null;
    try {
      const reference = dto.reference_number;
      const repayment_amount = dto.repayment_amount;
      const loan: Loan = await this.loanRepo.findOneBy({ reference });

      if (loan) {
        const category =
          await this.loanSettingService.getRepaymentDurationCategoriesById(
            loan.loan_type,
          );

        const loanRepaymentAmount = loan.repayment_rate;
        const repayment_intervals = loan.repayment_intervals;
        const amount = loan.amount;
        const repaymentFormat = {};
        const loanRepayment = await this.loanRepaymentRepo.findOneBy({
          reference,
        });
        // const data = loanRepayment.repayments_data;
        this.dailyLoanRepayment(loan, dto, loanRepayment);

        statusCode = HttpStatus.CREATED;
      } else {
        statusCode = HttpStatus.BAD_REQUEST;
        message = ' Invalid loan  reference provided';
      }
    } catch (e) {
      logErrors(e);
      message = 'there was an error. please try again';
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    }
    return response
      .status(statusCode)
      .send(responseStructure(status, message, responseData, statusCode));
  }

  private createRepayent(details: any, repayment?: LoanRepayment) {}

  private updateRepayent(repayment: LoanRepayment) {}

  private dailyLoanRepayment(
    loan: Loan,
    dto: LoanRepaymentDto,
    repayment?: LoanRepayment,
  ): any {
    const repayment_intervals = loan.repayment_intervals;
    const repayment_amount = loan.repayment_rate;
    const amount = dto.repayment_amount;
    const repaymentFormat = {};
    let totalRepaymentValues = Math.ceil(amount / repayment_amount);

    if (repayment) {
      const dailyPayment = repayment.repayments_data['daily'];
      const totalPaymentRecords = dailyPayment.length;
      totalRepaymentValues = +totalPaymentRecords;
    }

    for (let i = 1; i <= totalRepaymentValues; i++) {
      repaymentFormat[`day_${i}`] = amount;
      repaymentFormat[`date_${i}`] = new Date();
    }
    const repaymentObject = {
      daily: {
        ...repaymentFormat,
      },
    };
    console.log(repaymentObject);
  }
}
