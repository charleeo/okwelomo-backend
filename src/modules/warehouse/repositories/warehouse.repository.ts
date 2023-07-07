import {DataSource, Repository} from 'typeorm';
import {Injectable} from '@nestjs/common';
import { Warehouse } from '../entities/warehouse.entity';


@Injectable()
export class WarehouseRepository extends Repository<Warehouse>
{
    constructor(private dataSource: DataSource)
    {
        super(Warehouse, dataSource.createEntityManager());
    }
}