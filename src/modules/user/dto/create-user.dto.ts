import {
  IsNotEmpty,
  Length,
  IsEmail,
  IsEnum,
  IsNumber,
  Validate,
  Matches,
  IsOptional,
} from 'class-validator';
import { UniqueEmailValidator } from 'src/config/pipes/unique.user.validator';
import { Users } from '../entities/user.entity';
enum Gender {
  MALE = 'male',
  FEMALE = 'female',
}
export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  @Validate(UniqueEmailValidator, [Users, 'email'])
  public email: string;

  @IsNotEmpty()
  @Length(2, 225)
  public firstname: string;

  @IsNotEmpty()
  @Length(2, 225)
  public lastname: string;

  @IsNotEmpty()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message: `$property must have a lower case, an upper case, a number and a minimum of 10 characters`,
    },
  )
  public password: string;

  @IsOptional()
  //   @IsNotEmpty()
  //   @Length(20)
  public bio: string;

  @IsNotEmpty()
  @IsEnum(Gender)
  public gender: Gender;
}
