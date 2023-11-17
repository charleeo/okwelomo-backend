import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class LoanRepaymentDto {
  @IsNotEmpty()
  @IsString()
  public reference_number: string;

  @IsNotEmpty()
  @IsNumber()
  public repayment_amount: number;
}
