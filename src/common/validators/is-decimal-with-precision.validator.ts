import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function IsDecimalWithPrecision(
  maxIntegers: number,
  maxDecimals: number,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isDecimalWithPrecision',
      target: object.constructor,
      propertyName,
      constraints: [maxIntegers, maxDecimals],
      options: validationOptions,
      validator: {
        validate(value: number, args: ValidationArguments) {
          if (typeof value !== 'number') return false;
          const [maxInts, maxDecs] = args.constraints;

          const [ints, decs = ''] = value.toString().split('.');
          return ints.length <= maxInts && decs.length <= maxDecs;
        },
        defaultMessage(args: ValidationArguments) {
          const [maxInts, maxDecs] = args.constraints;
          return `Debe tener como máximo ${maxInts} dígitos enteros y ${maxDecs} decimales`;
        },
      },
    });
  };
}
