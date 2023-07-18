import { Injectable,Param,Query } from '@nestjs/common';
import { logErrors } from 'src/common/helpers/logging';

import { Users } from '../user/entities/user.entity';
import { paginate } from 'nestjs-typeorm-paginate';

import { IsNumber } from 'class-validator';
import { responseStructure } from 'src/common/helpers/response.structure';
import { InventoryArrayDto, InventoryDto, SearchDto } from './dto/inventory.dto';
import { InventoryRepository } from './repository/inventory.repository';
import { Inventory } from './entities/inventory.entity';
import { WarehouseRepository } from '../warehouse/repositories/warehouse.repository';
import { InventoryUpdateDto } from './dto/update.inventory.dto';
@Injectable()
export class InventoryService {
    constructor(
        private  warehouseRepo:WarehouseRepository,private inventoryRepo:InventoryRepository 
        ){}
    
        /**
         * 
         * @param user 
         * @param query 
         * @returns
         */
   async inventoryLists(user:Users, @Query() query:any,search:SearchDto):Promise<Inventory[]>
   {
        let status:boolean=false
        let message:string =""
        let data : any=null
        let error=null;
        try{
            
            const {qty,itemName,description} = search
            const page = query.page && IsNumber(query.page) ?query.page:1
            const perPage = (query.perPage && IsNumber(query.perPage)) ?query.perPage:20
            let qb = this.inventoryRepo.createQueryBuilder('inventory')
            .leftJoinAndSelect("inventory.warehouse", "warehouses")
            .leftJoinAndSelect("warehouses.userWarehouses", "userWarehouse")
            .where("userWarehouse.userId = :userId", {userId: user.id})
            .orderBy("inventory.createdAT","DESC")
           
            qty?qb.andWhere("inventory.qty= :qty",{qty}):""
            itemName?qb.andWhere("inventory.itemName LIKE :itemName",{itemName:`%${itemName}%`}):""
            description? qb.andWhere("inventory.description LIKE :description",{description:`%${description}%`}):""
            
            data = await paginate<Inventory>(qb, {
                page,
                limit:perPage,
                route: process.env.APP_URL+"user",
              })
              if(data['items'].length >0){
                message="Data found"
                status=true
              }

        }catch(e){
            error=e.message
            console.log(e)
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
   
   async inventoryDetails(req:any,@Param() params):Promise<Inventory>
   {
        let status:boolean=false
        let message:string =""
        let data : any=null
        let error=null
        try{

            const user = req.user.id         
            const id = params.id
            data = await this.inventoryRepo.createQueryBuilder('inventory')
            .leftJoinAndSelect("inventory.warehouse", "warehouses") 
            .where("inventory.id = :id", {id})
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


    /**
     * 
     * @param inventories 
     * @param user 
     * @returns @any
     */
    async  createInventory(inventories:InventoryArrayDto,user:Users):Promise<any>{
        let status =false
        let error = null
        let message = ""
        let responseData =null
        try {
            const createdInventory= await this.inventoryRepo.create(inventories.items)
            await this.inventoryRepo.insert( createdInventory)
           if(createdInventory.length >0){
            message="Data created"
            status=true
           }
           responseData=createdInventory
        } catch (e) {
            logErrors(e)
            error = e.message
        }
         return { status, error,message,response : responseData}
    }

    /**
     * 
     * @param inventory 
     */
    async updateInventory(inventory:InventoryUpdateDto):Promise<any>{
        let status:boolean =false
        let error:string|object = null
        let message:string = ""
        let responseData:object =null
        try{
            let qb = await this.inventoryRepo.createQueryBuilder("inventory")
            .where("inventory.id=:id",{id:inventory.id})
    
            if(!qb.getOne()){
                message="inventory not found"
            }else{
                delete inventory.id
                if(qb.update().set({...inventory}).execute()){
                    status=true
                    message="data updated"
                }
            }
            responseData=await qb.getOne()
        }catch(e){
            logErrors(e)
            error=e.message
        }
        return { status, error,message,response : responseData}
    }
}
