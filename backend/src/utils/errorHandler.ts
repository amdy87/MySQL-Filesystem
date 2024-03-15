import { Response } from 'express';

// Error enum
const ERROR = {
  ValidationError: 'ValidationError',
  InvalidParamError: 'InvalidParamError',
  UnauthorizedError: 'UnauthorizedError',
  ForbiddenError: 'ForbiddenError',
  UserNotFoundError: 'UserNotFoundError',
  InvalidOperationError: 'InvalidOperationError',
  DuplicationError: 'DuplicationError',
};

export interface Error {
  name: string;
  status: number;
  message: string;
  param?: string;
}

export const errorHandler = {
  /**
   * Custom error with the same
   * name as mySQL ValidationError
   * Thrown when input field is invalid
   * @param message with error details
   * @return ValidationError
   */
  ValidationError: (message: string) => {
    return { name: ERROR.ValidationError, status: 400, message };
  },

  /**
   * Thrown when input parameter is invalid
   * @return InvalidParamError
   */
  InvalidParamError: (param: string) => {
    const message: string = `${param} is invalid or missing in the body`;
    return { name: ERROR.InvalidParamError, status: 400, message };
  },
  /**
   * Thrown when a document with duplicate
   * value on a unique field is inserted
   * @param message Message with error details
   * @return DuplicationError
   */
  DuplicationError: (message: string) => {
    return { name: ERROR.DuplicationError, status: 409, message };
  },

  /**
   * Thrown when a request is unauthorized
   * @param message Message with error details
   * @return ForbiddenError
   */
  ForbiddenError: (message: string) => {
    return { name: ERROR.ForbiddenError, status: 403, message };
  },

  /**
   * Thrown when a User is not found
   * by using the param on an API route
   * @param message Message with error details
   * @return UserNotFoundError
   */
  UserNotFoundError: (message: string) => {
    return { name: ERROR.UserNotFoundError, status: 404, message };
  },

  /**
   * Thrown when a authorization fail
   * by using the param on an API route
   * @param message Message with error details
   * @return UnauthorizedError
   */
  UnauthorizedError: (message: string) => {
    return { name: ERROR.UnauthorizedError, status: 401, message };
  },

  handleError: (error: Error, res: Response) => {
    if (Object.values(ERROR).includes(error.name)) {
      res.status(error.status);
      res.send(error.message);
    } else {
      res.status(500);
      res.send({ unknownError: error });
    }
  },
};
