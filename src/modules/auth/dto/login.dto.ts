
import { IsNotEmpty,  IsEmail, Validate, Length} from 'class-validator';
import { UserExistsValidation } from 'src/config/pipes/user..exists.validation';
import { Users } from 'src/modules/user/entities/user.entity';


export class LoginDto {
    // @Validate(UserExistsValidation,[Users,"email"])
    @IsEmail()
    @IsNotEmpty()
    public email:string

    @IsNotEmpty()
    public password:string
    
}
