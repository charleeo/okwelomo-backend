import { Type } from "class-transformer";
import { InventoryDto } from "./inventory.dto";
import { IsNotEmpty, IsOptional, Length, ValidateNested } from "class-validator";
import { Measurement } from "src/modules/config/entities/measurement.entity";
import { Warehouses } from "src/modules/warehouse/entities/warehouse.entity";

export class InventoryUpdateDto {
   
    @IsNotEmpty()
    @Length(2,225)
    public itemName:string
    
    @IsNotEmpty()

    public qty:string

    @IsNotEmpty()
    public measurement:Measurement

    @IsNotEmpty()
    public warehouse:Warehouses
    
    @IsOptional()
    @Length(6,225)
    public capacity:string


    @IsOptional()
    @Length(6,225)
    public pricePerItem:string
    
    @IsOptional()
    @Length(6,225)

    public salesPricePerMeasurement:string
    @IsNotEmpty()
    id:number
}