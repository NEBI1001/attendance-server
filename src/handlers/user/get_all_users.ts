import { Request, Response } from "express";
import { prisma } from "../../prisma";
import { successResponse } from "../../helpers/response_helpers";
import { generateUserResponse } from "../../helpers/generate_response";

const handler = async (request: Request, response: Response) => {
    const users = await prisma.user.findMany();
    return successResponse(response, {
        users: users.map(user => generateUserResponse(user))
    })
}

export default handler;