import { Exclude } from 'class-transformer';

import { Gender, KYCLevel, KYCStatus } from 'src/modules/entities/common.type';
import { Users } from 'src/modules/user/entities/user.entity';

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  Generated,
} from 'typeorm';

@Entity()
export class Loan {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column()
  @Generated('uuid')
  uuid: string;

  @Column({ type: 'int' })
  type: number;

  @Column({ type: 'int' })
  customer_id: number;

  @Column({ type: 'decimal', default: 0.0 })
  amount: number;

  @Column({ type: 'decimal', default: 0.0 })
  interest: number;

  @Column({ type: 'decimal', default: 0.0 })
  repayment_sum: number;

  @Column({ type: 'varchar', default: 0 })
  repayment_rate: number;

  @Column({ type: 'date', default: null })
  repayment_due_date: Date;

  @Column({ type: 'date', default: null })
  repayment_start_date: Date;

  @Column({ type: 'date', default: new Date() })
  issue_date: Date;

  @Column({ type: 'varchar' })
  reference: string;

  @CreateDateColumn()
  created_at: Date;
  @UpdateDateColumn()
  updated_at: Date;
}
