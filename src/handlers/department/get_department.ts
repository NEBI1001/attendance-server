import { Request, Response } from "express";
import { prisma } from "../../prisma";
import { notFoundResponse, successResponse } from "../../helpers/response_helpers";
import { generateDepartmentResponse } from "../../helpers/generate_response";

const handler = async (request: Request<{ departmentId: string }>, response: Response) => {
    const departmentId = Number(request.params.departmentId);

    const department = await prisma.department.findUnique({
        where: {
            id: departmentId
        }
    })

    if (!department) return notFoundResponse(response, "Department not found");

    return successResponse(response, generateDepartmentResponse(department));

}
export default handler;