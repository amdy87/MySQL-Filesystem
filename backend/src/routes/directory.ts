import express from "express";
import directoryControllers from "../controllers/directory";

const router = express.Router();


/**
 * Get a list of all directories owned by a user
 * @route GET /dir/
 * @access Any User
 * 
 * @body
 *  @requires
 *  @field userId (int)
 */

router.get("/dir", directoryControllers.getDirectories);


export default router;