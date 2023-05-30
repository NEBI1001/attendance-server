import { Request, Response } from "express";
import { validateJWT } from "../../helpers/token";
import { notFoundResponse, serverErrorResponse, successResponse, unauthorizedResponse } from "../../helpers/response_helpers";
import { prisma } from "../../prisma";
import { AdminUserUpdateRequest, AdminUserUpdateRequestType, NormalUpdateUserRequest, NormalUpdateUserRequestType } from "../../schema/request.schema";
import { generateUserResponse } from "../../helpers/generate_response";

const handler = async (request: Request<{ id: string }>, response: Response) => {
    const user = await validateJWT(request.cookies.token as string | undefined);
    const id = Number(request.params.id)
    if (!user || (user.id !== id && user.role !== "Admin")) return unauthorizedResponse(response, "Can't modify another user's profile")

    let updateData: AdminUserUpdateRequestType | NormalUpdateUserRequestType;
    if (user.role == "Admin") {
        updateData = await AdminUserUpdateRequest.parseAsync(request.body);
    } else {
        updateData = await NormalUpdateUserRequest.parseAsync(request.body)
    }

    try {
        const updatedUser = await prisma.user.update({

            data: {
                ...updateData
            },
            where: {
                id
            },
        })
        return successResponse(response, generateUserResponse(updatedUser))
    } catch (e) {
        return notFoundResponse(response, "User not found")
    }

}

export default handler;