/**
 * Routes for User API
 * @pakageDocumentation
 */

import express from 'express';
import { authAccessToken } from '../middlewares/auth';
import {
  userExist,
  userIsAdmin,
  userExistByEmail,
  userExistParam,
} from '../middlewares/user';

import { userControllers } from '../controllers/user';

const router = express.Router();

/**
 * Create all users
 * @route GET /user/
 * @access ADMIN
 *
 * @header
 *  @requires
 *  @field authorization (string)
 *  @description authorization token
 */
router.get(
  '/',
  authAccessToken,
  userExist,
  userIsAdmin,
  userControllers.getUsers,
);

/**
 * Create a new User Record
 * @route POST /user/signup
 * @access Everyone
 *
 * @body
 *  @requires
 *  @field name (string)
 *  @description User name
 *
 *  @requires
 *  @field email (string)
 *  @description User email
 *
 *  @requires
 *  @field password (string)
 *  @description User password
 *  * Password must:
 *  * contain at least an uppercase letter
 *  * contain at least an lowercase letter
 *  * contain at least a special character
 *  * contain at least a number
 *  * be at least 8 characters length
 */
router.post('/signup', userControllers.signUp);

/**
 * Authenticate a user with email/password
 * @route POST /user/login
 * @access Everyone
 *
 * @body
 *  @required
 *  @field email (string)
 *  @description User registered email
 *
 *  @required
 *  @field password (string)
 *  @description User provided password
 */

router.post('/login', userExistByEmail, userControllers.loginWithPassword);

/**
 * Update a user record
 * @route POST /user/update
 * @access Everyone
 *
 * @header
 *  @required
 *  @field Authorization
 *  @description Bearer token
 *
 * @body
 *  @required
 *  @field userId (int)
 *  @description User id
 *
 *  @optional
 *  @field email (string)
 *  @description User new email
 *
 *  @optional
 *  @field name (string)
 *  @description User new name
 *
 *  @optional
 *  @field rootDirId (int)
 *  @description id of the root direcotry owned by user
 */
router.post(
  '/update',
  authAccessToken,
  userExist,
  userControllers.updateUserById,
);

/**
 * Delete a user profile
 * @route DELETE /user/:id
 * @access Authenticated ADMIN user
 *
 * @header
 *  @required
 *  @field Authorization
 *  @description Bearer token
 *
 * @body
 *  @required
 *  @field userId (number)
 *  @description User id of User who request to delete users
 *
 * @param id (number)
 *  @required
 *  @description User id to be deleted
 */

router.delete(
  '/:id',
  authAccessToken,
  userExist, //check whom request
  userIsAdmin,
  userExistParam, //check who's being deleted
  userControllers.deleteUserById,
);

// router.delete('/:id', userExist, userControllers.deleteUserById);

export default router;
