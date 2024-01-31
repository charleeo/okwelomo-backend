import {  Request } from '@nestjs/common';
import { IsNumber } from 'class-validator';
import { paginate } from 'nestjs-typeorm-paginate';
import { Users } from 'src/modules/user/entities/user.entity';
import { FileUploadService } from 'src/modules/config/services/file.upload.service';
import { SelectQueryBuilder } from 'typeorm';

export class BaseDataSource extends FileUploadService {
  constructor(public readonly repo?: any) {
    console.log(repo)
    super();
  }

  /**
   * update an  entity depending on the provided conitions
   * @param condition
   * @param col
   * @param object
   */
  public async updateEntity(condition, col: string, object: object) {

    const entity = await this.repo
      .createQueryBuilder()
      .where(`${col} = :key`, { key: condition })
      .update({ ...object })
      .returning('*')
      .updateEntity(true)
      .execute();
    return entity.raw[0];
  }

  /**
   *
   * @param req Get the auth user
   * @returns
   */
  async getUser(@Request() req): Promise<Users> {
    return req.user;
  }

 async paginate<T>(qb: SelectQueryBuilder<any>, query: any,route?:string): Promise<any> {
    
    const pageQuery = query.page;
    const limit = query.per_page;

    const page =
      pageQuery && IsNumber(pageQuery) && pageQuery > 0 ? pageQuery : 1;
    const per_page = limit && IsNumber(limit) && limit > 0 ? limit : 20;

    return  await paginate<T>(qb, {
      page,
      limit: per_page,
      route
    });
   
  }
  
}
