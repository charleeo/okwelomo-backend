
import { IsNotEmpty, Length, IsEmail, IsNumber, IsOptional, MinLength, Validate} from 'class-validator';
import { UniqueFieldValidator } from 'src/config/pipes/unique.validator';
import { Location } from 'src/modules/config/entities/location.entity';
import { WarehouseStatus } from 'src/modules/entities/common.type';
import { Warehouse } from '../entities/warehouse.entity';
import { WarehouseCategory } from 'src/modules/config/entities/warehouse.category.entity';
import { ColumnExistValidator } from 'src/config/pipes/column.exists.validator';



export class WarehouseDto {
    @IsOptional()
    @IsEmail()
    public warehouseEmail:string
    
    @IsNotEmpty()
    @Length(2,225)
    @Validate(UniqueFieldValidator, [Warehouse, 'warehousename'])
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
    location:Location

    @IsNotEmpty()
    @IsNumber()
    @Validate(ColumnExistValidator,[WarehouseCategory, 'categoryId'])
    categoryId:WarehouseCategory
    
}
