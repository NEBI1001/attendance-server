import { Request, Response } from "express";
import { validateJWT } from "../../helpers/token";
import { notFoundResponse, successResponse, unauthorizedResponse } from "../../helpers/response_helpers";
import { prisma } from "../../prisma";
import { generateDepartmentFullResponse } from "../../helpers/generate_response";

const handler = async (request: Request<{ departmentId: string }>, response: Response) => {
    const departmentId = Number(request.params.departmentId);
    const user = await validateJWT(request.cookies.token);
    if (!user || user.role !== "Admin") return unauthorizedResponse(response, "Only Admins can access this route");

    const department = await prisma.department.findUnique({
        where: {
            id: departmentId
        },
        include: {
            User: true
        }
    });
    if (!department) return notFoundResponse(response, "Department not found");

    return successResponse(response, generateDepartmentFullResponse(department))
}

export default handler;