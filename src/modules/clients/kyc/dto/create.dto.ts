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

import { Gender } from 'src/modules/entities/common.type';

import { ValidateField } from '../Validations/ValidateField';
import { KYC } from '../entities/kyc.entity';

export class CreateKYCDTO {
  @IsNotEmpty()
  @Length(2, 225)
  public firstname: string;

  @IsOptional()
  @Length(2, 225)
  public lastname: string;

  @IsNotEmpty()
  @Length(20, 225)
  public address: string;

  @IsOptional()
  @IsEnum(Gender)
  public gender: Gender;

  @Validate(ValidateField, [KYC, 'nin'])
  @IsOptional()
  @Length(11)
  nin: string;

  // @ValidateIf((req) => !req.phone && !req.nin, {
  //   message:
  //     'bvn is required when neither nin nor phone number is not provided',
  // })

  @Validate(ValidateField, [KYC, 'bvn'])
  @IsOptional()
  @Length(12)
  bvn: string;

  @Validate(ValidateField, [KYC, 'phone'])
  @IsNotEmpty()
  @Length(12)
  phone: string;
}
