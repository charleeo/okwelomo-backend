
import { Measurement } from "src/modules/config/entities/measurement.entity";
import { InventoryStatus } from "src/modules/entities/common.type";

import { Warehouses } from "src/modules/warehouse/entities/warehouse.entity";
import { Column,PrimaryGeneratedColumn, Entity, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, AfterInsert } from "typeorm";

@Entity()
export class Inventory{
   
    @PrimaryGeneratedColumn()
    id:number

    @Column({type:"varchar",length:225,nullable:false})
    itemName:string

    @Column({type:"text",nullable:false})
    description:string;

    @Column({type:"varchar",nullable:false})
    qty:string

    @ManyToOne(() => Measurement, (measurement) => measurement.inventory)
    @JoinColumn()
    measurement: Measurement

    @ManyToOne(() => Warehouses, (warehouse) => warehouse.inventory)
    @JoinColumn()
    warehouse: Warehouses

    @Column({type:"varchar",nullable:true,comment:"This how much an item was bought for"})
    pricePerItem:string 

    @Column({type:"varchar",nullable:true,comment:"This how much an item was sold  for"})
    salesPricePerMeasurement:string

    @Column({default:0,type:"varchar",nullable:true})
    soldQTY:string

    @Column({type:"varchar", nullable:true})
    remainder:string

    @Column({type:"varchar", nullable:true})
    profit:string

    @Column({type:"varchar", nullable:true,default:InventoryStatus.not_sold})
    status:InventoryStatus

    @CreateDateColumn()
    createdAT:Date

    @UpdateDateColumn()
    updatedAt:Date
}
