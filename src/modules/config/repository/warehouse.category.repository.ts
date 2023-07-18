import {DataSource, Repository} from 'typeorm';
import {Injectable} from '@nestjs/common';
import { WarehouseCategories } from '../entities/warehouse.category.entity';


@Injectable()
export class WarehouseCategoryRepository extends Repository<WarehouseCategories>
{
    constructor(private dataSource: DataSource)
    {
        super(WarehouseCategories, dataSource.createEntityManager());
    }
}