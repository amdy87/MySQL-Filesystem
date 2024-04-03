import express, { Request, Response } from 'express';

import { fileController } from '../controllers/file';

export const fileRouter = express.Router();

// ADD AUTH MIDDLEWARE after token is setup
/**
 * Get a list of all files owned by a user
 * @route GET
 * @access Any User
 *
 * @params
 *  @requires
 *  @description userId (int)
 */

fileRouter.get('/', fileController.getFiles);

// ADD AUTH MIDDLEWARE after token is setup
/**
 * Get a list of all files owned by a user
 * @route GET
 * @access Any User
 *
 * @param userId
 * @description userId (int)
 *
 * @param parentDirId
 * @description parentDirId: the parent directory of the file of this user
 */

fileRouter.get('/', fileController.getFilesByParentDir);

/**
 * Create a file owned by a user
 * @route POST /file/add
 * @access Any User
 *
 * @body
 *  @requires
 *  @field ownerId (number)
 *  @description userId of the User who creates this file
 *
 *  @requires
 *  @field name (string)
 *  @description name of the file
 *
 *  @requires
 *  @field path (string)
 *  @description absolute path of the file
 *
 *  @requires
 *  @field parentId (number)
 *  @description directoryId of the parent directory
 *
 *  @optional
 *  @field content (string)
 *  @description content written in this file
 *
 */
//  TODO: add authToken after frontend setup token storage
fileRouter.post('/add', fileController.addFile);

/**
 * Update a file
 * @route POST /file/update
 * @access Owner of the user
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
fileRouter.post('/update', fileController.updateFileById);
