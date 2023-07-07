import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { Injectable } from '@nestjs/common';
import { WarehouseCategoryRepository } from 'src/modules/config/repository/warehouse.category.repository';


@ValidatorConstraint({ name: 'exists', async: true })
@Injectable()
export class ColumnExistValidator implements ValidatorConstraintInterface {
  constructor(private readonly repo: WarehouseCategoryRepository) {
  }

  validate = async (value: any, args: ValidationArguments): Promise<boolean> => {
      // const [entityClass, fieldName] = args.constraints;
      const entity = await this.repo.findOneBy({id:value})
      return entity?true:false
  }

  defaultMessage(args: ValidationArguments) {
    const [entityClass, fieldName] = args.constraints;
    return `${fieldName} of  ${args.value} is invalid`;
  }


}