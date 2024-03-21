import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport';
import { UserService } from 'src/modules/user/services/user.service'
import { AuthService } from '../../auth.service'

@Controller('social')
export class SocialController {
    constructor(private userService:UserService, private authService:AuthService){}
  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth() {}

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req, @Res() res) {
     let user = req.user
     this.userService.createOrUpdate(user)
     delete user.token
     res.redirect(`http://localhost:4500/social/login?email=${user.email}`)
  }

  @Post('login')
  async login( @Body() user: any, @Res() res: Response) {
    return await this.authService.login(user, res)
  }

}
