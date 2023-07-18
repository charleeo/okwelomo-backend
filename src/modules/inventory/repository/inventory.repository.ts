import {DataSource, Repository} from 'typeorm';
import {Injectable} from '@nestjs/common';
import { Inventory } from '../entities/inventory.entity';



@Injectable()
export class InventoryRepository extends Repository<Inventory>
{
    constructor(private dataSource: DataSource)
    {
        super(Inventory, dataSource.createEntityManager());
    }
}