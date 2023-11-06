import {
  Controller,
  UseGuards,
  Post,
  Res,
  Body,
  Request as NestRequest,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LoanSettingService } from '../services/loan.settings.service';
import { LoanSettingDTO } from '../dto/loan.setting.dto';

@Controller('loan-setting')
@UseGuards(AuthGuard('jwt'))
export class LoanSettingController {
  constructor(private loanService: LoanSettingService) {}

  @Post('/')
  async create(
    @Body() loan: LoanSettingDTO,
    @Res() res,
    @NestRequest() req,
  ): Promise<any> {
    return await this.loanService.configure(loan, res, req);
  }
}
