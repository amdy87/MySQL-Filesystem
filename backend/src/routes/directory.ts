/**
 * Routes for Directory API
 * @fileoverview
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

/**
 * Update a file
 * @route POST /file/update
 * @access Owner of the file
 *
 * @body
 *  @requires
 *  @field fileId (number)
 *  @description fileId of the User who creates this file
 *
 *  @optional
 *  @field name (string)
 *  @description name of the file
 *
 *  @optional
 *  @field path (string)
 *  @description absolute path of the file
 *
 *  @optional
 *  @field parentId (number)
 *  @description directoryId of the parent directory
 *
 *  @optional
 *  @field content (string)
 *  @description content written in this file
 *
 */

//  TODO: add authToken after frontend setup token storage
router.post('/update', directoryControllers.updateDirById);

export default router;
