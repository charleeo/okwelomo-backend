import { Injectable ,BadRequestException} from '@nestjs/common';
import { RoleRepository } from './repository/roles.repository';
import { ActionRepository } from './repository/actions.repository';
import { DutyRepository } from './repository/duties.repository';

import roles from  "../../storage/data/roles.json"
import actions from  "../../storage/data/actions.json"
import locations from  "../../storage/data/locations.json"
import duties from  "../../storage/data/duties.json"
import measurements from  "../../storage/data/measurements.json"
import warehousecategories from  "../../storage/data/categories.json"
import { Roles } from './entities/roles.entity';
import { UserRoleRepository } from './repository/user_roles.repository';
import { ALLDUTIES,ADMINROLES,NOTASSIGNED,NOACTIONASSIGNED } from '../../config/constants';
import { responseStructure } from "../../common/helpers/response.structure";
import { UserRoles } from './entities/user.role.entity';
import { LocationRepository } from './repository/locations.repository';
import { WarehouseCategoryRepository } from './repository/warehouse.category.repository';
import { logErrors } from 'src/common/helpers/logging';
import { MeasurementRepository } from './repository/measurement.repository';


@Injectable()

export class ConfigService {

    constructor(
        private roleRepo:RoleRepository,
        private actionRepo:ActionRepository,
        private dutyRepo:DutyRepository,
        private readonly userRoleRepo:UserRoleRepository,
        private readonly locationRepo:LocationRepository,
        private readonly warehouseCategoryRepo:WarehouseCategoryRepository,
        private readonly measurementRepo:MeasurementRepository,
        ){}

    async create():Promise<any> {
        let error:string 
        let message:string
        let responseData:object={}
        let status:boolean
        try {
            
            roles.map(async (role)=>{
                responseData['roles'] = "Roles created"
                await this.roleRepo.upsert({role_name:role.role_name,role:role.role},['role'])
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

            measurements.map((measurement)=>{
                this.measurementRepo.upsert({name:measurement},["name"]);
                responseData['measurement'] = "measurements created"
           })

            status=true
            message="Config data created"

        } catch (e) {
            logErrors(e)
            error=e.message
            status=false
        }
        return responseStructure(status,error??message,responseData)
    }

    async assignRoleToUser(userRole):Promise<UserRoles>
    {
        let error:any=null
        let status:boolean =false
        let message:string =""
        let responseData:any =null
        try{
            let userId = userRole.userId
            let roleId = userRole.roleId
            let dutyId = userRole.dutyId
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
            const data ={user:userId,roleId,dutyId, actions: actionIds,status:assignmentStatus}
            this.userRoleRepo.upsert(data,['user'])
        }catch(e){

            error=e.message
        }
        if(!error)message="roles assigned";status=true;
        return responseStructure(status,error??message,responseData)
    }

    async getRolesByName(role:string):Promise<Roles>{
        return await this.roleRepo.findOneBy({role})
    }
}
