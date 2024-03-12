import express from 'express';
import permissionController from '../controllers/permission';

const router = express.Router();

/**
 * Get a list of all permissions
 * @route GET
 * @access Any User
 *
 */

router.get('/', permissionController.getPermissions);

export default router;
