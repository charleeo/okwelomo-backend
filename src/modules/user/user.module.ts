import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';

import { UserRepository } from './user.repository';
import { UserRoleRepository } from '../config/repository/user_roles.repository';
import { ActionRepository } from '../config/repository/actions.repository';
import { UniqueEmailValidator } from 'src/config/pipes/unique.user.validator';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserService,UserRepository,UserRoleRepository,ActionRepository,UniqueEmailValidator],
  exports:[UserService]
})
export class UserModule {}
