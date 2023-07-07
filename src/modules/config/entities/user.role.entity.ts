import { Status } from "src/modules/entities/common.type";
import { User } from "src/modules/user/entities/user.entity";
import { PrimaryGeneratedColumn, Column, Entity, CreateDateColumn, UpdateDateColumn,OneToOne,JoinColumn} from "typeorm";

@Entity()
export class UserRole
{
    @PrimaryGeneratedColumn({type:"int",unsigned:true})
    id:number

    @Column({type:"int",unsigned:true})
    role_id:number
    
    @Column({type:"json"})
    actions:string

    @Column({type:"int",unsigned:true})
    duty_id:number

    @Column({
        type: "enum",
        enum: Status,
        default: Status.active,
        comment:"1 means active status. O means inactive status"
    })
    status: Status

    @CreateDateColumn()
    created_at:Date

    @UpdateDateColumn()
    updated_at:Date

    @OneToOne(() => User, user=>user.role)
    @JoinColumn({name:"user_id"})
    user_id:User
}