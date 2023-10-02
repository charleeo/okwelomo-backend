import {
  Body,
  Controller,
  Post,
  Request as NestRequest,
  UseGuards,
  Res,
  Get,
  Query,
  Param,
  Delete,
} from '@nestjs/common';
import { Response } from 'express';
import { CreateKYCDTO } from './dto/create.dto';
import { KycService } from './kyc.service';
import { KYC } from './entities/kyc.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('kyc')
@UseGuards(AuthGuard('jwt'))
export class KycController {
  constructor(private kcyService: KycService) {}

  @Post('create')
  async create(
    @Body() kyc: CreateKYCDTO,
    @NestRequest() req,
    @Res() res: Response,
  ): Promise<any> {
    const user = req.user;
    return await this.kcyService.create(kyc, user, res);
  }

  @Get('all')
  async index(@Res() res: Response, @Query() query: any): Promise<any> {
    console.log('here');
    return await this.kcyService.index(res, query);
  }

  @Get(':id')
  async show(@Res() res: Response, @Param() param: any): Promise<any> {
    return await this.kcyService.show(res, param);
  }

  @Delete(':id')
  async delete(@Res() res: Response, @Param() param: any): Promise<KYC> {
    return await this.kcyService.destroy(res, param);
  }
}
