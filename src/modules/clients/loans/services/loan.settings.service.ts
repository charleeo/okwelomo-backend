import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { responseStructure } from 'src/common/helpers/response.structure';
import { LoanRepaymentDurationCategoryRepository } from 'src/modules/config/repository/loan.repayment.duration.category.repository';
import { LoanTypeRepository } from 'src/modules/config/repository/loan.type.repository';
import { ConfigHelperService } from 'src/modules/config/services/helpers.config';

import { HttpStatus, Injectable, Param, Request, Res } from '@nestjs/common';

import { LoanSettingDTO } from '../dto/loan.setting.dto';
import { LoanSettingVerifyPasswordDTO } from '../dto/loan.setting.verify-password.dto';
import { LoanSetting } from '../entities/loan.settings.entity';
import { LoanSettingRepository } from '../repositories/loan.setting.repository';

@Injectable()
export class LoanSettingService extends ConfigHelperService {
  constructor(
    private loanSettingRepo: LoanSettingRepository,
    private readonly loanRepaymentDurationRepo: LoanRepaymentDurationCategoryRepository,
    private readonly loanTypeRepo: LoanTypeRepository,
  ) {
    super();
  }

  async configure(
    dto: LoanSettingDTO,
    @Res() response: Response,
    @Request() req: Request,
  ): Promise<any> {
    let status = false;
    let statusCode: HttpStatus;
    let message = '';
    let responseData = null;
    const user = await this.getUser(req);
    const config = await this.findOne(user.id);
    if (config) {
      responseData = await this.update(req, dto);
      message = 'Configuration updated';
    } else {
      responseData = await this.create(req, dto);
      message = 'Configuration created';
    }
    statusCode = HttpStatus.CREATED;
    status = true;
    return response
      .status(statusCode)
      .send(responseStructure(status, message, responseData, statusCode));
  }

  /**
   *create a new record if no configuration exists for this user
   * @param req Request
   * @param dto LoanSettingDTO
   * @returns LoanSetting
   */
  async create(req: Request, dto: LoanSettingDTO): Promise<LoanSetting> {
    const user = await this.getUser(req);

    const config = await this.loanSettingRepo.save({
      application_password: await bcrypt.hash(dto.password, 10),
      default_loan_type: dto.default_loan_type,
      receiving_account: dto.receiving_account,
      receiving_bank: dto.receiving_bank,
      client_id: user.id,
    });
    return config;
  }

  /**
   *
   * @param client_id
   * @returns @LoanSetting
   */
  async findOne(client_id): Promise<LoanSetting> {
    return await this.loanSettingRepo.findOne({
      where: { client_id },
    });
  }

  /*
   *
   *create a new record if no configuration exists for this user
   * @param req Request
   * @param dto LoanSettingDTO
   * @returns LoanSetting
   */
  async update(req: Request, dto: LoanSettingDTO): Promise<LoanSetting> {
    const user = await this.getUser(req);

    await this.loanSettingRepo.update(
      { client_id: user.id },
      {
        application_password: await bcrypt.hash(dto.password, 10),
        default_loan_type: dto.default_loan_type,
        receiving_account: dto.receiving_account,
        receiving_bank: dto.receiving_bank,
      },
    );
    return await this.findOne(user.id);
  }

  async getRepaymentDurationCategoriesById(id) {
    return await this.loanRepaymentDurationRepo.findOneOrFail({
      where: { id },
    });
  }

  async getLoanTypeById(key: string | number|any) {
    return await this.loanTypeRepo
      .createQueryBuilder()
      .where('id = :loanId', { loanId: key })
      .getOneOrFail();
  }

  async show(@Res() response: Response, @Param() params): Promise<any> {
    let status = false;
    let message = '';
    let responseData: object = null;
    let statusCode: HttpStatus;

    const configId = params.id;
    responseData = await this.findOne(configId);

    if (responseData) {
      message = 'Data found';
      status = true;
    } else message = 'No data found';
    statusCode = HttpStatus.OK;

    return response
      .status(statusCode)
      .send(responseStructure(status, message, responseData, statusCode));
  }

  async verifyPassword(
    @Res() response: Response,
    @Param() params,
    dto: LoanSettingVerifyPasswordDTO,
  ): Promise<any> {
    let status = false;
    let message = '';
    const responseData: object = null;
    let statusCode: HttpStatus;

    const configId = params.id;
    const config: LoanSetting = await this.findOne(configId);

    const match = await bcrypt.compare(
      dto.password,
      config.application_password,
    );
    if (match) {
      message = 'Application password matched';
      status = true;
      statusCode = HttpStatus.OK;
    } else {
      message = 'Wrong application password';
      statusCode = HttpStatus.BAD_REQUEST;
    }

    return response
      .status(statusCode)
      .send(responseStructure(status, message, responseData, statusCode));
  }
}
