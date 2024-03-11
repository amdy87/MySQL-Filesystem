import { Request, Response } from "express";
import { Prisma, PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

import {Role} from "../utils/config";
import {errorHandler} from "../utils/errorHandler";

const controller: any = {};
const prisma: PrismaClient = new PrismaClient();

// Get a list of all directories if request user is an ADMIN
// controller.getAllDirectory = async (req: Request, res: Response){
//     try{
//         const {userId} = req.body;
//         const user = await prisma.user.findUnique({
//             where:{
//                 id: userId,
//             },
//             select:{
//                 role: true,
//             }
//         })
//         if(user?.role == Role.ADMIN) {
//             const directories = await prisma.directory.findMany();
//             res.send(directories);
//         }else {
//             res.send("User has no authorization to get all directories");
//         }
//     } catch (error:any) {
//         if (error.code === "P2002") {
//         const message = "User with the same email already exists.";
//         error = errorHandler.DuplicationError(message);
//         }
//         errorHandler.handleError(error, res);
//     }
// };


export default controller;