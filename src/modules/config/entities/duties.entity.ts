import { PrimaryGeneratedColumn, Column, Entity} from "typeorm";

@Entity()
export class Duties
{
    @PrimaryGeneratedColumn({type:"int",unsigned:true})
    id:number

    @Column({type:"varchar",length:225,unique:true})
    name:string
}