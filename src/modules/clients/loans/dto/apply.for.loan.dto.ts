import {
  IsNotEmpty,
  IsNumber,
  IsArray,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { InterestPaymentStatus } from 'src/modules/entities/common.type';

export class LoanApplicationDto {
  @IsNotEmpty()
  @IsNumber()
  public amount: number;

  @IsNotEmpty()
  // @IsDate()
  public grantedDate: Date;

  @IsNotEmpty()
  @IsNumber()
  public loan_durtion_category_id: number;

  @IsNotEmpty()
  public loan_type: number | string | any;

  @IsNotEmpty()
  @IsEnum(InterestPaymentStatus)
  public interest_payment_status: InterestPaymentStatus;
}
