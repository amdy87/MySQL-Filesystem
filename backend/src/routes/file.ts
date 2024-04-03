/**
 * Routes for File API
 * @fileoverview
 */

import express, { Request, Response } from 'express';

import { fileControllers } from '../controllers/file';
import { authAccessToken } from '../middlewares/auth';
import {
  checkReadPerm,
  checkWritePerm,
  checkExecutePerm,
} from '../middlewares/file';

export const fileRouter = express.Router();

// ADD AUTH MIDDLEWARE after token is setup
/**
 * Get a list of all files owned by a user
 * @route GET
 * @access Any User
 *
 * @param {number} userId
 *  @requires
 *  @description {number} userId
 */

fileRouter.get('/', fileControllers.getFiles);

// /**
//  * Get file content by fileId
//  * @route GET
//  * @access User has read access to the file
//  *
//  * @header req.headers.authorization
//  *  @requires
//  *  @description authentication token; from authenticating this token,
//  *                we know who's the user putting in this request
//  *
//  * @param {number} fileId
//  *  @requires
//  *  @description {number} fileId
//  */
// //  TODO: add middleware to autheticate token, and authorize the user
// fileRouter.get('/content', fileControllers.getFileContent);

// ADD AUTH MIDDLEWARE after token is setup
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
//  TODO: add authToken after frontend setup token storage
fileRouter.post('/add', fileControllers.addFile);

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
fileRouter.post('/update', fileControllers.updateFileById);

/**
 * delete a file by its fildId
 * @route DEL /file/
 * @access Owner of the file
 *
 * @param fileId: number
 */
fileRouter.delete('/', fileControllers.deleteFileById);
