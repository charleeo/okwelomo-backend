
import { IsNotEmpty, IsString} from 'class-validator';

export class ForgotPasswordRedirectionDto {
    
    @IsString()
    @IsNotEmpty()
    public token:string
}