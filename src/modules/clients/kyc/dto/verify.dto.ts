import { IsEnum, IsNotEmpty, IsNumber, Validate } from 'class-validator';

import { VerificationEnums } from 'src/modules/entities/common.type';
import { ValidateField } from '../Validations/ValidateField';
import { KYC } from '../entities/kyc.entity';
import { ValidateKYCId } from '../Validations/ValidateKYCId';

export class VerifyKYCDTO {
  @IsNotEmpty()
  @IsNumber()
  //   @Validate(ValidateKYCId, [KYC, 'id'])
  public kyc_id: number;

  @IsNotEmpty()
  @IsEnum(VerificationEnums)
  public status: VerificationEnums;
}
