import { Request, Response } from 'express';
import { responseStructure } from 'src/common/helpers/response.structure';

import { HttpStatus, Injectable, Query, Req, Res } from '@nestjs/common';

import { Loan } from '../../entities/loan.entity';
import { LoanRepository } from '../../repositories/loan.repository';
import { BaseDataSource } from 'src/common/helpers/base.data.ource';
import { RepaymentStatus } from 'src/modules/entities/common.type';
import { Users } from 'src/modules/user/entities/user.entity';
import { LessThanOrEqual, MoreThanOrEqual } from 'typeorm';

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
  public async getAllloanForAUSer(user, param): Promise<any> {
    
    const qb =  this.loanRepo
    .createQueryBuilder('loan')
    .leftJoinAndSelect('loan.loan_duration_category', 'loan_repayment_duration_categoriess')
    .leftJoinAndSelect('loan.loan_type', 'loan_types')
    .leftJoinAndSelect('loan.repayments', 'repayments', 'repayments.confirmation_status = :status', { status: RepaymentStatus.pending })
    .orderBy("loan.created_at", 'DESC')
    
    if(!user.is_admin){
      qb.where('loan.customer_id = :customerID', { customerID: user.id });
    }

    if (param.status !== undefined && param.status !== null && param?.status.length ) {
      const status = param.status
      qb.andWhere('loan.verification_status = :loanStatus', {
        loanStatus:status
      });
    }

    if (param.from_amount !== undefined && param.from_amount !== null && param?.from_amount > 0 ) {
      const amount = param.from_amount
      qb.andWhere('loan.amount >= :from_amount', {
       from_amount: amount
      });
    }

    if (param.to_amount !== undefined && param.to_amount !== null && param?.to_amount > 0 ) {
      const amount = param.to_amount
      qb.andWhere('loan.amount <= :to_amount', {
       to_amount: amount
      });
    }
    return qb;
  }

  public async userLoans(user: any, @Res() res: Response, @Query() query: any,@Req() req: Request): Promise<any> {
   
    let status = false;
    let message = '';
    let responseData: object = null;
    let statusCode: HttpStatus;
   
    const loanData = await this.findPaginatedData<Loan>({
      repository:this.loanRepo,
      req,
      route:'loan-data/user/loans',
      query,
      relations:['repayments','loan_type','loan_duration_category'],
      condition:  this.queryConditions(user,query),
      order:{created_at:'desc'}
    })
   
    if (loanData?.items?.length) {
      statusCode = HttpStatus.OK;
      status = true;
      responseData = loanData;
      message ="Loan data fetched"
    } else statusCode = HttpStatus.NO_CONTENT;
    return res
      .status(statusCode)
      .send(responseStructure(status, message, responseData, statusCode));
  }

/**
 * Prepare a condition to be used for the query
 * @param user 
 * @param param 
 * @returns 
 */
  protected queryConditions(user:Users,param:any){
    let condition : any ={}
     if(!user.is_admin){
      condition.customer_id = user.id
    }

    if (param.status !== undefined && param.status !== null && param?.status.length ) {
      const status = param.status
      condition.verification_status = status
    }

   if (param.from_amount !== undefined && param.from_amount !== null && param?.from_amount > 0) {
        const amount = param.from_amount;
        condition.amount = MoreThanOrEqual(amount); // Use standard SQL comparison
    }

    if (param.to_amount !== undefined && param.to_amount !== null && param?.to_amount > 0) {
        const amount = param.to_amount;
        condition.amount = LessThanOrEqual(amount); // Use standard SQL comparison
    }
   
    return condition
  }



}
