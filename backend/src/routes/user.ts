import express from "express";
import userControllers from "../controllers/user";

const router = express.Router();

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
router.post("/signup", userControllers.signUp);


/**
 * Authenticate a user with email/password
 * @route POST /user/login
 * @access Everyone
 * 
 * @body
 *  @required
 *  @field email (String)
 *  @desc User registered email
 * 
 *  @required
 *  @field password (String)
 *  @desc User provided password
 */
router.post("/login", userControllers.loginWithPassword);

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
 *  @field email (String)
 *  @desc User new email
 * 
 *  @optional
 *  @field name (String)
 *  @desc User new name
 * 
 *  @optional
 *  @field rootDirId (int)
 *  @desc id of the root direcotry owned by user
 */
router.post("/update", userControllers.updateUserById);

/**
 * Delete a user profile
 * @route DELETE /users/delete/:id
 * @access Authenticated user
 */
router.delete("/:id", userControllers.deleteUserById);



export default router;
