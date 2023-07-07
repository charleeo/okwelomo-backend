import { Controller,Get,UseGuards,Req,Res,Body,Post, Request as NestRequest} from '@nestjs/common';
import { WarehouseService } from './warehouse.service';
import { RoleActions } from 'src/config/custom-meta-data/set.roles.metadata';
import { RoleGuard } from 'src/config/guards/role/role.guard';
import { ActionEnums } from 'src/storage/data/action.enums';
import { Response,Request} from 'express';
import { WarehouseDto } from './dto/warehouse.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('warehouses')
export class WarehouseController {
    constructor(private warehouseService:WarehouseService){}
    
    
    @RoleActions(`${ActionEnums.CAN_VIEW_WAREHOUSES}.${ActionEnums.CAN_STOCK_WAREHOUSE}`)
    @UseGuards(RoleGuard)
    @Get()
     
    getStorages(@Body() req:Request,res:Response){
        return this.warehouseService.getStorage(req,res)
    }


    @RoleActions(`${ActionEnums.CAN_REGISTER_WAREHOUSE}`)
    @UseGuards(RoleGuard)
    
    @UseGuards(AuthGuard('jwt'))
    @Post('/register')
     
    async registerWarehouse(@Body() warehouse:WarehouseDto, @NestRequest() req)
    {
        const user = req.user//The logged in user
        return await this.warehouseService.registerWarehouse(warehouse)
    }
    
}
