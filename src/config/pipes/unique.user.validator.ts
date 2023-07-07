import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { Injectable } from '@nestjs/common';
import { UserService } from 'src/modules/user/user.service';


@ValidatorConstraint({ name: 'uniqueEmail', async: true })
@Injectable()
export class UniqueEmailValidator implements ValidatorConstraintInterface {
  constructor(private readonly service: UserService) {
  }

  validate = async (value: any, args: ValidationArguments): Promise<boolean> => {
      // const [entityClass, fieldName] = args.constraints;
      const entity = await this.service.findOneByEmail(value);
      return !entity;
  }

  defaultMessage(args: ValidationArguments) {
    const [entityClass, fieldName] = args.constraints;
    return `${fieldName}: ${args.value} has already been taken`;
  }
}