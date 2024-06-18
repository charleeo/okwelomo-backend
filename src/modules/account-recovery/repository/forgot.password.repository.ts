import {DataSource, Repository} from 'typeorm';
import {Injectable} from '@nestjs/common';
import { ForgotPassword } from '../entity/forgot.password.entity';


@Injectable()
export class ForgotPasswordRepository extends Repository<ForgotPassword>
{
    constructor(private dataSource: DataSource)
    {
        super(ForgotPassword, dataSource.createEntityManager());
    }
}