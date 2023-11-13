import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { ApprovalStatus } from 'src/modules/entities/common.type';

export class ApproveLoanDto {
  @IsNotEmpty()
  @IsEnum(ApprovalStatus)
  public status: ApprovalStatus;

  @IsNotEmpty()
  @IsNumber()
  public loan_id: number;
}
