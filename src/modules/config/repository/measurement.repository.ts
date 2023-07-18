import {DataSource, Repository} from 'typeorm';
import {Injectable} from '@nestjs/common';
import { Measurement } from '../entities/measurement.entity';


@Injectable()
export class MeasurementRepository extends Repository<Measurement>
{
    constructor(private dataSource: DataSource)
    {
        super(Measurement, dataSource.createEntityManager());
    }
}