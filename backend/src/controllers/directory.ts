import { Request, Response } from "express";

import {prisma} from "../entrypoint";
import {errorHandler} from "../utils/errorHandler";

const controller = {
    getDirectories: async (req: Request, res: Response) =>{
        try{
            const {userId} = req.body;
            if (!userId) {
                throw errorHandler.InvalidParamError('userId is missing in the request body');
            }
            const directories = await prisma.directory.findMany({
                where:{
                    ownerId: userId,
                },
                select:{
                    id: true,
                    createdAt: true,
                    updatedAt:true,
                    name: true,
                    path:true,
                    parentId: true,
                    ownerId: true
                }
            })
            res.send(directories);

        } catch (error:any) {
            // if (error.code === "P2002") {
            // const message = "User with the same email already exists.";
            // error = errorHandler.DuplicationError(message);
            // }
            errorHandler.handleError(error, res);
        }
    }

}


export default controller;