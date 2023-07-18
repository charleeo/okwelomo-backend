import { DataSource, EntitySubscriberInterface, EventSubscriber, InsertEvent } from "typeorm";
import { Warehouses } from "../entities/warehouse.entity";
import { Injectable } from "@nestjs/common";
import { UserCreatedEvent } from "src/events/user.created.event";

@Injectable()
@EventSubscriber()
export class WarehouseSubscriber implements EntitySubscriberInterface<Warehouses> {
  constructor(dataSource: DataSource, private eventService:UserCreatedEvent) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return Warehouses;
  }

  async  afterInsert(entity: InsertEvent<Warehouses>) {
    const warehouse = entity.entity
    const eventObject ={
                receipient:{
                    name:warehouse.warehouseName,
                    email:warehouse.warehouseEmail
                },
                extraData:{
                    url:process.env.APP_URL,
                    subject:"Warehouse creation notification"
                },
                template:{
                    name:"welcome"
                }
            }
    return await this.eventService.listentToEvent(eventObject)
  }
}