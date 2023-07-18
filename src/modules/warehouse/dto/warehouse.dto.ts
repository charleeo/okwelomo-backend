
import { IsNotEmpty, Length, IsEmail, IsNumber, IsOptional, MinLength, Validate} from 'class-validator';
import { UniqueFieldValidator } from 'src/config/pipes/unique.validator';
import { Locations } from 'src/modules/config/entities/location.entity';
import { WarehouseStatus } from 'src/modules/entities/common.type';
import { Warehouses } from '../entities/warehouse.entity';
import { WarehouseCategories } from 'src/modules/config/entities/warehouse.category.entity';
import { ColumnExistValidator } from 'src/config/pipes/column.exists.validator';



export class WarehouseDto {
    @IsOptional()
    @IsEmail()
    public warehouseEmail:string
    
    @IsNotEmpty()
    @Length(2,225)
    @Validate(UniqueFieldValidator, [Warehouses, 'warehousename'])
    public warehouseName:string
    
    @IsNotEmpty()
    @Length(2,225)
    public warehousePhone:string
    
    @IsOptional()
    @Length(6,225)
    public capacity:string

    @IsOptional()
    @MinLength(20)
    public description:string

    @IsOptional()
    @MinLength(5)
    public contactAddress:string
    
    @IsOptional()
    status:WarehouseStatus

    @IsNotEmpty()
    @IsNumber()
    location:Locations

    @IsOptional()
    @IsNumber()
    @Validate(ColumnExistValidator,[WarehouseCategories, 'id'])
    category:WarehouseCategories
    
}
