import errorHandler from "./errorHandler";
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Get environment variables
const env = process.env;


// // ENUMS
export enum Role {
    USER = "USER",
    ADMIN = "ADMIN"
}

// export validate: function (value) {
//     try {
//       if (!/[A-Z]+/.test(value)) {
//         throw "Password requires at least an uppercase letter.";
//       }
//       if (!/[a-z]+/.test(value)) {
//         throw "Password requires at least a lowercase letter.";
//       }
//       if (!/[0-9]+/.test(value)) {
//         throw "Password requires at least a number.";
//       }
//       if (!/[~`!@#\$%\^&\*\(\)_\-\+={}\[\]\|\\:;"'<,>\.\?\/]+/.test(value)) {
//         throw "Password requires at least a special character.";
//       }
//       if (value.length < USER.PasswordLength) {
//         throw `Password requires at least ${USER.PasswordLength} characters.`;
//       }
//     } catch (message) {
//       throw errorHandler.ValidationError(message);
//     }
//     return true;
// },

export const PORT = env.port || 3000;
export const WEB_DOMAIN = env.WEB_DOMAIN;
// export const userRole Role