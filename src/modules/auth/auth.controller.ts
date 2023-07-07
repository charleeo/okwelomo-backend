import { Controller, Body, Post, UseGuards, Request, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';



import { CreateUserDto } from '../user/dto/create-user.dto';


@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @UseGuards(AuthGuard('local'))
    @Post('login')
    async login(@Request() req) {
        return await this.authService.login(req.user);
    }


    @Post('signup')
    async signUp(@Body() user: CreateUserDto) {
        return await this.authService.createUser(user);
    }
}