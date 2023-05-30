import { Request, Response } from "express";
import { CreateUserRequest } from "../../schema/request.schema";
import { badRequestResponse, createdResponse, forbiddenResponse, successResponse, unauthorizedResponse } from "../../helpers/response_helpers";
import { prisma } from "../../prisma";
import { UserRole } from "@prisma/client";
import { generateUserResponse } from "../../helpers/generate_response";
import { generateJWT, validateJWT } from "../../helpers/token";

const handler = async (request: Request, response: Response) => {
    const cookie = request.cookies.token as string | undefined;
    const admin = await validateJWT(cookie);
    if (!admin || admin.role !== "Admin") return unauthorizedResponse(response, "Not an admin");

    try {
        const createData = await CreateUserRequest.parseAsync(request.body);
        try {
            const user = await prisma.user.create({
                data: {
                    ...createData,
                    role: createData.role as UserRole
                }
            });

            return createdResponse(response, generateUserResponse(user))
        } catch (e) {
            forbiddenResponse(response, "Email already exists")
        }
    } catch (e) {
        return badRequestResponse(response, "Request was in the wrong format");
    }

}

export default handler;