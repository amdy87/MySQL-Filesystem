import { Request, Response } from "express";
import {Prisma} from "@prisma/client";
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
                    ownerId: true,
                    permissions:true
                }
            })
            res.send({ownerId: userId, dirs: directories});

        } catch (error:any) {
            // if (error.code === "P2002") {
            // const message = "User with the same email already exists.";
            // error = errorHandler.DuplicationError(message);
            // }
            console.log(error.code);
            errorHandler.handleError(error, res);
        }
    },

    addRootDirectory:async (req: Request, res: Response) => {
        try{
            var {ownerId, name, path} = req.body;
            if (!ownerId) {
                throw errorHandler.InvalidParamError('ownerId');
            }

            let directory: Prisma.DirectoryCreateInput;
            directory = {
                name: name,
                parentId: null,
                path: path,
                ownerId: ownerId
            }
            const result = await prisma.directory.create({data: directory});
            return result;

        } catch (error:any) {
            if (error.code === "P2002") {
            // TODO: Check with DB, does DB handle this correctly
            const message = "Directory with the same name already exists.";
            error = errorHandler.DuplicationError(message);
            }
            errorHandler.handleError(error, res);
        }
    },
    addDirectory:async (req: Request, res: Response) => {
        try{
            var {ownerId, parentId, name, path} = req.body;
            if (!ownerId) {
                throw errorHandler.InvalidParamError('ownerId');
            }
            if (!parentId) {
                throw errorHandler.InvalidParamError('parentId');
            }
            let directory: Prisma.DirectoryCreateInput;
            directory = {
                name: name,
                parentId: parentId,
                path: path,
                ownerId: ownerId
            }
            const newDirectory = await prisma.directory.create({data: directory});
            res.send({dir: newDirectory, message: "Successfully create a directory"});

        } catch (error:any) {
            if (error.code === "P2002") {
            // TODO: Check with DB, does DB handle this correctly
            const message = "Directory with the same name already exists.";
            error = errorHandler.DuplicationError(message);
            }
            errorHandler.handleError(error, res);
        }
    }

}


export default controller;