import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { formatToKSTDate } from '../../utils/date';

@ValidatorConstraint({ name: 'isAfter', async: false })
@Injectable()
export class IsAfterConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments): boolean {
    const fieldName = args.constraints[0];

    const targetDate = fieldName
      ? new Date(args.object[fieldName])
      : formatToKSTDate(new Date());

    // targetDate가 유효하지 않은 경우는 무조건 true
    if (targetDate.toString() === 'Invalid Date') {
      return true;
    }

    return value.toJSON().slice(0, 10) >= targetDate.toJSON().slice(0, 10);
  }

  defaultMessage(args: ValidationArguments): string {
    const data = args.constraints.length
      ? args.constraints[0]
      : formatToKSTDate(new Date()).toJSON().slice(0, 10);
    return `${args.property} must be after ${data}`;
  }
}

export function IsAfter(
  targetField?: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: targetField ? [targetField] : [],
      validator: IsAfterConstraint,
    });
  };
}
