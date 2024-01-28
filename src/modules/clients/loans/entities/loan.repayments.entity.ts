import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  Generated,
  ManyToOne,
} from 'typeorm';
import { Loan } from './loan.entity';

@Entity()
export class LoanRepayment {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column()
  @Generated('uuid')
  uuid: string;

  @Column({ type: 'decimal', default: 0.0, precision: 10, scale: 2 })
  amount: number;

  // @Column({ type: 'varchar' })

  @ManyToOne(() => Loan, user => user.repayments)
  @JoinColumn({ name: 'reference', referencedColumnName:'reference' })
  reference: Loan | string

  @Column({ type: 'varchar', nullable: true })
  repayment_reference: string;

  @Column({ type: 'bool', default: false })
  confirmation_status: boolean;

  @Column({ type: 'jsonb', default: {} })
  repayments_data: object;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
