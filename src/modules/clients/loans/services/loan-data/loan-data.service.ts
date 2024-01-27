import { Request, Response } from 'express';
import { responseStructure } from 'src/common/helpers/response.structure';

import { HttpStatus, Injectable, Query, Req, Res } from '@nestjs/common';

import { Loan } from '../../entities/loan.entity';
import { LoanRepository } from '../../repositories/loan.repository';
import { BaseDataSource } from 'src/common/helpers/base.data.ource';

@Injectable()
export class LoanDataService extends BaseDataSource {
  private readonly DAILY: string;
  private readonly MONTHLY: string;
  private readonly WEEKLY: string;

  constructor(private readonly loanRepo: LoanRepository) {
    super(loanRepo)
  }

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

  /**
   * Get all the loans associated to this user and also be able to filter by some conditions
   * @param user 
   * @param status 
   * @returns 
   */
  public async getAllloanForAUSer(user, status = null,search=null): Promise<any> {
    
    const qb =  this.loanRepo
      .createQueryBuilder('loan')
      .leftJoinAndSelect('loan.loan_duration_category', 'loan_repayment_duration_categoriess')
      .leftJoinAndSelect('loan.loan_type', 'loan_types')
   
    if(!user.is_admin){
      qb.where('loan.customer_id = :customerID', { customerID: user.id });
    }
    if (status !== null && status.length ) {
      qb.andWhere('loan.verification_status = :status', {
        status
      });
    }
    return qb;
  }

  public async userLoans(user: any, @Res() res: Response, @Query() query: any, @Req() req:Request): Promise<any> {
    console.log(req)
    let status = false;
    const message = '';
    let responseData: object = null;
    let statusCode: HttpStatus;
    let route = process.env.APP_URL + 'loan-data/user/loans'
    let loanStatus = query.status
    const loans = await this.paginate<Loan>(
      await this.getAllloanForAUSer(user, loanStatus),
      query,
      route
      );

    if (loans['items'].length) {
      statusCode = HttpStatus.OK;
      status = true;
      responseData = loans;
    } else statusCode = HttpStatus.NO_CONTENT;
    return res
      .status(statusCode)
      .send(responseStructure(status, message, responseData, statusCode));
  }
}
