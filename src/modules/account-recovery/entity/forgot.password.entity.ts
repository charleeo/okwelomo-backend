import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  
} from 'typeorm';

@Entity()
export class ForgotPassword {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column()
  @Generated('uuid')
  uuid: string;

  @Column({ unique: true, type: 'varchar' })
  email: string;

  @Column({ nullable: false, type: 'varchar' })
  token: string;

  @Column({ nullable: false, type: 'timestamp' })
  token_expiration: Date;


  @Column({ nullable: false, type: 'boolean', default:false })
  is_expired: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
  
}
