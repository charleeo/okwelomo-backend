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
import { LoanType } from 'src/modules/config/entities/loan.type.entity';

@Injectable()
export class RepaymentService {
  private readonly DAILY: string;
  private readonly MONTHLY: string;
  private readonly WEEKLY: string;
  private readonly YEARLY: string;
  constructor(
    private readonly loanRepo: LoanRepository,
    private readonly loanRepaymentRepo: LoanRepaymentRepository,
    private readonly loanSettingService: LoanSettingService,
  ) {
    this.DAILY = 'daily';
    this.MONTHLY = 'monthly';
    this.WEEKLY = 'weekly';
    this.YEARLY = 'yearly';
  }

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
    let status = false;
    let statusCode: HttpStatus;
    let message = '';
    let responseData = null;
    try {
      const reference = dto.reference_number;
      const repayment_amount = dto.repayment_amount;
      const loan: Loan = await this.loanRepo.findOneBy({ reference });

      if (loan) {
        const loanType = await this.loanSettingService.getLoanTypeById(
          loan.loan_type,
        );

        const repaymentObject = await this.setRepaymentObject(
          loan,
          loanType,
          repayment_amount,
        );
        const payment = await this.loanRepaymentRepo.save({
          amount: repayment_amount,
          repayments_data: repaymentObject,
          reference,
        });

        if (payment) {
          await this.updateLoanEntity(loan, {
            repayment_sum: repaymentObject.amount,
          });

          statusCode = HttpStatus.CREATED;
          status = true;
          message = 'Loan repayment data saved';
        } else {
          message = 'Loan repayment data not saved';
        }
        responseData = payment;
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

  /**
   *
   * @param reference
   * @returns
   */
  public async getLoansByRefernce(reference): Promise<LoanRepayment[]> {
    const repayments = await this.loanRepaymentRepo
      .createQueryBuilder('repayment')
      .where('repayment.reference = :referenceNo', { referenceNo: reference })
      .getMany();
    return repayments;
  }

  /**
   *
   * @param loan
   * @param loanTYpe
   * @param amount
   * @returns
   */
  private async setRepaymentObject(loan: Loan, loanTYpe: LoanType, amount) {
    const repaymentDataCount = await this.getLoansByRefernce(loan.reference);
    let sum_of_payments = 0;
    if (repaymentDataCount) {
      repaymentDataCount.map((payment) => {
        sum_of_payments += payment.amount + amount;
      });
    }

    const repaymentObect = {
      amount,
      sum_of_payments,
      payment_date: new Date(),
    };

    if (loanTYpe.type === this.DAILY) {
      repaymentObect['type'] = this.DAILY;
    }
    if (loanTYpe.type === this.MONTHLY) {
      repaymentObect['type'] = this.MONTHLY;
    }

    if (loanTYpe.type === this.WEEKLY) {
      repaymentObect['type'] = this.WEEKLY;
    }
    if (loanTYpe.type === this.YEARLY) {
      repaymentObect['type'] = this.YEARLY;
    }
    return repaymentObect;
  }

  /**
   *
   * @param loan
   * @param object
   */
  private async updateLoanEntity(loan: Loan, object: Partial<Loan>) {
    await this.loanRepo
      .createQueryBuilder()
      .where('id = :loanId', { loanId: loan.id })
      .update(object);
  }
}
