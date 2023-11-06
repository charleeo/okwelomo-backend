import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { LoanCategory } from '../entities/loans.category.entity';

@Injectable()
export class LoanCategoryRepository extends Repository<LoanCategory> {
  constructor(private dataSource: DataSource) {
    super(LoanCategory, dataSource.createEntityManager());
  }
}
