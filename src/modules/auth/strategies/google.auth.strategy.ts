import { Strategy } from 'passport-google-oauth20';

  import {
    Injectable,
  } from '@nestjs/common';
  import { PassportStrategy } from '@nestjs/passport';
  
  
  @Injectable()
  export class GoogleStrategy extends PassportStrategy(Strategy,'google') {
      constructor() {
      super({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: 'http://127.0.0.1:4551/api/v1/social/google/redirect',
        scope: ['email', 'profile'],
      });
    }
  
    async validate (accessToken: string, refreshToken: string, profile: any): Promise<any> {
      const { name, emails, photos } = profile
      const user = {
        email: emails[0].value,
        firstname: name.givenName,
        lastname: name.familyName,
        profile_picture: photos[0].value,
        token:accessToken,
        refresh_token:refreshToken
      }        
        return user;
    }
  }
  