/**
 * Routes for Directory API
 * @fileoverview
 */

import express from 'express';
import { authAccessToken } from '../middlewares/auth';
import { directoryControllers } from '../controllers/directory';
import { checkDirReadPerm, checkDirWritePerm } from '../middlewares/directory';
import { treeControllers } from '../controllers/tree';

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
 * @route GET /dir/
 * @access Any User
 *
 * @body
 *  @requires
 *  @field userId (int)
 */

router.get('/', directoryControllers.getDirectories);

/**
 * Get a directories record
 * @route GET /dir/dirById
 * @access Any User
 *
 * @query
 *  @requires
 *  @param {number} directoryId
 */

router.get(
  '/dirById',
  authAccessToken,
  checkDirReadPerm,
  directoryControllers.getDirectory,
);

/**
 * Update a dir
 * @route POST /dir/update
 * @access Owner of the dir
 *
 * @body
 *  @requires
 *  @field directoryId (number)
 *  @description directoryId of the User who creates this file
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
 *
 */

router.post(
  '/update',
  authAccessToken,
  checkDirWritePerm,
  directoryControllers.updateDirById,
);

export default router;
