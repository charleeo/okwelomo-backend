import { Request } from '@nestjs/common';

import { Users } from 'src/modules/user/entities/user.entity';

export class BaseDataSource {
  constructor(public readonly repo?: any) {}

  /**
   * update an  entity depending on the provided conitions
   * @param condition
   * @param col
   * @param object
   */
  public async updateEntity(condition, col: string, object: object) {
    const loan = await this.repo
      .createQueryBuilder()
      .where(`${col} = :key`, { key: condition })
      .update({ ...object })
      .returning('*')
      .updateEntity(true)
      .execute();
    return loan.raw[0];
  }

  /**
   *
   * @param req Get the auth user
   * @returns
   */
  async getUser(@Request() req): Promise<Users> {
    return req.user;
  }
}
