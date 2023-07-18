
import { Exclude } from "class-transformer"

import { Gender } from "src/modules/entities/common.type"
import { Roles } from "../../config/entities/roles.entity"
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
    ManyToOne,
    Generated
} from "typeorm"
import { UserRoles } from "src/modules/config/entities/user.role.entity"
import { Warehouses } from "src/modules/warehouse/entities/warehouse.entity"
import { UsersWarehouses } from "src/modules/warehouse/entities/users.warehouses.entity"



@Entity()
export class Users {

    @PrimaryGeneratedColumn({unsigned:true})
    id : number

    @Column()
    @Generated("uuid")
    uuid: string

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

    
    @OneToOne(() => UserRoles, role => role.user)
    role: UserRoles
   
    @OneToMany(() => UsersWarehouses, (userWarehouse) => userWarehouse.user)
    userWarehouses: UsersWarehouses[]

    @CreateDateColumn()
    created_at:Date

    @UpdateDateColumn()
    updated_at:Date

}
