import { Injectable,Param,Query } from '@nestjs/common';
import { WarehouseDto } from './dto/warehouse.dto';
import { WarehouseRepository } from './repositories/warehouse.repository';
import { UserCreatedEvent } from 'src/events/user.created.event';
import { logErrors } from 'src/common/helpers/logging';
import { UserWarehouseRepository } from './repositories/user_warehouse.repository';
import { Users } from '../user/entities/user.entity';
import { paginate } from 'nestjs-typeorm-paginate';
import { Warehouses } from './entities/warehouse.entity';
import { IsNumber } from 'class-validator';
import { responseStructure } from 'src/common/helpers/response.structure';
@Injectable()
export class WarehouseService {
    constructor(
        private  warehouseRepo:WarehouseRepository, private userCreatedEvent:UserCreatedEvent,private userWarehouseRepo:UserWarehouseRepository 
        ){}
    
   async warehouseLists(user:Users, @Query() query:any):Promise<Warehouses[]>
   {
        let status:boolean=false
        let message:string =""
        let data : any=null
        let error=null
        try{
            const page = query.page && IsNumber(query.page) ?query.page:1
            const limit = (query.limit && IsNumber(query.limit)) ?query.limit:20
            const qb = this.warehouseRepo.createQueryBuilder('warehouse')
            .leftJoinAndSelect("warehouse.userWarehouses", "userWarehouse")
            .where("userWarehouse.userId = :userId", {userId: user.id})
            .orderBy("warehouse.createdAt","DESC")
            data = await paginate<Warehouses>(qb, {
                page,
                limit,
                route: process.env.APP_URL+"user",
              })
              if(data['items'].length >0){
                message="Data found"
                status=true
              }

        }catch(e){
            error=e.message
            logErrors(e.message);
          }
          return responseStructure(status,error??message,data)
   }
   
   /**
    * 
    * @param user 
    * @param query 
    * @returns 
    */
   
   async warehouseDetails(req:any,@Param() params):Promise<Warehouses>
   {
        let status:boolean=false
        let message:string =""
        let data : any=null
        let error=null
        try{

            const user = req.user.id         
            const warehouseId = params.id
            data = await this.warehouseRepo.createQueryBuilder('warehouse')
            .leftJoinAndSelect("warehouse.location", "locations")
            .leftJoinAndSelect("warehouse.category", "WarehouseCategories")
            .where("warehouse.id = :id", {id: warehouseId})
            .getOne()
           
            if(data){
            message="Data found"
            status=true
            }

        }catch(e){
            error=e.message
            logErrors(e.message);
          }
          return responseStructure(status,error??message,data)
   }

   async getWarehouseByName(name:string){
      return await this.warehouseRepo.findOneBy({warehouseName:name})
    }

    async  registerWarehouse(warehouse:WarehouseDto,user:Users):Promise<any>{
        let status =false
        let error = null
        let message = ""
        let responseData =null
        try {
            
            const createWarehouse = await this.warehouseRepo.save(warehouse);
            if(createWarehouse)
            {   this.createUserAndWarehouseRelationship(user.id,createWarehouse.id)
                status=true
                message = "warehouse created"
            }
            responseData = createWarehouse
        } catch (e) {
            logErrors(e)
            error = e.message
        }
         return { status, error,message,response : responseData}
    }

    async createUserAndWarehouseRelationship(userId:number,warehouseId:number)
    {
        return await this.userWarehouseRepo.save({user:userId,warehouse:warehouseId})
    }
}
