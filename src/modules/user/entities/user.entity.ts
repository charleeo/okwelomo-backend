import { Exclude } from 'class-transformer';

import { Gender } from 'src/modules/entities/common.type';
import { Roles } from '../../config/entities/roles.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  Generated,
} from 'typeorm';
import { UserRoles } from 'src/modules/config/entities/user.role.entity';
import { KYC } from 'src/modules/clients/kyc/entities/kyc.entity';

@Entity()
export class Users {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column()
  @Generated('uuid')
  uuid: string;

  @Column({ unique: true, type: 'varchar' })
  email: string;

  @Column({ nullable: true, type: 'varchar' })
  firstname: string;

  @Column({ nullable: true, type: 'varchar' })
  lastname: string;

  @Column({ type: 'varchar' })
  @Exclude()
  password: string;

  @Column({ type: 'bool', default: false })
  is_admin: boolean;

  @OneToOne(() => UserRoles, (role) => role.user)
  role: UserRoles;

  @OneToOne(() => KYC, (kyc) => kyc.user)
  kyc: KYC;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
