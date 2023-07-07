import { PrimaryGeneratedColumn, Column, Entity} from "typeorm";

@Entity()
export class Actions
{
    @PrimaryGeneratedColumn({type:"int",unsigned:true})
    id:number

    @Column({type:"varchar",length:225,unique:true})
    actions:string

    @Column({type:"varchar",length:225,unique:true})
    tag_line:string
}