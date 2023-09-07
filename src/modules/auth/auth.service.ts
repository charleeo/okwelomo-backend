import { ConflictException, Injectable } from '@nestjs/common';
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

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
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

  public async login(req) {
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
    return { status, error, message, data: responseData };
  }

  public async createUser(user) {
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
        await this.assignRolesDynamically(newUser);
        status = true;
        message = 'User created';
      }
      responseData = newUser;
    } catch (e) {
      error = e.message;
    }
    return { status, error, message, response: responseData };
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

  async assignRolesDynamically(user) {
    const all_duties_object = await this.configService.getDutiessByName(
      ALLDUTIES,
    );
    const all_duties = instanceToPlain(all_duties_object);
    const superAdminRole: Roles = await this.configService.getRolesByName(
      ADMINROLES['super_admin'],
    );
    const actions: number[] = await this.configService.getAllActions();
    user['userId'] = user.id;
    user['roleId'] = superAdminRole.id;
    user['dutyId'] = all_duties.id;
    user['actions'] = actions;
    await this.configService.assignRoleToUser(user);
  }
}
