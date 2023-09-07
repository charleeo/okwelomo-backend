import { IsNotEmpty, IsOptional, Length, ValidateNested } from "class-validator";
import { Measurement } from "src/modules/config/entities/measurement.entity";
import { Warehouses } from "src/modules/warehouse/entities/warehouse.entity";

export class InventoryUpdateDto {
   
    @IsNotEmpty()
    @Length(2,225)
    public itemName:string
    
    @IsNotEmpty()
    public qty:number

    @IsNotEmpty()
    public measurement:Measurement

    @IsNotEmpty()
    public warehouse:Warehouses
    

    @IsOptional()
    @Length(6,225)
    public pricePerItem:number
    
    @IsOptional()
    @Length(6,225)
    public salesPricePerMeasurement:number

    @IsNotEmpty()
    id:number
}