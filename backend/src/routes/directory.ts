import express from "express";
import directoryControllers from "../controllers/directory";

const router = express.Router();


/**
 * Get a list of all directories
 * @route GET /dir/
 * @access ADMIN User
 * 
 * @body
 *  @requires
 *  @field userId (int)
 */

router.get("/dir", directoryControllers.getAllDirectory);


export default router;