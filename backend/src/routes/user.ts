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
 * @body
 *  @requires
 *  @field userId (number)
 *  @desc id of a User
 */
router.get('/', userExist, userIsAdmin, userControllers.getUsers);

/**
 * Create a new User Record
 * @route POST /user/signup
 * @access Everyone
 *
 * @body
 *  @requires
 *  @field name (string)
 *  @desc User name
 *
 *  @requires
 *  @field email (string)
 *  @desc User email
 *
 *  @requires
 *  @field password (string)
 *  @desc User password
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
 *  @desc User registered email
 *
 *  @required
 *  @field password (string)
 *  @desc User provided password
 */
router.post('/login', userExistByEmail, userControllers.loginWithPassword);

/**
 * Update a user record
 * @route POST /user/update
 * @access Everyone
 *
 * @body
 *  @required
 *  @field userId (int)
 *  @desc User id
 *
 *  @optional
 *  @field email (string)
 *  @desc User new email
 *
 *  @optional
 *  @field name (string)
 *  @desc User new name
 *
 *  @optional
 *  @field rootDirId (int)
 *  @desc id of the root direcotry owned by user
 */
router.post('/update', userExist, userControllers.updateUserById);

/**
 * Delete a user profile
 * @route DELETE /user/:id
 * @access Authenticated ADMIN user
 *
 * @body
 *  @required
 *  @field userId (number)
 *  @desc User id of User who request to delete users
 *
 * @param id (number)
 *  @required
 *  @desc User id to be deleted
 */

router.delete(
  '/:id',
  userExist,
  userIsAdmin,
  userExistParam,
  userControllers.deleteUserById,
);

// router.delete('/:id', userExist, userControllers.deleteUserById);

export default router;
