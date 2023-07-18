import { Inventory } from "src/modules/inventory/entities/inventory.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Measurement{
    @PrimaryGeneratedColumn()
    id:number
    
    @Column({type:"varchar",unique:true})
    name:string

    @OneToMany(() => Inventory, (inventory) => inventory.measurement)
    inventory: Inventory

    @CreateDateColumn()
    createdAt:Date

    @UpdateDateColumn()
    updatedAt:Date
}