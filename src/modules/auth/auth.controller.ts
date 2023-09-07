import { Controller, Body, Post, UseGuards, Request, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';



import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginDto } from './dto/login.dto'


@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @UseGuards(AuthGuard('local'))
    @Post('login')
    async login(@Body() user:LoginDto) {
        return await this.authService.login(user);
    }


    @Post('signup')
    async signUp(@Body() user: CreateUserDto) {
        return await this.authService.createUser(user)
    }
}