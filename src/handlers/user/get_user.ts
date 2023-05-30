import { Request, Response } from "express"
import { validateJWT } from "../../helpers/token"
import { notFoundResponse, successResponse, unauthorizedResponse } from "../../helpers/response_helpers";
import { prisma } from "../../prisma";
import { generateUserResponse } from "../../helpers/generate_response";
const handler = async (request: Request<{ id: string }>, response: Response) => {
    const id = Number(request.params.id);
    const cookie = await validateJWT(request.cookies.token as string | undefined);
    if (!cookie || (cookie.id !== id && cookie.role === "Employee")) return unauthorizedResponse(response, "You don't have the sufficient credentials to access this data")

    const user = await prisma.user.findUnique({
        where: {
            id
        }
    })

    if (!user) return notFoundResponse(response, "User not found");

    return successResponse(response, generateUserResponse(user));
}

export default handler;