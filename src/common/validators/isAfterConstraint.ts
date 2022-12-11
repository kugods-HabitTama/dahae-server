import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';

@ValidatorConstraint({ name: 'isAfter', async: false })
@Injectable()
export class IsAfterConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments): boolean {
    const fieldName = args.constraints[0];

    if (fieldName) return value >= args.object[fieldName];
    else return value >= new Date().toJSON().slice(0, 10);
  }

  defaultMessage(args: ValidationArguments): string {
    const data = args.constraints.length
      ? args.constraints[0]
      : new Date().toJSON().slice(0, 10);
    return `"${args.property}" must be after "${data}"`;
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
