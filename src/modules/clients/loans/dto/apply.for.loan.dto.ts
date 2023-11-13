import { IsNotEmpty, IsNumber, IsArray, IsOptional } from 'class-validator';

export class LoanApplicationDto {
  @IsNotEmpty()
  @IsNumber()
  public amount: number;

  @IsNotEmpty()
  // @IsDate()
  public grantedDate: Date;

  @IsNotEmpty()
  @IsNumber()
  public categoryId: number;

  @IsOptional()
  @IsNumber()
  public repaymentDuration: number;
}
