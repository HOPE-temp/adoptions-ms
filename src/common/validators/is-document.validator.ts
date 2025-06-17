import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsPeruvianDocument(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isPeruvianDocument',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          const dniRegex = /^[0-9]{8}$/;
          const ceRegex = /^[a-zA-Z0-9]{9,12}$/;

          return (
            typeof value === 'string' &&
            (dniRegex.test(value) || ceRegex.test(value))
          );
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid DNI (8 digits) or CE (9–12 alphanumeric characters)`;
        },
      },
    });
  };
}
