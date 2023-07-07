
import { IsNotEmpty, Length, IsEmail, IsEnum,IsNumber, Validate, } from 'class-validator';
import { UniqueEmailValidator } from 'src/config/pipes/unique.user.validator';
import { User } from '../entities/user.entity';
enum Gender {
    MALE = 'male',
    FEMALE = 'female',
}
export class CreateUserDto {
    @IsNotEmpty()
    @IsEmail()
    @Validate(UniqueEmailValidator,[User,"email"])
    public email:string
    
    @IsNotEmpty()
    @Length(2,225)
    public firstname:string
    
    @IsNotEmpty()
    @Length(2,225)
    public lastname:string
    
    @IsNotEmpty()
    @Length(6,225)
    public password:string
    
    @IsNotEmpty()
    @Length(20)
    public bio:string
    
    @IsNotEmpty()
    @IsEnum(Gender)
    public gender:Gender
}
