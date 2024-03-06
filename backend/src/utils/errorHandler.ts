import { Response } from "express";

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

const errorHandler = {
    /**
     * Thrown when a document with duplicate
     * value on a unique field is inserted
     * @param message Message with error details
     * @return DuplicationError
     */
    DuplicationError: (message: String) => {
        return { name: ERROR.DuplicationError, status: 409, message };
    },
    /**
     * Thrown when a User is not found
     * by using the param on an API route
     * @return UserNotFoundError
     */
    UserNotFoundError: (message: String) => {
        return { name: ERROR.UserNotFoundError, status: 404, message };
    },
    handleError: (error: any, _res: Response) => {
        // To be enriched later
        console.log(error);
    }
};

export default errorHandler;
