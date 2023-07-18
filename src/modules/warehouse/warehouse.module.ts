import { Module } from '@nestjs/common';
import { WarehouseService } from './warehouse.service';
import { WarehouseController } from './warehouse.controller';
import { WarehouseRepository } from './repositories/warehouse.repository';
import { UniqueFieldValidator } from 'src/config/pipes/unique.validator';
import { ColumnExistValidator } from 'src/config/pipes/column.exists.validator';
import { WarehouseCategoryRepository } from '../config/repository/warehouse.category.repository';
import { UserCreatedEvent } from 'src/events/user.created.event';
import { UserWarehouseRepository } from './repositories/user_warehouse.repository';
import { WarehouseSubscriber } from './subscribers/warehouse.subscribers';

@Module({
  providers: [WarehouseService,WarehouseRepository,UniqueFieldValidator,ColumnExistValidator, WarehouseCategoryRepository,UserCreatedEvent,UserWarehouseRepository,WarehouseSubscriber],
  controllers: [WarehouseController],
  exports:[WarehouseService,WarehouseSubscriber],
})
export class WarehouseModule {}
