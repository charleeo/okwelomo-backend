
import { Warehouse } from "src/modules/warehouse/entities/warehouse.entity";
import { PrimaryGeneratedColumn, Column, Entity, CreateDateColumn, UpdateDateColumn,OneToOne,JoinColumn, OneToMany} from "typeorm";

@Entity()
export class Location
{
    @PrimaryGeneratedColumn({type:"int",unsigned:true})
    id:number

    @Column({type:"varchar",length:225})
    locationName:string
    
    @OneToMany(() => Warehouse, (warehouse) => warehouse.location)
    warehouses: Warehouse[]

    @CreateDateColumn()
    createdAt:Date

    @UpdateDateColumn()
    updatedAt:Date

 
}