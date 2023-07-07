import { Injectable ,BadRequestException} from '@nestjs/common';
import { RoleRepository } from './repository/roles.repository';
import { ActionRepository } from './repository/actions.repository';
import { DutyRepository } from './repository/duties.repository';

import roles from  "../../storage/data/roles.json"
import actions from  "../../storage/data/actions.json"
import locations from  "../../storage/data/locations.json"
import duties from  "../../storage/data/duties.json"
import warehousecategories from  "../../storage/data/categories.json"
import { Role } from './entities/roles.entity';
import { UserRoleRepository } from './repository/user_roles.repository';
import { ALLDUTIES,ADMINROLES,NOTASSIGNED,NOACTIONASSIGNED } from '../../config/constants';
import { responseStructure } from "../../common/helpers/response.structure";
import { UserRole } from './entities/user.role.entity';
import { LocationRepository } from './repository/locations.repository';
import { WarehouseCategoryRepository } from './repository/warehouse.category.repository';


@Injectable()

export class ConfigService {

    constructor(
        private roleRepo:RoleRepository,
        private actionRepo:ActionRepository,
        private dutyRepo:DutyRepository,
        private readonly userRoleRepo:UserRoleRepository,
        private readonly locationRepo:LocationRepository,
        private readonly warehouseCategoryRepo:WarehouseCategoryRepository,
        ){}

    async create():Promise<any> {
        let error:string 
        let message:string
        let responseData:object={}
        let status:boolean
        try {
            
            roles.map(async (role)=>{
                let existingRole:Role= await this.roleRepo.findOneBy({role:role.role})
    
                if(existingRole==null){
                    await this.roleRepo.save({role_name:role.role_name,role:role.role})
                }
                responseData['roles'] = "Roles created"
            })
    
            actions.map((action)=>{
                this.actionRepo.upsert({tag_line:action.tag_line,actions:action.action},["tag_line"])
                responseData['actions'] = "Actions created"
            })
            
            locations.map((location)=>{
                this.locationRepo.upsert({locationName:location.name},["locationName"])
                responseData['locations'] = "Locations created"
            })
    
            duties.map((duty)=>{
                 this.dutyRepo.upsert({name:duty.name},["name"]);
                 responseData['duties'] = "Duties created"
            })

            warehousecategories.map((category)=>{
                 this.warehouseCategoryRepo.upsert({categoryName:category.categoryName,categoryTag:category.categoryTag},["categoryTag"]);
                 responseData['categories'] = "Categories created"
            })

            status=true
            message="Config data created"

        } catch (e) {
            error=e.message
            status=false
        }
        return responseStructure(status,error??message,responseData)
    }

    async assignRoleToUser(userRole):Promise<UserRole>
    {
        let error:any=null
        let status:boolean =false
        let message:string =""
        let responseData:any =null
        try{
            let userId = userRole.user_id
            let roleId = userRole.role_id
            let dutyId = userRole.duty_id
            let actionIds = userRole.actions
            let assignmentStatus = 1
            let selectedRole = await this.roleRepo.findOneBy({id:roleId})
            if(ADMINROLES.includes(selectedRole.role)){
               dutyId = (await this.dutyRepo.findOneBy({name:ALLDUTIES})).id
               let actions = await this.actionRepo.find({select:['id']})
               let actionsArray=[]
               actions.map(a=> actionsArray.push (a.id))
               actionIds=actionsArray
            }
            else{
                let noDuty = await this.dutyRepo.findOneBy({id:dutyId})
                actionIds = Array.from( new Set(actionIds))//only non repeating items
                if(noDuty.name == NOTASSIGNED){
                    actionIds = [(await this.actionRepo.findOneBy({tag_line:NOACTIONASSIGNED})).id]
                    assignmentStatus=0
                }
            }
            actionIds= actionIds.join(",")
            const data ={
                user_id:userId,role_id:roleId,duty_id: dutyId, actions: actionIds,status:assignmentStatus 
            }
          
            this.isUserAssignedanyRole(data)
            // this.userRoleRepo.upsert(data,['user_id'])
        }catch(e){

            error=e.message
        }
        if(!error)message="roles assigned";status=true;
        return responseStructure(status,error??message,responseData)
    }

    /**If the user already has some roles assignmnet, just update the row instead 
     * @param userRole
    */
    private async isUserAssignedanyRole(userRole):Promise<any>{
        let assignedUser = await this.userRoleRepo.createQueryBuilder('userRole')
        .where('user_id=:user_id',{user_id:userRole.user_id}).getOne()
        if(!assignedUser){
            return await this.userRoleRepo.save(userRole)
        }else return await this.userRoleRepo.update({user_id: assignedUser.user_id},userRole)
    }
}
