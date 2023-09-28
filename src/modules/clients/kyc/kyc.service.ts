import {
  BadRequestException,
  HttpStatus,
  Injectable,
  Res,
} from '@nestjs/common';
import { KYCRepository } from './repositories/kyc.repository';
import { CreateKYCDTO } from './dto/create.dto';
import { KYC } from './entities/kyc.entity';
import { Users } from 'src/modules/user/entities/user.entity';
import { logErrors } from 'src/common/helpers/logging';
import { responseStructure } from 'src/common/helpers/response.structure';
import { Response } from 'express';

@Injectable()
export class KycService {
  constructor(private kycRepo: KYCRepository) {}

  async create(
    kyc: CreateKYCDTO,
    user: Users,
    @Res() response: Response,
  ): Promise<any> {
    let status = false;
    let error = null;
    let message = '';
    let responseData = null;

    try {
      if (await this.findOne(user.id, 'user_id')) {
        message = 'KYC record exists';
        return response
          .status(HttpStatus.BAD_REQUEST)
          .send(responseStructure(status, message, {}, HttpStatus.BAD_REQUEST));
      }
      kyc['user'] = user.id; //always use the key that is in your entity defination, in this case, it is user and not userId
      kyc['user_id'] = user.id;
      responseData = await this.kycRepo.save(kyc);
      if (responseData) status = true;
    } catch (e) {
      logErrors(e);
      error = e.message;
    }
    return { status, error, message, response: responseData };
  }

  async findOne(value: any, fieldName: any): Promise<KYC> {
    const data = await this.kycRepo.findOne({
      where: { [`${fieldName}`]: value },
    });
    return data;
  }
}
