import { HttpStatus, Injectable, Res, Query, Param } from '@nestjs/common';
import { IsNumber } from 'class-validator';
import { KYCRepository } from './repositories/kyc.repository';
import { CreateKYCDTO } from './dto/create.dto';
import { KYC } from './entities/kyc.entity';
import { Users } from 'src/modules/user/entities/user.entity';
import { logErrors } from 'src/common/helpers/logging';
import { responseStructure } from 'src/common/helpers/response.structure';
import { Response, query } from 'express';
import { Pagination, paginate } from 'nestjs-typeorm-paginate';

import { VerifyKYCDTO } from './dto/verify.dto';
import { VerificationEnums } from 'src/modules/entities/common.type';

@Injectable()
export class KycService {
  constructor(private kycRepo: KYCRepository) {}

  async create(
    kyc: CreateKYCDTO,
    user: Users,
    @Res() response: Response,
  ): Promise<any> {
    let status = false;
    let statusCode: HttpStatus;
    let message = '';
    let responseData = null;

    try {
      if (await this.findOne(user.id, 'user_id')) {
        message = 'KYC record exists';
        return response
          .status(HttpStatus.BAD_REQUEST)
          .send(responseStructure(status, message, {}, HttpStatus.BAD_REQUEST));
      }
      console.log(kyc);
      kyc['user'] = user.id; //always use the key that is in your entity defination, in this case, it is user and not userId
      kyc['user_id'] = user.id;
      responseData = await this.kycRepo.save(kyc);
      if (responseData !== null) {
        status = true;
        message = 'KYC record created';
        statusCode = HttpStatus.CREATED;
      }
    } catch (e) {
      logErrors(e);
      message = 'there was an error. please try again';
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    }
    return response
      .status(statusCode)
      .send(responseStructure(status, message, responseData, statusCode));
  }

  async findOne(value: any, fieldName: any): Promise<KYC> {
    const data = await this.kycRepo.findOne({
      where: { [`${fieldName}`]: value },
    });
    return data;
  }

  async findPendingKYC(user: Users): Promise<KYC> {
    const data = await this.kycRepo
      .createQueryBuilder('kyc')
      .where('kyc.kyc_verification_status = :status', {
        status: VerificationEnums.pending,
      })
      .andWhere('kyc.user_id = :userId', { userId: user.id })
      .getOne();

    return data;
  }
  async findKYCByUserId(user: Users): Promise<KYC> {
    const data = await this.kycRepo
      .createQueryBuilder('kyc')
      .where('kyc.user_id = :userId', { userId: user.id })
      .getOne();

    return data;
  }

  async index(@Res() response: Response, @Query() query: any): Promise<any> {
    let status = false;
    let error = null;
    let message = '';
    let responseData = null;
    let statusCode: HttpStatus;
    try {
      const qb = await this.kycRepo
        .createQueryBuilder('kyc')
        .leftJoinAndSelect('kyc.user', 'user');
      qb.orderBy('kyc.id', 'DESC');
      const page = query.page && IsNumber(query.page) ? query.page : 1;
      const limit = query.limit && IsNumber(query.limit) ? query.limit : 20;

      responseData = await paginate<KYC>(qb, {
        page,
        limit,
        route: process.env.APP_URL + 'kyc/all',
      });

      if (responseData['items'].length > 0) {
        message = 'Data found';
        status = true;
      }
      statusCode = HttpStatus.OK;
    } catch (e) {
      logErrors(e);
      error = e.message;
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'There was an error';
    }

    return response
      .status(statusCode)
      .send(responseStructure(status, message, responseData, statusCode));
  }

  async show(@Res() response: Response, @Param() params): Promise<any> {
    let status = false;
    let message = '';
    let responseData: object = null;
    let statusCode: HttpStatus;

    try {
      const kycId = params.id;
      responseData = await this.kycRepo.findOne({
        where: { id: kycId },
        relations: { user: true },
      });

      if (responseData) {
        message = 'KYC data found';
        status = true;
      } else message = 'No kyc found';
      statusCode = HttpStatus.OK;
    } catch (e) {
      message = 'there was an error. please try again';
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      logErrors(e.message);
    }

    return response
      .status(statusCode)
      .send(responseStructure(status, message, responseData, statusCode));
  }

  async destroy(@Res() response: Response, @Param() params): Promise<any> {
    let status = false;
    let message = '';
    const responseData = null;
    let statusCode: HttpStatus;
    try {
      const kycId = params.id;
      const kyc = await this.kycRepo.findOneBy({ id: kycId });

      if (kyc) {
        await this.kycRepo.delete({ id: kyc.id });
        message = 'KYC data deleted';
        status = true;
      } else message = 'KYC not found';
      statusCode = HttpStatus.OK;
    } catch (e) {
      message = 'There was an error';
      logErrors(e.message);
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    }

    return response
      .status(statusCode)
      .send(responseStructure(status, message, responseData, statusCode));
  }

  async updateKYCStatus(
    kycDto: VerifyKYCDTO,
    @Res() response: Response,
  ): Promise<any> {
    let status = false;
    let message = '';
    let responseData = null;
    let statusCode: HttpStatus;
    try {
      const kyc = await this.kycRepo.findOneBy({ id: kycDto.kyc_id });

      if (kyc) {
        await this.kycRepo.update(
          { id: kyc.id },
          {
            kyc_verification_status: kycDto.status,
          },
        );
        message = 'KYC status updated to ' + kycDto.status;
        responseData = kyc;
        status = true;
      } else message = 'KYC not found';
      statusCode = HttpStatus.OK;
    } catch (e) {
      message = 'There was an error';
      logErrors(e.message);
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    }

    return response
      .status(statusCode)
      .send(responseStructure(status, message, responseData, statusCode));
  }
}
