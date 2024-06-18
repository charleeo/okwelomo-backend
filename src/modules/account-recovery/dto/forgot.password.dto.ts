
import { IsNotEmpty,  IsEmail} from 'class-validator';

export class ForgotPasswordlDto {
    
    @IsEmail()
    @IsNotEmpty()
    public email:string
}