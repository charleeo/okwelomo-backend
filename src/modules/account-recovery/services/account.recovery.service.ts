import { responseStructure } from 'src/common/helpers/response.structure';
import * as bcrypt from 'bcrypt';

import {
  HttpStatus,
  Injectable,
} from '@nestjs/common';

import { MailService } from '../../mails/mails.service';
import { UserService } from 'src/modules/user/services/user.service';
import { instanceToPlain } from 'class-transformer';
import { ForgotPasswordRepository } from '../repository/forgot.password.repository';
import { addHours, generatePasswordResetCode, isCurrentTimeGreaterThan } from 'src/common/helpers/generals';
import { ForgotPassword } from '../entity/forgot.password.entity';
import { UpdateUserDto } from 'src/modules/user/dto/update-user.dto';
import { UserRepository } from 'src/modules/user/user.repository';

@Injectable()
export class AccountRecoveryService {
  constructor(
    private readonly mailService: MailService,
    private readonly userService: UserService,
    private readonly forgotPasswordRepo: ForgotPasswordRepository,
    private readonly userRepo: UserRepository,
  ) {}
 
  public async sendForgotPasswordEmail(user:any, res) {
    let status: boolean =false
    let message = ''
    let code = 200
    
    const userObject = instanceToPlain( await this.userService.findOneByEmail(user.email))

    if(!userObject){
      message = 'No record found this account'
      return res
      .status(code)
      .send(responseStructure(status, message, null, code))
    }
    const { token} = await this.createToken(userObject)
   
    const context ={
      resetLink:`${process.env.FRONTEND_URL}/reset/password?token=${token}`,
       name:userObject?.name ?? userObject.email,
    }

    let mailResponse = await this.mailService.sendTemplateMail(userObject?.email, "Reset Password", 'forgot-password', context, 'dollars.png')
    
    if(mailResponse?.accepted?.length && !mailResponse?.rejected?.length){
      message = 'Mail sent'
      status = true
    }
    return res
      .status(code)
      .send(responseStructure(status, message, mailResponse, code))
  }

  public async createToken(req:any): Promise<Partial<ForgotPassword>>{
    const expiration : any = process.env.RESET_PASSWORD_TOKEN_EXPIRATION
    await this.forgotPasswordRepo.upsert({
      email: req.email,
      token: generatePasswordResetCode(),
      token_expiration: addHours(expiration),
      is_expired:false
    }, ['email'])
    const details = await this.forgotPasswordRepo.findOneBy({email: req.email})
    return details
  }

  public async resetPasswordRedirection(token: any, res)
  {
    let status: boolean =false
    let message = ''
    let code = 200
     const tokenData = await this.forgotPasswordRepo.findOneBy({token})
     
     if(!tokenData || tokenData?.is_expired || isCurrentTimeGreaterThan(tokenData.token_expiration)){
      message = 'No record found this account or token has expired'
      return res
      .status(code)
      .send(responseStructure(status, message, null, code))
     }
     
    status = true
    return res
      .status(code)
      .send(responseStructure(status, message, tokenData, code))
  }

  public async resetPassword(req: any, res)
  {
      let status: boolean =false
      let message = ''
      let code = 200
      const tokenData = await this.forgotPasswordRepo.findOneBy({token: req.token})
      
      if(!tokenData ){
        message = 'No record found this account '
        return res
        .status(code)
        .send(responseStructure(status, message, null, code))
      }
      
      if(isCurrentTimeGreaterThan(tokenData.token_expiration)){
        message = 'Token has expired '
        code = 400
        return res
        .status(code)
        .send(responseStructure(status, message, null, code))
      }

      const userData = await this.userService.findOneByEmail(tokenData.email)
      const hashedPassword = await bcrypt.hash(req.password, 10)
      const updated = await this.userRepo.update(userData.id, {password: hashedPassword})
      if(updated){
        await this.forgotPasswordRepo.update(tokenData.id, {is_expired: true})
        status = true
        message = 'Password reset'
      }
      return res
      .status(code)
      .send(responseStructure(status, message, userData, code))
  }
}
