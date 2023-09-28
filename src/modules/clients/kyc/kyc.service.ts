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
      //checking for an existing kyc records
      if (await this.findOne(user.id, 'user_id')) {
        message = 'KYC record exists';
        return response
          .status(HttpStatus.BAD_REQUEST)
          .send(responseStructure(status, message, {}, HttpStatus.BAD_REQUEST));
      }
      kyc['user'] = user.id; //always use the key that is in your entity defination, in this case, it is user and not userId
      kyc['user_id'] = user.id;
      responseData = await this.kycRepo.save(kyc);
      if (responseData !== null) {
        status = true;
        message = 'KYC record created';
      }
    } catch (e) {
      logErrors(e);
      error = e.message;
    }
    return response
      .status(HttpStatus.CREATED)
      .send(
        responseStructure(status, message, responseData, HttpStatus.CREATED),
      );
  }

  async findOne(value: any, fieldName: any): Promise<KYC> {
    const data = await this.kycRepo.findOne({
      where: { [`${fieldName}`]: value },
    });
    return data;
  }

  async index(@Res() response: Response, @Query() query: any): Promise<any> {
    let status = false;
    let error = null;
    let message = '';
    let responseData = null;

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
    } catch (e) {
      logErrors(e);
      error = e.message;
    }

    return response
      .status(HttpStatus.CREATED)
      .send(
        responseStructure(status, message, responseData, HttpStatus.CREATED),
      );
  }

  async show(@Res() response: Response, @Param() params): Promise<any> {
    let status = false;
    let message = '';
    let responseData = null;

    try {
      const kycId = params.id;
      responseData = await this.kycRepo.findOne({
        where: { id: kycId },
        relations: {
          user: true,
        },
      });

      if (responseData) {
        message = 'KYC data found';
        status = true;
      } else message = 'No kyc found';
    } catch (e) {
      logErrors(e.message);
    }

    return response
      .status(HttpStatus.CREATED)
      .send(
        responseStructure(status, message, responseData, HttpStatus.CREATED),
      );
  }
}
