import { Request, Response } from "express";
import { Prisma, PrismaClient } from "@prisma/client";
import errorHandler from "../utils/errorHandler";

const prisma: PrismaClient = new PrismaClient();

export default const controller = {
    // Create and register a User
    // Register a user
    signUp: async (req: Request, res: Response) => {
        try {
            let user: Prisma.UserCreateInput
            const { name, email, password } = req.body;

            user = {
                name: name,
                email: email,
                password: password
            }
            const result = await prisma.user.create({ data: user })
            res.send(result);
        } catch (error: any) {
            if (error.code === "P2002") {
                const message = "User with the same email already exists.";
                error = errorHandler.DuplicationError(message);
            }
            errorHandler.handleError(error, res);
        }
    },

    // Authenticate a user using email/password
    signInWithPassword: async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;
            const user = await prisma.user.findUnique({
                where: {
                    email: email,
                },
                select: {
                    email: true,
                    password: true
                }
            })

            if (user?.password === password) {
                res.send("LOG IN successfully");
            } else {
                const message: String = "Incorrect password";
                res.status(401);
                res.send(message);
            }

        } catch (error: any) {
            // Set generic error message on auth errors
            if (error.code === "P2015") {
                const message: String = "A related User record could not be found.";
                error = errorHandler.UserNotFoundError(message);
            }
            errorHandler.handleError(error, res);
        }
    },

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
                const message: String = "A related User record could not be found.";
                error = errorHandler.UserNotFoundError(message);
            }
            errorHandler.handleError(error, res);
        }
    }
};
