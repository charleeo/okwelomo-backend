import { Controller,Get,UseGuards,Query,Body,Post, Request as NestRequest, Param} from '@nestjs/common';

import { RoleActions } from 'src/config/custom-meta-data/set.roles.metadata';
import { RoleGuard } from 'src/config/guards/role/role.guard';
import { ActionEnums } from 'src/storage/data/action.enums';
import { Response,Request} from 'express';

import { AuthGuard } from '@nestjs/passport';
import { InventoryService } from './inventory.service';
import { InventoryArrayDto, InventoryDto, SearchDto } from './dto/inventory.dto';
import { InventoryUpdateDto } from './dto/update.inventory.dto';
import { InventoryStockUpdateDto } from './dto/update.stock.inventory.dto';

@Controller('inventory')
export class InventoryController {
    constructor(private inventoryService:InventoryService){}
    
    
    @RoleActions(`${ActionEnums.CAN_VIEW_WAREHOUSES}.${ActionEnums.CAN_STOCK_WAREHOUSE}`)
    @UseGuards(RoleGuard)
    @Post()
    @UseGuards(AuthGuard('jwt'))
    inventoryLists(@NestRequest() req,@Query() query: Request, @Body() search:SearchDto){
        const user = req.user
        return this.inventoryService.inventoryLists(user,query,search)
    }


    @RoleActions(`${ActionEnums.CAN_MANAGE_WAREHOUSES}`)
    @UseGuards(RoleGuard)
    @Get(":id")
    @UseGuards(AuthGuard('jwt'))
    inventoryDetails(@NestRequest() req,@Param() params){
        return this.inventoryService.inventoryDetails(req,params)
    }


    @RoleActions(`${ActionEnums.CAN_STOCK_WAREHOUSE}`)
    @UseGuards(RoleGuard)
    
    @UseGuards(AuthGuard('jwt'))
    @Post('/create')
     
    async createInventory(@Body() inventory:InventoryArrayDto, @NestRequest() req)
    {
        const user = req.user
        return await this.inventoryService.createInventory(inventory,user)
    }


    @RoleActions(`${ActionEnums.CAN_REGISTER_WAREHOUSE}`)
    @UseGuards(RoleGuard)
    
    @UseGuards(AuthGuard('jwt'))
    @Post('/update')
    async updateInventory(@Body() inventory:InventoryUpdateDto)
    {
        return await this.inventoryService.updateInventory(inventory)
    }


    @RoleActions(`${ActionEnums.CAN_REGISTER_WAREHOUSE}`)
    @UseGuards(RoleGuard)
    
    @UseGuards(AuthGuard('jwt'))
    @Post('/update/stock')
    async updateInventoryStock(@Body() inventory:InventoryStockUpdateDto)
    {
        return await this.inventoryService.updateInventoryStockStatus(inventory)
    }
}
