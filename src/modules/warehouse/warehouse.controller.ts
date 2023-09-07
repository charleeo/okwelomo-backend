import { Controller,Get,UseGuards,Query,Body,Post, Request as NestRequest, Param} from '@nestjs/common';
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
    @Post()
    @UseGuards(AuthGuard('jwt'))
    warehouseLists(@NestRequest() req,@Query() query: Request){
        const user = req.user
        return this.warehouseService.warehouseLists(user,query)
    }


    @RoleActions(`${ActionEnums.CAN_VIEW_WAREHOUSES}.${ActionEnums.CAN_STOCK_WAREHOUSE}`)
    @UseGuards(RoleGuard)
    @Get(":id")
    @UseGuards(AuthGuard('jwt'))
    warehousedetails(@NestRequest() req,@Param() params){
        return this.warehouseService.warehouseDetails(req,params)
    }


    @RoleActions(`${ActionEnums.CAN_REGISTER_WAREHOUSE}`)
    @UseGuards(RoleGuard)
    
    @UseGuards(AuthGuard('jwt'))
    @Post('/create')
     
    async createWarehouse(@Body() warehouse:WarehouseDto, @NestRequest() req)
    {
        return await this.warehouseService.createWarehouse(warehouse,req.user)
    }
}
