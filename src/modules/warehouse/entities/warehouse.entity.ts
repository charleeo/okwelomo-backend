
import { Location } from "src/modules/config/entities/location.entity"
import { WarehouseCategory } from "src/modules/config/entities/warehouse.category.entity"
import { Status, WarehouseStatus } from "src/modules/entities/common.type"
import { Exclude } from 'class-transformer';
import { 
    Entity ,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    ManyToMany,
    OneToMany,
} from "typeorm"
import { User } from "src/modules/user/entities/user.entity";

@Entity({name:"warehouses"})
export class Warehouse{
    @PrimaryGeneratedColumn({type:"int",unsigned:true})
    id:number

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
    
    @ManyToOne(() => Location, (location) => location.warehouses)
    location: Location

    @OneToMany(() => User, (users) => users.warehouse)
    users: User[]


    @ManyToOne(() => WarehouseCategory, (category) => category.warehouses)
    category: WarehouseCategory

  

    @CreateDateColumn()
    createdAt:Date

    @UpdateDateColumn()
    @Exclude()
    updatedAt:Date

}