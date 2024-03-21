import { Injectable } from '@nestjs/common';
import { BaseDataSource } from 'src/common/helpers/base.data.ource';

@Injectable()
export class AdminService extends BaseDataSource{
    constructor(){
        super()
    }

    /**
     * Create a user with a default admin role responsibilities
     * 
     */
    createUsers()
    {

    }
}
