import { Request, Response } from "express";
import {Prisma} from "@prisma/client";
import bcrypt from "bcrypt";

import {prisma} from "../entrypoint";
import {errorHandler} from "../utils/errorHandler";

const userControllers = {
    // Create and register a User
    // Register a user
    signUp: async (req: Request, res: Response) => {
    try{
        let user: Prisma.UserCreateInput
        const {name, email, password} = req.body;
        const hashedPassword = bcrypt.hashSync(password, 12);
        user = {
            name: name, 
            email: email, 
            password: hashedPassword
        }
        const result = await prisma.user.create({ data: user })
        res.send(result);
    } catch (error:any) {
        if (error.code === "P2002") {
        const message = "User with the same email already exists.";
        error = errorHandler.DuplicationError(message);
        }
        errorHandler.handleError(error, res);
    }},

    // Authenticate a user using email/password
    loginWithPassword: async (req: Request, res: Response) => {
        try {
            const {email, password} = req.body;
            const user = await prisma.user.findUnique({
                where:{
                    email: email,
                },
                select:{
                    name: true,
                    email: true,
                    password: true
                }
            })
            if(!user) {
                throw errorHandler.UserNotFoundError("User does not exist, please signup")
            }
            const userPassword: string = user?.password || "";
            const result = await bcrypt.compare(password, userPassword);
            if (result) {
                res.json({
                  message: `${user?.name} LOG IN successfully`,
                  user: user,
                });
            } else {
                throw errorHandler.UnauthorizedError("Incorrect password");
            }

        } catch (error: any) {
            console.log("sldijfil: " + error.code);
            // Set generic error message on auth errors
            if (error.code === "P2015") {
                const message: string = "A related User record could not be found.";
                error = errorHandler.UserNotFoundError(message);
            }

            errorHandler.handleError(error, res);
        }},

    // Delete a user with the specified id and all related data
    deleteUserById: async (req: Request, res: Response) => {
        const userId = req.params.id;
        const userIdInt = parseInt(userId, 10);
        try {
            const user = await prisma.user.delete({
                where: {
                    id: userIdInt,
                },
            })
            res.send(user);
      } catch (error: any) {
        if (error.code === "P2015") {
            const message: string = "A related User record could not be found.";
            error = errorHandler.UserNotFoundError(message);
            }
            errorHandler.handleError(error, res);
        }
    }
};

export default userControllers;