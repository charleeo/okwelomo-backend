import { Body, Controller, Post, Query, Res } from '@nestjs/common';
import { AccountRecoveryService } from './services/account.recovery.service';
import { ForgotPasswordlDto } from './dto/forgot.password.dto';
import { UpdateUserDto } from '../user/dto/update-user.dto';
import { ForgotPasswordRedirectionDto } from './dto/forgot.password.redirection.dto';


@Controller('account-recovery')
export class AccountRecoveryController {
    constructor(private accountRecoveryService: AccountRecoveryService) {}

    @Post('send_forgot/password/email')
    async sendForgotPasswordEmail(@Body() receipient: ForgotPasswordlDto, @Res() res: Response) {
        return await this.accountRecoveryService.sendForgotPasswordEmail(receipient, res);
      }

    @Post('reset/password/redirection')
    async resetPasswordRedirect(@Query('token') token: string, @Res() res: Response) {
        return await this.accountRecoveryService.resetPasswordRedirection(token, res);
      }

    @Post('reset/password')
    async resetPassword(@Body() receipient: UpdateUserDto, @Res() res: Response) {
        return await this.accountRecoveryService.resetPassword(receipient, res);
      }
}
