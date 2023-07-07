import {DataSource, Repository} from 'typeorm';
import {Injectable} from '@nestjs/common';
import { WarehouseCategory } from '../entities/warehouse.category.entity';


@Injectable()
export class WarehouseCategoryRepository extends Repository<WarehouseCategory>
{
    constructor(private dataSource: DataSource)
    {
        super(WarehouseCategory, dataSource.createEntityManager());
    }
}