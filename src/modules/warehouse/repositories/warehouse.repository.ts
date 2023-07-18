import {DataSource, Repository} from 'typeorm';
import {Injectable} from '@nestjs/common';
import { Warehouses } from '../entities/warehouse.entity';


@Injectable()
export class WarehouseRepository extends Repository<Warehouses>
{
    constructor(private dataSource: DataSource)
    {
        super(Warehouses, dataSource.createEntityManager());
    }
}