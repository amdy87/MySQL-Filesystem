import errorHandler from "./errorHandler";

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

export const PORT = env.port || 4000;
// export const userRole Role