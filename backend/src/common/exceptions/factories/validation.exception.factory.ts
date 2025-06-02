import { BadRequestException, HttpStatus, ValidationError } from '@nestjs/common';

const formatValidationErrors = (errors: ValidationError[]): string[] => {
  const formattedErrors: string[] = [];

  errors.forEach((error) => {
    if (error.constraints) {
      formattedErrors.push(...Object.values(error.constraints));
    }
    if (error.children?.length) {
      formattedErrors.push(...formatValidationErrors(error.children));
    }
  });
  return formattedErrors;
};

export const validationExceptionFactory = (errors: ValidationError[]) => {
  const formattedErrors: string[] = formatValidationErrors(errors);

  return new BadRequestException({
    statusCode: HttpStatus.BAD_REQUEST,
    message: formattedErrors[0] || 'Validation failed',
    error: formattedErrors,
  });
};
