import { Injectable } from '@nestjs/common';
import { LoanRepository } from '../../repositories/loan.repository';
import { LoanSettingService } from '../loan.settings.service';

@Injectable()
export class RepaymentService {
  private readonly DAILY: string;
  private readonly REPAYMENTDURATION: number;
  constructor(
    private readonly loanRepo: LoanRepository,
    private readonly loanSettingService: LoanSettingService,
  ) {
    this.DAILY = 'daily';
    this.REPAYMENTDURATION = 12;
  }

  async processRepayment() {}
}
