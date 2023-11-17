import { HttpStatus, Injectable, Res, Body, Request } from '@nestjs/common';

import { responseStructure } from 'src/common/helpers/response.structure';
import { logErrors } from 'src/common/helpers/logging';
import { Response } from 'express';

import {
  reference,
  setPaymentCommencementDateDaily,
  setPaymentCommencementDateMonthly,
  setPaymentCommencementDateWekly,
  setPaymentDueDateDaily,
  setPaymentDueDateForNonDaily,
} from 'src/common/helpers/generals';
import { ConfigHelperService } from 'src/modules/config/services/helpers.config';

import {
  ApprovalStatus,
  InterestPaymentStatus,
} from 'src/modules/entities/common.type';

import { LoanSettingService } from '../loan.settings.service';
import { LoanRepository } from '../../repositories/loan.repository';
import { LoanApplicationDto } from '../../dto/apply.for.loan.dto';
import { ApproveLoanDto } from '../../dto/verify.loan.dto';
import { Loan } from '../../entities/loan.entity';
import { LoanRepaymentDurationCategory } from 'src/modules/config/entities/loans.category.entity';
import { LoanType } from 'src/modules/config/entities/loan.type.entity';

@Injectable()
export class ApplicationService extends ConfigHelperService {
  private readonly DAILY: string;
  private readonly MONTHLY: string;
  private readonly WEEKLY: string;

  constructor(
    private readonly loanRepo: LoanRepository,
    private readonly loanSettingService: LoanSettingService,
  ) {
    super();
    this.DAILY = 'daily';
    this.MONTHLY = 'monthly';
    this.WEEKLY = 'weekly';
  }

  /**
   * Process the loan and save records to database
   * @param dto
   * @param response
   * @param req
   * @returns
   */
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
      const loanType = await this.loanSettingService.getLoanTypeById(
        dto.loan_type,
      );
      const repaymenDurationtPlan =
        await this.loanSettingService.getRepaymentDurationCategoriesById(
          dto.loan_durtion_category_id,
        );

      if (!loanType || !repaymenDurationtPlan) {
        statusCode = HttpStatus.BAD_REQUEST;
        message = ' Invalid data provided';
        return response
          .status(statusCode)
          .send(responseStructure(status, message, responseData, statusCode));
      }

      const {
        repayment_amount,
        interest,
        repayment_commencement_date,
        repayment_due_date,
        amount,
        start_date,
      } = await this.processLoans(dto, loanType, repaymenDurationtPlan);

      let repaymentAmount = Number(repayment_amount).toFixed(2);

      const repayment_counts = this.repaymentCount(
        loanType,
        repaymenDurationtPlan,
      );

      const interestPaymentCheck = this.checInterestUpfrontPayment(
        dto,
        amount,
        interest,
        repayment_counts,
        repaymentAmount,
      );
      const repaymentObject = interestPaymentCheck.object;
      repaymentAmount = interestPaymentCheck.amount;
      const loanRepaymentTotal = amount + interest;

      //Save the loan information to database and return the response
      responseData = await this.loanRepo.save({
        ...repaymentObject,
        customer_id: user.id,
        loan_type: dto.loan_type,
        amount: amount,
        interest: interest,
        repayment_rate: parseFloat(repaymentAmount),
        repayment_due_date: repayment_due_date,
        repayment_start_date: repayment_commencement_date,
        issue_date: start_date,
        repayment_intervals: repayment_counts,
        loan_duration_category: dto.loan_durtion_category_id,
        expected_repayment_amount: loanRepaymentTotal,
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
   *Set how much to be repaid monthly
   * @param amount
   * @param repaymentDuration
   */
  protected calculateMonthlyRepaymentPlan(
    amount: number,
    repaymentDuration = 12,
  ) {
    return amount / repaymentDuration;
  }

  /**
   *Set how much to be paid weekly
   * @param amount
   * @param repaymentDuration
   */
  protected calculateWeeklyRepaymentPlan(
    amount: number,
    repaymentDuration = 12,
  ) {
    const weeks = (repaymentDuration * 30) / 7; //days

    return Math.ceil(amount / weeks);
  }

  /**
   *
   * @param amount
   * @param repaymentDuration
   */
  protected calculateMonthlyRepaymentInterval(
    paymentPlan: number | any,
  ): number {
    return paymentPlan;
  }

  protected calculateInterest(amount, rate): number {
    return (rate / 100) * amount;
  }

  /**
   * Format the daily loans application process
   */
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

  protected getRepaymentDurationLoanPlan(
    category: LoanRepaymentDurationCategory,
  ): number {
    const paymentDurationPlan = category.category_tagline.split('_')[0];
    return parseInt(paymentDurationPlan);
  }

  /**
   * Format the montly loans application process
   */
  protected monthlyLoansFormating(dto, repaymentCat): any {
    const amount = dto.amount;

    const grantedDate = dto.grantedDate;

    const interest: number = this.calculateInterest(amount, 20);

    const repaymentDuration = this.getRepaymentDurationLoanPlan(repaymentCat);

    const repaymentCommencementDate: Date =
      setPaymentCommencementDateMonthly(grantedDate);

    const repaymentAmount: number = this.calculateMonthlyRepaymentPlan(
      amount,
      repaymentDuration,
    );

    const repaymentDueDate: Date = setPaymentDueDateForNonDaily(
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

  /**
   * Format the montly loans application process
   */
  protected weeklyLoansFormating(
    dto,
    repaymentCat: LoanRepaymentDurationCategory,
  ): any {
    const amount = dto.amount;

    const grantedDate = dto.grantedDate;

    const interest: number = this.calculateInterest(amount, 18);

    const repaymentDuration = this.getRepaymentDurationLoanPlan(repaymentCat);

    const repaymentCommencementDate: Date =
      setPaymentCommencementDateWekly(grantedDate);

    const repaymentAmount: number = this.calculateWeeklyRepaymentPlan(
      amount,
      repaymentDuration,
    );

    const repaymentDueDate: Date = setPaymentDueDateForNonDaily(
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

  /**
   * Start the loan application process and return any of the loan type
   * @params dto
   */
  protected async processLoans(
    dto,
    loanType: LoanType,
    loanDurationPlan: LoanRepaymentDurationCategory,
  ): Promise<any> {
    const type = loanType.type;
    if (type === this.DAILY) {
      return this.dailyLoansFormating(dto);
    } else if (type === this.WEEKLY) {
      return this.weeklyLoansFormating(dto, loanDurationPlan);
    }

    return this.monthlyLoansFormating(dto, loanDurationPlan);
  }

  /**
   * Calculate how many times the payment willbe made
   * @params category
   * @params dto
   */
  protected repaymentCount(loanType: LoanType, repaymentPlan): number {
    let repayment_counts = 0;
    let repaymenDurationtPlan =
      this.getRepaymentDurationLoanPlan(repaymentPlan);
    const type = loanType.type;
    if (type === this.DAILY) {
      repayment_counts = 22; //for daily loans
    } else if (type === this.WEEKLY) {
      repaymenDurationtPlan *= 30; //days
      repayment_counts = Math.floor(repaymenDurationtPlan / 7); //days in a week
    } else if (type === this.MONTHLY) {
      repayment_counts = repaymenDurationtPlan;
    }
    return repayment_counts;
  }

  /**
   * Get loan information for a user
   * @param user
   * @returns
   */
  public async getAloanForAUSer(user): Promise<Loan> {
    const loanData = await this.loanRepo
      .createQueryBuilder('loan')
      .where('loan.verification_status = :status', {
        status: ApprovalStatus.pending,
      })
      .andWhere('loan.customer_id = :customerID', { customerID: user.id })
      .getOne();
    return loanData;
  }

  /**
   * approve a new loan request and returns the details
   * @param dto
   * @param response
   * @returns
   */
  public async approveLoan(
    @Body() dto: ApproveLoanDto,
    @Res() response: Response,
  ): Promise<any> {
    let status = false;
    let statusCode: HttpStatus;
    let message = '';
    let responseData = null;

    try {
      const loan = await this.loanRepo
        .createQueryBuilder('loan')
        .where('loan.id = :loanId', { loanId: dto.loan_id })
        .update({ verification_status: dto.status })
        .returning('*')
        .updateEntity(true)
        .execute();
      const raw = await loan.raw;

      if (!raw.length) {
        message = 'Loan does not exists';
        statusCode = HttpStatus.NOT_FOUND;
      } else {
        message = `Loan is ${dto.status}`;
        status = true;
        statusCode = HttpStatus.CREATED;
        responseData = raw[0];
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
   * returns n object containing the interest upfront payment status
   * @param dto
   * @param loanAmount
   * @param interest
   * @param repayment_counts
   * @param repaymentAmount
   * @returns
   */
  private checInterestUpfrontPayment(
    dto: LoanApplicationDto,
    loanAmount,
    interest,
    repayment_counts,
    repaymentAmount,
  ) {
    let repaymentObject = {};

    if (dto.interest_payment_status == InterestPaymentStatus.not_paid_upfront) {
      let totalAmount = parseFloat(loanAmount);
      totalAmount += interest;
      totalAmount /= repayment_counts;
      repaymentAmount = Number(totalAmount).toFixed(2);

      repaymentObject = {
        interest_payment_status: dto.interest_payment_status,
      };
    }
    return { object: repaymentObject, amount: repaymentAmount };
  }
}
