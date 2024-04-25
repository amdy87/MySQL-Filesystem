/**
 * Load and setup constants used in backend
 * @fileoverview
 */

import dotenv from 'dotenv';
import { Response } from 'express';

import { errorHandler } from './errorHandler';

// Load environment variables from .env file
dotenv.config();

// Get environment variables
const env = process.env;

// ENUMS
export enum Role {
  USER,
  ADMIN,
}

export const TOKEN = {
  Refresh: {
    name: 'RefreshToken',
    limit: '15d',
  },
  Access: {
    limit: '2d',
  },
};

export const JWT_SECRET = env.JWT_SECRET;
export const PORT = 8080;
export const DATABASE_URL = env.DATABASE_URL || 'default_value';
export const BACKEND_DOMAIN = env.BACKEND_DOMAIN;
export const PASSWORD_LENGTH = env.PASSWORD_LENGTH || '8';

// Check that the password is at least 8 characters long
// with at least 1 uppercase letter, 1 lowercase letter,
// and a digit
export function validatePassword(value: string): boolean {
  return (
    value.length >= parseInt(PASSWORD_LENGTH) &&
    /(?=.*[A-Z]+)(?=.*[a-z]+)(?=.*\d+)/.test(value)
  );
}

// Check that the email is valid
export function validateEmail(value: string): boolean {
  return value.length >= 5 && /(?=.*.+@.+\..+)/.test(value);
}
