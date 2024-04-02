/**
 * Routes for Permission API
 * @pakageDocumentation
 */

import express from 'express';
import { permissionControllers } from '../controllers/permission';

const router = express.Router();

/**
 * Get a list of all permissions
 * @route GET
 * @access Any User
 *
 */

router.get('/', permissionControllers.getPermissions);

export default router;
