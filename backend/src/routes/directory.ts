/**
 * Routes for Directory API
 * @pakageDocumentation
 */

import express from 'express';
import { directoryControllers } from '../controllers/directory';

const router = express.Router();

/**
 * Create a directory owned by a user
 * @route POST /dir/addDirectory
 * @access Any User
 *
 * @body
 *  @requires
 *  @field isRoot (bool)
 *  @description whether this is a root directory
 *
 *  @requires
 *  @field ownerId (int)
 *  @description userId of the User who creates this directory
 *
 *  @requires
 *  @field name (string)
 *  @description name the directory
 *
 *  @requires
 *  @field path (string)
 *  @description absolute path of the directory
 *
 *  @requires
 *  @field parentId (int)
 *  @description directoryId of the parent directory
 *        None if this is the root dir
 *
 */

router.post('/add', directoryControllers.addDirectory);

/**
 * Get a list of all directories owned by a user
 * @route GET
 * @access Any User
 *
 * @body
 *  @requires
 *  @field userId (int)
 */

router.get('/', directoryControllers.getDirectories);

export default router;
