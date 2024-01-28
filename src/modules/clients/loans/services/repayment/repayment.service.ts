import { HttpStatus, Injectable, Res, Body, Request } from '@nestjs/common';
import { Response } from 'express';
import { LoanRepository } from '../../repositories/loan.repository';
import { LoanSettingService } from '../loan.settings.service';
import { LoanRepaymentRepository } from '../../repositories/loan.repayment.repository';
import { LoanRepaymentDto } from '../../dto/loan.repayment.dto';
import { responseStructure } from 'src/common/helpers/response.structure';
import { Loan } from '../../entities/loan.entity';
import { LoanRepayment } from '../../entities/loan.repayments.entity';
import { LoanType } from 'src/modules/config/entities/loan.type.entity';
import { generateReference } from 'src/common/helpers/generals';
import { LoanRepaymentConfirmationDto } from '../../dto/repayment.confirmation.dto';
import { BaseDataSource } from 'src/common/helpers/base.data.ource';
import { DaysAndWeekAndMonths } from 'src/modules/entities/common.type';
import { ApplicationService } from '../application/application.service';

@Injectable()
export class RepaymentService extends BaseDataSource {
  private readonly CODE: string;
  constructor(
    private readonly loanRepo: LoanRepository,
    private readonly loanService: ApplicationService,
    private readonly loanRepaymentRepo: LoanRepaymentRepository,
    private readonly loanSettingService: LoanSettingService,
  ) {
    super(loanRepaymentRepo);
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

    const reference = dto.reference_number;
    const repayment_amount = dto.repayment_amount;
    
    const loan = await this.loan(reference);

    const loanType = await this.loanSettingService.getLoanTypeById(
      dto.loan.loan_type['id'],
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

    if (loanTYpe.type === DaysAndWeekAndMonths.DAILY) {
      repaymentObect['type'] = DaysAndWeekAndMonths.DAILY;
    }
    if (loanTYpe.type === DaysAndWeekAndMonths.MONTHLY) {
      repaymentObect['type'] = DaysAndWeekAndMonths.MONTHLY;
    }

    if (loanTYpe.type === DaysAndWeekAndMonths.WEEKLY) {
      repaymentObect['type'] = DaysAndWeekAndMonths.WEEKLY;
    }
    if (loanTYpe.type === DaysAndWeekAndMonths.YEARLY) {
      repaymentObect['type'] = DaysAndWeekAndMonths.YEARLY;
    }
    return repaymentObect;
  }

  /**
   *
   * @param loan
   * @param object
   */
  private async getData(loan, repayment) {
    let repayment_sum: number = loan.repayment_sum;

    repayment_sum =
      parseFloat(Number(repayment.amount).toFixed(2)) +
      parseFloat(Number(repayment_sum).toFixed(2));

    const repayment_percentage =
      Number((repayment_sum / loan.expected_repayment_amount) * 100).toFixed(
        2,
      ) + '%';
    return { repayment_sum, repayment_percentage };
  }

  public async confirmRepayment(
    @Body() dto: LoanRepaymentConfirmationDto,
    @Res() response: Response,
  ) {
    let status = false;
    let statusCode: HttpStatus;
    let message = '';
    const responseData = {};

    const repayment_reference = dto.reference_number;
    const confirmation_status = dto.confirmation_status;

    const repaymentData = await this.repayment(repayment_reference);

    const loan = await this.loan(repaymentData.reference);

    //check for the status selected if it true, then update the records
    if (confirmation_status) {
      const updatedRepaymentData = await this.updateEntity(
        repayment_reference,
        'repayment_reference',
        {
          confirmation_status,
        },
      );

      if (!repaymentData.confirmation_status) {
        const updatedLoan = await this.loanService.updateEntity(
          loan.id,
          'id',
          await this.getData(loan, repaymentData),
        );
        responseData['loan'] = updatedLoan;
      }
      statusCode = HttpStatus.CREATED;
      status = true;
      message = 'Loan repayment data updated';
      responseData['repayment'] = updatedRepaymentData;
    } else {
      message = 'Loan repayment data not updated';
    }

    return response
      .status(statusCode)
      .send(responseStructure(status, message, responseData, statusCode));
  }

  private async loan(reference): Promise<Loan> {
    return await this.loanRepo.findOneByOrFail({ reference });
  }
  private async repayment(repayment_reference): Promise<LoanRepayment> {
    return await this.loanRepaymentRepo.findOneByOrFail({
      repayment_reference,
    });
  }
}
