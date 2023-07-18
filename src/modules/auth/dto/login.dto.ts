
import { IsNotEmpty,  IsEmail, Validate, } from 'class-validator';
import { UserExistsValidation } from 'src/config/pipes/user..exists.validation';
import { Users } from 'src/modules/user/entities/user.entity';


export class LoginDto {
    @IsNotEmpty()
    @IsEmail()
    @Validate(UserExistsValidation,[Users,"email"])
    public email:string

    @IsNotEmpty()
    public password:string
    
}
