import { ConflictException, Injectable, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { logData } from 'src/common/helpers/logging';
import { instanceToPlain } from 'class-transformer';
import { ConfigService } from '../config/config.service';
import { ADMINROLES, ALLDUTIES } from 'src/config/constants';
import { LoginDto } from './dto/login.dto';
import { Roles } from '../config/entities/roles.entity';
import { Action } from 'rxjs/internal/scheduler/Action';
import { Actions } from '../config/entities/actions.entity';
import { responseStructure } from 'src/common/helpers/response.structure';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  /**
   * Check if the email provided matches any record in the database
   *
   * */
  async validateUser(username: string, pass: string) {
    // find if user exist with this email
    let userData = await this.userService.findOneWithRoles(username);
    const user = await this.userService.findOneByEmail(username);
    userData = instanceToPlain(userData);
    const actionarrays: string[] = [];
    if (userData) {
      userData.map((userActions) => {
        actionarrays.push(userActions.tag_line);
      });
    }
    if (!user) {
      return null;
    }

    // find if user password match
    const match = await this.comparePassword(pass, user.password);
    if (!match) {
      return null;
    }
    user['roleDetails'] = userData;
    user['actions'] = actionarrays;
    delete user['password'];
    return user;
  }

  public async login(req, res) {
    let status: boolean;
    let error: string | null;
    let message = '';
    let code = 200;
    let responseData = null;
    try {
      // user = instanceToPlain(user)//convert it into a plain object
      const user = await this.userService.findOneByEmail(req.email);
      const token = await this.generateToken(instanceToPlain(user));
      if (token) {
        status = true;
        message = 'Token generated and login successful';
        code = 200;
      }
      responseData = user;
      responseData.token = token;
    } catch (e) {
      error = e.message;
      code = 500;
      message = 'There was an error. Please retry';
    }

    logData(responseData, Request, error ?? message, code);
    return res
      .status(HttpStatus.OK)
      .send(responseStructure(status, message, responseData, HttpStatus.OK));
  }

  public async createUser(user, res) {
    let status = false;
    let error = null;
    let message = '';
    let responseData = null;
    // hash the password
    try {
      const password = await this.hashPassword(user.password);

      const newUser = await this.userService.create({ ...user, password });

      delete newUser['password'];
      // generate token

      if (newUser) {
        status = true;
        message = 'User created';
      }
      responseData = newUser;
    } catch (e) {
      error = e.message;
    }
    return res
      .status(HttpStatus.CREATED)
      .send(
        responseStructure(status, message, responseData, HttpStatus.CREATED),
      );
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
    return await bcrypt.hash(password, 10);
  }

  private async comparePassword(enteredPassword, dbPassword) {
    const match = await bcrypt.compare(enteredPassword, dbPassword);
    return match;
  }
}
