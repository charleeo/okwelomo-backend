
import { Warehouse } from "src/modules/warehouse/entities/warehouse.entity"
import { 
    Entity ,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany
} from "typeorm"


@Entity()

export class WarehouseCategory{
    @PrimaryGeneratedColumn()
    id:number

    @Column({type:"varchar",length:225})
    categoryName:string

    @Column({type:"varchar",length:225, })
    categoryTag:string

    @OneToMany(() => Warehouse, (warehouse) => warehouse.location)
    warehouses: Warehouse[]

    @CreateDateColumn()
    createdAt

    @UpdateDateColumn()
    updatedAt
}