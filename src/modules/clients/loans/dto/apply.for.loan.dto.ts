import {
  IsNotEmpty,
  IsNumber,
  IsArray,
  IsOptional,
  IsString,
  Validate,
  Length,
  IsEnum,
  ValidateIf,
  MaxLength,
} from 'class-validator';

export class ApplyForLoanDTO {
  @IsNotEmpty()
  @IsNumber()
  public amount: number;
}
