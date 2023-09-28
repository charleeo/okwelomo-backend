import {
  Body,
  Controller,
  Post,
  Request as NestRequest,
  UseGuards,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { CreateKYCDTO } from './dto/create.dto';
import { KycService } from './kyc.service';
import { KYC } from './entities/kyc.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('kyc')
export class KycController {
  constructor(private kcyService: KycService) {}

  @Post('create')
  @UseGuards(AuthGuard('jwt'))
  async create(
    @Body() kyc: CreateKYCDTO,
    @NestRequest() req,
    @Res() res: Response,
  ): Promise<any> {
    const user = req.user;
    return await this.kcyService.create(kyc, user, res);
  }
}
