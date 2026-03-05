import { ClassConstructor, plainToClass } from "class-transformer";
import { ValidationError, validate } from "class-validator";

const validationError = async (
  input: any
): Promise<ValidationError[] | false> => {
  const errors = await validate(input, {
    validationError: { target: true },
  });

  if (errors.length) {
    return errors;
  }

  return false;
};

export const RequestValidator = async <T>(
  type: ClassConstructor<T>,
  body: any
): Promise<{ errors: boolean | string; input: T }> => {
  const input = plainToClass(type, body);

  const errors = await validationError(input);
  if (errors) {
    const extractMessages = (errs: ValidationError[]): string[] => {
      return errs.flatMap((err) => {
        if (err.constraints) return Object.values(err.constraints as any);
        if (err.children && err.children.length)
          return extractMessages(err.children as ValidationError[]);
        return [] as string[];
      });
    };

    const messages = extractMessages(errors);
    const errorMessage = messages.join(", ");
    return { errors: errorMessage, input };
  }

  return { errors: false, input };
};