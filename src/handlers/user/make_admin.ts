import { Response, Request } from "express";
import { prisma } from "../../prisma";
import { CreateUserRequest } from "../../schema/request.schema";
import { UserRole } from "@prisma/client";
import { hash } from "bcrypt";
import { successResponse } from "../../helpers/response_helpers";
import { generateUserResponse } from "../../helpers/generate_response";

const handler = async (request: Request, response: Response) => {
    const userData = await CreateUserRequest.parseAsync(request.body)
    userData.password = await hash(userData.password, 10);
    const user = await prisma.user.create({
        data: {
            ...userData,
            role: userData.role as UserRole,
            departmentId: undefined
        }
    })
    return successResponse(response, generateUserResponse(user));
}
export default handler;