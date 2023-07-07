
import { Exclude } from "class-transformer"

import { Gender } from "src/modules/entities/common.type"
import { Role } from "../../config/entities/roles.entity"
import { 
    Entity ,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    OneToOne,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne
} from "typeorm"
import { UserRole } from "src/modules/config/entities/user.role.entity"
import { Warehouse } from "src/modules/warehouse/entities/warehouse.entity"



@Entity({name:"users"})
export class User {

    @PrimaryGeneratedColumn({unsigned:true})
    id : number

    @Column({unique:true,type:"varchar"})
    email:string

    @Column({type:"varchar"})
    @Exclude()
    password:string

    @Column({
        type: "enum",
        enum: Gender,
        default: Gender.MALE
    })
    gender: Gender
 
    @Column({length:225})
    firstname:string

    @Column({length:225,nullable:true})
    lastname:string

    @Column({type:"text", nullable:true})
    bio:string

    
    @OneToOne(() => UserRole, role => role.user_id)
    role: UserRole;
    @ManyToOne(() => Warehouse, (warehouse) => warehouse.users,{nullable:true})
    warehouse: Warehouse

    @CreateDateColumn()
    created_at:Date

    @UpdateDateColumn()
    updated_at:Date

}
