import dotenv from 'dotenv';
import { Response } from 'express';

import { errorHandler } from './errorHandler';


// Load environment variables from .env file
dotenv.config();

// Get environment variables
const env = process.env;

// // ENUMS
export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export const JWT_SECRET = env.port;
export const PORT = env.port || 3000;
export const BACKEND_DOMAIN = env.BACKEND_DOMAIN;
export const PASSWORD_LENGTH = env.PASSWORD_LENGTH || "8";

export function validatePassword(value: string, res: Response): boolean {
  try {
    if (!/[A-Z]+/.test(value)) {
      throw "Password requires at least an uppercase letter.";
    }
    if (!/[a-z]+/.test(value)) {
      throw "Password requires at least a lowercase letter.";
    }
    if (!/[0-9]+/.test(value)) {
      throw "Password requires at least a number.";
    }
    if (!/[~`!@#\$%\^&\*\(\)_\-\+={}\[\]\|\\:;"'<,>\.\?\/]+/.test(value)) {
      throw "Password requires at least a special character.";
    }
    if (value.length < parseInt(PASSWORD_LENGTH)) {
      throw `Password requires at least ${PASSWORD_LENGTH} characters.`;
    }
  } catch (error: any) {
    errorHandler.handleError(error, res);
  }
  return true;
}
