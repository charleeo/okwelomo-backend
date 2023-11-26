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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { extname } from 'path';
import { diskStorage } from 'multer';
import { Response } from 'express';
import { CreateKYCDTO } from './dto/create.dto';
import { KycService } from './kyc.service';
import { KYC } from './entities/kyc.entity';
import { AuthGuard } from '@nestjs/passport';
import { VerifyKYCDTO } from './dto/verify.dto';
import { FileInterceptor } from '@nestjs/platform-express';

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

  @Post('update/status')
  async updateKYCStatus(
    @Body() kyc: VerifyKYCDTO,
    @Res() res: Response,
  ): Promise<any> {
    return await this.kcyService.updateKYCStatus(kyc, res);
  }

  @Get('all')
  async index(@Res() res: Response, @Query() query: any): Promise<any> {
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

  @Post('/file')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './src/public/uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
    }),
  )
  handleUpload(@UploadedFile() file: Express.Multer.File) {
    console.log('file', file);
    return 'File upload API';
  }
}
