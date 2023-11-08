import { HttpStatus, Injectable, Res, Body, Request } from '@nestjs/common';
import { LoanRepository } from '../repositories/loan.repository';
import { LoanApplicationDto } from '../dto/apply.for.loan.dto';
import { Users } from 'src/modules/user/entities/user.entity';
import { responseStructure } from 'src/common/helpers/response.structure';
import { logErrors } from 'src/common/helpers/logging';
import { Response } from 'express';
import { LoanSettingService } from './loan.settings.service';
import {
  reference,
  setPaymentCommencementDateDaily,
  setPaymentCommencementDateMonthly,
  setPaymentDueDateDaily,
  setPaymentDueDateMonthly,
} from 'src/common/helpers/generals';
import { ConfigHelperService } from 'src/modules/config/services/helpers.config';

@Injectable()
export class LoansService extends ConfigHelperService {
  private readonly DAILY: string;
  private readonly REPAYMENTDURATION: number;
  constructor(
    private readonly loanRepo: LoanRepository,
    private readonly loanSettingService: LoanSettingService,
  ) {
    super();
    this.DAILY = 'daily';
    this.REPAYMENTDURATION = 12;
  }

  async applayForLoan(
    @Body() dto: LoanApplicationDto,
    @Res() response: Response,
    @Request() req: Request,
  ): Promise<any> {
    let status = false;
    let statusCode: HttpStatus;
    let message = '';
    let responseData = null;
    const user = await this.getUser(req);

    try {
      const {
        repayment_amount,
        interest,
        repayment_commencement_date,
        repayment_due_date,
        amount,
        start_date,
      } = await this.processLoans(dto);

      responseData = await this.loanRepo.save({
        customer_id: user.id,
        type: dto.categoryId,
        amount: amount,
        interest: interest,
        repayment_rate: repayment_amount,
        repayment_due_date: repayment_due_date,
        repayment_start_date: repayment_commencement_date,
        issue_date: start_date,
        reference: reference(),
      });

      if (responseData) {
        message = 'Data creted';
        status = true;
        statusCode = HttpStatus.CREATED;
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
   * @param amount
   * Calculate daily loan repayment data
   */
  protected calCulateDailyRepaymentPlan(amount: number) {
    return amount / 22; //22 is the days for daily payments
  }

  /**
   *
   * @param amount
   * @param repaymentDuration
   */
  protected calculateMonthlyRepaymentPlan(
    amount: number,
    repaymentDuration = 12,
    paymentPlan: number | any,
  ) {
    const paymentIntervals = repaymentDuration / paymentPlan;
    return amount / paymentIntervals;
  }
  /**
   *
   * @param amount
   * @param repaymentDuration
   */
  protected calculateMonthlyRepaymentInterval(
    repaymentDuration = 12,
    paymentPlan: number | any,
  ): number {
    return repaymentDuration / paymentPlan;
  }

  protected calculateInterest(amount, rate): number {
    return (rate / 100) * amount;
  }

  protected dailyLoansFormating(dto): any {
    const amount = dto.amount;
    const grantedDate = dto.grantedDate;
    const repaymentCommencementDate: Date =
      setPaymentCommencementDateDaily(grantedDate);
    const repaymentAmount: number = this.calCulateDailyRepaymentPlan(amount);
    const repaymentDueDate: Date = setPaymentDueDateDaily(
      repaymentCommencementDate,
    );
    const interest = this.calculateInterest(amount, 15);
    return {
      interest: interest,
      repayment_amount: repaymentAmount,
      repayment_due_date: repaymentDueDate,
      repayment_commencement_date: repaymentCommencementDate,
      amount: amount,
      start_date: grantedDate,
    };
  }

  protected monthlyLoansFormating(dto, category): any {
    const amount = dto.amount;

    const grantedDate = dto.grantedDate;
    const repaymentDuration = dto.repaymentDuration ?? this.REPAYMENTDURATION;

    const interest: number = this.calculateInterest(amount, 20);
    const paymentPlan = category.category_tagline.split('_')[0];

    const plan = parseInt(paymentPlan);

    const repaymentCommencementDate: Date = setPaymentCommencementDateMonthly(
      grantedDate,
      plan,
    );

    const repaymentAmount: number = this.calculateMonthlyRepaymentPlan(
      amount,
      repaymentDuration,
      plan,
    );
    const repaymentDueDate: Date = setPaymentDueDateMonthly(
      grantedDate,
      repaymentDuration,
    );
    return {
      interest: interest,
      repayment_amount: repaymentAmount,
      repayment_due_date: repaymentDueDate,
      repayment_commencement_date: repaymentCommencementDate,
      amount: amount,
      start_date: grantedDate,
    };
  }

  protected async processLoans(dto) {
    const category = await this.loanSettingService.getCategoriesById(
      dto.categoryId,
    );
    if (category.category_tagline === this.DAILY) {
      return this.dailyLoansFormating(dto);
    }
    return this.monthlyLoansFormating(dto, category);
  }
}
