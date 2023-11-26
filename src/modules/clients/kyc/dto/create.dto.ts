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
import { IsImageFile } from 'src/config/pipes/validate.image.pipe';

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

  @IsOptional()
  @IsImageFile({ message: 'invalid mime type received' })
  profile_picture: string;

  @Validate(ValidateField, [KYC, 'nin'])
  @IsOptional()
  @Length(11)
  nin: string;

  @Validate(ValidateField, [KYC, 'bvn'])
  @IsOptional()
  @Length(12)
  bvn: string;

  @Validate(ValidateField, [KYC, 'phone'])
  @IsNotEmpty()
  @Length(12)
  phone: string;
}
