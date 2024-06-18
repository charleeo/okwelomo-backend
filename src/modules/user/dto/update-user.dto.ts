import { IsOptional, IsString, Length, Matches } from 'class-validator';

import { PartialType } from '@nestjs/mapped-types';

import { CreateUserDto } from './create-user.dto';
import { NAME_REGEX, SINGLE_NAME_REGEX } from 'src/config/constants';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsString()
  @Length(2, 225)
  @Matches(NAME_REGEX, {
    message: 'Firstname must not have special characters',
  })
  @Matches(SINGLE_NAME_REGEX, {
    message: 'Firstname must not have white spaces',
  })
  public firstname: string;

  @IsOptional()
  @IsString()
  @Length(2, 225)
  @Matches(NAME_REGEX, {
    message: 'Lastname must not have special characters',
  })
  @Matches(SINGLE_NAME_REGEX, {
    message: 'Lastname must not have white spaces',
  })
  public lastname: string;

  @IsOptional()
  @IsString()
  @Length(2, 225)
  public phone: string;

  @IsOptional()
  @IsString()
  @Length(2, 225)
  public address: string;

  @IsOptional()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&^<>])[A-Za-z\d@$!%*?#&^<>]{7,}$/,
    {
      message: `$property must have a lower case, an upper case, a number, a special character and a minimum of 10 characters`,
    },
  )
  public password: string;
}
