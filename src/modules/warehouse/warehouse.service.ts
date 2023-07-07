import { Injectable,Body } from '@nestjs/common';
import { Request } from 'express';
import { WarehouseDto } from './dto/warehouse.dto';
import { WarehouseRepository } from './repositories/warehouse.repository';
import { UserCreatedEvent } from 'src/events/user.created.event';
import { logErrors } from 'src/common/helpers/logging';
@Injectable()
export class WarehouseService {
    constructor(private  warehouseRepo:WarehouseRepository, private userCreatedEvent:UserCreatedEvent ){}
    
    getStorage(@Body() body:Request,  res){
        body["newData"] = "This is an attached body for testing"
        console.log(body)
        // req.body.response = "This is an additional data that is added to this body"
        return "This implementation is working"
    }

   async getWarehouseByName(name:string){
      return await this.warehouseRepo.findOneBy({warehouseName:name})
    }

    async  registerWarehouse(warehouse:WarehouseDto):Promise<any>{
        let status =false
        let error = null
        let message = ""
        let responseData =null
        try {
            
            const mailObject ={
                receipient:{
                    name:warehouse.warehouseName,
                    email:warehouse.warehouseEmail
                },
                extraData:{
                    url:process.env.APP_URL,
                    subject:"Warehouse creation notification"
                },
                template:{
                    name:"welcome"
                }
            }

            this.userCreatedEvent.listentToEvent(mailObject)
            const createWarehouse = await this.warehouseRepo.save(warehouse);
            if(createWarehouse)
            {
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
}
