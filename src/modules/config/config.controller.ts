import { Controller, Get ,Post,Body} from '@nestjs/common';
import { ConfigService } from './config.service';
import { ActionDto, DutyDto, RoleDto, UserRoleDto } from './dto/config.dto';
import { Request } from 'express';
import { UserRoles } from './entities/user.role.entity';

@Controller('config')
export class ConfigController {
    constructor(private readonly configService:ConfigService){}

    @Get()
     async create():Promise<any> {
        return this.configService.create()
    }

    @Post("create/user/roles")
     async assignRoleToUser(@Body() user: UserRoleDto):Promise<UserRoles> {
        
        return await this.configService.assignRoleToUser(user)
    }
}
