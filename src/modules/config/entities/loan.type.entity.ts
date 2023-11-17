import { PrimaryGeneratedColumn, Column, Entity, Generated } from 'typeorm';

@Entity({ name: 'loan_types' })
export class LoanType {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column()
  @Generated('uuid')
  uuid: string;

  @Column({ type: 'varchar', length: 225, unique: true })
  type: string;

  @Column({ type: 'varchar', length: 225 })
  description: string;

  @Column({ type: 'varchar', length: 225 })
  status: string;
}
