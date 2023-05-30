import { Request, Response } from "express";
import { validateJWT } from "../../helpers/token";
import { successResponse, unauthorizedResponse } from "../../helpers/response_helpers";
import { prisma } from "../../prisma";
import { DepartmentFullResponse } from "../../schema/response.schema";
import { generateDepartmentFullResponse } from "../../helpers/generate_response";

const handler = async (request: Request, response: Response) => {
    const user = await validateJWT(request.cookies.token);
    if (!user || user.role !== "Admin") return unauthorizedResponse(response, "Only Admins can access this route");

    const departments = await prisma.department.findMany({
        include: {
            User: true
        }
    });

    return successResponse<{ departments: DepartmentFullResponse[] }>(response, {
        departments: departments.map(department => generateDepartmentFullResponse(department))
    })
}

export default handler;