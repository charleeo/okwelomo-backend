
import { IsNotEmpty, IsNumber, IsOptional, Length, ValidateNested } from "class-validator";


export class InventoryStockUpdateDto {

    @IsNotEmpty()
    public soldQTY:number|string|any

    @IsOptional()
    @IsNumber()
    public remainder:number|string|any
    
    @IsOptional()
    @IsNumber()
    public pricePerItem:number|string|any
    
    @IsOptional()
    @IsNumber()
    public salesPerItem:number|string|any
   
    @IsNotEmpty()
    @IsNumber()
    id:number
}