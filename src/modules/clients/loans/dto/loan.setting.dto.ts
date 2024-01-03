import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class LoanSettingDTO {
  @IsNotEmpty()
  @IsString()
  // @Matches(
  //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&^<>])[A-Za-z\d@$!%*?#&^<>]{6,}$/,
  //   {
  //     message: `$property must have a lower case, an upper case, a number, a special character and a minimum of 6 characters`,
  //   },
  // )
  public password: string;

  @IsOptional()
  @IsString()
  @Length(10, 10)
  receiving_account: string;

  @IsOptional()
  @IsString()
  @Length(3, 225)
  receiving_bank: string;

  @IsNotEmpty()
  default_loan_type: number;
}
