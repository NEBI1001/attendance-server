import { Request, Response } from "express";
import { validateJWT } from "../../helpers/token";
import { notFoundResponse, successResponse, unauthorizedResponse } from "../../helpers/response_helpers";
import { prisma } from "../../prisma";

const handler = async (request: Request<{ id: string }>, response: Response) => {
    const admin = await validateJWT(request.cookies.token as string | undefined);
    if (!admin || admin.role !== "Admin") return unauthorizedResponse(response, "Not a valid Admin");

    try {
        const user = await prisma.user.delete({
            where: {
                id: Number(request.params.id)
            },
        });
        return successResponse(response, { message: `Successfully deleted ${user.firstName} ${user.lastName}` })
    } catch (error) {
        return notFoundResponse(response, "User was not found")
    }
}

export default handler;