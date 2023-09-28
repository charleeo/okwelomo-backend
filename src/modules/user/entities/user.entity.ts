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
import { Warehouses } from 'src/modules/warehouse/entities/warehouse.entity';
import { UsersWarehouses } from 'src/modules/warehouse/entities/users.warehouses.entity';
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

  @Column({ type: 'varchar' })
  @Exclude()
  password: string;

  @OneToOne(() => UserRoles, (role) => role.user)
  role: UserRoles;

  @OneToOne(() => KYC, (kyc) => kyc.user)
  kyc: KYC;

  @OneToMany(() => UsersWarehouses, (userWarehouse) => userWarehouse.user)
  userWarehouses: UsersWarehouses[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
