import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { Injectable } from '@nestjs/common';
import { WarehouseService } from 'src/modules/warehouse/warehouse.service';


@ValidatorConstraint({ name: 'unique', async: true })
@Injectable()
export class UniqueFieldValidator implements ValidatorConstraintInterface {
  constructor(private readonly service: WarehouseService) {
  }

  validate = async (value: any, args: ValidationArguments): Promise<boolean> => {
      // const [entityClass, fieldName] = args.constraints;
      const entity = await this.service.getWarehouseByName(value);
      return !entity;
  }

  defaultMessage(args: ValidationArguments) {
    const [entityClass, fieldName] = args.constraints;
    return `${fieldName}: ${args.value} has already been taken`;
  }
}