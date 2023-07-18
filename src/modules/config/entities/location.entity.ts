
import { Warehouses } from "src/modules/warehouse/entities/warehouse.entity";
import { PrimaryGeneratedColumn, Column, Entity, CreateDateColumn, UpdateDateColumn,OneToOne,JoinColumn, OneToMany, Generated} from "typeorm";

@Entity()
export class Locations
{
    @PrimaryGeneratedColumn({type:"int",unsigned:true})
    id:number

    @Column()
    @Generated("uuid")
    uuid: string

    @Column({type:"varchar",length:225,unique:true})
    locationName:string
    
    @OneToMany(() => Warehouses, (warehouse) => warehouse.location)
    warehouses: Warehouses[]

    @CreateDateColumn()
    createdAt:Date

    @UpdateDateColumn()
    updatedAt:Date

 
}