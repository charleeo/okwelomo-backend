
import { Locations } from "src/modules/config/entities/location.entity"
import { WarehouseCategories } from "src/modules/config/entities/warehouse.category.entity"
import { WarehouseStatus } from "src/modules/entities/common.type"
import { Exclude } from 'class-transformer';
import { 
    Entity ,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToMany,
    Generated,
    JoinColumn,
} from "typeorm"

import { UsersWarehouses } from "./users.warehouses.entity";
import { Inventory } from "src/modules/inventory/entities/inventory.entity";

@Entity()
export class Warehouses{
    // constructor(private readonly userEvent:UserCreatedEvent ) {
    //   }
    
    @PrimaryGeneratedColumn({type:"int",unsigned:true})
    id:number

    @Column()
    @Generated("uuid")
    uuid: string

    @Column({type:"varchar",length:225})
    warehouseName:string

    @Column({type:"varchar",length:225,nullable:true})
    warehouseEmail:string

    @Column({type:"varchar",length:225,nullable:false})
    warehousePhone:string

    @Column({type:"varchar",length:225,nullable:true})
    capacity:string
   
    @Column({
        type: "enum",
        enum: WarehouseStatus,
        default: WarehouseStatus.active,
        comment:"1 menas active status. 0 means inactive status"
    })

    status:WarehouseStatus

    @Column({type:"text",nullable:true})
    description:string

    @Column({type:"text",nullable:true})
    contactAddress:string
    
    @ManyToOne(() => Locations, (location) => location.warehouses)
    @JoinColumn()
    location: Locations
    
    @ManyToOne(() => WarehouseCategories, (category) => category.warehouses)
    @JoinColumn()
    category: WarehouseCategories

    @OneToMany(() => UsersWarehouses, (userWarehouse) => userWarehouse.warehouse)
    userWarehouses: UsersWarehouses[]

    @OneToMany(() => Inventory, (inventory) => inventory.measurement)
    inventory: Inventory

    @CreateDateColumn()
    createdAt:Date

    @UpdateDateColumn()
    @Exclude()
    updatedAt:Date

}