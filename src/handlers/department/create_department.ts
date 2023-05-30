import { Request, Response } from "express";
import { validateJWT } from "../../helpers/token";
import { badRequestResponse, forbiddenResponse, successResponse, unauthorizedResponse } from "../../helpers/response_helpers";
import { prisma } from "../../prisma";
import { CreateDepartmentRequest } from "../../schema/request.schema";
import { generateDepartmentResponse } from "../../helpers/generate_response";

const handler = async (request: Request, response: Response) => {
    const user = await validateJWT(request.cookies.token);
    if (!user || user.role !== "Admin") return unauthorizedResponse(response, "Only admins can access the route");


    try {
        const createDepartmentData = await CreateDepartmentRequest.parseAsync(request.body);

        try {
            const department = await prisma.department.create({
                data: {
                    name: createDepartmentData.name,
                }
            });

            return successResponse(response, generateDepartmentResponse(department));
        } catch {
            return forbiddenResponse(response, "Department has already been created");
        }
    } catch {
        return badRequestResponse(response, "Request Data was not in the correct format")
    }
}

export default handler;