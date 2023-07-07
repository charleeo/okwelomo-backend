import { ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { logData } from 'src/common/helpers/logging';
import { instanceToPlain } from 'class-transformer';


@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService
    ) { }
    /**
     * Check if the email provided matches any record in the database
     *  
     * */
    async validateUser(username: string, pass: string) {
        // find if user exist with this email
        let userData = await this.userService.findOneWithRoles(username);
        const user = await this.userService.findOneByEmail(username);
        userData = instanceToPlain(userData)
        let actionarrays :string[]=[]
        if(userData){
            userData.map(userActions=>{actionarrays.push(userActions.tag_line)})
        }
        user['roleDetails'] = userData
        user['actions'] = actionarrays
        if (!user) {
            return null
        }

        // find if user password match
        const match = await this.comparePassword(pass, user.password);
        if (!match) {
            return null;
        }
        delete user["password"]
        return user;
    }

    public async login(user) {
        let status =false
        let error = null
        let message = ""
        let code =200
        let responseData =null
        try {
            user = instanceToPlain(user)//convert it into a plain object
            const token = await this.generateToken(user);
            if(token)
            {
                status=true
                message = "Token generated and login successful"
            }
            responseData = user
            responseData.token = token
        } catch (e) {
            error = e.message
            code=500
        }

         logData(responseData,Request,error??message,code)
         return { status, error,message,response : responseData}
    }

    public async createUser(user) {
        let status =false
        let error = null
        let message = ""
        let responseData =null
        // hash the password
        try {
            const password = await this.hashPassword(user.password)
            
            let newUser = await this.userService.create({...user,password})
             
             delete newUser["password"]
            // generate token
            const token = await this.generateToken(newUser)
            if(newUser){
                status=true
                message="User created"
            }
            responseData=newUser
            responseData.token = token
        } catch (e) {
            error = e.message
        }
        return { 
                status, 
                error,
                message,
                response : responseData
            }
    }

    private async generateToken(user) {
        const token = await this.jwtService.sign(user);
        return token;
    }

    public async verifyToken(token) {
        const valid = await this.jwtService.verify(token);
        return valid;
    }

    private async hashPassword(password) {
        const hash = await bcrypt.hash(password, 10);
        return hash;
    }

    private async comparePassword(enteredPassword, dbPassword) {
        const match = await bcrypt.compare(enteredPassword, dbPassword);
        return match;
    }
}