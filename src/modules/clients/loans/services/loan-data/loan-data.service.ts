import { Injectable } from '@nestjs/common';
import { LoanRepository } from '../../repositories/loan.repository';
import { LoanSettingService } from '../loan.settings.service';
import { Loan } from '../../entities/loan.entity';

@Injectable()
export class LoanDataService {
  private readonly DAILY: string;
  private readonly MONTHLY: string;
  private readonly WEEKLY: string;

  constructor(
    private readonly loanRepo: LoanRepository,
    private readonly loanSettingService: LoanSettingService,
  ) {
    this.DAILY = 'daily';
    this.MONTHLY = 'monthly';
    this.WEEKLY = 'weekly';
  }

  public async getAloanForAUSer(user, status): Promise<Loan> {
    const loanData = await this.loanRepo
      .createQueryBuilder('loan')
      .where('loan.verification_status = :status', {
        status,
      })
      .andWhere('loan.customer_id = :customerID', { customerID: user.id })
      .getOne();
    return loanData;
  }
}
