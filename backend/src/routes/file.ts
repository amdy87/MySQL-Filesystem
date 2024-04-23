/**
 * Routes for File API
 * @fileoverview
 */

import express, { Request, Response } from 'express';

import { fileControllers } from '../controllers/file';
import { authAccessToken } from '../middlewares/auth';
import {
  checkFileReadPerm,
  checkFileWritePerm,
  checkFileExecutePerm,
} from '../middlewares/file';
import {
  checkDirReadPerm,
  checkDirWritePerm,
  checkDirExecutePerm,
} from '../middlewares/directory';

export const fileRouter = express.Router();

/**
 * Get a list of all files owned by a user
 * @route GET
 * @access Any User
 *
 * @param {number} userId
 *  @requires
 *  @description {number} userId
 */

fileRouter.get('/', authAccessToken, fileControllers.getFiles);

/**
 * Get a list of all files owned by a user
 * @route GET
 * @access Any User
 *
 * @header req.headers.authorization
 *  @requires
 *  @description authentication token
 *
 * @param {number} userId
 *  @requires
 *  @description id of the owner user
 *
 * @param {number} parentId
 *  @requires
 *  @description parentId: the parent directory of the file of this user
 */

fileRouter.get('/', authAccessToken, fileControllers.getFilesByParentDir);
// fileRouter.get('/', fileControllers.getFilesByParentDir);

/**
 * Get a file record by fileId
 * @route GET
 * @access User who has READ permission
 *
 * @header req.headers.authorization
 *  @requires
 *  @description authentication token
 *
 * @param {number} fileId
 *  @requires
 *  @description id of the file
 */

fileRouter.get(
  '/fileById',
  authAccessToken,
  checkFileReadPerm,
  fileControllers.getFileById,
);

/**
 * Create a file owned by a user
 * @route POST /file/add
 * @access Any User
 *
 * @body
 *  @requires
 *  @field ownerId {number}
 *  @description userId of the User who creates this file
 *
 *  @requires
 *  @field name {string}
 *  @description name of the file
 *
 *  @requires
 *  @field path {string}
 *  @description absolute path of the file
 *
 *  @requires
 *  @field parentId {number}
 *  @description directoryId of the parent directory
 *
 *  @optional
 *  @field content {string}
 *  @description content written in this file
 *
 */
fileRouter.post(
  '/add',
  authAccessToken,
  checkDirWritePerm,
  fileControllers.addFile,
);

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

fileRouter.post(
  '/update',
  authAccessToken,
  checkFileWritePerm,
  fileControllers.updateFileById,
);

/**
 * delete a file by its fileId
 * @route DEL /file/
 * @access Owner of the file
 *
 * @param fileId: number
 */
fileRouter.delete(
  '/',
  authAccessToken,
  checkFileWritePerm,
  fileControllers.deleteFileById,
);
