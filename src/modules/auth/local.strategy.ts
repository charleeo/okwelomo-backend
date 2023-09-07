import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException,BadRequestException,HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { responseStructure } from 'src/common/helpers/response.structure';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private  authService: AuthService) {
        super({
            usernameField: 'email',
            passwordField: 'password',
          })
    }

    async validate(email: string, password: string): Promise<any>{
        const user = await this.authService.validateUser(email, password);

        if (!user) {
            const message:string ="Invalid credentials supplied"
            throw new BadRequestException( responseStructure(false,message,{},HttpStatus.BAD_REQUEST))
        }
        return user;
    }
}