import {DataSource, Repository} from 'typeorm';
import {Injectable} from '@nestjs/common';
import { Warehouses } from '../entities/warehouse.entity';
import { UsersWarehouses } from '../entities/users.warehouses.entity';


@Injectable()
export class UserWarehouseRepository extends Repository<UsersWarehouses>
{
    constructor(private dataSource: DataSource)
    {
        super(UsersWarehouses, dataSource.createEntityManager());
    }
}