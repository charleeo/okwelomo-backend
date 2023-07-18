import { Module } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { InventoryRepository } from './repository/inventory.repository';
import { WarehouseRepository } from '../warehouse/repositories/warehouse.repository';
import { InventoryController } from './inventory.controller';

@Module({
  providers: [InventoryService,InventoryRepository,WarehouseRepository],
  controllers: [InventoryController]
})
export class InventoryModule {}
