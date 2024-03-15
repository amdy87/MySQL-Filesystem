import express from 'express';
import { directoryController } from '../controllers/directory';

const router = express.Router();

/**
 * Create a directory owned by a user
 * @route POST /dir/addDirectory
 * @access Any User
 *
 * @body
 *  @requires
 *  @field isRoot (bool)
 *  @desc whether this is a root directory
 *
 *  @requires
 *  @field ownerId (int)
 *  @desc userId of the User who creates this directory
 *
 *  @requires
 *  @field name (string)
 *  @desc name the directory
 *
 *  @requires
 *  @field path (string)
 *  @desc absolute path of the directory
 *
 *  @requires
 *  @field parentId (int)
 *  @desc directoryId of the parent directory
 *        None if this is the root dir
 *
 */

router.post('/add', directoryController.addDirectory);

/**
 * Get a list of all directories owned by a user
 * @route GET
 * @access Any User
 *
 * @body
 *  @requires
 *  @field userId (int)
 */

router.get('/', directoryController.getDirectories);

export default router;
