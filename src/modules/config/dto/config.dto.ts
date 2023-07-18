
import { IsNotEmpty, IsNumber,IsArray, IsOptional, IsString} from 'class-validator';

export class ActionDto {

    @IsNumber()
    public id:number

    @IsNotEmpty()
    
    public action:string

    @IsNotEmpty()
    public tag_line:string
}

export class RoleDto {
 
    @IsNumber()
    public id:number

    @IsNotEmpty()
    public role_name:string

    @IsNotEmpty()
    public role:string
}

export class DutyDto {

    @IsNumber()
    public id:number

    @IsNotEmpty()
    public name:string
}

export class UserRoleDto {

    @IsNotEmpty()
    @IsNumber()
    public userId:number
    
    @IsNotEmpty()
    @IsNumber()
    public roleId:number
    
    @IsNotEmpty()
    @IsNumber()
    public dutyId:number

    @IsNotEmpty()
    @IsArray()
    public actions:[]

    public status:boolean
}

export class LocationDto {
 
    @IsOptional()
    @IsNumber()
    public id:number

    @IsNotEmpty()
    public name:string
}

export class WarehouseCategoryDto {
 
    @IsOptional()
    @IsNumber()
    public id:number

    @IsNotEmpty()
    @IsString({always:true})
    public categoryName:string

    @IsNotEmpty()
    @IsString({always:true})
    public categoryTag:string
}
export class MeasurementDto {
 
    @IsOptional()
    @IsNumber()
    public id:number

    @IsNotEmpty()
    @IsString({always:true})
    public name:string
}
