
import { Request, Response } from "supertest";
import { Prisma } from "@prisma/client";

// Error enum
const ERROR = {
    ValidationError: "ValidationError",
    InvalidParamError: "InvalidParamError",
    UnauthorizedError: "UnauthorizedError",
    ForbiddenError: "ForbiddenError",
    UserNotFoundError: "UserNotFoundError",
    InvalidOperationError: "InvalidOperationError",
    DuplicationError: "DuplicationError",
  };

const errorHandler: any = {};


/**
 * Thrown when a document with duplicate
 * value on a unique field is inserted
 * @param message Message with error details
 * @return DuplicationError
 */
errorHandler.DuplicationError = (message: String) => {
    return { name: ERROR.DuplicationError, status: 409, message };
  };


/**
 * Thrown when a User is not found
 * by using the param on an API route
 * @return UserNotFoundError
 */
errorHandler.UserNotFoundError = (message: String) => {
    return { name: ERROR.UserNotFoundError, status: 404, message };
  };


errorHandler.handleError = ( error: any, res: Response) => {
    // To be enriched later
    console.log(error);
}


export default errorHandler;