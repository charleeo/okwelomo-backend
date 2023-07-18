
import { Type } from 'class-transformer';
import { IsNotEmpty, Length, IsEmail, IsNumber, IsOptional, MinLength, Validate, IsArray, ValidateNested, isNotEmpty, IsString} from 'class-validator';
import { Measurement } from 'src/modules/config/entities/measurement.entity';
import { Warehouses } from 'src/modules/warehouse/entities/warehouse.entity';

export class InventoryDto {
    
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
    public salePerItem:string
    
    @IsOptional()
    @Length(6,225)
    public salesPricePerMeasurement:string
}

export class InventoryArrayDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => InventoryDto)
    items: InventoryDto[]
}
export class SearchDto {
   
    @IsOptional()
    @IsNotEmpty()
    @IsNumber()
    qty:number

    @IsOptional()
    @IsNotEmpty()
    @IsString({always:true})
    itemName:string

    @IsOptional()
    @IsNotEmpty()
    @IsString({always:true})
    description:string
}
  
