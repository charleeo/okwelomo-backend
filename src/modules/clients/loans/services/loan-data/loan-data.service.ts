import { Response } from 'express';
import { responseStructure } from 'src/common/helpers/response.structure';

import { HttpStatus, Injectable, Res } from '@nestjs/common';

import { Loan } from '../../entities/loan.entity';
import { LoanRepository } from '../../repositories/loan.repository';

@Injectable()
export class LoanDataService {
  private readonly DAILY: string;
  private readonly MONTHLY: string;
  private readonly WEEKLY: string;

  constructor(private readonly loanRepo: LoanRepository) {}

  public async getAloanForAUSer(user, status = null): Promise<Loan> {
    const loanData = await this.loanRepo
      .createQueryBuilder('loan')
      .where('loan.verification_status = :status', {
        status
      })
      .andWhere('loan.customer_id = :customerID', { customerID: user.id })
      .getOne();
    return loanData;
  }
  public async getAllloanForAUSer(user, status = null): Promise<Loan[]> {
    const queryBuilder = await this.loanRepo
      .createQueryBuilder('loan')
      .where('loan.customer_id = :customerID', { customerID: user.id });
    if (status !== null) {
      queryBuilder.where('loan.verification_status = :status', {
        status
      });
    }
    return queryBuilder.getMany();
  }

  public async userLoans(user: any, @Res() res: Response): Promise<any> {
    let status = false;
    const message = '';
    let responseData: object = null;
    let statusCode: HttpStatus;
    const loans = await this.getAllloanForAUSer(user);
    if (loans.length) {
      statusCode = HttpStatus.OK;
      status = true;
      responseData = loans;
    } else statusCode = HttpStatus.NO_CONTENT;
    return res
      .status(statusCode)
      .send(responseStructure(status, message, responseData, statusCode));
  }
}
