import {
  HttpStatus,
  Injectable,
  Res,
  Body,
  Query,
  Param,
} from '@nestjs/common';
import { LoanRepository } from '../repositories/loan.repository';
import { LoanApplicationDto } from '../dto/apply.for.loan.dto';
import { Users } from 'src/modules/user/entities/user.entity';
import { responseStructure } from 'src/common/helpers/response.structure';
import { logErrors } from 'src/common/helpers/logging';
import { Response } from 'express';
import { LoanSettingService } from './loan.settings.service';
import {
  setPaymentCommencementDateDaily,
  setPaymentCommencementDateMonthly,
} from 'src/common/helpers/generals';

@Injectable()
export class LoansService {
  private readonly DAILY: string;
  private readonly REPAYMENTDURATION: number;
  constructor(
    private readonly loanRepo: LoanRepository,
    private readonly loanSettingService: LoanSettingService,
  ) {
    this.DAILY = 'daily';
    this.REPAYMENTDURATION = 12;
  }

  async applayForLoan(
    @Body() dto: LoanApplicationDto,
    @Res() response: Response,
  ): Promise<any> {
    const status = false;
    let statusCode: HttpStatus;
    let message = '';
    const responseData = null;

    try {
      statusCode = HttpStatus.OK;
      const amount = dto.amount;
      const categoryId = dto.categoryId;
      const grantedDate = dto.grantedDate;
      const repaymentDuration = dto.repaymentDuration ?? this.REPAYMENTDURATION;

      const category = await this.loanSettingService.getCategoriesById(
        categoryId,
      );

      let repaymentCommencementDate = null;
      let repaymentAmount = 0;

      if (category.category_tagline === this.DAILY) {
        repaymentCommencementDate = setPaymentCommencementDateDaily(
          grantedDate,
          repaymentDuration,
        );
        repaymentAmount = this.calCulateDailyRepaymentPlan(amount);
      } else {
        const paymentPlan = category.category_tagline.split('_')[0];
        const plan = parseInt(paymentPlan);

        repaymentCommencementDate = setPaymentCommencementDateMonthly(
          grantedDate,
          repaymentDuration,
        );

        repaymentAmount = this.calculateMonthlyRepaymentPlan(
          amount,
          repaymentDuration,
          plan,
        );
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
    const repaymentAmount = amount / paymentIntervals;
    return repaymentAmount;
  }
}
