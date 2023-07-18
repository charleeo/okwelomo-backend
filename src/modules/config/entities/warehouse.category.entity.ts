
import { Warehouses } from "src/modules/warehouse/entities/warehouse.entity"
import { 
    Entity ,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    Generated
} from "typeorm"


@Entity()

export class WarehouseCategories{
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    @Generated("uuid")
    uuid: string

    @Column({type:"varchar",length:225})
    categoryName:string

    @Column({type:"varchar",length:225, unique:true})
    categoryTag:string

    @OneToMany(() => Warehouses, (warehouse) => warehouse.category)
    warehouses: Warehouses[]

    @CreateDateColumn()
    createdAt

    @UpdateDateColumn()
    updatedAt
}