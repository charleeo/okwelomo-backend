import {DataSource, Repository} from 'typeorm';
import {Injectable} from '@nestjs/common';
import { UserRole } from '../entities/user.role.entity';


@Injectable()
export class UserRoleRepository extends Repository<UserRole>
{
    constructor(private dataSource: DataSource)
    {
        super(UserRole, dataSource.createEntityManager());
    }
}