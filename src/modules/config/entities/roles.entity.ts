
import { 
    Entity ,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn
} from "typeorm"


@Entity()

export class Role{
    @PrimaryGeneratedColumn()
    id:number

    @Column({type:"varchar",length:225})
    role_name:string

    @Column({type:"varchar",length:225,nullable:true})
    role:string
}