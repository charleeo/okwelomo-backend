import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';
import { InterestPaymentStatus } from 'src/modules/entities/common.type';

export class LoanApplicationDto {
  @IsNotEmpty()
  public amount: number;

  @IsNotEmpty()
  // @IsDate()
  public grantedDate: Date;

  @IsNotEmpty()
  public loan_durtion_category_id: number;

  @IsNotEmpty()
  public loan_type: number | string | any;

  @IsNotEmpty()
  @IsEnum(InterestPaymentStatus)
  public interest_payment_status: InterestPaymentStatus;
}
