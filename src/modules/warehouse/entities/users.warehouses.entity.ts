
import { Locations } from "src/modules/config/entities/location.entity"
import { WarehouseCategories } from "src/modules/config/entities/warehouse.category.entity"
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
    JoinColumn,
    Generated,
} from "typeorm"
import { Users } from "src/modules/user/entities/user.entity";
import { UUID } from "crypto";
import { Warehouses } from "./warehouse.entity";

@Entity()
export class UsersWarehouses{
    @PrimaryGeneratedColumn({type:"int",unsigned:true})
    id:number
   
    @Column()
    @Generated("uuid")
    uuid: string
    
    @ManyToOne(() => Warehouses, (warehouse) => warehouse.id)
    @JoinColumn()
    warehouse: number

    @ManyToOne(() => Users, (user) => user.id)
    @JoinColumn()
    user: number

    @CreateDateColumn()
    createdAt:Date

    @UpdateDateColumn()
    @Exclude()
    updatedAt:Date

}