import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { Injectable } from '@nestjs/common';

import { UserService } from 'src/modules/user/user.service';


@ValidatorConstraint({ name: 'exists', async: true })
@Injectable()
export class UserIdExistValidator implements ValidatorConstraintInterface {
  constructor(private readonly service: UserService) {
  }

  validate = async (value: any, args: ValidationArguments): Promise<boolean> => {
      // const [entityClass, fieldName] = args.constraints;
      const entity = await this.service.findOne(value)
      return !entity?true:false
  }

  defaultMessage(args: ValidationArguments) {
    const [entityClass, fieldName] = args.constraints;
    return `${fieldName} of  ${args.value} is invalid`;
  }


}