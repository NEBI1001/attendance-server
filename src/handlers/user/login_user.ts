import { Request, Response } from "express"
import { LoginUserRequest } from "../../schema/request.schema";
import { badRequestResponse, notFoundResponse, successResponse } from "../../helpers/response_helpers";
import { prisma } from "../../prisma";
import bcrypt from "bcrypt";
import { generateUserResponse } from "../../helpers/generate_response";
import { generateJWT } from "../../helpers/token";

const handler = async (request: Request, response: Response) => {
    try {
        const loginData = await LoginUserRequest.parseAsync(request.body)
        const user = await prisma.user.findUnique({
            where: { email: loginData.email }
        });

        if (!user) return notFoundResponse(response, "Email or passwrd Invalid");

        const isValid = await bcrypt.compare(loginData.password, user.password);
        if (!isValid) return notFoundResponse(response, "Email or password Invalid");

        const token = await generateJWT({ id: user.id, email: user.email, role: user.role })

        return successResponse(response, generateUserResponse(user), {
            name: "token", value: token, options: {
                maxAge: 24 * 60 * 60 * 1000
            }
        })

    } catch (error) {
        return badRequestResponse(response, "Request Data was in the wrong format")
    }

}

export default handler;