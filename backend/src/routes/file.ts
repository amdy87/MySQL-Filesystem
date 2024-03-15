import express, { Request, Response } from 'express';

import { fileController } from '../controllers/file';

export const fileRouter = express.Router();

// ADD AUTH MIDDLEWARE after token is setup
/**
 * Get a list of all files owned by a user
 * @route GET
 * @access Any User
 *
 * @body
 *  @requires
 *  @field userId (int)
 */

fileRouter.get('/', fileController.getFiles);

// ADD AUTH MIDDLEWARE after token is setup
/**
 * Get a list of all files owned by a user
 * @route GET
 * @access Any User
 *
 * @body
 *  @requires
 *  @field userId (int)
 *
 * @param parentDirId
 * @desc directoryId, the parent directory of the file of this user
 */

fileRouter.get('/:parentDirId', fileController.getFilesByParentDir);

/**
 * Create a file owned by a user
 * @route POST /file/add
 * @access Any User
 *
 * @body
 *  @requires
 *  @field ownerId (number)
 *  @desc userId of the User who creates this file
 *
 *  @requires
 *  @field name (string)
 *  @desc name of the file
 *
 *  @requires
 *  @field path (string)
 *  @desc absolute path of the file
 *
 *  @requires
 *  @field parentId (number)
 *  @desc directoryId of the parent directory
 *
 *  @optional
 *  @field content (string)
 *  @desc content written in this file
 *
 */

fileRouter.post('/add', fileController.addFile);
