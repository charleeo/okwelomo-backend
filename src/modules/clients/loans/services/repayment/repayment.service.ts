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
import { generateReference } from 'src/common/helpers/generals';
import { LoanRepaymentConfirmationDto } from '../../dto/repayment.confirmation.dto';

@Injectable()
export class RepaymentService {
  private readonly DAILY: string;
  private readonly MONTHLY: string;
  private readonly WEEKLY: string;
  private readonly YEARLY: string;
  private readonly CODE: string;
  constructor(
    private readonly loanRepo: LoanRepository,
    private readonly loanRepaymentRepo: LoanRepaymentRepository,
    private readonly loanSettingService: LoanSettingService,
  ) {
    this.DAILY = 'daily';
    this.MONTHLY = 'monthly';
    this.WEEKLY = 'weekly';
    this.YEARLY = 'yearly';
    this.CODE = 'RPM_CODE_';
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
      const loan = await this.loan(reference);
      if (loan) {
        const loanType = await this.loanSettingService.getLoanTypeById(
          loan.loan_type,
        );

        //repayment data
        const repaymentObject = await this.setRepaymentObject(
          loan,
          loanType,
          repayment_amount,
        );

        const payment = await this.loanRepaymentRepo.save({
          amount: repayment_amount,
          repayments_data: repaymentObject,
          reference,
          repayment_reference: generateReference(this.CODE),
        });

        if (payment) {
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
        const totalAmount = Number(payment.amount).toFixed(2);
        sum_of_payments = sum_of_payments + parseFloat(totalAmount);
      });
    }

    sum_of_payments = sum_of_payments + amount;
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
  private async updateLoanEntity(loan, repayment) {
    let repayment_sum: number = loan.repayment_sum;

    repayment_sum =
      parseFloat(Number(repayment.amount).toFixed(2)) +
      parseFloat(Number(repayment_sum).toFixed(2));

    const repayment_percentage =
      Number((repayment_sum / loan.expected_repayment_amount) * 100).toFixed(
        2,
      ) + '%';

    await this.loanRepo.update(
      { id: loan.id },
      { repayment_sum, repayment_percentage },
    );
  }

  public async confirmRepayment(
    @Body() dto: LoanRepaymentConfirmationDto,
    @Res() response: Response,
  ) {
    let status = false;
    let statusCode: HttpStatus;
    let message = '';
    let responseData = null;
    try {
      const repayment_reference = dto.reference_number;
      const confirmation_status = dto.confirmation_status;

      const repaymentData = await this.repayment(repayment_reference);

      if (repaymentData) {
        const loan = await this.loan(repaymentData.reference);

        //check for the status selected if it true, then update the records
        if (confirmation_status) {
          await this.loanRepaymentRepo.update(
            { repayment_reference },
            { confirmation_status },
          );

          //update the loan data if this is called for the reference the first time
          if (!repaymentData.confirmation_status) {
            this.updateLoanEntity(loan, repaymentData);
          }

          statusCode = HttpStatus.CREATED;
          status = true;
          message = 'Loan repayment data updated';
        } else {
          message = 'Loan repayment data not updated';
        }
        responseData = repaymentData;
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

  private async loan(reference): Promise<Loan> {
    return await this.loanRepo.findOneBy({ reference });
  }
  private async repayment(repayment_reference): Promise<LoanRepayment> {
    return await this.loanRepaymentRepo.findOneBy({ repayment_reference });
  }
}
