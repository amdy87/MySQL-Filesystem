import { Request, Response } from "express";
import { Prisma, PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

import {prisma} from "../entrypoint";
import errorHandler from "../utils/errorHandler";


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
    signInWithPassword: async (req: Request, res: Response) => {
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

            const userPassword: string = user && user.password ? user.password : "";

            bcrypt.compare(password, userPassword, (err, result) => {
                if (err) {
                    const message: string = "Incorrect password";
                    res.status(401);
                    res.send(message);
                }
                
                if (result) {
                    res.json({"message": `${user?.name} LOG IN successfully`, 
                                "user": user})
                } else {
                    console.log('Passwords do not match');
                    // TODO: THROW ERROR
                }
            });

        } catch (error: any) {
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
        // Set generic error message on auth errors
        if (error.code === "P2015") {
            const message: string = "A related User record could not be found.";
            error = errorHandler.UserNotFoundError(message);
            }
            errorHandler.handleError(error, res);
        }
    }
};

export default userControllers;